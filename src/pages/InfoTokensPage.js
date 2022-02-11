import React from "react";
import { Link } from "react-router-dom";
import LineChart from "../Components/Chart";
import { store } from "../Redux/store";
import {
  volData,
  TokenData,
  TransSwapping,
  TopPools,
  TokenInfoPair,
} from "../Api";

class InfoTokensPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volData: null,
      TokenData: null,
      TopPools: null,
      TransSwapping: null,
      PoolInfo: null,
      //   poolPair: "bshd_htz",
    };
  }
  async componentDidMount() {
    this.setState({
      volData: await volData(),
      TokenData: await TokenData(),
      TopPools: await TopPools(),

      PoolInfo: await TokenInfoPair(store.getState().tokenSymbol),
    });
    console.log(this.state.PoolInfo);
  }
  render() {
    return (
      <>
        <div class="overview_main_div1 my-md-5 my-4">
          <div class="container overview_main_div rounded py-3">
            <div class="row">
              <div class="col-md-12 co-12">
                <div class="over_tab_view pt-1">
                  <ul class="nav nav-pills" id="pills-tab" role="tablist">
                    <li class="nav-item">
                      <Link
                        class="nav-link "
                        id="pills-overview-tab"
                        data-toggle="pill"
                        // href="#pills-overview"
                        to="/info"
                        role="tab"
                        aria-controls="pills-overview"
                        aria-selected="true"
                      >
                        Overview
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link "
                        id="pills-pools-tab"
                        data-toggle="pill"
                        href="#pills-pools"
                        to="/poolinfo"
                        role="tab"
                        aria-controls="pills-pools-tab"
                        aria-selected="false"
                      >
                        Pools
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link active"
                        id="pills-token-tab"
                        data-toggle="pill"
                        // href="#pills-token"
                        to="/tokeninfo"
                        role="tab"
                        aria-controls="pills-token"
                        aria-selected="true"
                      >
                        Tokens
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {/* //Section 2 */}
        <div class="overview_main_2nd my-md-5 my-4">
          {" "}
          <div class="container px-md-0">
            <div class="row">
              <div class="col-md-12 co-12">
                <div class="over_tab_2nd">
                  {/* <!--===========================TABS BODY ============================--> */}
                  <div class="tab-content" id="pills-tabContent">
                    {/* //Pools Tab */}
                    <div
                      class="tab-pane fade show active"
                      id="pills-pools"
                      role="tabpanel"
                      aria-labelledby="pills-pools-tab"
                    >
                      <h1 style={{ color: "#fff" }}>Tokens</h1>
                      <div class="overview_main_2nd my-md-5 my-4">
                        <div class="container px-md-0">
                          <div class="row">
                            <div class="col-md-12 co-12">
                              <div class="over_tab_2nd">
                                <div class="tab-content">
                                  <div>
                                    <div>
                                      <div class="tab_nav_">
                                        <div class="row">
                                          <div class="col-md">
                                            <div>
                                              <nav aria-label="breadcrumb">
                                                <ol class="breadcrumbs d-flex list-unstyled">
                                                  <li class="breadcrumb-item">
                                                    <a href="#">Home</a>
                                                  </li>
                                                  <li class="breadcrumb-item">
                                                    <a href="#">Pools</a>
                                                  </li>
                                                  <li
                                                    class="breadcrumb-item active"
                                                    aria-current="page"
                                                  >
                                                    {store
                                                      .getState()
                                                      .tokenSymbol.toUpperCase()}
                                                    &nbsp;
                                                  </li>
                                                </ol>
                                              </nav>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="htz_img_jfg py-md-3 py-4">
                                        <div class="d-flex align-items-center">
                                          <span>
                                            <img
                                              // src={
                                              //   this.state.PoolInfo === null
                                              //     ? "#"
                                              //     : this.state.PoolInfo
                                              //         .tokenAResult.image
                                              // }
                                              width="30"
                                              style={{ borderRadius: "50%" }}
                                            ></img>
                                          </span>
                                          &nbsp;&nbsp;
                                          <h2 class="text-white m-0">
                                            {store
                                              .getState()
                                              .tokenSymbol.toUpperCase()}
                                            &nbsp;
                                          </h2>
                                        </div>
                                      </div>
                                      <div class="htz_liquidity_add py-md-5 py-4">
                                        <div class="row">
                                          <div class="col-md col-12">
                                            <div class="d-md-flex align-items-center">
                                              <a
                                                href="#"
                                                class="d-flex align-items-center"
                                              >
                                                <span>
                                                  <img
                                                    // src={
                                                    //   this.state.PoolInfo ===
                                                    //   null
                                                    //     ? "#"
                                                    //     : this.state.PoolInfo
                                                    //         .tokenAResult.image
                                                    // }
                                                    width="24"
                                                  ></img>
                                                </span>
                                                &nbsp;&nbsp;
                                                <h6 class="text-white font-weight-normal m-0">
                                                  1{" "}
                                                  {/* {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[1].toUpperCase()}
                                                  &nbsp;=&nbsp;
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo
                                                        .tokenAPrice}
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[0].toUpperCase()} */}
                                                </h6>
                                              </a>
                                            </div>
                                          </div>
                                          <div class="col-md-auto col-12">
                                            <div class="d-flex align-items-center"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="volume_liquidity">
                                        <div class="row">
                                          <div class="col-md-4 col-12">
                                            <div class="bg_skylight px-3 mb-3 py-4">
                                              <div class="row">
                                                <div class="col-6">
                                                  <div classs="">
                                                    <h6 class="font-weight-normal text_green">
                                                      Liquidity
                                                    </h6>
                                                    <h4 class="font-weight-normal text-white">
                                                      $
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : parseFloat(
                                                            this.state.PoolInfo
                                                              .totalLiquidity
                                                          ).toFixed(2)}
                                                    </h4>
                                                  </div>
                                                </div>
                                              </div>
                                              <h5 class="font-weight-normal mt-3 text-white">
                                                Total Token Locked
                                              </h5>
                                              <div class="">
                                                <div class="bg_lightsky p-2 border">
                                                  <div class="d-flex align-items-center justify-content-between py-2 mt-2">
                                                    <span class="font-weight-normal text-white">
                                                      <img
                                                        // src={
                                                        //   this.state.PoolInfo
                                                        //     .tokenAResult ==
                                                        //   null
                                                        //     ? "https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/default.png"
                                                        //     : this.state
                                                        //         .PoolInfo
                                                        //         .tokenAResult
                                                        // }
                                                        width="24"
                                                      ></img>{" "}
                                                      &nbsp;
                                                      {/* {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.token[1].toUpperCase()} */}
                                                      {store
                                                        .getState()
                                                        .tokenSymbol.toUpperCase()}
                                                    </span>
                                                    <span class="font-weight-normal text-white">
                                                      {" "}
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : parseFloat(
                                                            this.state.PoolInfo
                                                              .tokenTotal
                                                          ).toFixed(2)}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div class="bg_skylight px-3 my-3 py-4">
                                              <div class="dbfkd_tabs__">
                                                <ul
                                                  class="nav nav-pills mb-3"
                                                  id="pills-tab"
                                                  role="tablist"
                                                >
                                                  {/* <li class="nav-item">
                                                    <a
                                                      class="nav-link active"
                                                      id="pills-24d-tab"
                                                      data-toggle="pill"
                                                      href="#pills-24d"
                                                      role="tab"
                                                      aria-controls="pills-24d"
                                                      aria-selected="true"
                                                    >
                                                      24D
                                                    </a>
                                                  </li>
                                                  <li class="nav-item">
                                                    <a
                                                      class="nav-link"
                                                      id="pills-7d-tab"
                                                      data-toggle="pill"
                                                      href="#pills-7d"
                                                      role="tab"
                                                      aria-controls="pills-7d"
                                                      aria-selected="false"
                                                    >
                                                      7D
                                                    </a>
                                                  </li> */}
                                                </ul>
                                                <div
                                                  class="tab-content"
                                                  id="pills-tabContent"
                                                >
                                                  <div
                                                    class="tab-pane fade active show"
                                                    id="pills-24d"
                                                    role="tabpanel"
                                                    aria-labelledby="pills-24d-tab"
                                                  >
                                                    <div class="">
                                                      <div class="row p-0">
                                                        <div class="col-6">
                                                          <div classs="">
                                                            <p
                                                              class="font-weight-normal text_green"
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                              }}
                                                            >
                                                              Volume 24H
                                                            </p>
                                                            <h4 class="font-weight-normal text-white">
                                                              ${" "}
                                                              {this.state
                                                                .PoolInfo ===
                                                              null
                                                                ? null
                                                                : parseFloat(
                                                                    this.state
                                                                      .PoolInfo
                                                                      .swap24row
                                                                  ).toFixed(2)}
                                                            </h4>
                                                          </div>
                                                        </div>
                                                        <div class="col-6">
                                                          <div classs="">
                                                            <p
                                                              class="font-weight-normal text_green"
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                              }}
                                                            >
                                                              LP reward fees 24H
                                                            </p>
                                                            <h4 class="font-weight-normal text-white">
                                                              ${" "}
                                                              {this.state
                                                                .PoolInfo ===
                                                              null
                                                                ? null
                                                                : parseFloat(
                                                                    this.state
                                                                      .PoolInfo
                                                                      .totalRewards24
                                                                  ).toFixed(2)}
                                                            </h4>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  class="tab-pane fade  fade active show"
                                                  id="pills-7d"
                                                  role="tabpanel"
                                                  aria-labelledby="pills-7d-tab"
                                                >
                                                  <div class="">
                                                    <div class="row p-0">
                                                      <div class="col-6">
                                                        <div classs="">
                                                          <p
                                                            class="font-weight-normal text_green"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            Volume 7D
                                                          </p>
                                                          <h4 class="font-weight-normal text-white">
                                                            $
                                                            {this.state
                                                              .PoolInfo === null
                                                              ? null
                                                              : parseFloat(
                                                                  this.state
                                                                    .PoolInfo
                                                                    .swap7row
                                                                ).toFixed(2)}
                                                          </h4>
                                                        </div>
                                                      </div>
                                                      <div class="col-6">
                                                        <div class="">
                                                          <p
                                                            class="font-weight-normal text_green"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            LP reward fees 7D
                                                          </p>
                                                          <h4 class="font-weight-normal text-white">
                                                            $
                                                            {this.state
                                                              .PoolInfo === null
                                                              ? null
                                                              : parseFloat(
                                                                  this.state
                                                                    .PoolInfo
                                                                    .totalRewards7
                                                                ).toFixed(2)}
                                                          </h4>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-8 col-12">
                                            <div class="bg_skylight p-3">
                                              <ul
                                                class="nav nav-pills mb-3"
                                                id="pills-tab"
                                                role="tablist"
                                              >
                                                <li class="nav-item w-50 text-center">
                                                  <a
                                                    class="nav-link active"
                                                    id="pills-volumetabs-tab"
                                                    data-toggle="pill"
                                                    href="#pills-volumetabs"
                                                    role="tab"
                                                    aria-controls="pills-volumetabs"
                                                    aria-selected="true"
                                                  >
                                                    Volume
                                                  </a>
                                                </li>
                                                <li class="nav-item w-50 text-center">
                                                  <a
                                                    class="nav-link"
                                                    id="pills-liquiditytabs-tab"
                                                    data-toggle="pill"
                                                    href="#pills-liquiditytabs"
                                                    role="tab"
                                                    aria-controls="pills-liquiditytabs"
                                                    aria-selected="false"
                                                  >
                                                    Liquidity
                                                  </a>
                                                </li>
                                              </ul>
                                              <div
                                                class="tab-content"
                                                id="pills-tabContent"
                                              >
                                                <div
                                                  class="tab-pane fade show active"
                                                  id="pills-volumetabs"
                                                  role="tabpanel"
                                                  aria-labelledby="pills-volumetabs-tab"
                                                >
                                                  <div class="charrt_volumetabs">
                                                    <div class="pb-2">
                                                      <div class="d-flex align-items-center">
                                                        <h4 class="text_pink font-weight-normal">
                                                          $
                                                          {this.state
                                                            .PoolInfo === null
                                                            ? null
                                                            : parseFloat(
                                                                this.state
                                                                  .PoolInfo
                                                                  .pairVol
                                                              ).toFixed(2)}
                                                        </h4>
                                                      </div>
                                                      <div class="clock">
                                                        <div
                                                          class="text-white"
                                                          id="DateV"
                                                        ></div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      id="pairLiquditychart1"
                                                      style={{
                                                        width: "100%",
                                                        background: "#fff",
                                                      }}
                                                    >
                                                      {this.state.PoolInfo ===
                                                      null ? null : (
                                                        <LineChart
                                                          label={"Liquidity"}
                                                          Dataset={
                                                            this.state.PoolInfo
                                                              .pairDataPoints
                                                          }
                                                        />
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  class="tab-pane fade"
                                                  id="pills-liquiditytabs"
                                                  role="tabpanel"
                                                  aria-labelledby="pills-liquiditytabs-tab"
                                                >
                                                  <div class="chart_liquidity">
                                                    <div class="pb-2">
                                                      <div class="d-flex align-items-center">
                                                        <h4 class="text_pink font-weight-normal">
                                                          ${" "}
                                                          {this.state
                                                            .PoolInfo === null
                                                            ? null
                                                            : parseFloat(
                                                                this.state
                                                                  .PoolInfo
                                                                  .lPairvol
                                                              ).toFixed(2)}
                                                        </h4>
                                                      </div>
                                                      <div class="clock">
                                                        <div
                                                          class="text-white"
                                                          id="Date"
                                                        ></div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      id="pairLiquditychart2"
                                                      style={{
                                                        background: "#fff",
                                                        width: "100%",
                                                      }}
                                                    >
                                                      {this.state.PoolInfo ===
                                                      null ? null : (
                                                        <LineChart
                                                          label={"Liquidity"}
                                                          Dataset={
                                                            this.state.PoolInfo
                                                              .LPairdataPoints
                                                          }
                                                        />
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="top_overview py-4">
                                        <div class="py-3">
                                          <h4 class="text-white">
                                            Transaction
                                          </h4>
                                        </div>
                                        <div class="transaction_tabs_pools">
                                          <ul
                                            class="nav nav-pills mb-3"
                                            id="pills-tab"
                                            role="tablist"
                                          >
                                            <li class="nav-item">
                                              <a
                                                class="nav-link active"
                                                id="pills-swapsed-tab"
                                                data-toggle="pill"
                                                href="#pills-swapsed"
                                                role="tab"
                                                aria-controls="pills-swapsed"
                                                aria-selected="false"
                                              >
                                                Swaps
                                              </a>
                                            </li>
                                            <li class="nav-item">
                                              <a
                                                class="nav-link"
                                                id="pills-addsed-tab"
                                                data-toggle="pill"
                                                href="#pills-addsed"
                                                role="tab"
                                                aria-controls="pills-addsed"
                                                aria-selected="false"
                                              >
                                                Adds
                                              </a>
                                            </li>
                                            <li class="nav-item">
                                              <a
                                                class="nav-link"
                                                id="pills-removeed-tab"
                                                data-toggle="pill"
                                                href="#pills-removeed"
                                                role="tab"
                                                aria-controls="pills-removeed"
                                                aria-selected="false"
                                              >
                                                Remove
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                        <div class="top_overview_tables">
                                          <div
                                            class="tab-content"
                                            id="pills-tabContent"
                                          >
                                            <div
                                              class="tab-pane fade show active"
                                              id="pills-swapsed"
                                              role="tabpanel"
                                              aria-labelledby="pills-swaps-tab"
                                            >
                                              <div class=" table-responsive p-3">
                                                <table class="table table-hover transactionData">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Action{" "}
                                                        </span>
                                                      </th>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Token Amount{" "}
                                                        </span>
                                                      </th>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Token Amount{" "}
                                                        </span>
                                                      </th>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Date{" "}
                                                        </span>
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {this.state.TopPools ===
                                                    null
                                                      ? null
                                                      : this.state.PoolInfo.swappingsArray.map(
                                                          (data, key) => (
                                                            <tr key={key}>
                                                              <th scope="row">
                                                                <span class="text-white font-weight-normal">
                                                                  <div class="font-weight-normal">
                                                                    Swap{" "}
                                                                    {data.symbol.toUpperCase()}{" "}
                                                                    for{" "}
                                                                    {data.received_token.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </th>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {
                                                                      data.received_amount
                                                                    }{" "}
                                                                    {data.symbol.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {parseFloat(
                                                                      data.transfer_amount
                                                                    ).toFixed(
                                                                      2
                                                                    )}{" "}
                                                                    {data.received_token.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text_green">
                                                                  <div class="font-weight-normal text_pink">
                                                                    {data.time}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* //Tokens Tab */}
                    {/* <div
                      class="tab-pane fade  show active"
                      id="pills-token"
                      role="tabpanel"
                      aria-labelledby="pills-token-tab"
                    >
                      <div class="over_token">
                        <div class="all_token pt-4">
                          <div class="py-3">
                            <h4 class="text-white">Top Tokens</h4>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <!--===========================TABS BODY ============================--> */}
          </div>
        </div>
      </>
    );
  }
}

export default InfoTokensPage;
