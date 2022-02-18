import React, { useEffect } from "react";
import { swal } from "sweetalert";
import $ from "jquery";
import { store } from "../Redux/store";
import {
  liquidityAdd,
  truncateToDecimals,
  getTokenRatio,
  getPayableAmount,
} from "../Services/liquidity";

import {
  getPair,
  getPerTokenPayable,
  serverApi,
} from "../Services/allFunction";
import { Link } from "react-router-dom";
export default function LiquidityPage(props) {
  useEffect(() => {
    $(document).ready(function () {
      $("#liqudity").click(function () {
        $("#Liquidity_token").hide();
        $("#Liquidity_show").show();
      });
    });

    $(document).ready(function () {
      $(".kfn_left").click(function () {
        $("#Liquidity_show").hide();
        $("#Liquidity_token").show();
      });
    });

    $("#filter").keyup(function () {
      var filter = $(this).val(),
        count = 0;
      $("#symbol1 span").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
          count++;
        }
      });
    });

    $("#filterLiq2").keyup(function () {
      var filter = $(this).val(),
        count = 0;

      $("#liquiditySymbol2 span").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
          count++;
        }
      });
    });

    $("#filterSwap1").keyup(function () {
      var filter = $(this).val(),
        count = 0;

      $("#symbol2 span").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
          count++;
        }
      });
    });

    $("#filterLiquidity").keyup(function () {
      // Retrieve the input field text and reset the count to zero
      var filter = $(this).val(),
        count = 0;

      // Loop through the comment list
      $("#swapTokeList span").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
          count++;
        }
      });
    });

    // SWAP FIRST INPUT KEYUP
    $(document).ready(function () {
      $("#firstTokenAmount").on("keyup", function () {
        getPair()
          .then((pair) => {
            console.log(pair);

            let value = $(this).val();
            let addressTypes = $("#addressTypes").val();
            let symbol2 = pair.split("_")[1];

            if (!isNaN(value)) {
              let changeValue = truncateToDecimals(value);

              if (changeValue == "0.0000") {
                $("#errorMessage").text("Please enter a four decimal value");
                $("#liquidityBtn").attr("disabled", "true");
              } else {
                $("#errorMessage").text("");
                $("#errorMessage2").text("");
                $("#liquidityBtn").removeAttr("disabled");

                getPayableAmount(pair)
                  .then((secondAmount) => {
                    if (secondAmount.code == 1) {
                      getPerTokenPayable(pair, addressTypes)
                        .then((result) => {
                          let secondAmount = $("#secondTokenAmount").val();

                          var totalPool =
                            Number(value) +
                            Number(secondAmount) +
                            Number(result.result.totalLiquidityOfPair);
                          var shareOfPool =
                            ((Number(value) + Number(secondAmount)) /
                              Number(totalPool)) *
                            100;
                          $("#shareOfPool").text(`${shareOfPool.toFixed(2)} %`);
                        })
                        .catch((err) => console.log(err));

                      if (secondAmount.result == 0) {
                        getTokenRatio(symbol2)
                          .then((ratio) => {
                            $("#secondTokenAmount").val();
                          })
                          .catch((err) => console.log(err));
                      } else {
                        $("#secondTokenAmount").val(
                          parseFloat(
                            secondAmount.result.payableAmount * value
                          ).toFixed(4)
                        );
                      }
                    } else {
                      $("#firstLiquidityProvider").text(
                        "You are the first liquidity provider"
                      );
                    }
                  })
                  .catch((err) => console.log(err));
              }
            } else {
              swal("Invalid Amount", "Please enter a valid amount", "warning");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      // SWAP SECOND INPUT KEYUP
      $("#secondTokenAmount").on("keyup", function () {
        getPair()
          .then((pair) => {
            let value = $(this).val();
            let addressTypes = $("#addressTypes").val();
            let firstAmount = $("#firstTokenAmount").val();
            if (!isNaN(value)) {
              let symbol1 = pair.split("_")[0];
              let symbol2 = pair.split("_")[1];
              let addressType1 = addressTypes.split("_")[0];
              let addressType2 = addressTypes.split("_")[1];
              let newPair = `${symbol2}_${symbol1}`;
              let newAddressTypes = `${addressType2}_${addressType1}`;

              let changeValue = truncateToDecimals(value);

              if (changeValue == "0.0000") {
                $("#errorMessage2").text("Please enter a four decimal value");
                $("#liquidityBtn").attr("disabled", "true");
              } else {
                $("#errorMessage").text("");
                $("#errorMessage2").text("");
                $("#liquidityBtn").removeAttr("disabled");

                getPayableAmount(newPair)
                  .then((secondAmount) => {
                    if (secondAmount.code == 1) {
                      getPerTokenPayable(newPair, addressTypes)
                        .then((result) => {
                          // console.log(result.result.totalLiquidityOfPair);

                          var totalPool =
                            Number(value) +
                            Number(firstAmount) +
                            Number(result.result.totalLiquidityOfPair);
                          var shareOfPool =
                            ((Number(value) + Number(firstAmount)) /
                              Number(totalPool)) *
                            100;
                          console.log("Total Pool", totalPool);
                          console.log("Share of pool", shareOfPool);

                          $("#shareOfPool").text(`${shareOfPool.toFixed(2)} %`);
                        })
                        .catch((err) => console.log(err));

                      if (secondAmount.result == 0) {
                        getTokenRatio(symbol2)
                          .then((ratio) => {
                            $("#firstTokenAmount").val();
                          })
                          .catch((err) => console.log(err));
                      } else {
                        $("#firstTokenAmount").val(
                          parseFloat(
                            secondAmount.result.payableAmount * value
                          ).toFixed(4)
                        );
                      }
                    } else {
                      $("#firstLiquidityProvider").text(
                        "You are the first liquidity provider"
                      );
                    }
                  })
                  .catch((err) => console.log(err));
              }
            } else {
              swal("Invalid Amount", "Please enter a valid amount", "warning");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });

    // let selectedPair = $("#selectedPair").val();
    document.getElementById("symbol1").innerHTML = "";
    document.getElementById("symbol2").innerHTML = "";

    var formdata = new FormData();

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`${serverApi.apiHost}/get-all-tokens`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.result.map((Result) => {
          let t = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstLiquidityPair('${
            Result.tokens
          }','${Result.address_type}','${Result.image}')"><img src="${
            Result.image
          }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;
          document.getElementById("symbol1").innerHTML += t;
        });
      })
      .catch((error) => console.log("error", error));
  }, []);
  return (
    <>
      <section class="total_wsum_main">
        <div class="container">
          <div class="row WSUM_value justify-content-center">
            <div class="col-md-8 col-12">
              <div class="row WSUM_value_02">
                <div class="col-md-12">
                  <div class="text-center " style={{ padding: "14px 0" }}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/Hertz_Swap_Arrows_white.png"
                      }
                      class="w-75"
                      alt=""
                    ></img>
                  </div>

                  <hr class="mb-0" style={{ borderColor: "#26c5eb" }} />
                  <div class="row py-3">
                    <div class="col-auto">
                      <div class="kfn_i"></div>
                    </div>
                    <div class="col">
                      <div class="kfn_h6 text-center">
                        <h5>Add Liquidity </h5>
                      </div>
                    </div>
                    <div class="col-auto">
                      <div
                        class="swapbox"
                        data-toggle="modal"
                        data-target="#exampleModalView"
                        id="showTotalLiquidityBtn"
                        onclick="showLiquidityByAddressAndPair()"
                      >
                        <i
                          class="fal fa-clock"
                          data-toggle="tooltip"
                          data-placement="right"
                          title="Transaction status"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div class="farm-tool">
                    <div class="tab-content" id="pills-tabContent">
                      <div
                        class="tab-pane fade show active d-none"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                      >
                        <div class="fnlfgj_">
                          <div class="swap_tab_01 py-md-3 py-2">
                            <div class="form_area_01">
                              <span> </span>
                              <div class="form-group">
                                <label for="">Input</label>
                                <input
                                  type="text"
                                  class="form-control form_token"
                                  placeholder="0.0"
                                ></input>
                                <button
                                  type="button"
                                  class="btn btn-primary angle_down"
                                  data-toggle="modal"
                                  data-target="#liquidityPairsModel"
                                >
                                  <img
                                    src="https://defi.hertz-network.com/wp-content/themes/twentytwenty/assets/images/1.png"
                                    class=""
                                    alt="WETH.png"
                                    style={{ width: "35px" }}
                                  />
                                  KNC <i class="far fa-angle-down"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="swap_tab_01 py-md-3 py-2">
                            <div class="form_area_02">
                              <a href="#">
                                <i class="fad fa-arrow-alt-circle-down"></i>
                              </a>
                            </div>
                          </div>
                          <div class="swap_tab_03 py-md-3 py-2">
                            <div class="form_area_03">
                              <span> </span>
                              <div class="form-group">
                                <label for="">To</label>
                                <input
                                  type="text"
                                  class="form-control form_token"
                                  placeholder="0.0"
                                ></input>
                                <button
                                  type="button"
                                  class="btn btn-primary angle_down1"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter_"
                                >
                                  <img
                                    src="https://defi.hertz-network.com/wp-content/themes/twentytwenty/assets/images/eth.png"
                                    class=""
                                    alt="eth.png"
                                    style={{ width: "35px" }}
                                  ></img>{" "}
                                  ETH <i class="far fa-angle-down"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="swap_tab_04 py-md-3 py-2">
                            <div class="form_area_btn">
                              <button class="btn_outline_light">
                                Unlock Wallet
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="tab-pane fade show active"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      >
                        <div class="show_area" id="Liquidity_token">
                          <div class=" text-center pt-5 pb-5">
                            <span class="text-center">
                              Connect to a wallet to view your liquidity.
                            </span>
                            {/* ) : (
                              <span class="text-center">
                                Wallet is connected.
                              </span>
                            )} */}
                          </div>
                          <hr class="mb-0" style={{ borderColor: "#26c5eb" }} />
                          <div class="swap_tab_01 py-md-3 py-2">
                            <div class="form_area_btn2">
                              <h6 class="text-center">
                                Add liquidity to earn trading fees
                              </h6>
                              <button
                                class="btn_outline_light mt-3"
                                id="liqudity"
                              >
                                Add Liquidity
                              </button>
                            </div>
                          </div>

                          <div class="py-md-5 d-none">
                            <p>
                              Don't see a pool you joined?
                              <a href="#"> Import it.</a>
                            </p>
                            <p>
                              {" "}
                              Or, if you staked your LP tokens in a farm,
                              unstake them to see them here.
                            </p>
                          </div>
                        </div>
                        <div class="sdmngblsdf_token" id="Liquidity_show">
                          <div class="row py-3">
                            <div class="col-auto">
                              <div class="kfn_left">
                                <i class="fal fa-arrow-left"></i>
                              </div>
                            </div>
                            <div class="col">
                              <div class="kfn_h6">
                                <h6>Your Liquidity </h6>
                              </div>
                            </div>
                            <div class="col-auto"></div>
                          </div>
                          <div class="swap_tab_0_1 py-md-3 py-2">
                            <div class="form_area_01">
                              <span> </span>
                              <div class="form-group">
                                <div class="row">
                                  <span class="col"></span>
                                  <small class="col text-right">&nbsp;</small>
                                </div>

                                <div class="btn_in__put">
                                  <input
                                    type="text"
                                    class="form-control form_token"
                                    id="firstTokenAmount"
                                    placeholder="0.0"
                                  ></input>
                                  <button
                                    type="button"
                                    class="btn btn-primary angle_down  d-flex align-items-center justify-content-center"
                                    style={{ lineHeight: "2" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter1"
                                    id="pairArea1"
                                  >
                                    <span id="symbolImage1">
                                      <img
                                        src="https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/HTZ-NEW.png"
                                        class=""
                                        alt="eth.png"
                                        style={{ width: "35px" }}
                                      ></img>
                                    </span>
                                    &nbsp;<span id="currencySymbol1">HTZ</span>
                                    <i class="far fa-angle-down"></i>
                                  </button>
                                </div>
                                <p id="errorMessage" class="text-danger"></p>
                              </div>
                            </div>
                          </div>
                          <div class="swap_tab_02 py-md-3">
                            <div class="form_area_02">
                              <a>
                                <i class="far fa-plus-circle"></i>
                              </a>
                            </div>
                          </div>
                          <div class="swap_tab_0_1 py-md-3 py-2">
                            <div class="form_area_03">
                              <span> </span>
                              <div class="form-group">
                                <div class="row">
                                  <span class="col"></span>
                                  <small class="col text-right">&nbsp;</small>
                                </div>
                                <input
                                  type="text"
                                  class="form-control form_token amountGet"
                                  id="secondTokenAmount"
                                  placeholder="0.0"
                                />
                                <button
                                  type="button"
                                  class="btn btn-primary angle_down1  d-flex align-items-center justify-content-center"
                                  style={{ lineHeight: 2 }}
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter3"
                                  id="pairArea2"
                                >
                                  <span id="symbolImage2">
                                    <p class="mb-0">Select a token</p>
                                  </span>
                                  &nbsp;<span id="currencySymbol2"></span>{" "}
                                  &nbsp; <i class="far fa-angle-down"></i>
                                </button>
                                <p id="errorMessage2" class="text-danger"></p>
                              </div>
                            </div>
                          </div>

                          <div class="py-2 mt-1 text-center">
                            <span id="firstLiquidityProvider"></span>
                          </div>

                          <div
                            class="py-md-4"
                            id="payableAmountDiv"
                            style={{ display: "none" }}
                          >
                            <label class="mb-2">Prices and pool share</label>
                            <div class="row">
                              <div class="col">
                                <div class="price_div_area text-center">
                                  <div id="firstTokenWithPair">0.0000</div>
                                  <div id="firstTokenPayableAmount"></div>
                                </div>
                              </div>
                              <div class="col">
                                <div class="price_div_area text-center">
                                  <div id="secondTokenWithPair">0.0000</div>
                                  <div id="secondTokenPayableAmount"></div>
                                </div>
                              </div>
                              <div class="col">
                                <div class="price_div_area text-center">
                                  <div id="shareOfPool">0%</div>
                                  <div>Share of Pool</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="swap_tab_04 py-md-3 py-2">
                            <div class="form_area_btn">
                              <button
                                class="btn_outline_light w-100"
                                id="liquidityBtn"
                                onClick={liquidityAdd}
                              >
                                Add Liquidity
                              </button>

                              <Link
                                to="/withdraw"
                                class="btn_outline_light w-100 mt-2 text-white"
                                id="withdrawLiquidityBtn"
                              >
                                Withdraw Liquidity
                              </Link>
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

        {/* <!--View all transaction--> */}

        <div
          class="modal fade viewall"
          id="exampleModalView"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  All Transactions
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class=" mt-3 table-responsive">
                  <h5 id="liquidityDetails1"></h5>

                  <table class="table table-condensed">
                    <thead>
                      <tr>
                        <th>Pair</th>
                        <th>Symbol</th>
                        <th>Transaction#</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody id="liquidityDetails"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!--Farm plans model--> */}
        <div
          class="modal fade viewplanmodal"
          id="farmPlansModel1"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel1"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h3>View All Plans</h3>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="farmprice">
                  <table class="table table-condensed farmtable">
                    <thead>
                      <tr>
                        <th>Plan Name</th>
                        <th>Price</th>
                        <th>Energy</th>
                        <th>Duration</th>
                        <th>Buy Now</th>
                      </tr>
                    </thead>
                    <tbody id="farmingPlans"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!--LIQUIDITY FIRST MODEL SYMBOL--> */}
        <div
          class="modal fade"
          id="exampleModalCenter3"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  Select a token
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="sid_ebar mx-2">
                  <div class="sc-bEjcJn jLJzwT">
                    <input
                      type="text"
                      id="filterLiq2"
                      placeholder="search token name"
                      class="form-control address_search"
                    />
                  </div>

                  {/* <!--Token Select options div start--> */}
                  <div
                    id="liquiditySymbol2"
                    class="token_list_all scrollbar_width scrollbar_width"
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  {/* <!--Token Select options div end--> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" id="selectedPair" value=""></input>
        <input type="hidden" id="firstSymbol" value="htz"></input>
        <input type="hidden" id="secondSymbol" value=""></input>
        <input type="hidden" id="addressTypes" value=""></input>
        <input type="hidden" id="currencyAddressType" value=""></input>
        <input type="hidden" id="firstAddressType" value="hertz"></input>
        <input type="hidden" id="secondAddressType" value=""></input>
      </section>
    </>
  );
}
