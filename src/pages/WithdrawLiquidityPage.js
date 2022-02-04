import React from "react";
import { getLiquidityPairs } from "../Services/liquidity";
export default function WithdrawLiquidityPage() {
  return (
    <>
      <div class="row WSUM_value_ my-5">
        <div class="col-md-12">
          <div class="Accordian w-lg-50 mx-auto">
            <div id="main">
              <div class="container">
                {/* <!--DYNAMIC PAIR TABS--> */}
                <div class="row">
                  <div class="col-md-12 col-12">
                    <div class="py-md-5 py-3">
                      <h2 class="text-center text_skylight">
                        Withdraw Liquidity
                      </h2>
                    </div>
                  </div>

                  <div class="col-md-12 col-12">
                    <div class="float-right">
                      <button
                        class="btn btn_Connect_light d-block w-100 px-md-4 px-4"
                        onClick={getLiquidityPairs}
                      >
                        <i class="fal fa-sync"></i> &nbsp;&nbsp; Refresh
                      </button>
                    </div>
                  </div>

                  <div class="col-md-12 col-12">
                    <div id="pairTabs">
                      <div
                        class="text-white text-center"
                        id="resultFetching"
                      ></div>
                    </div>
                  </div>
                  {/* <!--DYNMAIC PAIR TABS--> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="responseLoader"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "200",
            display: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100vh",
              background: "#00000070",
            }}
          >
            <img
              src="https://ramlogics.com/assets/images/loader.gif"
              width="150"
              title="wait for a mint to confirm transaction"
              alt="loader-image"
            />
          </div>
        </div>
      </div>
    </>
  );
}
