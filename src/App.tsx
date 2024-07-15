import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { WagmiProvider } from "wagmi";
import "./App.css";

import MainPage from "./pages/Main";
import { wagmiConfig } from "./shared/data/config";
import { persister, queryClient } from "./shared/data/queryClient";

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <MainPage />
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
