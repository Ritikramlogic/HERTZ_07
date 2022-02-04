import React, { useEffect } from "react";
import $ from "jquery";
import swal from "sweetalert";
import { swapping } from "../Services/trade";
import {
  getAddressTypes,
  getPair,
  getSwappingFees,
  getLiquidityPoolDetails,
  showMatchingSymbols,
} from "../Services/allFunction";

export default function TradePage(props) {
  useEffect(() => {
    // change functions and values on click arrow button
    $("#arrowPairChange").on("click", () => {
      var symbolImage1 = $("#symbolImage1").html();
      var symbolImage2 = $("#symbolImage2").html();
      var symbol1 = $("#currencySymbol1").text();
      var symbol2 = $("#").text();

      $("#Fees").text(0);
      $("#tokenPrice").text(0);
      $("#spreadFees").text(0);
      $(".amountGet").val(0);
      $("#LiquidityProviderFee").text(0);
      $("#tokenPriceImpact").text(0);

      $("#fromBalance").val("");
      $("#recipientAddress").val("");
      $("#symbolImage1").html(symbolImage2);
      $("#symbolImage2").html(symbolImage1);
      $("#currencySymbol1").text(symbol2);
      $("#currencySymbol2").text(symbol1);
      let pairSymbol1 = $("#currencySymbol1").text();
      let pairSymbol2 = $("#currencySymbol2").text();
      $("#selectedPair").val(
        pairSymbol1.toLowerCase() + "_" + pairSymbol2.toLowerCase()
      );
      $("#firstSymbol").val(pairSymbol1.toLowerCase());
      $("#secondSymbol").val(pairSymbol2.toLowerCase());

      var pair = $("#selectedPair").val();
      getAddressTypes(pair).then().catch();
    });

    $("#fromBalance").on("keyup", function () {
      getPair()
        .then((pair) => {
          var value = $(this).val();
          // var pair = $("#selectedPair").val();
          var swapFeeValue = 0;
          let amountAfterSwapFee = 0;
          let spreadValue = 0;
          let netPay = 0;
          let adjustedTokenAmount = 0;
          let tokenReceived = 0;
          let tokenUnitPrice = 0;
          let priceImpact = 0;
          let grossHTZAmount = 0;
          let sellerGets = 0;

          var payAmount = 0;
          var actualPayamount = 0;
          var totalFeeValue = 0;
          var symbol1 = pair.split("_")[0];
          var symbol2 = pair.split("_")[1];
          var address = $("#addressTypes").val();
          // let updatedAmount1 = 0;
          // let updatedAmount2 = 0;

          if (!isNaN(value)) {
            getSwappingFees(pair)
              .then((feeDetails) => {
                console.log(feeDetails);

                getLiquidityPoolDetails(pair)
                  .then((liquidityDetails) => {
                    console.log(liquidityDetails);
                    if (value == 0) {
                      $("#Fees").text(0);
                      $(".amountGet").val(0);
                      $("#tokenPriceImpact").text(0);
                      $("#tokenPrice").text(0);
                      $("#swappingBtn").attr("disabled", true);
                      $("#currentPrice").val(0);
                    } else {
                      if (symbol1.toLowerCase() == "htz") {
                        swapFeeValue =
                          parseFloat(value / 100) * feeDetails.fees;
                        amountAfterSwapFee =
                          parseFloat(value) - parseFloat(swapFeeValue);
                        spreadValue =
                          ((parseFloat(value) - parseFloat(swapFeeValue)) /
                            100) *
                          feeDetails.spreadFee;

                        totalFeeValue =
                          parseFloat(swapFeeValue) + parseFloat(spreadValue);

                        netPay =
                          parseFloat(value) -
                          (parseFloat(swapFeeValue) + parseFloat(spreadValue));
                        adjustedTokenAmount =
                          parseFloat(liquidityDetails.constant) /
                          (parseFloat(liquidityDetails.firstTokenAmount) +
                            parseFloat(netPay));
                        tokenReceived =
                          parseFloat(liquidityDetails.secondTokenAmount) -
                          parseFloat(adjustedTokenAmount);
                        tokenUnitPrice =
                          parseFloat(
                            parseFloat(liquidityDetails.secondTokenAmount) -
                              parseFloat(adjustedTokenAmount)
                          ) / parseFloat(amountAfterSwapFee);
                        priceImpact =
                          ((parseFloat(liquidityDetails.secondTokenPriceRatio) -
                            parseFloat(tokenUnitPrice)) /
                            parseFloat(
                              liquidityDetails.secondTokenPriceRatio
                            )) *
                          100;
                        window.tokenReceivedBNB = tokenReceived;
                        console.log(
                          `netPay ${netPay} adjustedTokenAmount ${adjustedTokenAmount} tokenReceived ${tokenReceived} ${tokenUnitPrice} price impact ${priceImpact}`
                        );

                        function truncateToDecimals(num, dec = 4) {
                          const calcDec = Math.pow(10, dec);
                          return Math.trunc(num * calcDec) / calcDec;
                        }
                        let changeValue = truncateToDecimals(value);

                        if (parseFloat(changeValue) == 0.0) {
                          $(".amountGet").val(0);
                          $("#tokenPriceImpact").text(0);
                          $("#errorMessage").addClass("text-danger");
                          $("#errorMessage").text(
                            "Please enter four decimal value"
                          );
                          $("#swappingBtn").attr("disabled", true);
                          $("#currentPrice").val(0);
                        } else {
                          if (liquidityDetails.constant == 0) {
                            $("#Fees").text("0");
                            $("#swapErrorMessage").text(
                              "Insufficient liquidity for this trade."
                            );
                            $("#tokenPrice").text(0);
                            $("#tokenPriceImpact").text(0);
                            $("#swappingBtn").attr("disabled", true);
                            $("#currentPrice").val(0);
                          } else {
                            $("#Fees").text(`${feeDetails.fees}%`);
                            $("#swapErrorMessage").text("");
                            $("#tokenPrice").text(
                              `${Number(tokenUnitPrice).toFixed(
                                4
                              )} ${symbol1.toUpperCase()} per ${symbol2.toUpperCase()}`
                            );
                            $(".amountGet").val(`${tokenReceived.toFixed(4)}`);
                            $("#feeAmount").val(
                              `${Number(totalFeeValue).toFixed(4)}`
                            );
                            $("#tokenPriceImpact").text(
                              `${parseFloat(priceImpact).toFixed(2)}%`
                            );
                            $("#swappingBtn").attr("disabled", false);
                            $("#currentPrice").val(`${tokenUnitPrice}`);
                          }
                          $("#errorMessage").text("");
                        }
                      }

                      if (symbol2.toLowerCase() == "htz") {
                        adjustedTokenAmount =
                          parseFloat(liquidityDetails.constant) /
                          (parseFloat(liquidityDetails.firstTokenAmount) +
                            parseFloat(value));
                        grossHTZAmount =
                          parseFloat(liquidityDetails.secondTokenAmount) -
                          parseFloat(adjustedTokenAmount);
                        spreadValue =
                          (parseFloat(grossHTZAmount) / 100) *
                          feeDetails.spreadFee;
                        tokenReceived =
                          parseFloat(grossHTZAmount) - parseFloat(spreadValue);
                        tokenUnitPrice =
                          parseFloat(tokenReceived) / parseFloat(value);
                        swapFeeValue =
                          (parseFloat(tokenReceived) / 100) * feeDetails.fees;
                        sellerGets =
                          parseFloat(tokenReceived) - parseFloat(swapFeeValue);
                        priceImpact =
                          ((parseFloat(liquidityDetails.secondTokenPriceRatio) -
                            parseFloat(tokenUnitPrice)) /
                            parseFloat(
                              liquidityDetails.secondTokenPriceRatio
                            )) *
                          100;

                        console.log(
                          `adjustedTokenAmount ${adjustedTokenAmount} grossHTZAmount ${grossHTZAmount} spreadValue ${spreadValue} tokenReceived ${tokenReceived} tokenUnitPrice ${tokenUnitPrice} swapFeeValue ${swapFeeValue} sellerGets ${sellerGets} price impact ${priceImpact}`
                        );

                        function truncateToDecimals(num, dec = 4) {
                          const calcDec = Math.pow(10, dec);
                          return Math.trunc(num * calcDec) / calcDec;
                        }
                        let changeValue = truncateToDecimals(value);

                        if (parseFloat(changeValue) == 0.0) {
                          $(".amountGet").val(0);
                          $("#tokenPriceImpact").text(0);
                          $("#errorMessage").addClass("text-danger");
                          $("#errorMessage").text(
                            "Please enter four decimal value"
                          );
                          $("#swappingBtn").attr("disabled", true);
                          $("#currentPrice").val(0);
                        } else {
                          if (liquidityDetails.constant == 0) {
                            $("#Fees").text("0");
                            $("#swapErrorMessage").text(
                              "Insufficient liquidity for this trade."
                            );
                            $("#tokenPrice").text(0);
                            $("#tokenPriceImpact").text(0);
                            $("#swappingBtn").attr("disabled", true);

                            $("#currentPrice").val(0);
                          } else {
                            $("#Fees").text(`${feeDetails.fees}%`);
                            $("#swapErrorMessage").text("");
                            $("#tokenPrice").text(
                              `${Number(tokenUnitPrice).toFixed(
                                4
                              )} ${symbol1.toUpperCase()} per ${symbol2.toUpperCase()}`
                            );
                            $(".amountGet").val(`${sellerGets.toFixed(4)}`);
                            $("#feeAmount").val(
                              `${Number(totalFeeValue).toFixed(4)}`
                            );
                            $("#tokenPriceImpact").text(
                              `${parseFloat(priceImpact).toFixed(2)}%`
                            );
                            $("#swappingBtn").attr("disabled", false);
                            $("#currentPrice").val(`${tokenUnitPrice}`);
                          }
                          $("#errorMessage").text("");
                        }
                      }
                    }
                  })
                  .catch((err) => {
                    $("#swapErrorMessage").text(
                      "Insufficient liquidity for this trade."
                    );
                    $("#Fees").text(0);
                    $("#spreadFees").text(0);
                    $(".amountGet").val(0);
                    $("#tokenPriceImpact").text(0);
                    $("#currentPrice").val(0);
                  });
              })
              .catch((err) => {
                $("#swapErrorMessage").text(
                  "Insufficient liquidity for this trade."
                );
                $("#Fees").text(0);
                $("#spreadFees").text(0);
                $(".amountGet").val(0);
                $("#tokenPriceImpact").text(0);
                $("#currentPrice").val(0);
              });
          } else {
            swal("Invalid Amount", "Please enter a valid amount", "warning");
            $("#Fees").text(0);
            $("#spreadFees").text(0);
            $(".amountGet").val(0);
            $("#tokenPriceImpact").text(0);
            $("#currentPrice").val(0);
          }
        })
        .catch((err) => console.log(err));
    });
  }, []);
  return (
    <>
      <section class="total_wsum_main">
        <div class="container">
          <div class="row WSUM_value justify-content-center">
            <div class="col-md-8 col-12">
              <div class="row WSUM_value_02">
                <div class="col-md-12">
                  <div class="text-center" style={{ padding: "14px 0" }}>
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
                      <div
                        class="kfn_i"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                      >
                        <i
                          class="far fa-cog"
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Slippage"
                        ></i>
                      </div>
                    </div>
                    <div class="col">
                      <div class="kfn_h6 text-center">
                        <h5>Trade</h5>
                      </div>
                    </div>
                    <div class="col-auto">
                      <div
                        class="swapbox"
                        data-toggle="modal"
                        data-target="#swappingModelView"
                        id="showSwappingDetails"
                        onclick="showSwappingDetailsByUser()"
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
                        class="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                      >
                        <div class="fnlfgj_">
                          <div class="row pb-3">
                            <div class="col">
                              <div class="kfn_h6">
                                <h6>Your Trade</h6>
                              </div>
                            </div>
                            <div class="col-auto"></div>
                          </div>
                          <div class="swap_tab_0_1 py-md-3 py-2">
                            <div class="form_area_01">
                              <span> </span>
                              <div class="form-group">
                                <div class="row">
                                  <span class="col">From</span>
                                  <small class="col text-right"></small>
                                </div>
                                <div class="btn_in__put">
                                  <input
                                    type="text"
                                    class="form-control form_token"
                                    id="fromBalance"
                                    placeholder="0.0"
                                  />
                                  <button
                                    type="button"
                                    class="btn btn-primary angle_down  d-flex align-items-center justify-content-center"
                                    style={{ lineHeight: "2" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter5"
                                    id="pairArea1"
                                  >
                                    <span id="symbolImage1">
                                      <img
                                        src="https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/HTZ-NEW.png"
                                        class=""
                                        alt="htz-new.png"
                                        style={{ width: "35px" }}
                                      />
                                    </span>
                                    &nbsp;<span id="currencySymbol1">HTZ</span>
                                    &nbsp;
                                    <i class="far fa-angle-down"></i>
                                  </button>
                                </div>
                                <p id="errorMessage"></p>
                              </div>
                            </div>
                          </div>
                          <div class="swap_tab_02 py-md-2 py-2">
                            <div class="form_area_02">
                              <a href="#" id="arrowPairChange">
                                <i class="fad fa-arrow-alt-circle-down text-center text-white"></i>
                              </a>
                            </div>
                          </div>
                          <div class="swap_tab_03 py-md-3 py-2">
                            <div class="form_area_03">
                              <span> </span>
                              <div class="form-group">
                                <div class="row">
                                  <span class="col">To (estimated)</span>
                                  <small class="col text-right"></small>
                                </div>
                                <input
                                  type="text"
                                  class="form-control form_token amountGet"
                                  id="recipientAddress"
                                  placeholder="0.0"
                                  disabled
                                />
                                <button
                                  type="button"
                                  class="btn btn-primary angle_down1  d-flex align-items-center justify-content-center"
                                  style={{ lineHeight: "2" }}
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter2"
                                  id="pairArea2"
                                >
                                  <span id="symbolImage2">
                                    <p class="mb-0">Select a token</p>
                                  </span>
                                  &nbsp;<span id="currencySymbol2"></span>
                                  &nbsp; <i class="far fa-angle-down"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="pt-2 text-center">
                            <label id="swapErrorMessage"></label>
                          </div>
                          <div class="">
                            <div class="d-flex justify-content-between flex-direction-row">
                              <p class="mb-1">Swap Fees</p>
                              <p class="mb-1" id="Fees">
                                0
                              </p>
                            </div>
                            <div class="d-flex justify-content-between flex-direction-row">
                              <p class="mb-1">Price Impact</p>
                              <p class="mb-1" id="tokenPriceImpact">
                                0
                              </p>
                            </div>
                            <div class="d-flex justify-content-between flex-direction-row">
                              <p class="mb-1">Price</p>
                              <p class="mb-1" id="tokenPrice">
                                0
                              </p>
                            </div>
                          </div>
                          <div class="swap_tab_04 md-3 py-3">
                            <div class="form_area_btn">
                              <button
                                class="btn_outline_light w-100"
                                id="swappingBtn"
                                onClick={swapping}
                              >
                                Swap
                              </button>
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

        {/* <!-- Modal --> */}
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Setting
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
                <div class="setting_modal">
                  <h6>Slippage Tolerance</h6>
                  <div class="row">
                    <div class="col">
                      <div class="setting_modal_area">
                        <button
                          type="button"
                          class="btn btn_Connect_light w-100 slippagePercentage"
                          data-value="0.1"
                        >
                          0.1%
                        </button>
                      </div>
                    </div>
                    <div class="col">
                      <div class="setting_modal_area">
                        <button
                          type="button"
                          class="btn btn_Connect_light w-100 slippagePercentage"
                          data-value="0.5"
                        >
                          0.5%
                        </button>
                      </div>
                    </div>
                    <div class="col">
                      <div class="setting_modal_area">
                        <button
                          type="button"
                          class="btn btn_Connect_light w-100 slippagePercentage"
                          data-value="1.0"
                        >
                          1.0%
                        </button>
                      </div>
                    </div>
                    <div class="col">
                      <div class="setting_modal_area d-flex align-items-center">
                        <input
                          type="text"
                          class="form-control text-white w-100"
                          placeholder="0.10"
                          id="slippage"
                        />{" "}
                        <span class="pl-1">%</span>
                      </div>
                    </div>
                  </div>
                  <p
                    class="text-danger py-3 font-weight-bold"
                    id="slippageError"
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" id="selectedPair" value=""></input>
        <input type="hidden" id="firstSymbol" value="htz"></input>
        <input type="hidden" id="firstAddressType" value="hertz"></input>
        <input type="hidden" id="secondSymbol" value=""></input>
        <input type="hidden" id="addressTypes" value=""></input>
        <input type="hidden" id="currencyAddressType" value=""></input>
        <input type="hidden" id="feeAmount" value=""></input>
      </section>{" "}
    </>
  );
}
