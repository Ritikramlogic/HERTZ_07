import swal, { swalAlert } from "sweetalert";
import {
  serverApi,
  getCurrentUser,
  getHertzUserDetails,
  generateString,
  getCurrentUserBalance,
  getCurrentUserTokenBalance,
  walletBalances,
  tokenDecimal,
  getPair,
  ownerAddress,
  ownerDetails,
  currentDate,
  getHertzOwner,
  web3,
  updateHertzBalance,
} from "./allFunction";
import { store } from "../Redux/store";
import $ from "jquery";
// GET THE LIQUIDITY PAYABLE AMOUNT
export async function getPayableAmount(pair) {
  return new Promise(async (resolve, reject) => {
    let data = { pair: pair };

    let fetchURL = await fetch(
      `${serverApi.apiHost}/get-payable-amount-of-second-symbol`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    let response = await fetchURL.json();
    resolve(response);
  });
}

// GET THE SELECTED PAIR FOR LIQUIDITY
async function selectedPair() {
  return new Promise((resolve, reject) => {
    const selectedPair = document.getElementById("selectedPair").value;
    if (selectedPair !== (undefined || null || "")) {
      resolve(selectedPair);
    } else {
      reject("Pair not found");
    }
  });
}

export function truncateToDecimals(num, dec = 4) {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}

// get all liquidity by address / pair
window.showLiquidityByAddressAndPair =
  async function showLiquidityByAddressAndPair() {
    let pair = $("#selectedPair").val();
    console.log(pair);
    var div = document.getElementById("liquidityDetails");
    let address1 = "";
    let address2 = "";
    if (pair !== "") {
      let addressTypes = $("#addressTypes").val();
      if (
        addressTypes == "hertz_ethereum" ||
        addressTypes == "hertz_binance" ||
        addressTypes == "hertz_ether" ||
        addressTypes == "hertz_binance-coin" ||
        addressTypes == "hertz_hertz"
      ) {
        address1 = store.getState().account;
        address2 = store.getState().metamaskWalletAddress;
        console.log("HERTZ");
        console.log(address1, address2);
      } else if (
        addressTypes == "ethereum_hertz" ||
        addressTypes == "binance_hertz" ||
        addressTypes == "ether_hertz" ||
        addressTypes == "binance-coin_hertz" ||
        addressTypes == "hertz_hertz"
      ) {
        address1 = store.getState().metamaskWalletAddress;
        address2 = store.getState().account;
        console.log("HERTZ");
        console.log(address1, address2);
      }

      if (address1 != "" && address2 != "") {
        var totalLiquidityDiv = document.getElementById("liquidityDetails1");
        totalLiquidityDiv.innerHTML = `<p>Total Liquidity: 0.0000</p>`;
        return new Promise((resolve, reject) => {
          tokenDecimal()
            .then((decimals) => {
              let data = { pair: pair, address1: address1, address2: address2 };
              fetch(`${serverApi.apiHost}/get-all-liquidity-by-address-pair`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((response) => response.json())
                .then((result) => {
                  var div = document.getElementById("liquidityDetails");
                  div.innerHTML = "";

                  if (result.code == 1) {
                    if (Object.keys(result.result).length) {
                      result.result.sort(function (a, b) {
                        return b.id > a.id ? 1 : b.id < a.id ? -1 : 0;
                      });

                      var totalLiquidity = 0;
                      console.log(result.result);
                      result.result.map((Result) => {
                        console.log(Result.address_type);

                        var pair = Result.pair;
                        var pairLiquidity = Result.amount;
                        totalLiquidity += pairLiquidity;
                        if (Result.status == -1) {
                          div.innerHTML += `
                          <tr class="text-color-danger text-center">
                              <td> ${Result.pair.toUpperCase()}</td>
                              <td> ${Result.symbol.toUpperCase()} </td>
                              <td><span class="liqui_hash_id"> ${
                                Result.hash
                              } </span></td>
                              <td> ${Result.amount} </td>
                              <td> Rejected </td>
                          </tr>`;
                        } else if (Result.status == 0) {
                          div.innerHTML += `
                          <tr class="text-color-warning text-center">
                              <td> ${Result.pair.toUpperCase()}</td>
                              <td> ${Result.symbol.toUpperCase()} </td>
                              <td><span class="liqui_hash_id"> ${
                                Result.hash
                              } </span></td>
                              <td> ${Result.amount} </td>
                              <td> Pending </td>
                          </tr>`;
                        } else {
                          div.innerHTML += `
                          <tr class="text-color-success text-center">
                              <td> ${Result.pair.toUpperCase()}</td>
                              <td> ${Result.symbol.toUpperCase()} </td>
                              <td><span class="liqui_hash_id"> ${
                                Result.hash
                              } </span></td>
                              <td> ${Result.amount} </td>
                              <td> Completed </td>
                          </tr>`;
                        }
                      });

                      totalLiquidityDiv.innerHTML = `<p>Total Liquidity: ${Number(
                        totalLiquidity
                      ).toFixed(4)}</p>`;
                      resolve(true);
                    } else {
                      div.innerHTML = `<tr class=" text-center"><td colspan='5' class="text-center text-white">No Records Found</td></tr>`;
                      resolve(true);
                    }
                  } else {
                    div.innerHTML = `<tr class=" text-center"><td colspan='5' class="text-center text-white">Pair have no records</td></tr>`;
                  }
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject("Err while getting token decimals", err));
        });
      } else {
        div.innerHTML = `<tr><td colspan="5" class="text-center">Please connect wallet</td></tr>`;
      }
    } else {
      div.innerHTML = `<tr><td colspan="5" class="text-center">Please select pair</td></tr>`;
    }
  };

export async function liquidityAdd() {
  return new Promise((resolve, reject) => {
    let firstAmount = $("#firstTokenAmount").val();
    let secondAmount = $("#secondTokenAmount").val();
    let addressType1 = $("#firstAddressType").val();
    let addressType2 = $("#secondAddressType").val();
    let addressTypes = $("#addressTypes").val();
    let totalAmount = parseFloat(firstAmount) + parseFloat(secondAmount);
    let randomNumber = generateString();

    getPair()
      .then((pair) => {
        let symbol1 = pair.split("_")[0];
        let symbol2 = pair.split("_")[1];

        if (
          firstAmount != "" &&
          secondAmount != "" &&
          parseFloat(firstAmount) > 0 &&
          parseFloat(secondAmount) > 0 &&
          !isNaN(firstAmount) &&
          !isNaN(secondAmount)
        ) {
          switch (addressTypes) {
            case "ethereum_hertz":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserTokenBalance()
                        .then((etherBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol2 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol2.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(etherBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(hertzBalance)
                                ) {
                                  addEthereum(firstAmount)
                                    .then((etherResult) => {
                                      $("#loaderDiv").css("display", "block");

                                      addHertz(secondAmount, symbol2)
                                        .then((hertzResult) => {
                                          insertEtherereum(
                                            pair,
                                            etherResult,
                                            symbol1,
                                            0,
                                            etherResult.transactionHash,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              // hide loader
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertHertz(
                                            `${symbol2}_${symbol1}`,
                                            hertzResult,
                                            symbol2,
                                            1,
                                            etherResult.transactionHash,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in hertz wallet",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in metamask",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;

            case "hertz_ethereum":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserTokenBalance()
                        .then((etherBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol1 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol1.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(secondAmount) <=
                                parseFloat(hertzBalance)
                              ) {
                                if (
                                  parseFloat(firstAmount) <=
                                  parseFloat(etherBalance)
                                ) {
                                  addEthereum(secondAmount)
                                    .then((etherResult) => {
                                      $("#loaderDiv").css("display", "block");

                                      addHertz(firstAmount, symbol1)
                                        .then((hertzResult) => {
                                          // swal("Transaction in process","Please wait your transaction is process","success");

                                          insertHertz(
                                            pair,
                                            hertzResult,
                                            symbol1,
                                            0,
                                            hertzResult.transaction_id,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertEtherereum(
                                            `${symbol2}_${symbol1}`,
                                            etherResult,
                                            symbol2,
                                            1,
                                            hertzResult.transaction_id,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject();
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in metamask",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in hertz wallet",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;

            case "ether_hertz":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserBalance()
                        .then((etherBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol2 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol2.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(etherBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(hertzBalance)
                                ) {
                                  addEther(firstAmount)
                                    .then((etherResult) => {
                                      $("#loaderDiv").css("display", "block");
                                      addHertz(secondAmount, symbol2)
                                        .then((hertzResult) => {
                                          insertEther(
                                            pair,
                                            etherResult,
                                            symbol1,
                                            0,
                                            etherResult.transactionHash,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              // hide loader
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertHertz(
                                            `${symbol2}_${symbol1}`,
                                            hertzResult,
                                            symbol2,
                                            1,
                                            etherResult.transactionHash,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process,",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in hertz wallet",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in metamask",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;

            case "hertz_ether":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserBalance()
                        .then((etherBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol1 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                                hertzBalance = hertzBalance.replace(/\,/g, "");
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol1.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                    hertzBalance = hertzBalance.replace(
                                      /\,/g,
                                      ""
                                    );
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(hertzBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(etherBalance)
                                ) {
                                  addLiquidityPair(
                                    symbol1,
                                    symbol2,
                                    addressType1,
                                    addressType2
                                  ).then((responseAfterAdded) => {
                                    addEther(secondAmount)
                                      .then((etherResult) => {
                                        $("#loaderDiv").css("display", "block");

                                        addHertz(firstAmount, symbol1)
                                          .then((hertzResult) => {
                                            insertHertz(
                                              pair,
                                              hertzResult,
                                              symbol1,
                                              0,
                                              hertzResult.transaction_id,
                                              randomNumber
                                            )
                                              .then(
                                                async (insertResultSecond) => {
                                                  $("#loaderDiv").css(
                                                    "display",
                                                    "none"
                                                  );
                                                  await updateHertzBalance();
                                                  swal(
                                                    "Transaction in process",
                                                    "Please click on clock icon see your transaction status",
                                                    "success"
                                                  );
                                                }
                                              )
                                              .catch((err) => {
                                                reject(err);
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                swal(
                                                  "Transaction Failed",
                                                  err,
                                                  "warning"
                                                );
                                              });

                                            insertEther(
                                              `${symbol2}_${symbol1}`,
                                              etherResult,
                                              symbol2,
                                              1,
                                              hertzResult.transaction_id,
                                              randomNumber
                                            )
                                              .then((insertResultOne) => {})
                                              .catch((err) => {
                                                reject(err);
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                swal(
                                                  "Transaction Failed",
                                                  err,
                                                  "warning"
                                                );
                                              });
                                          })
                                          .catch((err) => {
                                            reject();
                                            $("#loaderDiv").css(
                                              "display",
                                              "none"
                                            );
                                            console.log(
                                              "Err while transfer hertz Token"
                                            );
                                          });
                                      })
                                      .catch((err) => {
                                        reject(err);
                                        $("#loaderDiv").css("display", "none");
                                        console.log(
                                          "Err while transfer ethereum Token"
                                        );
                                      });
                                  });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in metamask",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in hertz wallet",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;

            case "hertz_hertz":
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  walletBalances()
                    .then((balanceWithSymbol) => {
                      let hertzFirstBalance = 0;
                      let hertzSecondBalance = 0;
                      console.log("symbol1", symbol1);
                      console.log("symbol2", symbol2);

                      if (symbol1 == "htz") {
                        hertzFirstBalance =
                          balanceWithSymbol.result.split(" ")[0];
                        hertzFirstBalance = hertzFirstBalance.replace(
                          /\,/g,
                          ""
                        );
                      } else {
                        balanceWithSymbol.tokens.map((Result) => {
                          if (Result.symbol === symbol1.toUpperCase()) {
                            hertzFirstBalance = Result.balance;
                            hertzFirstBalance = hertzFirstBalance.replace(
                              /\,/g,
                              ""
                            );
                          }
                        });
                      }

                      if (symbol2 == "htz") {
                        hertzSecondBalance =
                          balanceWithSymbol.result.split(" ")[0];
                        hertzSecondBalance = hertzSecondBalance.replace(
                          /\,/g,
                          ""
                        );
                      } else {
                        balanceWithSymbol.tokens.map((Result) => {
                          if (Result.symbol === symbol2.toUpperCase()) {
                            hertzSecondBalance = Result.balance;
                            hertzSecondBalance = hertzSecondBalance.replace(
                              /\,/g,
                              ""
                            );
                          }
                        });
                      }
                      // hertzFirstBalance = hertzFirstBalance.replace(/\,/g, "");
                      // hertzSecondBalance = hertzSecondBalance.replace(
                      //   /\,/g,
                      //   ""
                      // );
                      // hertzSecondBalance = hertzSecondBalance.replace(
                      //   /\,/g,
                      //   ""
                      // );

                      console.log("first balance", hertzFirstBalance);
                      console.log("second balance", hertzSecondBalance);
                      console.log("fisrt input", firstAmount);
                      console.log("second input", secondAmount);

                      if (
                        parseFloat(firstAmount) <= parseFloat(hertzFirstBalance)
                      ) {
                        console.log("fisrt loop");
                        if (
                          parseFloat(secondAmount) <=
                          parseFloat(hertzSecondBalance)
                        ) {
                          console.log("second loop");
                          addLiquidityPair(
                            symbol1,
                            symbol2,
                            addressType1,
                            addressType2
                          )
                            .then((responseAfterAdded) => {
                              addHertz(firstAmount, symbol1)
                                .then((hertzResult1) => {
                                  $("#loaderDiv").css("display", "block");

                                  insertHertz(
                                    pair,
                                    hertzResult1,
                                    symbol1,
                                    0,
                                    hertzResult1.transaction_id,
                                    randomNumber
                                  )
                                    .then((insertResultSecond) => {
                                      addHertz(secondAmount, symbol2)
                                        .then((hertzResult2) => {
                                          insertHertz(
                                            `${symbol2}_${symbol1}`,
                                            hertzResult2,
                                            symbol2,
                                            1,
                                            hertzResult1.transaction_id,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      swal(
                                        "Transaction Failed",
                                        err,
                                        "warning"
                                      );
                                    });
                                })
                                .catch((err) => {
                                  reject(err);
                                  $("#loaderDiv").css("display", "none");
                                  console.log("Err while transfer hertz Token");
                                });
                            })
                            .catch((err) => {
                              swal(
                                "Internel Server Error",
                                "Something went wrong",
                                "warning"
                              );
                            });
                        } else {
                          reject();
                          swal(
                            "Insuffient Balance",
                            "You don't have enough balance in hertz wallet",
                            "warning"
                          );
                        }
                      } else {
                        reject();
                        swal(
                          "Insuffient Balance",
                          "You don't have enough balance in hertz wallet",
                          "warning"
                        );
                      }
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                });
              break;
            case "hertz_binance-coin":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserBalance()
                        .then((bnbBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol1 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                                hertzBalance = hertzBalance.replace(/\,/g, "");
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol1.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                    hertzBalance = hertzBalance.replace(
                                      /\,/g,
                                      ""
                                    );
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(hertzBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(bnbBalance)
                                ) {
                                  addLiquidityPair(
                                    symbol1,
                                    symbol2,
                                    addressType1,
                                    addressType2
                                  )
                                    .then((responseAfterAdded) => {
                                      addBNB(secondAmount)
                                        .then((bnbResult) => {
                                          $("#loaderDiv").css(
                                            "display",
                                            "block"
                                          );

                                          addHertz(firstAmount, symbol1)
                                            .then((hertzResult) => {
                                              // swal("Transaction in process","Please wait your transaction is process","success");

                                              insertHertz(
                                                pair,
                                                hertzResult,
                                                symbol1,
                                                0,
                                                hertzResult.transaction_id,
                                                randomNumber
                                              )
                                                .then(
                                                  async (
                                                    insertResultSecond
                                                  ) => {
                                                    $("#loaderDiv").css(
                                                      "display",
                                                      "none"
                                                    );
                                                    await updateHertzBalance();
                                                    swal(
                                                      "Transaction in process",
                                                      "Please click on clock icon see your transaction status",
                                                      "success"
                                                    );
                                                  }
                                                )
                                                .catch((err) => {
                                                  reject(err);
                                                  $("#loaderDiv").css(
                                                    "display",
                                                    "none"
                                                  );
                                                  swal(
                                                    "Transaction Failed",
                                                    err,
                                                    "warning"
                                                  );
                                                });

                                              insertBNB(
                                                `${symbol2}_${symbol1}`,
                                                bnbResult,
                                                symbol2,
                                                1,
                                                hertzResult.transaction_id,
                                                randomNumber
                                              )
                                                .then((insertResultOne) => {})
                                                .catch((err) => {
                                                  reject(err);
                                                  $("#loaderDiv").css(
                                                    "display",
                                                    "none"
                                                  );
                                                  swal(
                                                    "Transaction Failed",
                                                    err,
                                                    "warning"
                                                  );
                                                });
                                            })
                                            .catch((err) => {
                                              reject();
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              console.log(
                                                "Err while transfer hertz Token"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer ethereum Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      swal(
                                        "Internel Server Error",
                                        "Something went wrong",
                                        "warning"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in your wallet",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in hertz wallet",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;

            case "binance-coin_hertz":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserBalance()
                        .then((bnbBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol2 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol2.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(bnbBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(hertzBalance)
                                ) {
                                  addBNB(firstAmount)
                                    .then((bnbResult) => {
                                      $("#loaderDiv").css("display", "block");

                                      addHertz(secondAmount, symbol2)
                                        .then((hertzResult) => {
                                          insertBNB(
                                            pair,
                                            bnbResult,
                                            symbol1,
                                            0,
                                            bnbResult.transactionHash,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertHertz(
                                            `${symbol2}_${symbol1}`,
                                            hertzResult,
                                            symbol2,
                                            1,
                                            bnbResult.transactionHash,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process,",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in hertz wallet",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in metamask",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;
            case "hertz_binance":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserTokenBalance()
                        .then((binanceTokenBalance) => {
                          console.log(binanceTokenBalance);

                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol1 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol1.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(secondAmount) <=
                                parseFloat(hertzBalance)
                              ) {
                                if (
                                  parseFloat(firstAmount) <=
                                  parseFloat(binanceTokenBalance)
                                ) {
                                  addBinance(secondAmount)
                                    .then((binanceResult) => {
                                      $("#loaderDiv").css("display", "block");

                                      addHertz(firstAmount, symbol1)
                                        .then((hertzResult) => {
                                          // swal("Transaction in process","Please wait your transaction is process","success");

                                          insertHertz(
                                            pair,
                                            hertzResult,
                                            symbol1,
                                            0,
                                            hertzResult.transaction_id,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertBinance(
                                            `${symbol2}_${symbol1}`,
                                            binanceResult,
                                            symbol2,
                                            1,
                                            hertzResult.transaction_id,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject();
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in metamask",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in hertz wallet",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;
            case "binance_hertz":
              getCurrentUser()
                .then((getCurrentUserAddress) => {
                  getHertzUserDetails()
                    .then((hertzUserDetails) => {
                      getCurrentUserTokenBalance()
                        .then((binanceTokenBalance) => {
                          walletBalances()
                            .then((balanceWithSymbol) => {
                              let hertzBalance = 0;
                              if (symbol2 == "htz") {
                                hertzBalance =
                                  balanceWithSymbol.result.split(" ")[0];
                              } else {
                                balanceWithSymbol.tokens.map((Result) => {
                                  if (Result.symbol === symbol2.toUpperCase()) {
                                    hertzBalance = Result.balance;
                                  }
                                });
                              }

                              if (
                                parseFloat(firstAmount) <=
                                parseFloat(binanceTokenBalance)
                              ) {
                                if (
                                  parseFloat(secondAmount) <=
                                  parseFloat(hertzBalance)
                                ) {
                                  addBinance(firstAmount)
                                    .then((binanceResult) => {
                                      $("#loaderDiv").css("display", "block");

                                      addHertz(secondAmount, symbol2)
                                        .then((hertzResult) => {
                                          insertBinance(
                                            pair,
                                            binanceResult,
                                            symbol1,
                                            0,
                                            binanceResult.transactionHash,
                                            randomNumber
                                          )
                                            .then((insertResultOne) => {})
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });

                                          insertHertz(
                                            `${symbol2}_${symbol1}`,
                                            hertzResult,
                                            symbol2,
                                            1,
                                            binanceResult.transactionHash,
                                            randomNumber
                                          )
                                            .then(
                                              async (insertResultSecond) => {
                                                $("#loaderDiv").css(
                                                  "display",
                                                  "none"
                                                );
                                                await updateHertzBalance();
                                                swal(
                                                  "Transaction in process",
                                                  "Please click on clock icon see your transaction status",
                                                  "success"
                                                );
                                              }
                                            )
                                            .catch((err) => {
                                              reject(err);
                                              $("#loaderDiv").css(
                                                "display",
                                                "none"
                                              );
                                              swal(
                                                "Transaction Failed",
                                                err,
                                                "warning"
                                              );
                                            });
                                        })
                                        .catch((err) => {
                                          reject(err);
                                          $("#loaderDiv").css(
                                            "display",
                                            "none"
                                          );
                                          console.log(
                                            "Err while transfer hertz Token"
                                          );
                                        });
                                    })
                                    .catch((err) => {
                                      reject(err);
                                      $("#loaderDiv").css("display", "none");
                                      console.log(
                                        "Err while transfer ethereum Token"
                                      );
                                    });
                                } else {
                                  reject();
                                  swal(
                                    "Insuffient Balance",
                                    "You don't have enough balance in hertz wallet",
                                    "warning"
                                  );
                                }
                              } else {
                                reject();
                                swal(
                                  "Insuffient Balance",
                                  "You don't have enough balance in metamask",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                      swal(
                        "Address not found",
                        "Please connect hertz wallet",
                        "warning"
                      );
                    });
                })
                .catch((err) => {
                  reject(err);
                  swal("Address not found", "Please connect wallet", "warning");
                });
              break;
            default:
              swal(
                "Something went wrong",
                "Your selected pair is not found",
                "warning"
              );
          }
        } else {
          reject();
          swal("Invalid Amount", "Please enter a valid amount", "warning");
        }
      })
      .catch((err) => {
        swal("Pair not found", "Please select pair", "warning");
        reject(err);
      });
    document.getElementById("firstTokenAmount").value = "";
    document.getElementById("secondTokenAmount").value = "";
    document.getElementById("payableAmountDiv").style.display = "none";
  });
}

// ADD LIQUIDITY ACCORDING NETWORK (BINANCE)
async function addBinance(amount) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((getCurrentUserAddress) => {
        getCurrentUserTokenBalance()
          .then((balance) => {
            tokenDecimal()
              .then((decimals) => {
                ownerAddress()
                  .then((owner) => {
                    if (parseFloat(amount) <= parseFloat(balance)) {
                      const value = Number(amount * 10 ** decimals);
                      ownerDetails.myContract.methods
                        .transfer(owner, value)
                        .send({ from: getCurrentUserAddress })
                        .on("transactionHash", function (hash) {
                          resolve({
                            currenctUserAddress: getCurrentUserAddress,
                            amount: amount,
                            transactionHash: hash,
                          });
                        })
                        .catch((err) => {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        });
                    } else {
                      reject();
                      swal(
                        "Insufficient Balance",
                        "You don't have sufficient balance for this transaction",
                        "warning"
                      );
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject();
            swal("Balance not found", "Your wallet balance it not getting");
          });
      })
      .catch((err) => {
        reject();
        swal("Address not found", "Please connect your wallet", "warning");
      });
  });
}

// INSERT HERTZ LIQUIDITY
async function insertHertz(
  pair,
  hertzResult,
  symbol,
  rev,
  firstTransactionHash,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    function truncateToDecimals(num, dec = 4) {
      const calcDec = Math.pow(10, dec);
      return Math.trunc(num * calcDec) / calcDec;
    }

    let data = {
      pair: pair,
      address: hertzResult.userHertzAddress,
      symbol: symbol,
      hash: hertzResult.transaction_id,
      amount: truncateToDecimals(parseFloat(hertzResult.amount)),
      token: hertzResult.userHertzToken,
      reverse: rev,
      firstTransactionHash: firstTransactionHash,
      randomNumber: randomNumber,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/add-liquidity-in-hertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// INSERT BINANCE LIQUIDITY
async function insertBinance(
  pair,
  binanceResult,
  symbol,
  rev,
  firstTransactionHash,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      address: binanceResult.currenctUserAddress,
      address_type: "binance",
      symbol: symbol,
      hash: binanceResult.transactionHash,
      amount: binanceResult.amount,
      reverse: rev,
      firstTransactionHash: firstTransactionHash,
      randomNumber: randomNumber,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/add-liquidity-in-binance`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// ADD LIQUIDITY ACCORDING NETWORK (HERTZ)
async function addHertz(amount, symbol) {
  return new Promise((resolve, reject) => {
    getHertzOwner()
      .then((ownerHertzAddress) => {
        getHertzUserDetails()
          .then((hertzUserDetails) => {
            walletBalances()
              .then((balanceWithSymbol) => {
                let balance;
                if (symbol == "htz") {
                  balance = balanceWithSymbol.result.split(" ")[0];
                } else {
                  balanceWithSymbol.tokens.map((Result) => {
                    if (Result.symbol === symbol.toUpperCase()) {
                      balance = Result.balance;
                      console.log("Add Hertz Balance inside loop", balance);
                    }
                  });
                }
                console.log("Add Hertz Balance", balance);
                balance = balance.replace(/\,/g, "");
                console.log("Add Hertz Balance after strip commas", balance);
                if (parseFloat(balance) >= parseFloat(amount)) {
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
                      resolve({
                        userHertzUsername: hertzUserDetails.userHertzUsername,
                        userHertzToken: hertzUserDetails.userHertzToken,
                        userHertzAddress: hertzUserDetails.userHertzAddress,
                        hertzOwnerAddress: ownerHertzAddress,
                        amount: amount,
                        symbol: symbol,
                        transaction_id: transferToken.transaction_id,
                      });
                    })
                    .catch((err) => {
                      swalAlert(
                        "Warning",
                        "Some problem while tranfer hertz token",
                        "warning"
                      );
                      reject({ title: "Critical problem", err: err });
                    });
                } else {
                  swal(
                    "Insufficient Balance",
                    "You don't have sufficient balance for this transaction",
                    "warning"
                  );
                }
              })
              .catch((err) =>
                console.log("Hertz wallet balance is not getting", err)
              );
          })
          .catch((err) => {
            swal("Address not found", "Please connect hertz wallet", "warning");
          });
      })
      .catch((err) => console.log("Owner hertz address not found", err));
  });
}
// ADD LIQUDITY PAIR
async function addLiquidityPair(symbol1, symbol2, addressType1, addressType2) {
  return new Promise((resolve, reject) => {
    let data = {
      symbol1: symbol1,
      symbol2: symbol2,
      address_type_1: addressType1,
      address_type_2: addressType2,
    };

    fetch(`${serverApi.apiHost}/add-liquidity-pair`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.code == 1) {
          resolve(result.result);
        } else {
          resolve(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}
// ADD LIQUIDITY ACCORDING NETWORK (ETHER)
async function addEther(amount) {
  return new Promise((resolve, reject) => {
    const value = Number(amount * 10 ** 18);

    getCurrentUser()
      .then((getCurrentUserAddress) => {
        getCurrentUserBalance()
          .then((balance) => {
            tokenDecimal()
              .then((decimals) => {
                ownerAddress()
                  .then((owner) => {
                    if (parseFloat(amount) <= parseFloat(balance)) {
                      web3.eth
                        .sendTransaction({
                          to: owner,
                          from: getCurrentUserAddress,
                          gasPrice: "50000000000",
                          value: value,
                        })
                        .on("transactionHash", function (hash) {
                          resolve({
                            currenctUserAddress: getCurrentUserAddress,
                            amount: amount,
                            transactionHash: hash,
                          });
                        })
                        .on("error", function (error, receipt) {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        })
                        .catch((err) => {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        });
                    } else {
                      reject();
                      swal(
                        "Insufficient Balance",
                        "You don't have sufficient balance for this transaction",
                        "warning"
                      );
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject();
            swal("Balance not found", "Your wallet balance it not getting");
          });
      })
      .catch((err) => {
        reject();
        swal("Address not found", "Please connect your wallet", "warning");
      });
  });
}

// ADD LIQUDITY ACCORDING NETWORK(BNB)
async function addBNB(amount) {
  return new Promise((resolve, reject) => {
    const value = Number(amount * 10 ** 18);

    getCurrentUser()
      .then((getCurrentUserAddress) => {
        getCurrentUserBalance()
          .then((balance) => {
            tokenDecimal()
              .then((decimals) => {
                ownerAddress()
                  .then((owner) => {
                    if (parseFloat(amount) <= parseFloat(balance)) {
                      let 
                      web3.eth
                        .sendTransaction({
                          to: owner,
                          from: getCurrentUserAddress,
                          gasPrice: "50000000000",
                          value: value,
                        })
                        .on("transactionHash", function (hash) {
                          resolve({
                            currenctUserAddress: getCurrentUserAddress,
                            amount: amount,
                            transactionHash: hash,
                          });
                        })
                        .on("error", function (error, receipt) {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        })
                        .catch((err) => {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        });
                    } else {
                      reject();
                      swal(
                        "Insufficient Balance",
                        "You don't have sufficient balance for this transaction",
                        "warning"
                      );
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject();
            swal("Balance not found", "Your wallet balance it not getting");
          });
      })
      .catch((err) => {
        reject();
        swal("Address not found", "Please connect your wallet", "warning");
      });
  });
}

// ADD LIQUIDITY ACCORDING NETWORK (ETHEREUM)
async function addEthereum(amount) {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((getCurrentUserAddress) => {
        getCurrentUserTokenBalance()
          .then((balance) => {
            tokenDecimal()
              .then((decimals) => {
                ownerAddress()
                  .then((owner) => {
                    if (parseFloat(amount) <= parseFloat(balance)) {
                      const value = Number(amount * 10 ** decimals);

                      ownerDetails.myContract.methods
                        .transfer(owner, value)
                        .send({ from: getCurrentUserAddress })
                        .on("transactionHash", function (hash) {
                          resolve({
                            currenctUserAddress: getCurrentUserAddress,
                            amount: amount,
                            transactionHash: hash,
                          });
                        })
                        .catch((err) => {
                          swal(
                            "Transaction cancel",
                            "User denied the transaction",
                            "warning"
                          );
                        });
                    } else {
                      reject();
                      swal(
                        "Insufficient Balance",
                        "You don't have sufficient balance for this transaction",
                        "warning"
                      );
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject();
            swal("Balance not found", "Your wallet balance it not getting");
          });
      })
      .catch((err) => {
        reject();
        swal("Address not found", "Please connect your wallet", "warning");
      });
  });
}

// INSERT ETHER LIQUIDITY
async function insertEther(
  pair,
  ethereumResult,
  symbol,
  rev,
  firstTransactionHash,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      address: ethereumResult.currenctUserAddress,
      address_type: "ether",
      symbol: symbol,
      hash: ethereumResult.transactionHash,
      amount: ethereumResult.amount,
      reverse: rev,
      firstTransactionHash: firstTransactionHash,
      randomNumber: randomNumber,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/add-liquidity-in-ether`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// INSERT BNB LIQUIDITY
async function insertBNB(
  pair,
  bnbResult,
  symbol,
  rev,
  firstTransactionHash,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      address: bnbResult.currenctUserAddress,
      address_type: "binance-coin",
      symbol: symbol,
      hash: bnbResult.transactionHash,
      amount: bnbResult.amount,
      reverse: rev,
      firstTransactionHash: firstTransactionHash,
      randomNumber: randomNumber,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/add-liquidity-in-bnb`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// INSERT ETHEREUM LIQUIDITY
async function insertEtherereum(
  pair,
  ethereumResult,
  symbol,
  rev,
  firstTransactionHash,
  randomNumber
) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      address: ethereumResult.currenctUserAddress,
      address_type: "ether",
      symbol: symbol,
      hash: ethereumResult.transactionHash,
      amount: ethereumResult.amount,
      reverse: rev,
      firstTransactionHash: firstTransactionHash,
      randomNumber: randomNumber,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/add-liquidity-in-ethereum`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// GET TOKEN PRICE
export async function getTokenRatio(token) {
  return new Promise((resolve, reject) => {
    let data = { token: token };

    fetch(`${serverApi.apiHost}/get-token-ratio`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result[0].price);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => reject(err));
  });
}

// NEW WITHDRAW FUNCTIONALITY
export async function getLiquidityPairs() {
  return new Promise((resolve, reject) => {
    let pairTabs = document.getElementById("pairTabs");
    let html = "";
    $("#responseLoader").css("display", "block");

    fetch(`${serverApi.apiHost}/get-liquidity-pairs`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.result.length > 0) {
          result.result.map((Result, key) => {
            html += `<div class="accordion my-2" id="faq${key}" style="display:block">
            <div class="card bg_blue_light_dark">
                <div class="card-header" id="faqhead11${key}">
                    <a href="#" class="btn btn-header-link w-100 pb-0" data-toggle="collapse" data-target="#faq11${key}"
                    aria-expanded="true" aria-controls="#faq1${key}" onclick="">
                        <div class="liquidity-accordiun">
                            <div class="row">
                                <div class="col">
                                    <div class="left-head-Accordiun">
                                        <h6 class="text-left text_skylight d-flex align-items-center mb-0">
                                            <div class="d-flex pr-2">
                                                <div class="col-auto p-0">
                                                    <img src="${
                                                      Result.token_image_1
                                                    }" width="30" class="token_img_ss">
                                                </div>
                                                <div class="col-auto pr-1">
                                                    <img src="${
                                                      Result.token_image_2
                                                    }" width="30" class="token_img_ss">
                                                </div>
                                            </div>
                                        ${Result.token_A_symbols.toUpperCase()}_${Result.token_B_symbols.toUpperCase()}</h6>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="Right-head-Accordiun">
                                        <p class="mb-0 text_skylight">Manage <i class="fas fa-chevron-down"></i></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
  
                <div id="faq11${key}" class="collapse" aria-labelledby="faqhead11${key}" data-parent="#faq${key}">
                    <div class="card-body text-dark" id="userLiquidityDetail${key}">
                        
                    </div>  
                </div>
            </div>
        </div>                   
            `;
            userLiquidityDetails(
              `${Result.pair_symbols}`,
              `${Result.address_type_1}_${Result.address_type_2}`,
              `userLiquidityDetail${key}`,
              `faq${key}`
            );
          });
          console.log(html);
          if (pairTabs != null) {
            document.getElementById("pairTabs").innerHTML = html;
          }
        } else {
          if (pairTabs != null) {
            document.getElementById(
              "pairTabs"
            ).innerHTML = `<div class="text-center"><p>Pair not found</p></div>`;
          }
        }
      })
      .catch((err) => console.log(err));
  });
}

const userLiquidityDetails = (pair, addressType, detailDiv, faqCounter) => {
  $(`#${detailDiv}`).html(
    `<div class="text-center text-white">Please connect wallet.<div>`
  );

  let address1 = store.getState().account;
  let address2 = store.getState().metamaskWalletAddress;
  if (
    address1 != ("" || null || undefined) &&
    address2 != ("" || null || undefined)
  ) {
    if (addressType === "hertz_ethereum") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address1,
        address2,
        detailDiv,
        faqCounter
      );

      // getCurrentUser()
      // .then(currentUserAddress => {
      //     getHertzUserDetails()
      //     .then(hertzUserDetails => {
      // getUserLiquidityDetails(pair,addressType,hertzUserDetails.userHertzAddress,currentUserAddress,detailDiv,faqCounter);
      //     })
      //     .catch(err=>swal("Address not found","Please connect hertz wallet","warning"));
      // })
      // .catch(err=>swal("Address not found","Please connect metamask wallet","warning"));
    } else if (addressType === "ethereum_hertz") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address2,
        address1,
        detailDiv,
        faqCounter
      );
      // getCurrentUser()
      // .then(currentUserAddress => {
      //     getHertzUserDetails()
      //     .then(hertzUserDetails => {
      // getUserLiquidityDetails(pair,addressType,currentUserAddress,hertzUserDetails.userHertzAddress,detailDiv,faqCounter);
      //     })
      //     .catch(err=>swal("Address not found","Please connect hertz wallet","warning"));
      // })
      // .catch(err=>swal("Address not found","Please connect metamask wallet","warning"));
    } else if (addressType === "ether_hertz") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address2,
        address1,
        detailDiv,
        faqCounter
      );
      // getCurrentUser()
      // .then(currentUserAddress => {
      //     getHertzUserDetails()
      //     .then(hertzUserDetails => {
      // getUserLiquidityDetails(pair,addressType,currentUserAddress,hertzUserDetails.userHertzAddress,detailDiv,faqCounter);
      //     })
      //     .catch(err=>swal("Address not found","Please connect hertz wallet","warning"))
      // })
      // .catch(err=>swal("Address not found","Please connect metamask wallet","warning"));
    } else if (addressType === "hertz_ether") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address1,
        address2,
        detailDiv,
        faqCounter
      );

      // getCurrentUser()
      // .then(currentUserAddress => {
      //     getHertzUserDetails()
      //     .then(hertzUserDetails => {
      // getUserLiquidityDetails(pair,addressType,hertzUserDetails.userHertzAddress,currentUserAddress,detailDiv,faqCounter);
      //     })
      //     .catch(err=>swal("Address not found","Please connect hertz wallet","warning"))
      // })
      // .catch(err=>swal("Address not found","Please connect metamask wallet","warning"));
    } else if (addressType === "hertz_hertz") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address1,
        address1,
        detailDiv,
        faqCounter
      );
      // getHertzUserDetails()
      // .then(hertzUserDetails => {
      // getUserLiquidityDetails(pair,addressType,hertzUserDetails.userHertzAddress,hertzUserDetails.userHertzAddress,detailDiv,faqCounter);
      // })
      // .catch(err=>swal("Address not found","Please connect hertz wallet","warning"))
    } else if (addressType === "hertz_binance-coin") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address1,
        address2,
        detailDiv,
        faqCounter
      );
    } else if (addressType === "binance-coin_hertz") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address2,
        address1,
        detailDiv,
        faqCounter
      );
    } else if (addressType === "hertz_binance") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address1,
        address2,
        detailDiv,
        faqCounter
      );
    } else if (addressType === "binance_hertz") {
      getUserLiquidityDetails(
        pair,
        addressType,
        address2,
        address1,
        detailDiv,
        faqCounter
      );
    }
  }
};

const getUserLiquidityDetails = async (
  pair,
  addressType,
  address1,
  address2,
  detailDiv,
  faqCounter
) => {
  $(`#${detailDiv}`).html("");
  $(`#${detailDiv}`).html(
    `<div class="text-center text-white">Fetching...<div>`
  );

  let data = { pair: pair, address1: address1, address2: address2 };

  let symbol1 = pair.split("_")[0];
  let symbol2 = pair.split("_")[1];

  let fetchURL = await fetch(
    `${serverApi.apiHost}/get-user-liquidity-details`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  let response = await fetchURL.json();
  // console.log(response);
  $("#responseLoader").css("display", "none");
  if (response.code == 1) {
    if (parseFloat(response.result.userTotalLiquidity) > 0) {
      $(`#${detailDiv}`).html(`
                         <div class="liquidity-accordiun-content">
                              <div class="row d-none">
                                  <div class="col">
                                      <div class="left-content-Accordiun">
                                          <p>Your Total Pool tokens</p>
                                      </div>
                                  </div>
                                  <div class="col-auto">
                                      <div class="Right-content-Accordiun">
                                          <p>${parseFloat(
                                            response.result.userTotalLiquidity
                                          ).toFixed(4)}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col">
                                      <div class="left-content-Accordiun">
                                          <p class="text-white">Pooled ${symbol1.toUpperCase()}</p>
                                      </div>
                                  </div>
                                  <div class="col-auto">
                                      <div class="Right-content-Accordiun">
                                          <p class="text-white">${parseFloat(
                                            response.result.basePairLiquidity
                                          ).toFixed(4)}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col">
                                      <div class="left-content-Accordiun">
                                          <p class="text-white">Pooled ${symbol2.toUpperCase()}</p>
                                      </div>
                                  </div>
                                  <div class="col-auto">
                                      <div class="Right-content-Accordiun">
                                          <p class="text-white">${parseFloat(
                                            response.result.qoutePairLiquidity
                                          ).toFixed(4)}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col">
                                      <div class="left-content-Accordiun">
                                          <p class="text-white">Your Rewards</p>
                                      </div>
                                  </div>
                                  <div class="col-auto">
                                      <div class="Right-content-Accordiun">
                                          <p class="text-white"> ${parseFloat(
                                            response.result.totalReward
                                          )}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div class="liquidity-accordiun-bottom-btns mt-3">
                              <div class="row">
                                  <div class="col">
                                      <div class="Right-btn3-Accordiun">
                                         <button class="btn btn_Connect_light w-100" onclick="initiateWithdrawal('${pair}','${addressType}')" style="font-size:19px">Withdraw</button>
                                      </div>
                                  </div>
                              </div>
                          </div>            
      `);
    } else {
      $(`#${detailDiv}`).html("");
      $(`#${detailDiv}`).html(
        `<div class="text-center text-white">No Record Found<div>`
      );
    }
  } else {
    $(`#${detailDiv}`).html("");
    $(`#${detailDiv}`).html(
      `<div class="text-center text-white">${response.result}<div>`
    );
    $(`#${faqCounter}`).css("display", "none");
  }
};

// GET REWARD AMOUNT
async function getRewardAmount(address, pair, symbol) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair, address: address, symbol: symbol };
    fetch(`${serverApi.apiHost}/get-reward-amount`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        resolve(result.result);
      })
      .catch((err) => reject(err));
  });
}
async function withdrawUserLiquidity(
  pair,
  addressType,
  address1,
  address2,
  firstRewardAmount,
  secondRewardAmount
) {
  return new Promise((resolve, reject) => {
    let symbol1 = pair.split("_")[0];
    let symbol2 = pair.split("_")[1];

    let data = {
      pair: pair,
      addressType: addressType,
      address1: address1,
      address2: address2,
      currentDate: currentDate,
      firstRewardAmount: firstRewardAmount,
      secondRewardAmount: secondRewardAmount,
      action: "0",
    };

    console.log(data);
    fetch(`${serverApi.apiHost}/withdraw-user-liquidity`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.result);
        if (result.code === 1) {
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
                data = {
                  pair: pair,
                  addressType: addressType,
                  address1: address1,
                  address2: address2,
                  currentDate: currentDate,
                  firstRewardAmount: firstRewardAmount,
                  secondRewardAmount: secondRewardAmount,
                  action: "1",
                  firstMaxAmount: result.result.minimumFirstAmount,
                  secondMaxAmount: result.result.minimumSecondAmount,
                };
                fetch(`${serverApi.apiHost}/withdraw-user-liquidity`, {
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
                      swal("Transaction failed", result.result, "warning");
                      $("#loaderDiv").css("display", "none");
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
        } else if (result.code === 0) {
          swal("Transaction failed", result.result, "warning");
          $("#loaderDiv").css("display", "none");
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
}

window.initiateWithdrawal = async function initiateWithdrawal(
  pair,
  addressType
) {
  return new Promise((resolve, reject) => {
    swal({
      title: "Are you sure to withdraw liquidity?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let symbol1 = pair.split("_")[0];
        let symbol2 = pair.split("_")[1];
        let newPair = `${symbol2}_${symbol1}`;

        if (addressType === "hertz_ethereum") {
          getCurrentUser()
            .then((currentUserAddress) => {
              console.log("here error");
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  console.log(hertzUserDetails);
                  getRewardAmount(
                    hertzUserDetails.userHertzAddress,
                    pair,
                    symbol1
                  )
                    .then((firstRewardAmount) => {
                      getRewardAmount(currentUserAddress, pair, symbol2)
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            hertzUserDetails.userHertzAddress,
                            currentUserAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "ethereum_hertz") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(currentUserAddress, pair, symbol1)
                    .then((firstRewardAmount) => {
                      console.log(firstRewardAmount);

                      getRewardAmount(
                        hertzUserDetails.userHertzAddress,
                        pair,
                        symbol2
                      )
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            currentUserAddress,
                            hertzUserDetails.userHertzAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "ether_hertz") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(currentUserAddress, pair, symbol1)
                    .then((firstRewardAmount) => {
                      console.log(firstRewardAmount);

                      getRewardAmount(
                        hertzUserDetails.userHertzAddress,
                        pair,
                        symbol2
                      )
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            currentUserAddress,
                            hertzUserDetails.userHertzAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "hertz_ether") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(
                    hertzUserDetails.userHertzAddress,
                    pair,
                    symbol1
                  )
                    .then((firstRewardAmount) => {
                      getRewardAmount(currentUserAddress, pair, symbol2)
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            hertzUserDetails.userHertzAddress,
                            currentUserAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "hertz_hertz") {
          getHertzUserDetails()
            .then((hertzUserDetails) => {
              getRewardAmount(hertzUserDetails.userHertzAddress, pair, symbol1)
                .then((firstRewardAmount) => {
                  getRewardAmount(
                    hertzUserDetails.userHertzAddress,
                    pair,
                    symbol2
                  )
                    .then((secondRewardAmount) => {
                      console.log(secondRewardAmount);
                      $("#loaderDiv").css("display", "block");

                      withdrawUserLiquidity(
                        pair,
                        addressType,
                        hertzUserDetails.userHertzAddress,
                        hertzUserDetails.userHertzAddress,
                        firstRewardAmount,
                        secondRewardAmount
                      );
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            })
            .catch((err) => {
              swal(
                "Address not found",
                "Please connect hertz wallet",
                "warning"
              );
              reject(err);
            });
        } else if (addressType === "hertz_binance") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(
                    hertzUserDetails.userHertzAddress,
                    pair,
                    symbol1
                  )
                    .then((firstRewardAmount) => {
                      getRewardAmount(currentUserAddress, pair, symbol2)
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            hertzUserDetails.userHertzAddress,
                            currentUserAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "binance_hertz") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(currentUserAddress, pair, symbol1)
                    .then((firstRewardAmount) => {
                      console.log(firstRewardAmount);

                      getRewardAmount(
                        hertzUserDetails.userHertzAddress,
                        pair,
                        symbol2
                      )
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            currentUserAddress,
                            hertzUserDetails.userHertzAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "binance-coin_hertz") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(currentUserAddress, pair, symbol1)
                    .then((firstRewardAmount) => {
                      console.log(firstRewardAmount);

                      getRewardAmount(
                        hertzUserDetails.userHertzAddress,
                        pair,
                        symbol2
                      )
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            currentUserAddress,
                            hertzUserDetails.userHertzAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        } else if (addressType === "hertz_binance-coin") {
          getCurrentUser()
            .then((currentUserAddress) => {
              getHertzUserDetails()
                .then((hertzUserDetails) => {
                  getRewardAmount(
                    hertzUserDetails.userHertzAddress,
                    pair,
                    symbol1
                  )
                    .then((firstRewardAmount) => {
                      getRewardAmount(currentUserAddress, pair, symbol2)
                        .then((secondRewardAmount) => {
                          $("#loaderDiv").css("display", "block");
                          withdrawUserLiquidity(
                            pair,
                            addressType,
                            hertzUserDetails.userHertzAddress,
                            currentUserAddress,
                            firstRewardAmount,
                            secondRewardAmount
                          );
                        })
                        .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  swal(
                    "Address not found",
                    "Please connect hertz wallet",
                    "warning"
                  );
                  reject(err);
                });
            })
            .catch((err) =>
              swal(
                "Address not found",
                "Please connect metamask wallet",
                "warning"
              )
            );
        }
        resolve();
      } else {
        reject();
      }
    });
  });
};
