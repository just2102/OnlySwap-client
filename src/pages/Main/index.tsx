import { SwapProvider } from "src/context/SwapContext";

import styles from "./MainPage.module.scss";
import HeaderWidget from "./widgets/HeaderWidget";
import SwapWidget from "./widgets/SwapWidget";

const MainPage = () => {
  return (
    <SwapProvider>
      <HeaderWidget />
      <div className={styles.mainPage}>
        <SwapWidget />
      </div>
    </SwapProvider>
  );
};

export default MainPage;
