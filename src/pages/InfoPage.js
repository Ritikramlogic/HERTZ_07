import React from "react";
import { volData, TokenData, TransacSwapping, TopPools } from "../Api";
import $ from "jquery";
import Pagination from "../Components/Pagination";
import LineChart from "../Components/Chart";
import { Link } from "react-router-dom";
import { store } from "../Redux/store";

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volData: null,
      TokenData: null,
      TopPools: null,
      TranscationSwapping: null,
      PoolInfo: null,
      currentSwap: [],
      currentPage: null,
      totalPages: null,
    };
    this.onPageChanged = this.onPageChanged.bind(this);
  }
  async componentDidMount() {
    this.setState({
      volData: await volData(),
      TokenData: await TokenData(),
      TopPools: await TopPools(),
    });
  }
  onPageChanged(data) {
    console.log(data);
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentSwap = this.state.TopPools.swappingsArray.slice(
      offset,
      offset + pageLimit
    );
    this.setState({ currentPage, currentSwap, totalPages });
  }
  // render() {
  //   return (
  //     <>
  //       <div
  //         style={{
  //           position: "relative",
  //           top: "0",
  //           bottom: "0",
  //           height: "100vh",
  //         }}
  //       >
  //         <iframe
  //           src="https://ramlogics.com/info.php"
  //           style={{
  //             position: "absolute",
  //             top: "0",
  //             left: "0",
  //             width: "100%",
  //             height: "100%",
  //             overflow: "scroll",
  //           }}
  //           title="Iframe Example"
  //           frameborder="0"
  //           allowfullscreen
  //         ></iframe>
  //       </div>
  //     </>
  //   );
  // }
  render() {
    return (
      <>
        {/* Iframe code end  */}

        <div class="overview_main_div1 my-md-5 my-4">
          <div class="container overview_main_div rounded py-3">
            <div class="row">
              <div class="col-md-12 co-12">
                <div class="over_tab_view pt-1">
                  <ul class="nav nav-pills" id="pills-tab" role="tablist">
                    <li class="nav-item">
                      <a
                        class="nav-link active"
                        id="pills-overview-tab"
                        data-toggle="pill"
                        href="#pills-overview"
                        role="tab"
                        aria-controls="pills-overview"
                        aria-selected="true"
                      >
                        Overview
                      </a>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link"
                        id="pills-pools-tab"
                        data-toggle="pill"
                        // href="#pills-pools"
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
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="py-3">
                  <h4 class="text-white font-weight-normal">
                    HertzSwap Info &amp; Analytics
                  </h4>
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
                    {/* //Overview tab */}
                    <div
                      class="tab-pane fade show active"
                      id="pills-overview"
                      role="tabpanel"
                      aria-labelledby="pills-overview-tab"
                    >
                      <div class="tab_inner_bars">
                        <div class="analytics_cart">
                          <div class="row">
                            {/* Chart 1  */}
                            <div class="col-md-6 col-12 my-2">
                              <div class="nskdfn_bh">
                                <div class="bg_skylight p-3">
                                  <div class="pb-2">
                                    <div class="d-flex align-items-center">
                                      <h6 class="text_green font-weight-normal">
                                        Liquidity
                                      </h6>
                                      &nbsp;
                                      <h4 class="text_pink font-weight-normal">
                                        $
                                        {this.state.volData === null
                                          ? 0
                                          : parseFloat(
                                              this.state.volData.lvol
                                            ).toFixed(4)}
                                      </h4>
                                    </div>
                                    <div class="clock">
                                      <div class="text-white" id="Date"></div>
                                    </div>
                                  </div>
                                  <div
                                    id="chartContainerLiquidity"
                                    style={{
                                      height: "370px",
                                      width: "100%",
                                      background: "#fff",
                                    }}
                                  >
                                    {this.state.volData === null ? null : (
                                      <LineChart
                                        Dataset={this.state.volData.LdataPoints}
                                        label="Liquidity"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Chart 2  */}
                            <div class="col-md-6 col-12 my-2">
                              <div class="nskdfn_bh_2nd">
                                <div class="bg_skylight p-3">
                                  <div class="pb-2">
                                    <div class="d-flex align-items-center">
                                      <h6 class="text_green font-weight-normal">
                                        Volume 24H
                                      </h6>
                                      &nbsp;
                                      <h4 class="text_pink font-weight-normal">
                                        ${" "}
                                        {this.state.volData === null
                                          ? 0
                                          : this.state.volData.vol.toPrecision(
                                              3
                                            )}
                                      </h4>
                                    </div>
                                  </div>
                                  <div class="clock">
                                    <div class="text-white" id="Dateday"></div>
                                  </div>
                                  <div
                                    id="chartContainer"
                                    style={{
                                      height: "370px",
                                      width: "100%",
                                      background: "#fff",
                                    }}
                                  >
                                    {this.state.volData === null ? null : (
                                      <LineChart
                                        Dataset={
                                          this.state.volData.volDataPoints
                                        }
                                        label="Volume"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="top_overview py-4">
                          <div class="py-3">
                            <h4 class="text-white" id="top_tokens">
                              Top Tokens
                            </h4>
                          </div>
                          <div class="top_overview_tables p-3">
                            <div class=" table-responsive">
                              <table
                                class="table table-hover topTokensTable"
                                id="TOKENTABLES"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col" class="hash_div">
                                      <span class="text-white font-weight-normal">
                                        #{" "}
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        NAME{" "}
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        PRICE{" "}
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        PRICE CHANGE{" "}
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        VOLUME 24H{" "}
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        LIQUIDITY{" "}
                                      </span>
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {this.state.TokenData === null
                                    ? null
                                    : this.state.TokenData.row.map(
                                        (data, key) => (
                                          <>
                                            {console.log(
                                              this.state.TokenData.tokenResult[
                                                key
                                              ] === null
                                            )}
                                            <tr key={key}>
                                              <th scope="row">
                                                <span class="text-white font-weight-normal">
                                                  {key + 1}
                                                </span>
                                              </th>
                                              <td key={key + 1}>
                                                <div class="text-white d-flex align-items-center ">
                                                  <div class="font-weight-normal">
                                                    <span>
                                                      <img
                                                        src={
                                                          this.state.TokenData
                                                            .tokenResult[
                                                            key
                                                          ] === null
                                                            ? "https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/default.png"
                                                            : this.state
                                                                .TokenData
                                                                .tokenResult[
                                                                key
                                                              ].image
                                                        }
                                                        width="20"
                                                        class="token_img_ss"
                                                      />
                                                    </span>
                                                    &nbsp;
                                                    <Link
                                                      to="/tokeninfo"
                                                      onClick={() =>
                                                        (store.getState().tokenSymbol =
                                                          data.symbol)
                                                      }
                                                    >
                                                      {data.symbol.toUpperCase()}
                                                    </Link>
                                                  </div>
                                                </div>
                                              </td>
                                              <td>
                                                <span class="text-white">
                                                  <div class="font-weight-normal">
                                                    ${" "}
                                                    {parseFloat(
                                                      data.price
                                                    ).toFixed(4)}
                                                  </div>
                                                </span>
                                              </td>
                                              <td>
                                                {(parseFloat(
                                                  data.max - data.min
                                                ) /
                                                  parseFloat(
                                                    data.max + data.min
                                                  )) *
                                                  100 >
                                                0 ? (
                                                  <span class="font-weight-normal text_green">
                                                    <div class="font-weight-normal">
                                                      $
                                                      {(
                                                        (parseFloat(
                                                          data.max - data.min
                                                        ) /
                                                          parseFloat(
                                                            data.max + data.min
                                                          )) *
                                                        100
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                ) : (
                                                  <span class="font-weight-normal text-danger">
                                                    <div class="font-weight-normal">
                                                      $
                                                      {(
                                                        (parseFloat(
                                                          data.max - data.min
                                                        ) /
                                                          parseFloat(
                                                            data.max + data.min
                                                          )) *
                                                        100
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                <span class="text-white">
                                                  <div class="font-weight-normal">
                                                    $ 0.0000
                                                  </div>
                                                </span>
                                              </td>
                                              <td>
                                                <span class="text-white">
                                                  <div class="font-weight-normal">
                                                    ${" "}
                                                    {parseFloat(
                                                      this.state.TokenData
                                                        .totalLiquidity[key] *
                                                        0.001
                                                    ).toFixed(4)}
                                                  </div>
                                                </span>
                                              </td>
                                            </tr>
                                          </>
                                        )
                                      )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* <!--================================TOP POOLS TABLES=============================-->  */}
                        <div class="top_overview py-4">
                          <div class="py-3">
                            <h4 class="text-white">Top Pools</h4>
                          </div>
                          <div class="top_overview_tables p-3">
                            <div class=" table-responsive">
                              <table
                                class="table table-hover topPairTable"
                                id="POOLSTABLES"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col" class="hash_div">
                                      <span class="text-white font-weight-normal">
                                        #
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        POOL
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        VOLUME 24H
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        VOLUME 7D
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        LP REWARD FEES 24H
                                      </span>
                                    </th>
                                    <th scope="col">
                                      <span class="text-white font-weight-normal">
                                        LIQUIDITY
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <>
                                    {this.state.TopPools !== null
                                      ? this.state.TopPools.tokenAResult.map(
                                          (data, key) => (
                                            <>
                                              <tr key={key}>
                                                <th scope="row">
                                                  <span class="text-white font-weight-normal">
                                                    {key + 1}
                                                  </span>
                                                </th>
                                                <td>
                                                  <div class="text-white d-flex align-items-center ">
                                                    {console.log(
                                                      this.state.TopPools
                                                        .rowArray[key].pair
                                                    )}
                                                    <Link
                                                      to="/poolinfo"
                                                      onClick={() =>
                                                        (store.getState().poolPair =
                                                          this.state.TopPools.rowArray[
                                                            key
                                                          ].pair)
                                                      }
                                                      class="font-weight-normal"
                                                    >
                                                      <span class="">
                                                        <img
                                                          src={data.image}
                                                          width="20"
                                                          class="token_img_ss"
                                                        />
                                                        <img
                                                          src={data.image}
                                                          width="20"
                                                          class="token_img_ss"
                                                        />
                                                      </span>
                                                      &nbsp;{" "}
                                                      {data.tokens.toUpperCase()}
                                                      /
                                                      {this.state.TopPools
                                                        .tokenBResult[key] ===
                                                      null
                                                        ? "###"
                                                        : this.state.TopPools.tokenBResult[
                                                            key
                                                          ].tokens.toUpperCase()}
                                                    </Link>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .swaprow24[key] *
                                                          0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .swaprow7days[key] *
                                                          0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      ${" "}
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .totalRewards[key] *
                                                          0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      $
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .totalLiquidity[key] *
                                                          0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </span>
                                                </td>
                                              </tr>
                                            </>
                                          )
                                        )
                                      : null}
                                  </>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* <!--================================TOP POOLS TABLES END=============================--> */}

                        {/* <!--================================TOP TRANSACTIONS TABLES Start=============================--> */}
                        <div class="top_overview py-4">
                          <div class="py-3">
                            <h4 class="text-white">Transactions</h4>
                          </div>
                          <div class="transaction_tabs">
                            <ul
                              class="nav nav-pills mb-3"
                              id="pills-tab"
                              role="tablist"
                            >
                              <li class="nav-item">
                                <a
                                  class="nav-link active"
                                  id="pills-swaps-tab"
                                  data-toggle="pill"
                                  href="#pills-swaps"
                                  role="tab"
                                  aria-controls="pills-swaps"
                                  aria-selected="false"
                                >
                                  Swaps
                                </a>
                              </li>
                              <li class="nav-item">
                                <a
                                  class="nav-link"
                                  id="pills-adds-tab"
                                  data-toggle="pill"
                                  href="#pills-adds"
                                  role="tab"
                                  aria-controls="pills-adds"
                                  aria-selected="false"
                                >
                                  Adds
                                </a>
                              </li>
                              <li class="nav-item">
                                <a
                                  class="nav-link"
                                  id="pills-remove-tab"
                                  data-toggle="pill"
                                  href="#pills-remove"
                                  role="tab"
                                  aria-controls="pills-remove"
                                  aria-selected="false"
                                >
                                  Remove
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div class="top_overview_tables">
                            <div class="tab-content" id="pills-tabContent">
                              <div
                                class="tab-pane fade show active"
                                id="pills-swaps"
                                role="tabpanel"
                                aria-labelledby="pills-swaps-tab"
                              >
                                <div>
                                  {this.state.TopPools === null ? null : (
                                    <div
                                      style={{
                                        padding: "10px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <Pagination
                                        totalRecords={
                                          this.state.TopPools.swappingsArray
                                            .length
                                        }
                                        pageLimit={10}
                                        pageNeighbours={1}
                                        onPageChanged={this.onPageChanged}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div class=" table-responsive">
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
                                      {this.state.TopPools === null
                                        ? null
                                        : this.state.currentSwap.map(
                                            (data, key) => (
                                              <tr key={key}>
                                                <th scope="row">
                                                  <span class="text-white font-weight-normal">
                                                    <div class="font-weight-normal">
                                                      Swap{" "}
                                                      {data.symbol.toUpperCase()}
                                                      &nbsp; for&nbsp;
                                                      {data.received_token.toUpperCase()}
                                                    </div>
                                                  </span>
                                                </th>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        data.received_amount
                                                      ).toFixed(4)}
                                                      &nbsp;
                                                      {data.symbol.toUpperCase()}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        data.transfer_amount
                                                      ).toFixed(4)}
                                                      &nbsp;
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
                              <div
                                class="tab-pane fade"
                                id="pills-adds"
                                role="tabpanel"
                                aria-labelledby="pills-adds-tab"
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
                                      {this.state.TopPools === null
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
                                                      justifyContent: "center",
                                                    }}
                                                  >
                                                    <div class="font-weight-normal">
                                                      $
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .SwappairTotal[key] *
                                                          0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .SwaptokenATotal
                                                      ).toFixed(4)}
                                                      &nbsp;
                                                      {data.token_A_symbols.toUpperCase()}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .SwaptokenBTotal[key]
                                                      ).toFixed(4)}
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
                              <div
                                class="tab-pane fade"
                                id="pills-remove"
                                role="tabpanel"
                                aria-labelledby="pills-remove-tab"
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
                                      {this.state.TopPools === null
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
                                                      justifyContent: "center",
                                                    }}
                                                  >
                                                    <div class="font-weight-normal">
                                                      $
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .RemovepairTotal[
                                                          key
                                                        ] * 0.001
                                                      ).toFixed(4)}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .RemovetokenATotal
                                                      ).toFixed(4)}
                                                      &nbsp;
                                                      {data.token_A_symbols.toUpperCase()}
                                                    </div>
                                                  </span>
                                                </td>
                                                <td>
                                                  <span class="text-white">
                                                    <div class="font-weight-normal">
                                                      {parseFloat(
                                                        this.state.TopPools
                                                          .RemovetokenBTotal
                                                      ).toFixed(4)}
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
                        {/* <!--================================TOP TRANSACTIONS TABLES END=============================--> */}
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

export default InfoPage;
