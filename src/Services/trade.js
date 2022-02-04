import $ from "jquery";
import { serverApi, updateHertzBalance } from "../Services/allFunction";
import swal, { swalAlert } from "sweetalert";
import { transferEthereum, transferEther } from "./farm";
import { getAccount } from "../Api/index";
import Web3 from "web3";
import {
  web3,
  getHertzUserDetails,
  getPair,
  checkPairExists,
  fromBal,
  getTotalPoolAmount,
  insertPairAmount,
  walletBalances,
  getEstimatedGasFees,
  getHertzOwner,
  currentDate,
} from "./allFunction";
import { store } from "../Redux/store";
import { HTZ_to_BNB, HTZ_to_BNB_ABI } from "../Contract/config";
// SWAPPING
export async function swapping() {
  var addressTypePair = $("#addressTypes").val();
  let addressType1 = addressTypePair.split("_")[0];
  let addressType2 = addressTypePair.split("_")[1];
  var payAmount = $("#recipientAddress").val();
  let feeAmount = $("#feeAmount").val();
  let slippage = $("#slippage").val();
  let currentPrice = $("#currentPrice").val();
  parseFloat(currentPrice).toFixed(4);

  let minimumReceived = 0;
  if (slippage != "") {
    let slippageAmount = (parseFloat(payAmount) / 100) * parseFloat(slippage);
    Number(slippageAmount).toFixed(4);
    minimumReceived = parseFloat(payAmount) - parseFloat(slippageAmount);

    console.log(
      `slippage ${slippage} slippage amount ${slippageAmount}  miniMumreceived ${minimumReceived} payAmount ${payAmount}`
    );
    console.log(slippage);
  }

  return new Promise((resolve, reject) => {
    getPair()
      .then((pair) => {
        let symbol1 = pair.split("_")[0];
        let symbol2 = pair.split("_")[1];
        let newPair = `${symbol2}_${symbol1}`;

        checkPairExists(pair)
          .then((tokenPair) => {
            fromBal()
              .then((fromBalance) => {
                let totalAmount =
                  parseFloat(fromBalance) - parseFloat(payAmount);

                if (parseFloat(fromBalance) > 0 && !isNaN(fromBalance)) {
                  console.log("check 1");

                  if (parseFloat(payAmount) >= Number(minimumReceived)) {
                    console.log("check 2");
                    console.log(addressTypePair);
                    console.log(pair);
                    console.log(fromBalance);
                    if (addressTypePair == "ethereum_hertz") {
                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          let symbol = pair.split("_")[1];
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerBalance) => {
                              console.log(ownerBalance);
                              console.log(payAmount);
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                console.log("test");
                                transferEthereum(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    transferHertz(
                                      pair,
                                      fromBalance,
                                      addressTypePair
                                    )
                                      .then((hertzResult) => {
                                        ethereumToHertz(
                                          pair,
                                          hertzResult,
                                          ethResult,
                                          currentPrice
                                        )
                                          .then((result) => {
                                            if (result.code == 1) {
                                              insertPairAmount(
                                                totalAmount,
                                                tokenPair
                                              )
                                                .then(console.log)
                                                .catch(console.log);
                                              swal(
                                                result.message,
                                                result.result,
                                                "success"
                                              );
                                            } else {
                                              swal(
                                                result.message,
                                                result.result,
                                                "warning"
                                              );
                                            }
                                          })
                                          .catch((err) => {
                                            console.log(err);
                                          });
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "hertz_ethereum") {
                      console.log("hertz ethereum");

                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerTokenBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerTokenBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEthereum(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    let symbol = pair.split("_")[0];
                                    // console.log(symbol);
                                    walletBalances()
                                      .then((balanceWithSymbol) => {
                                        let balance;
                                        if (symbol == "htz") {
                                          balance =
                                            balanceWithSymbol.result.split(
                                              " "
                                            )[0];
                                        } else {
                                          balanceWithSymbol.tokens.map(
                                            (Result) => {
                                              if (
                                                Result.symbol ===
                                                symbol.toUpperCase()
                                              ) {
                                                balance = Result.balance;
                                              }
                                            }
                                          );
                                        }

                                        if (
                                          parseFloat(balance) >=
                                          parseFloat(fromBalance)
                                        ) {
                                          getEstimatedGasFees()
                                            .then((estimatedGasCost) => {
                                              web3.eth
                                                .sendTransaction({
                                                  to: ethResult.ownerAddress,
                                                  from: ethResult.currentUserAddress,
                                                  gasPrice: "50000000000",
                                                  value: estimatedGasCost * 2,
                                                })
                                                .on(
                                                  "transactionHash",
                                                  function (hash) {
                                                    // swal("Transaction in process","Click on the clock icon to view your transaction status","success");

                                                    transferHertz(
                                                      pair,
                                                      fromBalance,
                                                      addressTypePair
                                                    )
                                                      .then((hertzResult) => {
                                                        hertzToEth(
                                                          pair,
                                                          hertzResult,
                                                          ethResult,
                                                          currentPrice
                                                        )
                                                          .then((result) => {
                                                            if (
                                                              result.code == 1
                                                            ) {
                                                              insertPairAmount(
                                                                totalAmount,
                                                                tokenPair
                                                              )
                                                                .then(
                                                                  console.log
                                                                )
                                                                .catch(
                                                                  console.log
                                                                );
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "success"
                                                              );
                                                            } else {
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "warning"
                                                              );
                                                            }
                                                          })
                                                          .catch((err) => {
                                                            console.log(err);
                                                          });
                                                      })
                                                      .catch((err) => {
                                                        console.log(
                                                          "Hertz transfer err: ",
                                                          err
                                                        );
                                                      });
                                                  }
                                                );
                                            })
                                            .catch((err) =>
                                              console.log(
                                                "Err while getting estimated gas price: ",
                                                err
                                              )
                                            );
                                        } else {
                                          swal(
                                            "Insuffient Balance",
                                            "You don't have enough balance",
                                            "warning"
                                          );
                                        }
                                      })
                                      .catch((err) => {
                                        swal(
                                          "Address not found",
                                          "Please connect hertz wallet",
                                          "warning"
                                        );
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "hertz_hertz") {
                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          let symbol = pair.split("_")[1];
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferHertz(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((result1) => {
                                    hertzToHertz(pair, result1, currentPrice)
                                      .then((result) => {
                                        if (result.code == 1) {
                                          insertPairAmount(
                                            totalAmount,
                                            tokenPair
                                          )
                                            .then(console.log)
                                            .catch(console.log);
                                          swal(
                                            result.message,
                                            result.result,
                                            "success"
                                          );
                                        } else {
                                          swal(
                                            result.message,
                                            result.result,
                                            "warning"
                                          );
                                        }
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "ether_hertz") {
                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          let symbol = pair.split("_")[1];
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEther(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    transferHertz(
                                      pair,
                                      fromBalance,
                                      addressTypePair
                                    )
                                      .then((hertzResult) => {
                                        etherToHertz(
                                          pair,
                                          hertzResult,
                                          ethResult,
                                          currentPrice
                                        )
                                          .then((result) => {
                                            if (result.code == 1) {
                                              insertPairAmount(
                                                totalAmount,
                                                tokenPair
                                              )
                                                .then(console.log)
                                                .catch(console.log);
                                              swal(
                                                result.message,
                                                result.result,
                                                "success"
                                              );
                                            } else {
                                              swal(
                                                result.message,
                                                result.result,
                                                "warning"
                                              );
                                            }
                                          })
                                          .catch((err) => {
                                            console.log(err);
                                          });
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "hertz_ether") {
                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerEtherBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerEtherBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEther(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    let symbol = pair.split("_")[0];
                                    // console.log(symbol);
                                    walletBalances()
                                      .then((balanceWithSymbol) => {
                                        let balance;
                                        if (symbol == "htz") {
                                          balance =
                                            balanceWithSymbol.result.split(
                                              " "
                                            )[0];
                                        } else {
                                          balanceWithSymbol.tokens.map(
                                            (Result) => {
                                              if (
                                                Result.symbol ===
                                                symbol.toUpperCase()
                                              ) {
                                                balance = Result.balance;
                                              }
                                            }
                                          );
                                        }

                                        if (
                                          parseFloat(balance) >=
                                          parseFloat(fromBalance)
                                        ) {
                                          getEstimatedGasFees()
                                            .then((estimatedGasCost) => {
                                              web3.eth
                                                .sendTransaction({
                                                  to: ethResult.ownerAddress,
                                                  from: ethResult.currentUserAddress,
                                                  gasPrice: "50000000000",
                                                  value: estimatedGasCost * 2,
                                                })
                                                .on(
                                                  "transactionHash",
                                                  function (hash) {
                                                    // swal("Transaction in process","Click on the clock icon to view your transaction status","success");

                                                    transferHertz(
                                                      pair,
                                                      fromBalance,
                                                      addressTypePair
                                                    )
                                                      .then((hertzResult) => {
                                                        hertzToEther(
                                                          pair,
                                                          hertzResult,
                                                          ethResult,
                                                          currentPrice
                                                        )
                                                          .then((result) => {
                                                            if (
                                                              result.code == 1
                                                            ) {
                                                              insertPairAmount(
                                                                totalAmount,
                                                                tokenPair
                                                              )
                                                                .then(
                                                                  console.log
                                                                )
                                                                .catch(
                                                                  console.log
                                                                );
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "success"
                                                              );
                                                            } else {
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "warning"
                                                              );
                                                            }
                                                          })
                                                          .catch((err) => {
                                                            console.log(err);
                                                          });
                                                      })
                                                      .catch((err) => {
                                                        console.log(
                                                          "Hertz transfer err: ",
                                                          err
                                                        );
                                                      });
                                                  }
                                                );
                                            })
                                            .catch((err) =>
                                              console.log(
                                                "Err while getting estimated gas price: ",
                                                err
                                              )
                                            );
                                        } else {
                                          swal(
                                            "Insuffient Balance",
                                            "You don't have enough balance",
                                            "warning"
                                          );
                                        }
                                      })
                                      .catch((err) => {
                                        swal(
                                          "Address not found",
                                          "Please connect hertz wallet",
                                          "warning"
                                        );
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "hertz_binance") {
                      getHertzUserDetails()
                        .then(() => {
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerTokenBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerTokenBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEthereum(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    let symbol = pair.split("_")[0];
                                    // console.log(symbol);
                                    walletBalances()
                                      .then((balanceWithSymbol) => {
                                        let balance;
                                        if (symbol == "htz") {
                                          balance =
                                            balanceWithSymbol.result.split(
                                              " "
                                            )[0];
                                        } else {
                                          balanceWithSymbol.tokens.map(
                                            (Result) => {
                                              if (
                                                Result.symbol ===
                                                symbol.toUpperCase()
                                              ) {
                                                balance = Result.balance;
                                              }
                                            }
                                          );
                                        }

                                        if (
                                          parseFloat(balance) >=
                                          parseFloat(fromBalance)
                                        ) {
                                          getEstimatedGasFees()
                                            .then((estimatedGasCost) => {
                                              web3.eth
                                                .sendTransaction({
                                                  to: ethResult.ownerAddress,
                                                  from: ethResult.currentUserAddress,
                                                  gasPrice: "50000000000",
                                                  value: estimatedGasCost * 2,
                                                })
                                                .on(
                                                  "transactionHash",
                                                  function (hash) {
                                                    // swal("Transaction in process","Click on the clock icon to view your transaction status","success");

                                                    transferHertz(
                                                      pair,
                                                      fromBalance,
                                                      addressTypePair
                                                    )
                                                      .then((hertzResult) => {
                                                        hertzToBinance(
                                                          pair,
                                                          hertzResult,
                                                          ethResult,
                                                          currentPrice
                                                        )
                                                          .then((result) => {
                                                            if (
                                                              result.code == 1
                                                            ) {
                                                              insertPairAmount(
                                                                totalAmount,
                                                                tokenPair
                                                              )
                                                                .then(
                                                                  console.log
                                                                )
                                                                .catch(
                                                                  console.log
                                                                );
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "success"
                                                              );
                                                            } else {
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "warning"
                                                              );
                                                            }
                                                          })
                                                          .catch((err) => {
                                                            console.log(err);
                                                          });
                                                      })
                                                      .catch((err) => {
                                                        console.log(
                                                          "Hertz transfer err: ",
                                                          err
                                                        );
                                                      });
                                                  }
                                                );
                                            })
                                            .catch((err) =>
                                              console.log(
                                                "Err while getting estimated gas price: ",
                                                err
                                              )
                                            );
                                        } else {
                                          swal(
                                            "Insuffient Balance",
                                            "You don't have enough balance",
                                            "warning"
                                          );
                                        }
                                      })
                                      .catch((err) => {
                                        swal(
                                          "Address not found",
                                          "Please connect hertz wallet",
                                          "warning"
                                        );
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "binance_hertz") {
                      getHertzUserDetails()
                        .then(() => {
                          let symbol = pair.split("_")[1];
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerBalance) => {
                              console.log(ownerBalance);

                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEthereum(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    transferHertz(
                                      pair,
                                      fromBalance,
                                      addressTypePair
                                    )
                                      .then((hertzResult) => {
                                        binanceToHertz(
                                          pair,
                                          hertzResult,
                                          ethResult,
                                          currentPrice
                                        )
                                          .then((result) => {
                                            if (result.code == 1) {
                                              insertPairAmount(
                                                totalAmount,
                                                tokenPair
                                              )
                                                .then(console.log)
                                                .catch(console.log);
                                              swal(
                                                result.message,
                                                result.result,
                                                "success"
                                              );
                                            } else {
                                              swal(
                                                result.message,
                                                result.result,
                                                "warning"
                                              );
                                            }
                                          })
                                          .catch((err) => {
                                            console.log(err);
                                          });
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => {
                              reject(err);
                            });
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "binance-coin_hertz") {
                      console.log("check 3");

                      //get hertz account details
                      getHertzUserDetails()
                        .then(() => {
                          console.log("check 4");

                          let symbol = pair.split("_")[1];
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerBalance) => {
                              console.log("check 5");
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEther(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    transferHertz(
                                      pair,
                                      fromBalance,
                                      addressTypePair
                                    )
                                      .then((hertzResult) => {
                                        bnbToHertz(
                                          pair,
                                          hertzResult,
                                          ethResult,
                                          currentPrice
                                        )
                                          .then((result) => {
                                            if (result.code == 1) {
                                              insertPairAmount(
                                                totalAmount,
                                                tokenPair
                                              )
                                                .then(console.log)
                                                .catch(console.log);
                                              swal(
                                                result.message,
                                                result.result,
                                                "success"
                                              );
                                            } else {
                                              swal(
                                                result.message,
                                                result.result,
                                                "warning"
                                              );
                                            }
                                          })
                                          .catch((err) => {
                                            console.log(err);
                                          });
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => console.log(err));
                    } else if (addressTypePair == "hertz_binance-coin") {
                      getHertzUserDetails()
                        .then(() => {
                          getTotalPoolAmount(newPair, symbol2)
                            .then((ownerEtherBalance) => {
                              if (
                                parseFloat(payAmount) <=
                                  parseFloat(ownerEtherBalance) &&
                                parseFloat(payAmount) > 0
                              ) {
                                transferEther(
                                  pair,
                                  fromBalance,
                                  addressTypePair
                                )
                                  .then((ethResult) => {
                                    // console.log(ethResult);
                                    let symbol = pair.split("_")[0];
                                    // console.log(symbol);
                                    walletBalances()
                                      .then((balanceWithSymbol) => {
                                        let balance;
                                        if (symbol == "htz") {
                                          balance =
                                            balanceWithSymbol.result.split(
                                              " "
                                            )[0];
                                          balance = balance.replace(/\,/g, "");
                                          console.log(balance);
                                        } else {
                                          balanceWithSymbol.tokens.map(
                                            (Result) => {
                                              if (
                                                Result.symbol ===
                                                symbol.toUpperCase()
                                              ) {
                                                balance = Result.balance;
                                                balance = balance.replace(
                                                  /\,/g,
                                                  ""
                                                );
                                              }
                                            }
                                          );
                                        }

                                        if (
                                          parseFloat(balance) >=
                                          parseFloat(fromBalance)
                                        ) {
                                          console.log(fromBalance);
                                          getEstimatedGasFees().then(
                                            async (estimatedGasCost) => {
                                              var web3 = new Web3(
                                                window.web3.currentProvider
                                              );

                                              let HTZ_to_BNB_CONTRACT =
                                                await new web3.eth.Contract(
                                                  HTZ_to_BNB_ABI,
                                                  HTZ_to_BNB
                                                );

                                              console.log(
                                                parseFloat(
                                                  window.tokenReceivedBNB
                                                ).toPrecision(4) *
                                                  10 ** 18
                                              );

                                              try {
                                                await HTZ_to_BNB_CONTRACT.methods
                                                  .BuyBNB(
                                                    parseFloat(
                                                      window.tokenReceivedBNB
                                                    ).toPrecision(4) *
                                                      10 ** 18
                                                  )
                                                  .send({
                                                    from: store.getState()
                                                      .metamaskWalletAddress,
                                                  })
                                                  .then((hash) => {
                                                    console.log(
                                                      "BNB",
                                                      hash.transactionHash
                                                    );
                                                    window.tokenReceivedBNB =
                                                      "";
                                                    // swal("Transaction in process","Click on the clock icon to view your transaction status","success");
                                                    transferHertz(
                                                      pair,
                                                      fromBalance,
                                                      addressTypePair
                                                    )
                                                      .then((hertzResult) => {
                                                        console.log(
                                                          "Hertz result ",
                                                          hertzResult
                                                        );
                                                        console.log(
                                                          "Hertz result ",
                                                          ethResult
                                                        );
                                                        hertzTobnb(
                                                          pair,
                                                          hertzResult,
                                                          ethResult,
                                                          currentPrice,
                                                          hash.transactionHash
                                                        )
                                                          .then((result) => {
                                                            if (
                                                              result.code == 1
                                                            ) {
                                                              insertPairAmount(
                                                                totalAmount,
                                                                tokenPair
                                                              )
                                                                .then(
                                                                  console.log
                                                                )
                                                                .catch(
                                                                  console.log
                                                                );
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "success"
                                                              );
                                                            } else {
                                                              swal(
                                                                result.message,
                                                                result.result,
                                                                "warning"
                                                              );
                                                            }
                                                          })
                                                          .catch((err) => {
                                                            console.log(err);
                                                          });
                                                      })
                                                      .catch((err) => {
                                                        console.log(
                                                          "Hertz transfer err: ",
                                                          err
                                                        );
                                                      });
                                                  });
                                              } catch (error) {
                                                swal(
                                                  "Something went wrong",
                                                  "Please try again later",
                                                  "warning"
                                                );
                                              }
                                            }
                                          );
                                        } else {
                                          swal(
                                            "Insuffient Balance",
                                            "You don't have enough balance",
                                            "warning"
                                          );
                                        }
                                      })
                                      .catch((err) => {
                                        swal(
                                          "Address not found",
                                          "Please connect hertz wallet",
                                          "warning"
                                        );
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              } else {
                                swal(
                                  "Transaction failed",
                                  "Please try again after sometime",
                                  "warning"
                                );
                              }
                            })
                            .catch((err) => reject(err));
                        })
                        .catch((err) => console.log(err));
                    }
                  } else {
                    swal(
                      "Transaction failed",
                      "Your received amount is greater then estimated amount",
                      "warning"
                    );
                  }
                } else {
                  reject(false);
                  swal({
                    title: "Invalid amount",
                    text: "Please enter a valid amount",
                    icon: "warning",
                    button: "ok",
                  });
                }
              })
              .catch((err) => reject(err));
          })
          .catch((err) => {
            reject(err);
            swal("Pair not found", "Please select a valid pair", "warning");
          });
      })
      .catch((err) => {
        reject(err);
        swal("Pair not found", "Please select token first", "warning");
      });
  });
}

// show swapping details by user address
window.showSwappingDetailsByUser = async function showSwappingDetailsByUser() {
  let pair = $("#selectedPair").val();
  var div = document.getElementById("swappingDetails");

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
      console.log("hertz");
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
      console.log("Eth");
      console.log(address1, address2);
    }

    if (address1 != "") {
      return new Promise((resolve, reject) => {
        div.innerHTML = `<tr><td colspan="7" class="text-center">Please connect wallet to see records</td></tr>`;

        let data = { pair: pair, address: address1 };

        fetch(`${serverApi.apiHost}/get-swapping-details-by-user-with-pair`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            var div = document.getElementById("swappingDetails");
            div.innerHTML = "";

            if (result.code == 1) {
              var addressTypes = document.getElementById("addressTypes").value;

              if (result.result.length) {
                var totalSwapping = 0;
                result.result.forEach((element) => {
                  totalSwapping += element.transactionAmount;
                  var pair = element.pair;
                  if (element.status == -1) {
                    div.innerHTML += `
                                   <tr class="text-color-danger">
                                   <td> ${element.pair.toUpperCase()}</td>
                                   <td> ${element.from_address} </td>
                                   <td> ${element.to_address} </td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_A
                                   } </span></td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_B == null
                                       ? "Pending"
                                       : element.transactionHash_B
                                   }</span> </td>
                                   <td> ${element.transactionAmount} </td>
                                   <td> Rejcted </td>
                                   </tr>`;
                  } else if (element.status == 0) {
                    div.innerHTML += `
                                   <tr class="text-color-warning">
                                   <td> ${element.pair.toUpperCase()}</td>
                                   <td> ${element.from_address} </td>
                                   <td> ${element.to_address} </td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_A
                                   }  </span></td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_B == null
                                       ? "Pending"
                                       : element.transactionHash_B
                                   } </span></td>
                                   <td> ${element.transactionAmount}</td>
                                   <td> Pending </td>
                                   </tr>`;
                  } else {
                    div.innerHTML += `
                                   <tr class="text-color-success">
                                   <td> ${element.pair.toUpperCase()}</td>
                                   <td> ${element.from_address} </td>
                                   <td> ${element.to_address} </td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_A
                                   } </span></td>
                                   <td><span class="trans_hash_id"> ${
                                     element.transactionHash_B == null
                                       ? "Pending"
                                       : element.transactionHash_B
                                   }</span> </td>
                                   <td> ${element.transactionAmount} </td>
                                   <td> Completed </td>
                                   </tr>`;
                  }
                });

                var div = document.getElementById("totalSwappingAmount");
                div.innerHTML = `<p>Total Swap: ${Number(totalSwapping).toFixed(
                  4
                )}</p>`;
                resolve(true);
              } else {
                div.innerHTML = `<tr><td colspan='7' class="text-center">No Records Found</td></tr>`;
                resolve(true);
              }
            } else {
              div.innerHTML = `<tr><td colspan='7' class="text-center">Pair have no records</td></tr>`;
              reject(false);
            }
          })
          .catch((err) => {
            div.innerHTML = `<tr><td colspan='7' class="text-center">Please connect wallet</td></tr>`;
            reject(err);
          });
      });
    } else {
      div.innerHTML = `<tr><td colspan='7' class="text-center">Please connect wallet</td></tr>`;
    }
  } else {
    div.innerHTML = `<tr><td colspan='7' class="text-center">Please select pair</td></tr>`;
  }
};

// swap ethereum to hertz
async function ethereumToHertz(pair, hertzResult, ethResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: ethResult.currentUserAddress,
      to_address: hertzResult.ownerHertzAddress,
      transactionHash_A: ethResult.transactionHash,
      amount: ethResult.amount,
      userHertzAddress: hertzResult.userHertzAddress,
      decimals: ethResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/ethereumToHertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap ether to hertz
async function etherToHertz(pair, hertzResult, ethResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: ethResult.currentUserAddress,
      to_address: hertzResult.ownerHertzAddress,
      transactionHash_A: ethResult.transactionHash,
      amount: ethResult.amount,
      userHertzAddress: hertzResult.userHertzAddress,
      decimals: ethResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/etherToHertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap hertz to eth
async function hertzToEther(pair, hertzResult, ethResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: hertzResult.userHertzAddress,
      to_address: ethResult.ownerAddress,
      transactionHash_A: hertzResult.transaction_id,
      amount: hertzResult.amount,
      symbol: hertzResult.symbol,
      token: hertzResult.userHertzToken,
      username: hertzResult.userHertzUsername,
      currentUserAddress: ethResult.currentUserAddress,
      decimals: ethResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };

    fetch(`${serverApi.apiHost}/HertztoEther`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap BNB to hertz
async function bnbToHertz(pair, hertzResult, bnbResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: bnbResult.currentUserAddress,
      to_address: hertzResult.ownerHertzAddress,
      transactionHash_A: bnbResult.transactionHash,
      amount: bnbResult.amount,
      userHertzAddress: hertzResult.userHertzAddress,
      decimals: bnbResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/bnbToHertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap hertz to BNB
async function hertzTobnb(
  pair,
  hertzResult,
  bnbResult,
  currentPrice,
  transaction_Hash_B
) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: hertzResult.userHertzAddress,
      to_address: bnbResult.ownerAddress,
      transactionHash_A: hertzResult.transaction_id,
      transactionHash_B: transaction_Hash_B,
      amount: hertzResult.amount,
      symbol: hertzResult.symbol,
      token: hertzResult.userHertzToken,
      username: hertzResult.userHertzUsername,
      currentUserAddress: bnbResult.currentUserAddress,
      decimals: bnbResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    console.log(data);

    fetch(`${serverApi.apiHost}/hertztoBnb`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}
/// swap hertz to hertz
async function hertzToHertz(pair, result, currentPrice) {
  return new Promise((resolve, reject) => {
    console.log(pair, result);
    let data = {
      pair: pair,
      from_address: result.userHertzAddress,
      to_address: result.hertzOwnerAddress,
      transactionHash_A: result.transaction_id,
      amount: result.amount,
      symbol: result.symbol,
      token: result.userHertzToken,
      username: result.userHertzUsername,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    fetch(`${serverApi.apiHost}/HertztoHertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}
// swap hertz to Binance
async function hertzToBinance(pair, hertzResult, binanceResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: hertzResult.userHertzAddress,
      to_address: binanceResult.ownerAddress,
      transactionHash_A: hertzResult.transaction_id,
      amount: hertzResult.amount,
      symbol: hertzResult.symbol,
      token: hertzResult.userHertzToken,
      username: hertzResult.userHertzUsername,
      currentUserAddress: binanceResult.currentUserAddress,
      decimals: binanceResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };

    fetch(`${serverApi.apiHost}/hertztoBinance`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap binance to hertz
async function binanceToHertz(pair, hertzResult, binanceResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: binanceResult.currentUserAddress,
      to_address: hertzResult.ownerHertzAddress,
      transactionHash_A: binanceResult.transactionHash,
      amount: binanceResult.amount,
      userHertzAddress: hertzResult.userHertzAddress,
      decimals: binanceResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };

    fetch(`${serverApi.apiHost}/binanceToHertz`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// swap hertz to eth
async function hertzToEth(pair, hertzResult, ethResult, currentPrice) {
  return new Promise((resolve, reject) => {
    let data = {
      pair: pair,
      from_address: hertzResult.userHertzAddress,
      to_address: ethResult.ownerAddress,
      transactionHash_A: hertzResult.transaction_id,
      amount: hertzResult.amount,
      symbol: hertzResult.symbol,
      token: hertzResult.userHertzToken,
      username: hertzResult.userHertzUsername,
      currentUserAddress: ethResult.currentUserAddress,
      decimals: ethResult.decimals,
      currentPrice: currentPrice,
      currentDate: currentDate,
    };
    console.log(data);
    fetch(`${serverApi.apiHost}/HertztoEthereum`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve({
            code: result.code,
            message: result.message,
            result: result.result,
          });
        } else if (result.code == 0) {
          reject();
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

async function transferHertz(pair, amount, addressTypePair) {
  let symbol1 = pair.split("_")[0];
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
                  let balance;
                  if (symbol1 == "htz") {
                    balance = balanceWithSymbol.result.split(" ")[0];
                    balance = balance.replace(/\,/g, "");
                  } else {
                    balanceWithSymbol.tokens.map((Result) => {
                      if (Result.symbol === symbol1.toUpperCase()) {
                        balance = Result.balance;
                        balance = balance.replace(/\,/g, "");
                      }
                    });
                  }
                  console.log(symbol1);
                  console.log(balance);
                  console.log(amount);

                  if (parseFloat(balance) >= parseFloat(amount)) {
                    console.log(
                      `${serverApi.hertzApiHost}/transfer?account=${
                        hertzUserDetails.userHertzAddress
                      }&to=${ownerHertzAddress}&amount=${amount}&symbol=${symbol1.toUpperCase()}`
                    );
                    fetch(
                      `${serverApi.hertzApiHost}/transfer?account=${
                        hertzUserDetails.userHertzAddress
                      }&to=${ownerHertzAddress}&amount=${amount}&symbol=${symbol1.toUpperCase()}`,
                      {
                        method: "POST",
                        headers: {
                          Authorization:
                            "Bearer " + hertzUserDetails.userHertzToken,
                        },
                      }
                    )
                      .then((response) => response.json())
                      .then(async (transferToken) => {
                        if (transferToken.error) {
                          swal(
                            "Transaction failed",
                            "Please enter valid amount",
                            "warning"
                          );
                          $("#loaderDiv").css("display", "none");
                          reject();
                        } else {
                          //For upadte Hertz balacne
                          await updateHertzBalance();
                          resolve({
                            userHertzUsername:
                              hertzUserDetails.userHertzUsername,
                            userHertzToken: hertzUserDetails.userHertzToken,
                            userHertzAddress: hertzUserDetails.userHertzAddress,
                            hertzOwnerAddress: ownerHertzAddress,
                            amount: amount,
                            symbol: symbol1,
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
                      });
                  } else {
                    swal(
                      "Insuffient Balance",
                      "You don't have enough balance",
                      "warning"
                    );
                  }
                })
                .catch((err) => {
                  reject("cannot get hertz wallet balance :", err);
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
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Cannot find hertz owner address", "warning");
      });
  });
}
