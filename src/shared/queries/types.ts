export type TokenRaw = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type TokenWithMetadata = {
  address: `0x${string}`;
  address_label: string;
  block_number: string;
  created_at: string;
  decimals: string;
  fully_diluted_valuation: string;
  total_supply: string;
  total_supply_formatted: string;

  categories: string[];
  links: {
    twitter?: string;
    reddit?: string;
    website?: string;
    medium?: string;
    github?: string;
    discord?: string;
  };

  logo: string;
  logo_hash: string;
  thumbnail: string;

  name: string;
  symbol: string;

  validated: number;
  verified_contract: boolean;
  possible_spam: boolean;
};
