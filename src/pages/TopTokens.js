import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TokenData } from "../Api";
import { store } from "../Redux/store";

class TopTokens extends Component {
  constructor(props) {
    super(props);
    this.state = { TokenData: null };
  }
  async componentDidMount() {
    this.setState({
      TokenData: await TokenData(),
    });
  }
  render() {
    return (
      <>
        {" "}
        {/* Iframe code end  */}
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
                        to="/info"
                        role="tab"
                        aria-controls="pills-overview"
                        aria-selected="false"
                      >
                        Overview
                      </Link>
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
                        class="nav-link active"
                        id="pills-token-tab"
                        data-toggle="pill"
                        to="/tokens"
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
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="py-3"></div>
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
                            : this.state.TokenData.row.map((data, key) => (
                                <>
                                  {console.log(
                                    this.state.TokenData.tokenResult[key] ===
                                      null
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
                                                  .tokenResult[key] === null
                                                  ? "https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/default.png"
                                                  : this.state.TokenData
                                                      .tokenResult[key].image
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
                                          {data.price
                                            .toString()
                                            .substring(0, 6)}
                                        </div>
                                      </span>
                                    </td>
                                    <td>
                                      {(parseFloat(data.max - data.min) /
                                        parseFloat(data.max + data.min)) *
                                        100 >
                                      0 ? (
                                        <span class="font-weight-normal text_green">
                                          <div class="font-weight-normal">
                                            $
                                            {(
                                              (parseFloat(data.max - data.min) /
                                                parseFloat(
                                                  data.max + data.min
                                                )) *
                                              100
                                            ).toPrecision(4)}
                                          </div>
                                        </span>
                                      ) : (
                                        <span class="font-weight-normal text-danger">
                                          <div class="font-weight-normal">
                                            $
                                            {(
                                              (parseFloat(data.max - data.min) /
                                                parseFloat(
                                                  data.max + data.min
                                                )) *
                                              100
                                            ).toPrecision(4)}
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
                                          {this.state.TokenData.totalLiquidity[
                                            key
                                          ].toPrecision(4)}
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
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default TopTokens;
