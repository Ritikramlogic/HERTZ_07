import $ from "jquery";
import swal, { swalAlert } from "sweetalert";
import Web3 from "web3";
import { store } from "../Redux/store";
import { BigNumber } from "bignumber.js";
import {
  serverApi,
  connectedAccount,
  connectedNetwork,
  getCurrentUser,
  getHertzUserDetails,
  insertPairAmount,
  generateString,
  ownerAddress,
  getCurrentUserBalance,
  getHertzOwner,
  getCurrentUserTokenBalance,
  currentDate,
  walletBalances,
  ownerDetails,
  web3,
  tokenDecimal,
  updateHertzBalance,
} from "./allFunction";

import { getPayableAmount } from "./liquidity";
import {
  HTZ_to_BNB,
  HTZ_to_BNB_ABI,
  HTZ_TO_ETH,
  HTZ_TO_ETH_ABI,
  WBNB_ABI,
  WBNB_Address,
} from "../Contract/config";
async function showPlanPairs() {
  return new Promise((resolve, reject) => {
    fetch(`${serverApi.apiHost}/get-all-liquidity-pair`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        let html = "";
        let pairs = Array();
        let addressTypes = Array();
        let tokenImage1 = Array();
        let tokenImage2 = Array();
        let newPair = Array();
        let newAddressType = Array();
        let newTokenImage1 = Array();
        let newTokenImage2 = Array();

        result.result.map((Result) => {
          pairs.push(Result.pair_symbols);
          addressTypes.push(
            `${Result.address_type_1}_${Result.address_type_2}`
          );
          tokenImage1.push(`${Result.token_image_1}`);
          tokenImage2.push(`${Result.token_image_2}`);
        });

        for (let i = 0; i < pairs.length; i++) {
          var increment = parseInt(i) + 1;
          let symbol1 = pairs[i].split("_")[0];
          let symbol2 = pairs[i].split("_")[1];
          let addressType = addressTypes[i];

          if (pairs[increment] == `${symbol2}_${symbol1}`) {
            newPair.push(`${symbol1}_${symbol2}`);
            newAddressType.push(addressTypes[i]);
            newTokenImage1.push(tokenImage1[i]);
            newTokenImage2.push(tokenImage2[i]);
          }
        }
        resolve({ newPair, newAddressType, newTokenImage1, newTokenImage2 });
      })
      .catch((err) => reject(err));
  });
}

export const showAllFarmPlans = () => {
  let html = "";
  let i = 0;
  getListOfAllFarmsPlan()
    .then((allFarmsPlans) => {
      for (let i = 0; i < allFarmsPlans.plan.length; i++) {
        html += `
                <div class="maintab table-responsive">
                    <table class="table table-condensed maintable" style="border-collapse: collapse;">
                        <tbody >
                            <tr class="accordion-toggle" >
                                <th style="text-align: left;" data-toggle="collapse" data-target="#demo${i}" id="showAllPlanList${i}" onclick='showAllPlanList("${
          allFarmsPlans.plan[i]
        }","${allFarmsPlans.multiplier[i]}","${allFarmsPlans.time[i]}","${i}")'>
                                    <div class="img pl-3 d-flex align-items-center">
                                        <img src="https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/htz-old.png" class="geeks" width="36" /> &nbsp; &nbsp;
                                        <h5 class="font-weight-bold">${allFarmsPlans.plan[
                                          i
                                        ].toUpperCase()}</h5> &nbsp; &nbsp; &nbsp; <span> <i class="fas fa-chevron-down vert-move"></i> </span>
                                    </div>
                                </th>
                                <th>
                                    <div class="d-flex box-2">
                                        <div class="col search_tabs">
                                            <h6 class="font-weight-normal float-right mb-0">Search</h6> 
                                        </div>
                                        <div class="col-4" id="">
                                            <input class="fnlkj_width" type="text" id="myInput${i}" onkeyup="myFunction('${i}')" placeholder="Search farm" title="Seach farm">
                                        </div> 
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td colspan="6" class="hiddenRow">
                                    <div class="accordian-body collapse" id="demo${i}">
                                        <div class="tab-content" id="myTabContent2">
                                            <div class="tab-pane fade show active" id="home2" role="tabpanel" aria-labelledby="home-tab">
                                                <div class="card card-body">
                                                    <div class="table_view_plan w-100">
                                                        <table class="table table-condensed maintable table-hover" style="background-color: #fff0;" id="farmTable${i}">
                                                            <thead>
                                                                <tr>
                                                                    <th><span class="font-weight-normal">Farms</span></th>
                                                                    <th><span class="font-weight-normal">Multiplier</span></th>
                                                                    <th><span class="font-weight-normal">Period</span></th>
                                                                    <th><span class="font-weight-normal">Amount</span></th>
                                                                    <th><span class="font-weight-normal">Invest</span></th>
                                                                    <th><span class="font-weight-normal">Harvest</span></th>
                                                                    <th><span class="font-weight-normal">Balance</span></th>
                                                                    <th><span class="font-weight-normal">Harvest Time</span></th>
                                                                    <th><span class="font-weight-normal">Profit</span></th>
                                                                    <th><span class="font-weight-normal">Reward</span></th>
                                                                    <th><span class="font-weight-normal">Total Liquidity</span></th>
                                                                    
                                                                </tr>
                                                            </thead>
                                                            <tbody id="showAllPlans${i}">

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>            
            `;
      }
      $("#allAvailableFarms").append(html);
    })
    .catch((err) => console.log(err));
};

// GET LIST OF ALL LIST FUNCTION
export default async function getListOfAllFarmsPlan() {
  return new Promise(async (resolve, reject) => {
    let fetchURL = await fetch(`${serverApi.apiHost}/get-all-farm-plans`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    let response = await fetchURL.json();
    console.log(response.result);
    if (response.code === 1) {
      resolve(response.result);
    } else if (response.code === 0) {
      reject(response.result);
    }
  });
}

// SHOW PLAN LIST WITH USER DETAILS MAIN FUNCTION
window.showAllPlanList = function showAllPlanList(
  planName,
  multiplier,
  time,
  i
) {
  let html = "";
  let j = 0;
  let hertzAccount = store.getState().account;
  console.log(hertzAccount);
  if (
    hertzAccount != (null || "" || undefined) &&
    connectedAccount != (null || "" || undefined)
  ) {
    getLiquidityPairsOnFarms()
      .then((pairResult) => {
        console.log(pairResult[0].address_type_2);
        for (let j = 0; j < pairResult.length; j++) {
          let symbol1 = pairResult[j].pair_symbols.split("_")[0];
          let symbol2 = pairResult[j].pair_symbols.split("_")[1];
          let addressType1 = pairResult[j].address_type_1;
          let addressType2 = pairResult[j].address_type_2;
          let addressType = `${addressType1}_${addressType2}`;
          let pair = `${symbol1}_${symbol2}`;
          // etherirum
          if (connectedNetwork == 97 || connectedNetwork == 56) {
            if (addressType !== "ethereum" && addressType !== "ether") {
              console.log(addressType);
              if (addressType === "binance_hertz") {
                let t = 0;

                getCurrentUser()
                  .then((currentUserAddress) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          currentUserAddress,
                          hertzUserDetails.userHertzAddress
                        )
                          .then((farmedResults) => {
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${pair}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px;">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${pair}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                    </td>                                        
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>                                        
                                                                                            
                                                </tr>
                                                `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div> 
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                    </td>                                        
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>                                        
                                                                                            
                                                </tr>
                                                `;
                            } else {
                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div> 
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                                                            
                                                </tr>
                                                `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_binance") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails.userHertzAddress,
                          currentUserAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                       
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                        
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                        
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                            
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                                                   
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_hertz") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails1) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails2) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails1.userHertzAddress,
                          hertzUserDetails2.userHertzAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);

                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails1.userHertzAddress
                              }', '${
                                hertzUserDetails2.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                     
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails1.userHertzAddress
                              }', '${
                                hertzUserDetails2.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                     
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                                                    
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "binance-coin_hertz") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          currentUserAddress,
                          hertzUserDetails.userHertzAddress
                        )
                          .then((farmedResults) => {
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                               
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                     
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_binance-coin") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails.userHertzAddress,
                          currentUserAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br><span id="bnb_amount"> ${
                                farmedResults.activeFarmResult.amount2
                              }</span> ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${pair}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${pair}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                   
                                                                                    
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            }
          }
          // binance
          if (connectedNetwork == 3 || connectedNetwork == 1) {
            if (addressType !== "binance-coin" && addressType !== "binance") {
              if (addressType === "ethereum_hertz") {
                let t = 0;

                getCurrentUser()
                  .then((currentUserAddress) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          currentUserAddress,
                          hertzUserDetails.userHertzAddress
                        )
                          .then((farmedResults) => {
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${pair}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px;">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${pair}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                    </td>                                        
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>                                        
                                                                                            
                                                </tr>
                                                `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div> 
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                    </td>                                        
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>                                        
                                                                                            
                                                </tr>
                                                `;
                            } else {
                              html += `
                                                <tr>
                                                    <td>
                                                        <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div> 
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span>${multiplier} X</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="total_$doller"><span>${time} days</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                            <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                    </td>
                                                    <td>
                                                        <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                    </td>
                                                                                            
                                                </tr>
                                                `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_ethereum") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails.userHertzAddress,
                          currentUserAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                       
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                        
                                                        <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>                                        
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                            
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                                                   
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_hertz") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails1) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails2) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails1.userHertzAddress,
                          hertzUserDetails2.userHertzAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);

                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails1.userHertzAddress
                              }', '${
                                hertzUserDetails2.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                     
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails1.userHertzAddress
                              }', '${
                                hertzUserDetails2.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                                     
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                                                    
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "ether_hertz") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          currentUserAddress,
                          hertzUserDetails.userHertzAddress
                        )
                          .then((farmedResults) => {
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>                               
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${currentUserAddress}', '${
                                hertzUserDetails.userHertzAddress
                              }')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                    
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span><span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                     
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else if (addressType === "hertz_ether") {
                let t = 0;

                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    getCurrentUser()
                      .then((currentUserAddress) => {
                        getUserAllFarms(
                          planName,
                          pair,
                          hertzUserDetails.userHertzAddress,
                          currentUserAddress
                        )
                          .then((farmedResults) => {
                            console.log(farmedResults);
                            if (
                              farmedResults.activeFarmResult.activeFarmResult1
                                .length > 0 &&
                              farmedResults.activeFarmResult.activeFarmResult2
                                .length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.activeFarmResult.deadline
                              );

                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.activeFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.activeFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.activeFarmResult.profitPercentage
                              }%</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.activeFarmResult.rewardAmount1
                              } </span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else if (
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult1.length > 0 &&
                              farmedResults.inActiveFarmResult
                                .inActiveFarmResult2.length > 0
                            ) {
                              t = getTimeRemaining(
                                farmedResults.inActiveFarmResult.deadline
                              );
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${pair}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${pair}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" onclick="withdrawUserFarm('${planName}','${pair}','${addressType}','${
                                hertzUserDetails.userHertzAddress
                              }', '${currentUserAddress}')">harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">${
                                farmedResults.inActiveFarmResult.amount1
                              } ${symbol1.toUpperCase()} <br> ${
                                farmedResults.inActiveFarmResult.amount2
                              } ${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}"> ${
                                t.days < 0 ? "0" : t.days
                              }  days ${
                                t.hours < 0 ? "0" : t.hours
                              } : hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">${
                                farmedResults.inActiveFarmResult
                                  .profitPercentage
                              }%</span></div>
                                                </td>                                    
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> ${
                                farmedResults.inActiveFarmResult.rewardAmount1
                              } </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                    
                                                                                   
                                            </tr>
                                            `;
                            } else {
                              html += `
                                            <tr>
                                                <td>
                                                    <div class="20_plan_area d-flex">
                                                        <div class="d-flex">
                                                            <div class="col-auto p-0">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_1
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                            <div class="col-auto pr-1">
                                                                <img src="${
                                                                  pairResult[j]
                                                                    .token_image_2
                                                                }" width="30" class="token_img_ss">
                                                            </div>
                                                        </div>  
                                                    <span class="text_skyblue">${symbol1.toUpperCase()}<br>${symbol2.toUpperCase()}</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span>${multiplier} X</span></div>
                                                </td>
                                                <td>
                                                    <div class="total_$doller"><span>${time} days</span></div>
                                                </td>
                                                <td>
                                                    <div class="day_90day d-flex align-items-center justify-content-center flex-column">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmFirstAmountUpdate('${symbol1}_${symbol2}','${j}${i}')" id="first_farm_Amt${j}${i}" placeholder="Enter ${symbol1.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <input type="number" class="form-control farms_place" onkeyup="farmSecondAmountUpdate('${symbol2}_${symbol1}','${j}${i}')" id="second_farm_Amt${j}${i}" placeholder="Enter ${symbol2.toUpperCase()} Amount" style="margin-bottom:10px">
                                                        <label class="text-danger" id="errorMessage${j}${i}" style=" padding: 0 !important; margin: 0 !important; display: inline; "></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="submit" id="buy_btn${j}${i}" class="btn v-btn" onclick="investFarm('${planName}','${multiplier}','${time}','${pair}','${addressType}','${j}${i}')">Invest</button></div>
                                                </td>
                                                <td>
                                                    <div class="buy_now_table"><button type="button" id="harvest${j}${i}" class="btn v-btn" disabled>harvest</button></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="invested_amount${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="remaining_time${j}">0 days 0 hours</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="profit${j}">0</span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table"><span id="reward${j}"> 0 </span></div>
                                                </td>
                                                <td>
                                                    <div class="12_x_table d-grid"><span id="poolAmount1${j}">${Number(
                                farmedResults.firstPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol1.toUpperCase()}</span> <span class="divider"> <i class="fal fa-horizontal-rule text-white"></i></span> <span id="poolAmount2${j}">${Number(
                                farmedResults.secondPoolAmount
                              ).toFixed(
                                4
                              )} ${symbol2.toUpperCase()}</span></div>
                                                </td>                                   
                                                                                    
                                            </tr>
                                            `;
                            }
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            }
          }
        }
        $(`#showAllPlans${i}`).html(
          `<tr><td colspan="11">Fetching..</td></tr>`
        );
        setTimeout(() => {
          $(`#showAllPlans${i}`).html(html);
        }, 4000);
      })
      .catch((err) => console.log(err));
  } else {
    swal({
      title: `Please connect to a wallet`,
      button: false,
    });
  }
};

// NEW FARM FUCTIONS
async function getLiquidityPairsOnFarms() {
  let data;
  await fetch(`${serverApi.apiHost}/get-liquidity-pairs`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.code == 1) {
        data = result.result;
        // console.log(result.result);
        // return data;
        // resolve(result.result)
      } else {
        // reject("Pair not found");
      }
    });
  return data;
}

// GET USER ALL FARMS DETAILS
async function getUserAllFarms(plan, pair, address1, address2) {
  return new Promise((resolve, reject) => {
    let data = {
      address1: address1,
      address2: address2,
      pair: pair,
      plan: plan,
    };

    fetch(`${serverApi.apiHost}/get-user-farm-details`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// Time function for remaining time
const getTimeRemaining = (endtime) => {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

// OnkeyUp First Input
window.farmFirstAmountUpdate = function farmFirstAmountUpdate(pair, counter) {
  let symbol1 = pair.split("_")[0];
  let symbol2 = pair.split("_")[1];
  let FirstValue = $(`#first_farm_Amt${counter}`).val();
  function truncateToDecimals(num, dec = 4) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }
  if (!isNaN(FirstValue)) {
    let changeValue = truncateToDecimals(FirstValue);
    if (changeValue == "0.0000") {
      $(`#buy_btn${counter}`).attr("disabled", "true");
      $(`#second_farm_Amt${counter}`).val(0);
      $(`#errorMessage${counter}`).text("");
    } else {
      $(`#buy_btn${counter}`).removeAttr("disabled");
      getPayableAmount(pair)
        .then((secondAmount) => {
          if (secondAmount.result == 0) {
            $(`#errorMessage${counter}`).text(
              "Insufficient liquidity for this trade."
            );
            $(`#second_farm_Amt${counter}`).val();
            $(`#buy_btn${counter}`).attr("disabled", "true");
          } else {
            $(`#errorMessage${counter}`).text("");
            $(`#second_farm_Amt${counter}`).val(
              parseFloat(
                secondAmount.result.payableAmount * FirstValue
              ).toFixed(4)
            );
            $(`#buy_btn${counter}`).removeAttr("disabled");
          }
        })
        .catch((err) => console.log(err));
    }
  } else {
    swal("Invalid Amount", "Please enter a valid amount", "warning");
  }
};

// INVEST IN FARMS
window.investFarm = async function investFarm(
  plan,
  percentage,
  time,
  pair,
  addressType,
  i
) {
  return new Promise((resolve, reject) => {
    let firstSymbolAmount = $(`#first_farm_Amt${i}`).val();
    let secondSymbolAmount = $(`#second_farm_Amt${i}`).val();
    let symbol1 = pair.split("_")[0];
    let symbol2 = pair.split("_")[1];
    let newPair = `${symbol2}_${symbol1}`;
    let addressType1 = addressType.split("_")[0];
    let addressType2 = addressType.split("_")[1];
    let newAddressType = `${addressType2}_${addressType1}`;

    let randomNumber = generateString();

    let totalAmount =
      parseFloat(firstSymbolAmount) + parseFloat(secondSymbolAmount);

    if (
      parseFloat(firstSymbolAmount) > 0 &&
      parseFloat(secondSymbolAmount) > 0
    ) {
      if (!isNaN(firstSymbolAmount) && !isNaN(secondSymbolAmount)) {
        console.log(addressType);

        //etherium
        if (addressType === "ethereum_hertz") {
          transferEthereum(pair, firstSymbolAmount, addressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(
                pair,
                secondSymbolAmount,
                newAddressType,
                symbol2
              )
                .then((hertzResult) => {
                  investEthereum(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                      // insertPairAmount(totalAmount,pair).then(console.log).catch(console.log);
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "hertz_ethereum") {
          transferEthereum(pair, secondSymbolAmount, newAddressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(pair, firstSymbolAmount, addressType, symbol1)
                .then((hertzResult) => {
                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investEthereum(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "hertz_hertz") {
          transferHertzToken(pair, firstSymbolAmount, addressType, symbol1)
            .then((hertzResult1) => {
              $("#loaderDiv").css("display", "block");

              investHertz(
                hertzResult1.userHertzAddress,
                hertzResult1.userHertzToken,
                hertzResult1.transaction_id,
                pair,
                symbol1,
                addressType1,
                plan,
                hertzResult1.amount,
                time,
                randomNumber
              )
                .then((investHertzResult) => {
                  transferHertzToken(
                    pair,
                    secondSymbolAmount,
                    newAddressType,
                    symbol2
                  )
                    .then((hertzResult2) => {
                      investHertz(
                        hertzResult2.userHertzAddress,
                        hertzResult2.userHertzToken,
                        hertzResult2.transaction_id,
                        pair,
                        symbol2,
                        addressType2,
                        plan,
                        hertzResult2.amount,
                        time,
                        randomNumber
                      )
                        .then(async (investHertzResult) => {
                          insertPairAmount(totalAmount, pair)
                            .then(console.log)
                            .catch(console.log);
                          $("#loaderDiv").css("display", "none");

                          await updateHertzBalance();
                          swal(
                            "Transaction in process",
                            "Your transaction will be reflected in sometime",
                            "success"
                          );
                        })
                        .catch((err) => {
                          reject(err);
                          $("#loaderDiv").css("display", "none");
                        });
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "ether_hertz") {
          transferEther(pair, firstSymbolAmount, addressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(
                pair,
                secondSymbolAmount,
                newAddressType,
                symbol2
              )
                .then((hertzResult) => {
                  investEther(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "hertz_ether") {
          transferWETH(pair, secondSymbolAmount, newAddressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(pair, firstSymbolAmount, addressType, symbol1)
                .then((hertzResult) => {
                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investEther(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "binance_hertz") {
          transferEthereum(pair, firstSymbolAmount, addressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(
                pair,
                secondSymbolAmount,
                newAddressType,
                symbol2
              )
                .then((hertzResult) => {
                  investBinance(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "hertz_binance") {
          transferEthereum(pair, secondSymbolAmount, newAddressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(pair, firstSymbolAmount, addressType, symbol1)
                .then((hertzResult) => {
                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investBinance(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "binance-coin_hertz") {
          transferEther(pair, firstSymbolAmount, addressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(
                pair,
                secondSymbolAmount,
                newAddressType,
                symbol2
              )
                .then((hertzResult) => {
                  investBNB(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      insertPairAmount(totalAmount, pair)
                        .then(console.log)
                        .catch(console.log);
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        } else if (addressType === "hertz_binance-coin") {
          // transferEther(pair, secondSymbolAmount, newAddressType);
          transferWBNB(pair, secondSymbolAmount, newAddressType)
            .then((etherResult) => {
              $("#loaderDiv").css("display", "block");

              transferHertzToken(pair, firstSymbolAmount, addressType, symbol1)
                .then((hertzResult) => {
                  investHertz(
                    hertzResult.userHertzAddress,
                    hertzResult.userHertzToken,
                    hertzResult.transaction_id,
                    pair,
                    symbol1,
                    addressType1,
                    plan,
                    hertzResult.amount,
                    time,
                    randomNumber
                  )
                    .then(async (investHertzResult) => {
                      $("#loaderDiv").css("display", "none");
                      await updateHertzBalance();
                      swal(
                        "Transaction in process",
                        "Your transaction will be reflected in sometime",
                        "success"
                      );
                    })
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });

                  investBNB(
                    etherResult.currentUserAddress,
                    etherResult.transactionHash,
                    pair,
                    symbol2,
                    addressType2,
                    plan,
                    etherResult.amount,
                    time,
                    randomNumber
                  )
                    .then((investEtherResult) => {})
                    .catch((err) => {
                      reject(err);
                      $("#loaderDiv").css("display", "none");
                    });
                })
                .catch((err) => {
                  reject(err);
                  $("#loaderDiv").css("display", "none");
                });
            })
            .catch((err) => {
              reject(err);
              $("#loaderDiv").css("display", "none");
            });
        }
      } else {
        swal("Invalid Amount", "Please enter a valid amount", "warning");
      }
    } else {
      swal("Invalid Amount", "Please enter a valid amount", "warning");
    }
    document.getElementById(`first_farm_Amt${i}`).value = "";
    document.getElementById(`second_farm_Amt${i}`).value = "";
  });
};
// Withdraw harvest function
window.withdrawUserFarm = async function withdrawUserFarm(
  plan,
  pair,
  addressType,
  address1,
  address2
) {
  return new Promise(async (resolve, reject) => {
    let symbol1 = pair.split("_")[0];
    let symbol2 = pair.split("_")[1];

    $("#loaderDiv").css("display", "block");

    if (addressType === "hertz_binance-coin") {
      let WBNB = new web3.eth.Contract(HTZ_to_BNB_ABI, HTZ_to_BNB);
      await WBNB.methods
        .BuyBNB(parseFloat(0.00000000000000002) * 10 ** 18)
        .send({ from: store.getState().metamaskWalletAddress })

        .then((hash) => {
          console.log(hash);
          let data = {
            plan: plan,
            pair: pair,
            addressType: addressType,
            address1: address1,
            address2: address2,
            action: "0",
            currentDate: currentDate,
            cryptohash: hash,
          };
          fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              if (result.code === 1) {
                $("#loaderDiv").css("display", "none");
                swal("Withdraw farm successfully", result.result, "success");
                resolve(result.result);

                if (result.result.again) {
                  swal({
                    title: `Maximum amount for withdraw ${Number(
                      result.result.minimumFirstAmount
                    )} ${symbol1.toUpperCase()} / ${Number(
                      result.result.minimumSecondAmount
                    )} ${symbol2.toUpperCase()}`,
                    icon: "info",
                    text: "If you want to withdraw this amount please click ok",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      let data = {
                        plan: plan,
                        pair: pair,
                        addressType: addressType,
                        address1: address1,
                        address2: address2,
                        action: "1",
                        currentDate: currentDate,
                        firstMaxAmount: result.result.minimumFirstAmount,
                        secondMaxAmount: result.result.minimumSecondAmount,
                      };
                      fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                          "Content-type": "application/json; charset=UTF-8",
                        },
                      })
                        .then((response) => response.json())
                        .then((result) => {
                          if (result.code == 1) {
                            swal(
                              "Transaction complete",
                              result.result,
                              "success"
                            );
                            $("#loaderDiv").css("display", "none");
                            resolve(true);
                          } else {
                            $("#loaderDiv").css("display", "none");
                            swal(
                              "Something went wrong",
                              result.result,
                              "warning"
                            );
                            reject(false);
                          }
                        })
                        .catch((err) => reject(err));
                    } else {
                      $("#loaderDiv").css("display", "none");
                      reject(false);
                    }
                  });
                } else {
                  swal("Transaction complete", result.result, "success");
                  $("#loaderDiv").css("display", "none");
                  resolve(true);
                }
              } else {
                $("#loaderDiv").css("display", "none");
                swal("Something went wrong", result.result, "warning");
                reject(false);
              }
            })
            .catch((err) => reject(err));
        });
    } else if (addressType === "hertz_ether") {
      let WETH = new web3.eth.Contract(HTZ_TO_ETH_ABI, HTZ_TO_ETH);
      await WETH.methods
        .BuyETH(parseFloat(0.00000000000000002) * 10 ** 18)
        .send({ from: store.getState().metamaskWalletAddress })

        .then((hash) => {
          console.log(hash);
          let data = {
            plan: plan,
            pair: pair,
            addressType: addressType,
            address1: address1,
            address2: address2,
            action: "0",
            currentDate: currentDate,
            cryptohash: hash,
          };
          fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              if (result.code === 1) {
                $("#loaderDiv").css("display", "none");
                swal("Withdraw farm successfully", result.result, "success");
                resolve(result.result);

                if (result.result.again) {
                  swal({
                    title: `Maximum amount for withdraw ${Number(
                      result.result.minimumFirstAmount
                    )} ${symbol1.toUpperCase()} / ${Number(
                      result.result.minimumSecondAmount
                    )} ${symbol2.toUpperCase()}`,
                    icon: "info",
                    text: "If you want to withdraw this amount please click ok",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      let data = {
                        plan: plan,
                        pair: pair,
                        addressType: addressType,
                        address1: address1,
                        address2: address2,
                        action: "1",
                        currentDate: currentDate,
                        firstMaxAmount: result.result.minimumFirstAmount,
                        secondMaxAmount: result.result.minimumSecondAmount,
                      };
                      fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                          "Content-type": "application/json; charset=UTF-8",
                        },
                      })
                        .then((response) => response.json())
                        .then((result) => {
                          if (result.code == 1) {
                            swal(
                              "Transaction complete",
                              result.result,
                              "success"
                            );
                            $("#loaderDiv").css("display", "none");
                            resolve(true);
                          } else {
                            $("#loaderDiv").css("display", "none");
                            swal(
                              "Something went wrong",
                              result.result,
                              "warning"
                            );
                            reject(false);
                          }
                        })
                        .catch((err) => reject(err));
                    } else {
                      $("#loaderDiv").css("display", "none");
                      reject(false);
                    }
                  });
                } else {
                  swal("Transaction complete", result.result, "success");
                  $("#loaderDiv").css("display", "none");
                  resolve(true);
                }
              } else {
                $("#loaderDiv").css("display", "none");
                swal("Something went wrong", result.result, "warning");
                reject(false);
              }
            })
            .catch((err) => reject(err));
        });
    } else {
      let data = {
        plan: plan,
        pair: pair,
        addressType: addressType,
        address1: address1,
        address2: address2,
        action: "0",
        currentDate: currentDate,
      };
      fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.code === 1) {
            $("#loaderDiv").css("display", "none");
            swal("Withdraw farm successfully", result.result, "success");
            resolve(result.result);

            if (result.result.again) {
              swal({
                title: `Maximum amount for withdraw ${Number(
                  result.result.minimumFirstAmount
                )} ${symbol1.toUpperCase()} / ${Number(
                  result.result.minimumSecondAmount
                )} ${symbol2.toUpperCase()}`,
                icon: "info",
                text: "If you want to withdraw this amount please click ok",
                buttons: true,
                dangerMode: true,
              }).then((willDelete) => {
                if (willDelete) {
                  let data = {
                    plan: plan,
                    pair: pair,
                    addressType: addressType,
                    address1: address1,
                    address2: address2,
                    action: "1",
                    currentDate: currentDate,
                    firstMaxAmount: result.result.minimumFirstAmount,
                    secondMaxAmount: result.result.minimumSecondAmount,
                  };
                  fetch(`${serverApi.apiHost}/withdraw-user-farmed`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                      "Content-type": "application/json; charset=UTF-8",
                    },
                  })
                    .then((response) => response.json())
                    .then((result) => {
                      if (result.code == 1) {
                        swal("Transaction complete", result.result, "success");
                        $("#loaderDiv").css("display", "none");
                        resolve(true);
                      } else {
                        $("#loaderDiv").css("display", "none");
                        swal("Something went wrong", result.result, "warning");
                        reject(false);
                      }
                    })
                    .catch((err) => reject(err));
                } else {
                  $("#loaderDiv").css("display", "none");
                  reject(false);
                }
              });
            } else {
              swal("Transaction complete", result.result, "success");
              $("#loaderDiv").css("display", "none");
              resolve(true);
            }
          } else {
            $("#loaderDiv").css("display", "none");
            swal("Something went wrong", result.result, "warning");
            reject(false);
          }
        })
        .catch((err) => reject(err));
    }
  });
};

async function transferHertzToken(pair, amount, addressTypePair, symbol) {
  let balance = 0;
  return new Promise((resolve, reject) => {
    getHertzOwner()
      .then((ownerHertzAddress) => {
        getHertzUserDetails()
          .then((hertzUserDetails) => {
            if (
              addressTypePair == "hertz_ethereum" ||
              addressTypePair == "hertz_hertz" ||
              addressTypePair == "hertz_binance" ||
              addressTypePair == "hertz_ether" ||
              addressTypePair == "hertz_binance-coin"
            ) {
              walletBalances()
                .then((balanceWithSymbol) => {
                  console.log(balanceWithSymbol.tokens);
                  if (symbol == "htz") {
                    var balance = balanceWithSymbol.result.split(" ")[0];
                    balance = balance.replace(/\,/g, "");
                  } else {
                    // console.log(balanceWithSymbol.tokens);
                    balanceWithSymbol.tokens.map((data) => {
                      console.log(data, symbol);
                      if (data.symbol === symbol.toUpperCase()) {
                        balance = data.balance;
                        balance = balance.replace(/\,/g, "");
                      }
                    });
                  }
                  console.log(symbol);
                  console.log(balance);
                  console.log(amount);

                  if (parseFloat(balance) >= parseFloat(amount)) {
                    // console.log(`${serverApi.hertzApiHost}/accounts/transfer?account=${hertzUserDetails.userHertzAddress}&to=${ownerHertzAddress}&amount=${amount}&symbol=${symbol1.toUpperCase()}`);
                    fetch(
                      `${serverApi.hertzApiHost}/transfer?account=${
                        hertzUserDetails.userHertzAddress
                      }&to=${ownerHertzAddress}&amount=${amount}&symbol=${symbol.toUpperCase()}`,
                      {
                        method: "POST",
                        headers: {
                          Authorization:
                            "Bearer " + hertzUserDetails.userHertzToken,
                        },
                      }
                    )
                      .then((response) => response.json())
                      .then((transferToken) => {
                        if (transferToken.error) {
                          swal(
                            "Transaction failed",
                            "Please enter valid amount",
                            "warning"
                          );
                          $("#loaderDiv").css("display", "none");
                          reject();
                        } else {
                          resolve({
                            userHertzUsername:
                              hertzUserDetails.userHertzUsername,
                            userHertzToken: hertzUserDetails.userHertzToken,
                            userHertzAddress: hertzUserDetails.userHertzAddress,
                            hertzOwnerAddress: ownerHertzAddress,
                            amount: amount,
                            // symbol: symbol1,
                            transaction_id: transferToken.transaction_id,
                          });
                        }
                      })
                      .catch((err) => {
                        swalAlert(
                          "Warning",
                          "Some problem while tranfer hertz token",
                          "warning"
                        );
                        reject({ title: "Critical problem", err: err });
                        $("#loaderDiv").css("display", "none");
                      });
                  } else {
                    swal(
                      "Insuffient Balance",
                      "You don't have enough balance",
                      "warning"
                    );
                    $("#loaderDiv").css("display", "none");
                  }
                })
                .catch((err) => {
                  reject("cannot get hertz wallet balance :", err);
                  $("#loaderDiv").css("display", "none");
                });
            } else {
              resolve({
                userHertzUsername: hertzUserDetails.userHertzUsername,
                userHertzToken: hertzUserDetails.userHertzToken,
                userHertzAddress: hertzUserDetails.userHertzAddress,
                ownerHertzAddress: ownerHertzAddress,
              });
            }
          })
          .catch((err) => {
            swal("Address not found", "Please connect hertz wallet", "warning");
            $("#loaderDiv").css("display", "none");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Cannot find hertz owner address", "warning");
        $("#loaderDiv").css("display", "none");
      });
  });
}

// TRANSFER ETHEREUM
export async function transferEthereum(pair, amount, addressTypePair) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((currentUserAddress) => {
        ownerAddress()
          .then((owner) => {
            tokenDecimal()
              .then((decimals) => {
                if (
                  addressTypePair == "ethereum_hertz" ||
                  addressTypePair == "binance_hertz"
                ) {
                  getCurrentUserTokenBalance()
                    .then((balance) => {
                      if (parseFloat(balance) >= parseFloat(amount)) {
                        const value = Number(amount * 10 ** decimals);
                        ownerDetails.myContract.methods
                          .transfer(owner, value)
                          .send({ from: currentUserAddress })
                          .on("transactionHash", function (hash) {
                            resolve({
                              ownerAddress: owner,
                              currentUserAddress: currentUserAddress,
                              transactionHash: hash,
                              amount: amount,
                              decimals: decimals,
                            });
                          })
                          .on("error", function (error, receipt) {
                            swal(
                              "Transaction failed",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(error);
                          });
                      } else {
                        swal(
                          "Insuffient Balance",
                          "You don't have enough balance",
                          "warning"
                        );
                        $("#loaderDiv").css("display", "none");
                        reject();
                      }
                    })
                    .catch((err) => {
                      console.log("Err while getting balance:", err);
                      $("#loaderDiv").css("display", "none");
                    });
                } else {
                  resolve({
                    currentUserAddress: currentUserAddress,
                    ownerAddress: owner,
                    amount: amount,
                    decimals: decimals,
                  });
                }
              })
              .catch((err) => {
                reject("Cannot get decimals :", err);
              });
          })
          .catch((err) => {
            reject(err);
            swal("Address not found", "Owner address not found", "warning");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Please connect metamask", "warning");
      });
  });
}

export async function transferWBNB(pair, amount, addressTypePair) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((currentUserAddress) => {
        ownerAddress()
          .then((owner) => {
            tokenDecimal()
              .then((decimals) => {
                if (
                  addressTypePair == "ether_hertz" ||
                  addressTypePair == "binance-coin_hertz"
                ) {
                  getCurrentUserBalance()
                    .then(async (balance) => {
                      if (parseFloat(balance) >= parseFloat(amount)) {
                        const value = Number(amount * 10 ** 18);
                        let HTZ_to_BNB_CONTRACT = await new web3.eth.Contract(
                          HTZ_to_BNB_ABI,
                          HTZ_to_BNB
                        );
                        await HTZ_to_BNB_CONTRACT.methods
                          .BuyBNB(value)
                          .send({
                            from: store.getState().metamaskWalletAddress,
                          })

                          // web3.eth
                          //   .sendTransaction({
                          //     to: owner,
                          //     from: currentUserAddress,
                          //     gasPrice: "50000000000",
                          //     value: value,
                          //   })
                          .on("transactionHash", function (hash) {
                            console.log("Transaction hasj: ", hash);
                            resolve({
                              ownerAddress: owner,
                              currentUserAddress: currentUserAddress,
                              transactionHash: hash,
                              amount: amount,
                              decimals: decimals,
                            });
                          })
                          .on("error", function (error, receipt) {
                            swal(
                              "Transaction failed",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(error);
                          })
                          .catch((err) => {
                            swal(
                              "Transaction cancel",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(err);
                          });
                      } else {
                        swal(
                          "Insuffient Balance",
                          "You don't have enough balance",
                          "warning"
                        );
                        $("#loaderDiv").css("display", "none");
                        reject();
                      }
                    })
                    .catch((err) => {
                      console.log("Err while getting balance:", err);
                    });
                } else {
                  resolve({
                    currentUserAddress: currentUserAddress,
                    ownerAddress: owner,
                    amount: amount,
                    decimals: decimals,
                  });
                }
              })
              .catch((err) => {
                reject("Cannot get decimals :", err);
              });
          })
          .catch((err) => {
            reject(err);
            swal("Address not found", "Owner address not found", "warning");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Please connect metamask", "warning");
      });
  });
}
export async function transferWETH(pair, amount, addressTypePair) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((currentUserAddress) => {
        ownerAddress()
          .then((owner) => {
            tokenDecimal()
              .then((decimals) => {
                if (
                  addressTypePair == "ether_hertz" ||
                  addressTypePair == "binance-coin_hertz"
                ) {
                  getCurrentUserBalance()
                    .then(async (balance) => {
                      if (parseFloat(balance) >= parseFloat(amount)) {
                        const value = Number(amount * 10 ** 18);
                        let HTZ_to_ETH_CONTRACT = await new web3.eth.Contract(
                          HTZ_TO_ETH_ABI,
                          HTZ_TO_ETH
                        );
                        await HTZ_to_ETH_CONTRACT.methods
                          .BuyETH(value)
                          .send({
                            from: store.getState().metamaskWalletAddress,
                          })

                          // web3.eth
                          //   .sendTransaction({
                          //     to: owner,
                          //     from: currentUserAddress,
                          //     gasPrice: "50000000000",
                          //     value: value,
                          //   })
                          .on("transactionHash", function (hash) {
                            console.log("Transaction hasj: ", hash);
                            resolve({
                              ownerAddress: owner,
                              currentUserAddress: currentUserAddress,
                              transactionHash: hash,
                              amount: amount,
                              decimals: decimals,
                            });
                          })
                          .on("error", function (error, receipt) {
                            swal(
                              "Transaction failed",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(error);
                          })
                          .catch((err) => {
                            swal(
                              "Transaction cancel",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(err);
                          });
                      } else {
                        swal(
                          "Insuffient Balance",
                          "You don't have enough balance",
                          "warning"
                        );
                        $("#loaderDiv").css("display", "none");
                        reject();
                      }
                    })
                    .catch((err) => {
                      console.log("Err while getting balance:", err);
                    });
                } else {
                  resolve({
                    currentUserAddress: currentUserAddress,
                    ownerAddress: owner,
                    amount: amount,
                    decimals: decimals,
                  });
                }
              })
              .catch((err) => {
                reject("Cannot get decimals :", err);
              });
          })
          .catch((err) => {
            reject(err);
            swal("Address not found", "Owner address not found", "warning");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Please connect metamask", "warning");
      });
  });
}
// TRANSFER ETHER
export async function transferEther(pair, amount, addressTypePair) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((currentUserAddress) => {
        ownerAddress()
          .then((owner) => {
            tokenDecimal()
              .then((decimals) => {
                if (
                  addressTypePair == "ether_hertz" ||
                  addressTypePair == "binance-coin_hertz"
                ) {
                  getCurrentUserBalance()
                    .then((balance) => {
                      if (parseFloat(balance) >= parseFloat(amount)) {
                        const value = Number(amount * 10 ** 18);

                        web3.eth
                          .sendTransaction({
                            to: owner,
                            from: currentUserAddress,
                            gasPrice: "50000000000",
                            value: value,
                          })
                          .on("transactionHash", function (hash) {
                            resolve({
                              ownerAddress: owner,
                              currentUserAddress: currentUserAddress,
                              transactionHash: hash,
                              amount: amount,
                              decimals: decimals,
                            });
                          })
                          .on("error", function (error, receipt) {
                            swal(
                              "Transaction failed",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(error);
                          })
                          .catch((err) => {
                            swal(
                              "Transaction cancel",
                              "User denied the transaction",
                              "warning"
                            );
                            $("#loaderDiv").css("display", "none");
                            reject(err);
                          });
                      } else {
                        swal(
                          "Insuffient Balance",
                          "You don't have enough balance",
                          "warning"
                        );
                        $("#loaderDiv").css("display", "none");
                        reject();
                      }
                    })
                    .catch((err) => {
                      console.log("Err while getting balance:", err);
                    });
                } else {
                  resolve({
                    currentUserAddress: currentUserAddress,
                    ownerAddress: owner,
                    amount: amount,
                    decimals: decimals,
                  });
                }
              })
              .catch((err) => {
                reject("Cannot get decimals :", err);
              });
          })
          .catch((err) => {
            reject(err);
            swal("Address not found", "Owner address not found", "warning");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Please connect metamask", "warning");
      });
  });
}

// INVEST ETHEREUM IN FARMS
async function investEthereum(
  address,
  transactionHash,
  pair,
  symbol,
  addressType,
  plan,
  amount,
  time,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      address: address,
      transactionHash: transactionHash,
      pair: pair,
      plan: plan,
      symbol: symbol,
      addressType: addressType,
      amount: amount,
      time: time,
      currentDate: currentDate,
      randomNumber: randomNumber,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/invest-ethereum-farm`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          swal("Transaction failed", result.result, "warning");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// INVEST HERTZ IN FARM
async function investHertz(
  address,
  token,
  transactionHash,
  pair,
  symbol,
  addressType,
  plan,
  amount,
  time,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      address: address,
      token: token,
      transactionHash: transactionHash,
      pair: pair,
      plan: plan,
      symbol: symbol,
      addressType: addressType,
      amount: amount,
      time: time,
      currentDate: currentDate,
      randomNumber: randomNumber,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/invest-hertz-farm`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          swal("Transaction failed", result.result, "warning");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// INVEST ETHER IN FARM
async function investEther(
  address,
  transactionHash,
  pair,
  symbol,
  addressType,
  plan,
  amount,
  time,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      address: address,
      transactionHash: transactionHash,
      pair: pair,
      plan: plan,
      symbol: symbol,
      addressType: addressType,
      amount: amount,
      time: time,
      currentDate: currentDate,
      randomNumber: randomNumber,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/invest-ether-farm`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          swal("Transaction failed", result.result, "warning");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// INVEST BNB IN FARM
async function investBNB(
  address,
  transactionHash,
  pair,
  symbol,
  addressType,
  plan,
  amount,
  time,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      address: address,
      transactionHash: transactionHash,
      pair: pair,
      plan: plan,
      symbol: symbol,
      addressType: addressType,
      amount: amount,
      time: time,
      currentDate: currentDate,
      randomNumber: randomNumber,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/invest-bnb-farm`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          swal("Transaction failed", result.result, "warning");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// INVEST BINANCE IN FARM
async function investBinance(
  address,
  transactionHash,
  pair,
  symbol,
  addressType,
  plan,
  amount,
  time,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      address: address,
      transactionHash: transactionHash,
      pair: pair,
      plan: plan,
      symbol: symbol,
      addressType: addressType,
      amount: amount,
      time: time,
      currentDate: currentDate,
      randomNumber: randomNumber,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/invest-binance-farm`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 1) {
          resolve(result.result);
        } else {
          swal("Transaction failed", result.result, "warning");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

// Filter function
window.myFunction = function myFunction(counter) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(`myInput${counter}`);
  console.log(input.value);
  filter = input.value.toUpperCase();
  table = document.getElementById(`farmTable${counter}`);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};
