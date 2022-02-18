import React from "react";
import { Link } from "react-router-dom";
import { volData, TokenData, TopPools, PoolInfo } from "../Api";
import Pagination from "../Components/Pagination";
import LineChart from "../Components/Chart";
import { store } from "../Redux/store";
import { cssNumber } from "jquery";
class InforPoolPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volData: null,
      TokenData: null,
      TopPools: null,
      PoolInfo: null,
      currentSwap: [],
      currentPage: null,
      totalPages: null,
      //   poolPair: "bshd_htz",
    };
    this.onPageChanged = this.onPageChanged.bind(this);
  }

  async componentDidMount() {
    this.setState({
      volData: await volData(),
      TokenData: await TokenData(),
      TopPools: await TopPools(),
      PoolInfo: await PoolInfo(store.getState().poolPair),
    });
  }
  onPageChanged(data) {
    console.log(data);
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentSwap = this.state.TopPools.swappings.slice(
      offset,
      offset + pageLimit
    );
    this.setState({ currentPage, currentSwap, totalPages });
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
                        class="nav-link active"
                        id="pills-pools-tab"
                        data-toggle="pill"
                        // href="#pills-pools"
                        to="/poolinfo"
                        role="tab"
                        aria-controls="pills-pools-tab"
                        aria-selected="true"
                      >
                        Pools
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link"
                        id="pills-token-tab"
                        data-toggle="pill"
                        to="/tokens"
                        role="tab"
                        aria-controls="pills-token"
                        aria-selected="false"
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
                      <h1 style={{ color: "#fff" }}>Pools</h1>
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
                                                    {this.state.PoolInfo ===
                                                    null
                                                      ? null
                                                      : this.state.PoolInfo.token[0].toUpperCase()}
                                                    &nbsp;/{" "}
                                                    {this.state.PoolInfo ===
                                                    null
                                                      ? null
                                                      : this.state.PoolInfo.token[1].toUpperCase()}
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
                                              src={
                                                this.state.PoolInfo === null
                                                  ? "#"
                                                  : this.state.PoolInfo
                                                      .tokenAResult.image
                                              }
                                              width="30"
                                              style={{ borderRadius: "50%" }}
                                            ></img>
                                            <img
                                              src={
                                                this.state.PoolInfo === null
                                                  ? "#"
                                                  : this.state.PoolInfo
                                                      .tokenBResult.image
                                              }
                                              width="30"
                                              style={{ borderRadius: "50%" }}
                                            ></img>
                                          </span>
                                          &nbsp;&nbsp;
                                          <h2 class="text-white m-0">
                                            {this.state.PoolInfo === null
                                              ? null
                                              : this.state.PoolInfo.token[0].toUpperCase()}
                                            &nbsp;/{" "}
                                            {this.state.PoolInfo === null
                                              ? null
                                              : this.state.PoolInfo.token[1].toUpperCase()}
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
                                                    src={
                                                      this.state.PoolInfo ===
                                                      null
                                                        ? "#"
                                                        : this.state.PoolInfo
                                                            .tokenAResult.image
                                                    }
                                                    width="24"
                                                  ></img>
                                                </span>
                                                &nbsp;&nbsp;
                                                <h6 class="text-white font-weight-normal m-0">
                                                  1{" "}
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[0].toUpperCase()}
                                                  &nbsp;=&nbsp;
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo
                                                        .tokenBPrice}
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[1].toUpperCase()}
                                                </h6>
                                              </a>
                                              &nbsp;&nbsp;&nbsp;&nbsp;
                                              <a
                                                href="#"
                                                class="d-flex align-items-center"
                                              >
                                                <span>
                                                  <img
                                                    src={
                                                      this.state.PoolInfo ===
                                                      null
                                                        ? "#"
                                                        : this.state.PoolInfo
                                                            .tokenBResult.image
                                                    }
                                                    width="24"
                                                  ></img>
                                                </span>
                                                &nbsp;&nbsp;
                                                <h6 class="text-white font-weight-normal m-0">
                                                  1{" "}
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[1].toUpperCase()}
                                                  &nbsp;=&nbsp;
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo
                                                        .tokenAPrice}
                                                  {this.state.PoolInfo === null
                                                    ? "#"
                                                    : this.state.PoolInfo.token[0].toUpperCase()}
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
                                                        : this.state.PoolInfo.totalPairLiquidity.toFixed(
                                                            4
                                                          )}
                                                    </h4>
                                                  </div>
                                                </div>
                                                <div class="col-6">
                                                  <div classs="">
                                                    <h6 class="font-weight-normal text_green">
                                                      LP Reward
                                                    </h6>
                                                    <h4 class="font-weight-normal text-white">
                                                      ${" "}
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.totalRewards.toFixed(
                                                            4
                                                          )}
                                                    </h4>
                                                  </div>
                                                </div>
                                              </div>
                                              <h5 class="font-weight-normal mt-3 text-white">
                                                Total Tokens Locked
                                              </h5>
                                              <div class="">
                                                <div class="bg_lightsky p-2 border">
                                                  <div class="d-flex align-items-center justify-content-between py-2">
                                                    <span class="font-weight-normal text-white">
                                                      <img
                                                        src={
                                                          this.state
                                                            .PoolInfo === null
                                                            ? "#"
                                                            : this.state
                                                                .PoolInfo
                                                                .tokenAResult
                                                                .image
                                                        }
                                                        width="24"
                                                      ></img>{" "}
                                                      &nbsp;{" "}
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.token[0].toUpperCase()}
                                                    </span>
                                                    <span class="font-weight-normal text-white">
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.tokenATotal.toFixed(
                                                            4
                                                          )}
                                                    </span>
                                                  </div>
                                                  <div class="d-flex align-items-center justify-content-between py-2 mt-2">
                                                    <span class="font-weight-normal text-white">
                                                      <img
                                                        src={
                                                          this.state
                                                            .PoolInfo === null
                                                            ? "#"
                                                            : this.state
                                                                .PoolInfo
                                                                .tokenBResult
                                                                .image
                                                        }
                                                        width="24"
                                                      ></img>{" "}
                                                      &nbsp;
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.token[1].toUpperCase()}
                                                    </span>
                                                    <span class="font-weight-normal text-white">
                                                      {" "}
                                                      {this.state.PoolInfo ===
                                                      null
                                                        ? null
                                                        : this.state.PoolInfo.tokenBTotal.toFixed(
                                                            4
                                                          )}
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
                                                                : this.state.PoolInfo.swap24row.toFixed(
                                                                    4
                                                                  )}
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
                                                                : this.state.PoolInfo.totalRewards24.toFixed(
                                                                    4
                                                                  )}
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
                                                              : this.state.PoolInfo.swap7row.toFixed(
                                                                  4
                                                                )}
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
                                                              : this.state.PoolInfo.totalRewards7.toFixed(
                                                                  4
                                                                )}
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
                                                              ).toFixed(4)}
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
                                                      {" "}
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
                                                            : this.state.PoolInfo.lPairvol.toFixed(
                                                                4
                                                              )}
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
                                                        // height: "370px",
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
                                            Transactions
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
                                            {/* //Swap */}
                                            <div
                                              class="tab-pane fade show active"
                                              id="pills-swapsed"
                                              role="tabpanel"
                                              aria-labelledby="pills-swaps-tab"
                                            >
                                              {/* <div>
                                                {this.state.TopPools ===
                                                null ? null : (
                                                  <div
                                                    style={{
                                                      padding: "10px",
                                                      display: "flex",
                                                      justifyContent:
                                                        "flex-end",
                                                    }}
                                                  >
                                                    <Pagination
                                                      totalRecords={
                                                        this.state.TopPools
                                                          .swappings.length
                                                      }
                                                      pageLimit={10}
                                                      pageNeighbours={1}
                                                      onPageChanged={
                                                        this.onPageChanged
                                                      }
                                                    />
                                                  </div>
                                                )}
                                              </div> */}
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
                                                      : this.state.TopPools.swappings.map(
                                                          (data, key) => (
                                                            <>
                                                              {console.log(
                                                                data
                                                              )}
                                                              {console.log(
                                                                this.state
                                                                  .PoolInfo
                                                                  .token[0] +
                                                                  "_" +
                                                                  this.state
                                                                    .PoolInfo
                                                                    .token[1] ===
                                                                  data.pair ||
                                                                  this.state
                                                                    .PoolInfo
                                                                    .token[1] +
                                                                    "_" +
                                                                    this.state
                                                                      .PoolInfo
                                                                      .token[0] ===
                                                                    data.pair
                                                              )}
                                                              {this.state
                                                                .PoolInfo
                                                                .token[0] +
                                                                "_" +
                                                                this.state
                                                                  .PoolInfo
                                                                  .token[1] ===
                                                                data.pair ||
                                                              this.state
                                                                .PoolInfo
                                                                .token[1] +
                                                                "_" +
                                                                this.state
                                                                  .PoolInfo
                                                                  .token[0] ===
                                                                data.pair ? (
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
                                                                        {parseFloat(
                                                                          data.received_amount
                                                                        ).toFixed(
                                                                          4
                                                                        )}{" "}
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
                                                                          4
                                                                        )}{" "}
                                                                        {data.received_token.toUpperCase()}
                                                                      </div>
                                                                    </span>
                                                                  </td>
                                                                  <td>
                                                                    <span class="text_green">
                                                                      <div class="font-weight-normal text_pink">
                                                                        {
                                                                          data.time
                                                                        }
                                                                      </div>
                                                                    </span>
                                                                  </td>
                                                                </tr>
                                                              ) : null}
                                                            </>
                                                          )
                                                        )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                            {/* Adds */}
                                            <div
                                              class="tab-pane fade"
                                              id="pills-addsed"
                                              role="tabpanel"
                                              aria-labelledby="pills-adds-tab"
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
                                                          Total Value{" "}
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
                                                          Pair{" "}
                                                        </span>
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {this.state.TopPools ===
                                                    null
                                                      ? null
                                                      : this.state.TopPools.SwappairRecords.map(
                                                          (data, key) => (
                                                            <tr key={key}>
                                                              <th scope="row">
                                                                <span class="text-white font-weight-normal">
                                                                  <div class="font-weight-normal">
                                                                    {data.token_A_symbols.toUpperCase()}
                                                                    /
                                                                    {data.token_B_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </th>
                                                              <td>
                                                                <div
                                                                  class="text-white d-flex align-items-center "
                                                                  style={{
                                                                    justifyContent:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <div class="font-weight-normal">
                                                                    $
                                                                    {parseFloat(
                                                                      this.state
                                                                        .TopPools
                                                                        .SwappairTotal[
                                                                        key
                                                                      ] * 0.001
                                                                    ).toFixed(
                                                                      4
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {parseFloat(
                                                                      this.state
                                                                        .TopPools
                                                                        .SwaptokenATotal
                                                                    ).toFixed(
                                                                      4
                                                                    )}
                                                                    &nbsp;
                                                                    {data.token_A_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {parseFloat(
                                                                      this.state
                                                                        .TopPools
                                                                        .SwaptokenBTotal[
                                                                        key
                                                                      ]
                                                                    ).toFixed(
                                                                      4
                                                                    )}
                                                                    &nbsp;
                                                                    {data.token_B_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <a
                                                                    // href="https://defi.hertz-network.com/index.php/info/?pair="
                                                                    class="font-weight-normal d-flex"
                                                                    style={{
                                                                      justifyContent:
                                                                        "center",
                                                                    }}
                                                                  >
                                                                    <span class="">
                                                                      {data.token_A_symbols.toUpperCase()}
                                                                      /
                                                                      {data.token_B_symbols.toUpperCase()}
                                                                    </span>
                                                                    <i class="fal fa-external-link-alt"></i>
                                                                  </a>
                                                                </span>
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>

                                            {/* Remove */}
                                            <div
                                              class="tab-pane fade"
                                              id="pills-removeed"
                                              role="tabpanel"
                                              aria-labelledby="pills-remove-tab"
                                            >
                                              <div class=" table-responsive p-3">
                                                <table class="table table-hover transactionData">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Action
                                                        </span>
                                                      </th>
                                                      <th scope="col">
                                                        <span class="text-white font-weight-normal">
                                                          Total Value{" "}
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
                                                          Pair{" "}
                                                        </span>
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {this.state.TopPools ===
                                                    null
                                                      ? null
                                                      : this.state.TopPools.RemovepairRecords.map(
                                                          (data, key) => (
                                                            <tr key={key}>
                                                              <th scope="row">
                                                                <span class="text-white font-weight-normal">
                                                                  <div class="font-weight-normal">
                                                                    {data.token_A_symbols.toUpperCase()}
                                                                    /
                                                                    {data.token_B_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </th>
                                                              <td>
                                                                <div
                                                                  class="text-white d-flex align-items-center "
                                                                  style={{
                                                                    justifyContent:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <div class="font-weight-normal">
                                                                    $
                                                                    {parseFloat(
                                                                      this.state
                                                                        .TopPools
                                                                        .RemovepairTotal[
                                                                        key
                                                                      ] * 0.001
                                                                    ).toFixed(
                                                                      4
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {Math.abs(
                                                                      parseFloat(
                                                                        this
                                                                          .state
                                                                          .TopPools
                                                                          .RemovetokenATotal[
                                                                          key
                                                                        ]
                                                                      ).toFixed(
                                                                        4
                                                                      )
                                                                    )}
                                                                    &nbsp;
                                                                    {data.token_A_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <div class="font-weight-normal">
                                                                    {Math.abs(
                                                                      parseFloat(
                                                                        this
                                                                          .state
                                                                          .TopPools
                                                                          .RemovetokenBTotal[
                                                                          key
                                                                        ]
                                                                      ).toFixed(
                                                                        4
                                                                      )
                                                                    )}
                                                                    &nbsp;
                                                                    {data.token_B_symbols.toUpperCase()}
                                                                  </div>
                                                                </span>
                                                              </td>
                                                              <td>
                                                                <span class="text-white">
                                                                  <a
                                                                    // href="https://defi.hertz-network.com/index.php/info/?pair="
                                                                    class="font-weight-normal d-flex"
                                                                    style={{
                                                                      justifyContent:
                                                                        "center",
                                                                    }}
                                                                  >
                                                                    <span class="">
                                                                      {" "}
                                                                      {data.token_A_symbols.toUpperCase()}
                                                                      /
                                                                      {data.token_B_symbols.toUpperCase()}
                                                                    </span>
                                                                    <i class="fal fa-external-link-alt"></i>
                                                                  </a>
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

export default InforPoolPage;
