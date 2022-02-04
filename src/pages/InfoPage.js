import React from "react";
import { volData, TokenData, sumAmountAnalytics } from "../Api";
import LineChart from "../Components/Chart";

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volData: null,
      TokenData: null,
    };
  }
  async componentDidMount() {
    // this.setState({
    //   volData: await volData(),
    //   TokenData: await TokenData(),
    // });
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
    {
      console.log(this.state.TokenData);
    }
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
                      <a
                        class="nav-link"
                        id="pills-pools-tab"
                        data-toggle="pill"
                        href="#pills-pools"
                        role="tab"
                        aria-controls="pills-pools-tab"
                        aria-selected="false"
                      >
                        Pools
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        id="pills-token-tab"
                        data-toggle="pill"
                        href="#pills-token"
                        role="tab"
                        aria-controls="pills-token"
                        aria-selected="false"
                      >
                        Tokens
                      </a>
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

        {/* //Section 2 */}
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
                                        ${" "}
                                        {/* {this.state.volData === null
                                          ? 0
                                          : this.state.volData.volData} */}
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
                                    {/* {this.state.volData === null ? null : (
                                      <LineChart
                                        Chartdata={this.state.volData}
                                      />
                                    )} */}
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
                                        $
                                      </h4>
                                    </div>
                                    <div class="clock">
                                      <div
                                        class="text-white"
                                        id="Dateday"
                                      ></div>
                                    </div>
                                  </div>
                                  <div
                                    id="chartContainer"
                                    style={{
                                      height: "370px",
                                      width: "100%",
                                      background: "#fff",
                                    }}
                                  >
                                    {/* <LineChart /> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="top_overview py-4">
                          <div class="py-3">
                            <h4 class="text-white">Top Tokens</h4>
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
                                    : this.state.TokenData.map((data, key) => (
                                        <>
                                          <tr>
                                            <th scope="row">
                                              <span class="text-white font-weight-normal">
                                                {key + 1}
                                              </span>
                                            </th>
                                            <td key={key + 1}>
                                              <div class="text-white d-flex align-items-center ">
                                                <div class="font-weight-normal">
                                                  <span class="">
                                                    {/* <img src="<?php echo $tokenResult['image']; ?>" width="20" class="token_img_ss"/> */}
                                                  </span>
                                                  {data.symbol}
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <span class="text-white">
                                                <div class="font-weight-normal">
                                                  $ {data.price.toPrecision(4)}
                                                </div>
                                              </span>
                                            </td>
                                            <td>
                                              {(
                                                (data.max - data.min) /
                                                (data.max + data.min)
                                              ).toPrecision(6) *
                                                100 >
                                              0 ? (
                                                <span class="font-weight-normal text_green">
                                                  <div class="font-weight-normal">
                                                    $
                                                    {(
                                                      (data.max - data.min) /
                                                      (data.max + data.min)
                                                    ).toPrecision(6) * 100}
                                                  </div>
                                                </span>
                                              ) : (
                                                <span class="font-weight-normal text-danger">
                                                  <div class="font-weight-normal">
                                                    $
                                                    {(
                                                      (data.max - data.min) /
                                                      (data.max + data.min)
                                                    ).toPrecision(6) * 100}
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
                                                  {() =>
                                                    sumAmountAnalytics(
                                                      data.symbol
                                                    )
                                                  }
                                                </div>
                                              </span>
                                            </td>
                                          </tr>
                                        </>
                                      ))}
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
                                <tbody></tbody>
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
                                    <tbody></tbody>
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
                                    <tbody></tbody>
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
                                    <tbody></tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <!--================================TOP TRANSACTIONS TABLES END=============================--> */}
                      </div>
                    </div>
                    {/* //Pools Tab */}
                    <div
                      class="tab-pane fade"
                      id="pills-pools"
                      role="tabpanel"
                      aria-labelledby="pills-pools-tab"
                    >
                      <h1 style={{ color: "#fff" }}>Pools</h1>
                    </div>
                    {/* //Tokens Tab */}
                    <div
                      class="tab-pane fade"
                      id="pills-token"
                      role="tabpanel"
                      aria-labelledby="pills-token-tab"
                    >
                      <div class="over_token">
                        <div class="all_token pt-4">
                          <div class="py-3">
                            <h4 class="text-white">Top Tokens</h4>
                          </div>
                          <div class="top_overview_tables table-responsive p-3">
                            <table class="table table-hover topTokensTable">
                              <thead>
                                <tr>
                                  <th scope="col">
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

                              <tbody></tbody>
                            </table>
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

export default InfoPage;
