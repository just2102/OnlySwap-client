import { createContext, useCallback, useEffect, useState } from "react";

import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { Percent } from "@uniswap/sdk-core";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { abi as SWAP_ROUTER_ABI } from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { SwapOptions } from "@uniswap/v3-sdk";
import { SwapRouter } from "@uniswap/v3-sdk";
import { simulateContract } from "@wagmi/core";
import JSBI from "jsbi";
import { wagmiConfig, walletClient } from "src/shared/data/config";
import { ETH_DECIMALS_DEFAULT, USDC_TOKEN, WETH_CONTRACT_ADDRESS, WETH_TOKEN } from "src/shared/data/const";
import { QUERY_TOKENS_METADATA_LIMIT } from "src/shared/queries/const";
import { queryTokensList } from "src/shared/queries/queryTokensList";
import { TokenRaw, TokenWithMetadata } from "src/shared/queries/types";
import { getQuoterAddress, getSwapRouterAddress } from "src/shared/utils/address";
import { formatBalance, fromReadableAmount } from "src/shared/utils/balance";
import { d } from "src/shared/utils/conversion";
import { ContractFunctionExecutionError, encodeFunctionData, erc20Abi, fromHex } from "viem";
import { getBalance, readContract, sendTransaction } from "viem/actions";
import { useAccount, useBlockNumber, useClient } from "wagmi";

import { createTrade } from "./utils/createTrade";
import { fetchAllTokensMetadata } from "./utils/fetchAllTokensMetadata";
import { getPoolInfo } from "./utils/getPoolInfo";
import { getTokenTransferApproval } from "./utils/getTokenTransferApproval";

import { storeTx } from "../shared/storage/storeTx";

interface SwapContextValue {
  nativeBalanceReadable: string;
  availableTokens: TokenRaw[];
  initialDisplayedTokens: TokenWithMetadata[];

  fromToken: TokenWithMetadata;
  handleFromTokenChange: (token: TokenWithMetadata) => void;

  toToken: TokenWithMetadata;
  handleToTokenChange: (token: TokenWithMetadata) => void;

  poolFee: FeeAmount;

  amountIn: string;
  handleAmountInChange: (amount: string) => void;
  amountOut: string;
  handleAmountOutChange: (amount: string) => void;

  wrapETHIfNeeded: (eth: string) => void;
  getQuote: () => Promise<void>;
  handleSwap: () => Promise<void>;

  interactionDisabled: boolean;
  isApproved: boolean;
  swapSuccessTx: `0x${string}` | null;
  isWrapping: boolean;
  wrapSuccess: boolean;
}

const defaultContextValue: SwapContextValue = {
  nativeBalanceReadable: "",
  availableTokens: [],
  initialDisplayedTokens: [],

  fromToken: WETH_TOKEN,
  handleFromTokenChange: () => {},

  toToken: USDC_TOKEN,
  handleToTokenChange: () => {},

  poolFee: FeeAmount.MEDIUM,

  amountIn: "0.1",
  handleAmountInChange: () => {},
  amountOut: "0",
  handleAmountOutChange: () => {},

  wrapETHIfNeeded: () => {},
  getQuote: () => Promise.resolve(),
  handleSwap: () => Promise.resolve(),

  interactionDisabled: false,
  isApproved: false,
  swapSuccessTx: null,
  isWrapping: false,
  wrapSuccess: false,
};

export const SwapContext = createContext<SwapContextValue>(defaultContextValue);

export const SwapProvider = ({ children }: { children: React.ReactNode }) => {
  const { address: account, chainId } = useAccount();
  const client = useClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [nativeBalanceReadable, setNativeBalanceReadable] = useState<string>("");

  const [availableTokens, setAvailableTokens] = useState<TokenRaw[]>([]);
  const [initialDisplayedTokens, setInitialDisplayedTokens] = useState<TokenWithMetadata[]>([]);
  const [fromToken, setFromToken] = useState<TokenWithMetadata>(WETH_TOKEN);
  const [toToken, setToToken] = useState<TokenWithMetadata>(USDC_TOKEN);
  const poolFee = FeeAmount.MEDIUM; // todo: should change for optimal fee
  const [amountIn, setAmountIn] = useState<string>("0.1");
  const [amountOut, setAmountOut] = useState<string>("0");
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [swapSuccessTx, setSwapSuccessTx] = useState<`0x${string}` | null>(null);
  const [isWrapping, setIsWrapping] = useState(false);
  const [wrapSuccess, setWrapSuccess] = useState(false);

  const handleFromTokenChange = useCallback(
    (_token: TokenWithMetadata) => {
      setFromToken(_token);

      if (_token.address === toToken.address) {
        setToToken(fromToken);
        setAmountIn(amountOut);
      }
    },
    [amountOut, fromToken, toToken.address],
  );

  const handleToTokenChange = useCallback(
    (_token: TokenWithMetadata) => {
      setToToken(_token);

      if (_token.address === fromToken.address) {
        setFromToken(toToken);
        setAmountIn(amountOut);
      }
    },
    [amountOut, fromToken.address, toToken],
  );

  const handleAmountInChange = useCallback((amount: string) => {
    setAmountIn(amount);
  }, []);

  const handleAmountOutChange = useCallback((amount: string) => {
    setAmountOut(amount);
  }, []);

  const wrapETHIfNeeded = useCallback(
    async (eth: string) => {
      if (!account) return;

      const wETHBalance = await readContract(walletClient, {
        address: fromToken.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account],
      });

      if (d(fromReadableAmount(amountIn, ETH_DECIMALS_DEFAULT).toString()).lessThanOrEqualTo(d(wETHBalance.toString()))) {
        return;
      }

      setIsWrapping(true);
      try {
        const amountToWrap = d(fromReadableAmount(eth, ETH_DECIMALS_DEFAULT).toString()).minus(d(wETHBalance.toString()));
        const value = amountToWrap.toHex() as `0x${string}`;
        const hash = await sendTransaction(walletClient, {
          account: account,
          to: WETH_CONTRACT_ADDRESS,
          value: fromHex(value, "bigint"),
        });

        console.log("wrap eth hash: ", hash);
        setWrapSuccess(true);
      } catch (err) {
        console.error("Error wrapping ETH: ", err);
        throw err;
      } finally {
        setIsWrapping(false);
      }
    },
    [account, amountIn, fromToken.address],
  );

  const getQuote = useCallback(async () => {
    if (!chainId) return;

    try {
      setInteractionDisabled(true);

      const _fromToken = new Token(chainId, fromToken.address, Number(fromToken.decimals), fromToken.symbol, fromToken.name); // dont forget to use chainId
      const _toToken = new Token(chainId, toToken.address, Number(toToken.decimals), toToken.symbol, toToken.name);
      const rawTokenAmountIn = fromReadableAmount(amountIn, Number(fromToken.decimals));
      const { liquidity } = await getPoolInfo(client, chainId, _fromToken, _toToken, poolFee);

      if (liquidity.toString() === "0") {
        throw "No liquidity in the pool";
      }

      const simulated = await simulateContract(wagmiConfig, {
        abi: Quoter.abi,
        functionName: "quoteExactInputSingle",
        address: getQuoterAddress(chainId),
        args: [fromToken.address, toToken.address, poolFee, rawTokenAmountIn, 0],
      });
      const result = formatBalance(simulated.result, Number(toToken.decimals));

      setAmountOut(result);
      setInteractionDisabled(false);
    } catch (err) {
      console.error(err);

      if (err instanceof ContractFunctionExecutionError) {
        const cause = err.cause.message;

        console.error(cause);
      }

      throw err;
    }
  }, [
    amountIn,
    chainId,
    client,
    fromToken.address,
    fromToken.decimals,
    fromToken.name,
    fromToken.symbol,
    poolFee,
    toToken.address,
    toToken.decimals,
    toToken.name,
    toToken.symbol,
  ]);

  const handleApprove = useCallback(async (fromToken: Token, inputAmount: CurrencyAmount<Token>) => {
    if (!account) return;

    try {
      const allowance = await readContract(walletClient, {
        abi: erc20Abi,
        functionName: "allowance",
        address: fromToken.address as `0x${string}`,
        args: [account, getSwapRouterAddress(fromToken.chainId)],
      });

      const allowanceJSBI = JSBI.BigInt(allowance.toString());
      const inputAmountRaw = inputAmount.quotient;

      if (JSBI.lessThan(allowanceJSBI, inputAmountRaw)) {
        await getTokenTransferApproval(account, fromToken, inputAmount);
      }

      setIsApproved(true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const handleSwap = useCallback(async () => {
    if (!amountOut) return;
    if (!chainId) return;
    if (!account) return;

    try {
      setIsApproved(false);
      setSwapSuccessTx(null);
      setInteractionDisabled(true);

      await wrapETHIfNeeded(amountIn);

      const _fromToken = new Token(chainId, fromToken.address, Number(fromToken.decimals), fromToken.symbol, fromToken.name);
      const _toToken = new Token(chainId, toToken.address, Number(toToken.decimals), toToken.symbol, toToken.name);

      const uncheckedTrade = await createTrade(client, chainId, _fromToken, _toToken, poolFee, amountIn);

      await handleApprove(_fromToken, uncheckedTrade.inputAmount);

      const options: SwapOptions = {
        slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
        recipient: account,
      };

      const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);

      const tuple = {
        // todo: sdk prepares data for old router (https://github.com/Uniswap/sdks/issues/28), this is a workaround
        tokenIn: _fromToken.address,
        tokenOut: _toToken.address,
        fee: poolFee,
        recipient: account,
        amountIn: fromReadableAmount(amountIn, _fromToken.decimals),
        deadline: options.deadline,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      };

      const customCalldata = encodeFunctionData({
        abi: SWAP_ROUTER_ABI,
        functionName: "exactInputSingle",
        args: [tuple],
      });

      const hash = await sendTransaction(walletClient, {
        account: account,
        to: getSwapRouterAddress(chainId),
        value: BigInt(methodParameters.value),
        data: customCalldata,
      });

      console.log("swap tx hash: ", hash);
      storeTx(hash, fromToken, toToken, amountIn, amountOut, "0", "ETH"); // todo: get fee amount and token
      setSwapSuccessTx(hash);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setInteractionDisabled(false);
    }
  }, [account, amountIn, amountOut, chainId, client, fromToken, handleApprove, poolFee, toToken]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;

      const balance = await getBalance(walletClient, {
        address: account,
      });

      setNativeBalanceReadable(formatBalance(balance, ETH_DECIMALS_DEFAULT));
    };

    fetchBalance();
  }, [account, blockNumber, chainId, client]);

  useEffect(() => {
    const getTokenList = async () => {
      if (!chainId) return;

      const chainTokens = await queryTokensList(chainId);
      if (chainTokens) {
        setAvailableTokens(chainTokens);
      }
    };

    getTokenList();
  }, [chainId]);

  useEffect(() => {
    const queryTokensData = async () => {
      if (!chainId) return;
      if (!availableTokens.length) return;

      const allTokensWithMetadata = await fetchAllTokensMetadata(availableTokens, chainId, QUERY_TOKENS_METADATA_LIMIT);

      setInitialDisplayedTokens(allTokensWithMetadata);
    };

    queryTokensData();
  }, [availableTokens, chainId]);

  const contextValue: SwapContextValue = {
    nativeBalanceReadable,
    availableTokens,
    initialDisplayedTokens,

    fromToken,
    handleFromTokenChange,

    toToken,
    handleToTokenChange,

    poolFee,

    amountIn,
    handleAmountInChange,
    amountOut,
    handleAmountOutChange,

    wrapETHIfNeeded,
    getQuote,
    handleSwap,

    interactionDisabled,
    isApproved,
    swapSuccessTx,
    isWrapping,
    wrapSuccess,
  };

  return <SwapContext.Provider value={contextValue}>{children}</SwapContext.Provider>;
};
