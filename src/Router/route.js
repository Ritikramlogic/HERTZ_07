import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Layout2 from "../Container/Layout2";
import Layout1 from "../Container/Layout1";
import SwapTradePage from "../pages/SwapTradePage";
import TradePage from "../pages/TradePage";
import FramsPage from "../pages/FarmsPage";
import LiquidityPage from "../pages/LiquidityPage";
import InfoPage from "../pages/InfoPage";
import WithdrawLiquidityPage from "../pages/WithdrawLiquidityPage";
import { PoolInfo } from "../Api";
import InforPoolPage from "../pages/InfoPoolPage";
import InfoTokensPage from "../pages/InfoTokensPage";
import TopTokens from "../pages/TopTokens";
export default function Routers() {
  return (
    <>
      <Switch>
        <Layout1>
          <Route path="/" exact component={SwapTradePage} />
          <Route path="/liquidity" exact component={LiquidityPage} />
          <Route path="/farm" component={FramsPage} />
          <Route path="/trade" component={TradePage} />
          <Route path="/info" component={InfoPage} />
          <Route path="/poolinfo" component={InforPoolPage} />
          <Route path="/tokeninfo" component={InfoTokensPage} />
          <Route path="/tokens" component={TopTokens} />
          <Route path="/withdraw" component={WithdrawLiquidityPage} />
        </Layout1>
      </Switch>
    </>
  );
}

// https://codesandbox.io/s/react-router-v5-multiple-layout-forked-xb7rx?file=/src/router/index.js
