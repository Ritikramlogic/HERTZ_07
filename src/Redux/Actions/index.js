import {
  getAccount,
  transferToken,
  getLoginResponse,
  do2FAuthentication,
  transferHertzToUser,
  getTransactionhistory,
  transferHertzFromAdminToUser,
} from "../../Api/index";
import Web3 from "web3";
import swal, { swalAlert } from "sweetalert";
import { ethers } from "ethers";
import { store } from "../store";
import $ from "jquery";
import {
  ContractAddress,
  ContractABI,
  HTZContractAddress,
  HTZContractAbi,
  HTZSwapContractAbi,
  HTZSwapContractAddress,
  HTZ_to_ERC20_ABI,
  HTZ_to_ERC20,
} from "../../Contract/config";
import {
  connectedAccount,
  connectMetaMask,
  metamaskcurrentBalance,
  ownerDetails,
} from "../../Services/allFunction";

var BridgeTran = [];
//Get user account details
export const GetAccount = () => async (dispatch) => {
  const data = await getAccount();
  console.log(data);

  dispatch({
    type: "GET_ACCOUNT",
    payload: {
      account: data.account,
      balance: data.balance,
    },
  });
};

//Get user account details
export const TradeFromTO = (tradeValue) => (dispatch) => {
  if (tradeValue === "") {
    dispatch({
      type: "SET_TRADE_FROM_TO",
      payload: 0,
    });
  } else {
    dispatch({
      type: "SET_TRADE_FROM_TO",
      payload: tradeValue,
    });
  }
};

// set Swap Button Value
export const SetSwap = (value) => (dispatch) => {
  dispatch({
    type: "SET_SWAP",
    payload: value,
  });
};

//Check sufficient amount
export const GetsufficientBalance = (value) => (dispatch) => {
  dispatch({
    type: "GET_SUFFICIENT_BALANCE",
    payload: value,
  });
};

//Set Contract data
export const SetContract = () => async (dispatch) => {
  //When metamask is Installed
  let data, htzContract, htzBEP20Balance, htzSwapContract, htzBNBSwapContract;
  //For ETH NETWORK

  let currentProvider = new Web3(window.web3.currentProvider);
  console.log("====================================");
  console.log(await currentProvider.eth.getChainId());
  console.log("====================================");
  if (
    store.getState().NetworkId == 1 ||
    (await currentProvider.eth.getChainId()) == 1
  ) {
    let HTZ_TO_ERC20_Contract;
    try {
      var web3 = new Web3(window.web3.currentProvider);
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = await provider.getSigner();
      console.log(provider, signer);
      HTZ_TO_ERC20_Contract = new ethers.Contract(
        HTZ_to_ERC20,
        HTZ_to_ERC20_ABI,
        signer
      );
      console.log(HTZ_TO_ERC20_Contract);
      store.dispatch({
        type: "CURRENT_NETWORK",
        payload: {
          NetworkId: 1,
          NetworkName: "Ethereum",
          TradeSymbol_TO: "HTZ ETH20",
        },
      });
      store.dispatch({ type: "CHNAGE_NETWORK" });
      connectMetaMask(web3);

      store.getState().htzBEP20Balance = 0;
    } catch (err) {
      console.log("err");
    }
    dispatch({
      type: "SET_HTZ_TO_ERC20_CONTRACT",
      payload: {
        HTZ_to_ERC20Contract: HTZ_TO_ERC20_Contract,
      },
    });
  }
  // For BNB NETWORK
  else if (
    store.getState().NetworkId == 56 ||
    (await currentProvider.eth.getChainId()) == 56
  ) {
    try {
      // if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // var web3 = new Web3(window.ethereum);
      var web3 = new Web3(window.web3.currentProvider);
      window.account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = await provider.getSigner();
      //Get Account details from metamask
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      data = new ethers.Contract(ContractAddress, ContractABI, signer);
      htzContract = await new web3.eth.Contract(
        HTZContractAbi,
        HTZContractAddress
      );
      htzSwapContract = new ethers.Contract(
        HTZSwapContractAddress,
        HTZSwapContractAbi,
        signer
      );
      htzBNBSwapContract = new ethers.Contract(
        ContractAddress,
        ContractABI,
        signer
      );
      console.log(htzBNBSwapContract);
      // console.log(await htzSwapContract.checkContractAddress());
      htzBEP20Balance =
        (await htzContract.methods.balanceOf(account[0]).call()) / 10 ** 4;
      connectMetaMask(web3);
      store.dispatch({
        type: "CURRENT_NETWORK",
        payload: {
          NetworkId: 56,
          NetworkName: "Binance",
          TradeSymbol_TO: "HTZ BEP20",
        },
      });
      store.dispatch({ type: "CHNAGE_NETWORK" });
      // }
    } catch (e) {
      swalAlert("error", "Not a Ethereum browser", "error");
    }
    dispatch({
      type: "SET_CONTRACT",
      payload: {
        contract: data,
        htzContract: htzContract,
        metamaskWalletAddress: connectedAccount,
        htzBEP20Balance: parseFloat(htzBEP20Balance).toFixed(4),
        htzSwapContract: htzSwapContract,
        htzBNBSwapContract: htzBNBSwapContract,
      },
    });
  }
};

//Tranfer Token
export const TransferToken = () => async (dispatch) => {
  const data = await transferToken();
  dispatch({
    type: "TRANSFER_TOKEN",
    payload: true,
  });
};

// Get User account details
export const GetLoginDetails = (username, password) => async (dispatch) => {
  const Value = await getLoginResponse(username, password);

  if (Value.error !== "User not found") {
    console.log("====================================");
    console.log("TOKEN", Value.token);
    console.log("====================================");
    dispatch({
      type: "GET_LOGIN_DETAILS",
      payload: {
        token: Value.token,
        username: username,
        is2FAvisable: true,
        code: null,
        isTradeDisabled: false,
      },
    });
  } else {
    document.getElementById("usernotfound").innerHTML = "User not found";
    document.getElementById("usernotfound").style.color = "red";
    dispatch({
      type: "GET_LOGIN_DETAILS",
      payload: {
        username: "",
        code: null,
        is2FAvisable: false,
      },
    });
  }
};

export const is2FAvisableChanged = () => async (dispatch) => {
  dispatch({
    type: "GET_LOGIN_DETAILS",
    payload: {
      is2FAvisable: false,
    },
  });
};

// user 2 Factor Authentication
export const TwoFactorAuthentication = (code) => async (dispatch) => {
  try {
    let value = await do2FAuthentication(code);
    console.log(value.error);
    if (value.error !== false) {
      const data = await getAccount();
      console.log(data);
      let isMetamaskConnect = false;
      if (JSON.parse(localStorage.getItem("hertzAccount"))) {
        isMetamaskConnect = true;
      }
      // update next Time
      localStorage.setItem(
        "hertzAccount",
        JSON.stringify({
          account: data.account,
          token: store.getState().token,
          username: store.getState().username,
          htZbalance: data.balance,
          isMetamaskConnect: isMetamaskConnect,
          tokens: data.tokens,
        })
      );
      dispatch({
        type: "GET_ACCOUNT",
        payload: {
          account: data.account,
          balance: data.balance,
        },
      });
      window.$("#HertzModalCenter").modal("hide");
      window.$("#ConnectModal").modal("hide");
      window.$(".modal-backdrop .fade .show").remove();
    } else {
      swal(
        "Authentication has Faild",
        "Please Enter correct 2FA pin",
        "warning"
      );
    }
  } catch (err) {
    swal("Authentication has Faild", "Please Enter correct 2FA pin", "warning");
  }
};

//HERTZ Trasfer to user
export const TransferHertzToUser =
  (accountFrom, account, symbol, amount) => async (dispatch) => {
    console.log(account);
    console.log(symbol);
    console.log(amount);
    console.log(accountFrom);
    let ContractBalance,
      data = false;
    if (store.getState().NetworkId == 1) {
      console.log(store.getState().HTZ_to_ERC20Contract.address);
      ContractBalance =
        (await ownerDetails.myContract.methods
          .balanceOf(store.getState().HTZ_to_ERC20Contract.address)
          .call()) / 10000;
      console.log(ContractBalance);
      if (ContractBalance > amount) {
        data = await transferHertzToUser(accountFrom, account, symbol, amount);
      }
    } else if (store.getState().NetworkId == 56) {
      ContractBalance =
        (await store
          .getState()
          .htzContract.methods.balanceOf(store.getState().contract.address)
          .call()) / 10000;
      if (ContractBalance > amount) {
        data = await transferHertzToUser(accountFrom, account, symbol, amount);
      }
    }

    if (data !== false) {
      console.log(data);
      let tran = {
        pair: $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
        symbol: symbol,
        transaction: data.transaction_id,
        ammount: amount,
        status: "complete",
      };

      console.log(tran);
      if (!localStorage.getItem("bridgeTranHistory")) {
        BridgeTran.push(tran);
        localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
      } else {
        BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
        BridgeTran.push(tran);
        localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
      }
    }

    if (data.error === "Transaction failed") {
      swal("Invalid Ammount ", "Your transaction is not complete", "warning");
      dispatch({
        type: "TRANSFER_FROM_TO",
        payload: {
          isTransaction: false,
          isSwapDisabled: false,
          isClaimReward: false,
          isTradeDisabled: false,
          isSwapDisabled_visible: true,
        },
      });
    } else if (data === false) {
      swal(
        "Insufficent Balance ",
        "Your transaction is not complete",
        "warning"
      );
    } else {
      // alert("Transaction is successfully complete");
      dispatch({
        type: "TRANSFER_FROM_TO",
        payload: {
          isTransaction: true,
          isSwapDisabled: true,
          isClaimReward: true,
          isTradeDisabled: true,
          isSwapCurrerncyDisabled: true,
          isSwapDisabled_visible: false,
        },
      });

      const Acountdata = await getAccount();
      console.log(Acountdata);
      store.dispatch({
        type: "LOCAL_ACCOUNT",
        payload: {
          htZbalance: Acountdata.balance,
          tokens: Acountdata.tokens,
        },
      });
      if (localStorage.getItem("hertzAccount")) {
        let JSONdata = JSON.parse(localStorage.getItem("hertzAccount"));
        // update next Time
        JSONdata.htZbalance = Acountdata.balance;
        JSONdata.tokens = Acountdata.tokens;
        localStorage.setItem("hertzAccount", JSON.stringify(JSONdata));
      }

      dispatch({
        type: "GET_ACCOUNT",
        payload: {
          account: Acountdata.account,
          balance: Acountdata.balance,
        },
      });
    }
  };

export const ClaimHertz = (contract, amount) => async (dispatch) => {
  let _data;

  try {
    await contract
      .buyToken(amount * Math.pow(10, 4))
      .then((data) => (_data = data))
      .catch((e) => {
        if (e.code === 4001) {
          _data = false;
        }
      });
    // alert(`This is the Transaction Hash: ${_data.hash}`);

    if (_data !== false) {
      const data = await getAccount();
      let tran = {
        pair: $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
        symbol: $("#currencySymbol2").text(),
        transaction: _data.hash,
        ammount: amount,
        status: "complete",
      };
      BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
      BridgeTran.push(tran);
      localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
      console.log(_data);
      console.log("META:", tran);
      dispatch({
        type: "CLAIM_HERTZ",
        payload: {
          isClaimReward: false,
          tradeValue: 0,
          isTradeDisabled: false,
          isSwapCurrerncyDisabled: false,
          isSwapDisabled_visible: true,
        },
      });
      dispatch({
        type: "GET_ACCOUNT",
        payload: {
          account: data.account,
          balance: data.balance,
        },
      });
      swal(
        "Transaction in Process",
        "Your transaction will be reflected in sometime",
        "success"
      );
    } else {
      swal("You Denied Transaction", "Something went Wrong", "warning");
      dispatch({
        type: "CLAIM_HERTZ",
        payload: {
          isClaimReward: false,
          tradeValue: 0,
          isTradeDisabled: false,
          isSwapCurrerncyDisabled: false,
          isSwapDisabled_visible: true,
        },
      });
    }
  } catch (err) {
    swal("Transaction in Faild", "Your transaction is not complete", "warning");
  }
};

//for HTZ to ERC20
export const HTZ_to_ERC20Claim = (contract, amount) => async (dispatch) => {
  let _data;
  console.log(contract, amount);
  try {
    await contract
      .BuyHTZ_ERC20(amount * Math.pow(10, 4))
      .then((data) => (_data = data))
      .catch((e) => {
        if (e.code === 4001) {
          _data = false;
        }
      });
    // alert(`This is the Transaction Hash: ${_data.hash}`);

    if (_data !== false) {
      const data = await getAccount();
      let tran = {
        pair: $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
        symbol: $("#currencySymbol2").text(),
        transaction: _data.hash,
        ammount: amount,
        status: "complete",
      };
      BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
      BridgeTran.push(tran);
      localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
      console.log(_data);
      console.log("META:", tran);
      dispatch({
        type: "CLAIM_HERTZ",
        payload: {
          isClaimReward: false,
          tradeValue: 0,
          isTradeDisabled: false,
          isSwapCurrerncyDisabled: false,
          isSwapDisabled_visible: true,
        },
      });
      dispatch({
        type: "GET_ACCOUNT",
        payload: {
          account: data.account,
          balance: data.balance,
        },
      });
      swal(
        "Transaction in Process",
        "Your transaction will be reflected in sometime",
        "success"
      );
    } else {
      swal("You Denied Transaction", "Something went Wrong", "warning");
      dispatch({
        type: "CLAIM_HERTZ",
        payload: {
          isClaimReward: false,
          tradeValue: 0,
          isTradeDisabled: false,
          isSwapCurrerncyDisabled: false,
          isSwapDisabled_visible: true,
        },
      });
    }
  } catch (err) {
    swal("Transaction in Faild", "Your transaction is not complete", "warning");
  }
};

export const ERC20_to_HTZClaim = (contract, amount) => async (dispatch) => {
  console.log(contract, amount);
  let OwnerAmount;
  await fetch(`https://ramlogics.com:9101/getOwnerHertzBalance`, {
    method: "POST",
    body: JSON.stringify({ symbol: "htz" }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      OwnerAmount = data.result;
      console.log(data);
    });
  console.log(OwnerAmount);

  try {
    if (OwnerAmount < amount) {
      swal(
        "Something went wrong",
        "Please try again after sometime",
        "warning"
      );
    } else if (
      (await ownerDetails.myContract.methods
        .balanceOf(store.getState().metamaskWalletAddress)
        .call()) /
        10000 >
      amount
    ) {
      ownerDetails.myContract.methods
        .transfer(
          "0xAf80DB1B7ce3247275fe98BB007b1165BFA98aCf",
          amount * 10 ** 4
        )
        .send({ from: "0xAf80DB1B7ce3247275fe98BB007b1165BFA98aCf" })
        .on("transactionHash", function (hash) {
          console.log(hash);
          store.getState().ERC20Swap_Visibility = false;
          let tran = {
            pair:
              $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
            symbol: $("#currencySymbol1").text(),
            transaction: hash,
            ammount: amount,
            status: "complete",
          };

          console.log(tran);
          if (!localStorage.getItem("bridgeTranHistory")) {
            BridgeTran.push(tran);
            localStorage.setItem(
              "bridgeTranHistory",
              JSON.stringify(BridgeTran)
            );
          } else {
            BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
            BridgeTran.push(tran);
            localStorage.setItem(
              "bridgeTranHistory",
              JSON.stringify(BridgeTran)
            );
          }
          dispatch({
            type: "HERTZ_SWAP",
            payload: {
              success: false,
              isClaim: true,
              isClaimVisible: true,
              isTradeDisabled: true,
              isApprovedVisable: false,
            },
          });
        })
        .on("error", function (error, receipt) {
          swal("Transaction failed", "User denied the transaction", "warning");
          dispatch({
            type: "SWAP_CLAIM_HERTZ",
            payload: {
              isClaim: false,
              isSwapCurrerncyDisabled: false,
              tradeValue: 0,
              isApprovedSwap: false,
              isTradeDisabled: false,
              isClaimVisible: false,
            },
          });
        });
    } else {
      swal(
        "Something went wrong",
        "Please try again after sometime",
        "warning"
      );
      dispatch({
        type: "SWAP_CLAIM_HERTZ",
        payload: {
          isClaim: false,
          isSwapCurrerncyDisabled: false,
          tradeValue: 0,
          isApprovedSwap: false,
          isTradeDisabled: false,
          isClaimVisible: false,
        },
      });
      store.getState().ERC20Swap_Visibility = true;
    }
  } catch (err) {
    console.log(err);
  }
};
// for ERC20 to HTZ

//Check transcation hgistory of payment
export const TranscationStatus = () => async (dispatch) => {
  let data = await getTransactionhistory();
  return data;
};

// Swap Currency
export const SwapCurrency = (fromSymbol, toSymbol) => async (dispatch) => {
  dispatch({
    type: "SWAP_CURRENCY",
    payload: { from: fromSymbol, to: toSymbol },
  });
};

//Contract Approve Check
export const ApproversCheck = (HTZcontract, amount) => async (dispatch) => {
  const account = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  console.log(account[0]);

  let _data;
  try {
    await HTZcontract.methods
      .approve(HTZSwapContractAddress, amount * 10 ** 4)
      .send({ from: account[0] })
      .then((data) => (_data = data))
      .catch((err) => {
        console.log("Error", err);
        if (err.code === 4001) {
          _data = { error: false };
        } else {
          _data = { error: true };
        }
        console.log(_data.error);
      });

    if (_data.error !== false) {
      dispatch({
        type: "APPROVE_CHECK",
        payload: {
          condition: false,
          success: true,
          isApprovedSwap: true,
          isTradeDisabled: true,
          isSwapCurrerncyDisabled: true,
        },
      });
    } else {
      dispatch({
        type: "APPROVE_CHECK",
        payload: {
          condition: false,
          success: false,
          isApprovedSwap: false,
          isTradeDisabled: false,
          isSwapCurrerncyDisabled: false,
        },
      });
    }
  } catch (err) {
    swal("Invalid Ammount ", "Your transaction is not complete", "warning");
  }
};

export const ApproveCondition = (value) => async (dispatch) => {
  dispatch({
    type: "APPROVE_CONDITION",
    payload: value,
  });
};

export const HertzSwap = (contract, amount) => async (dispatch) => {
  let OwnerAmount;
  await fetch(`https://ramlogics.com:9101/getOwnerHertzBalance`, {
    method: "POST",
    body: JSON.stringify({ symbol: "htz" }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      OwnerAmount = data.result;
      console.log(data);
    });
  console.log(OwnerAmount);
  try {
    if (OwnerAmount < amount) {
      swal(
        "Something went wrong",
        "Please try again after sometime",
        "warning"
      );
    } else if (parseFloat(store.getState().htzBEP20Balance) > amount) {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let _data;
      console.log(account[0]);

      await contract
        .hertzSwap(amount * 10 ** 4)
        .then((data) => {
          _data = data;
          // alert(`This is the Transaction Hash: ${data.hash}`);
        })
        .catch((err) => {
          if (err.code === 4001) {
            _data = false;
          }
        });
      console.log(_data);
      if (_data !== false) {
        let tran = {
          pair:
            $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
          symbol: $("#currencySymbol1").text(),
          transaction: _data.hash,
          ammount: amount,
          status: "complete",
        };

        console.log(tran);
        if (!localStorage.getItem("bridgeTranHistory")) {
          BridgeTran.push(tran);
          localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
        } else {
          BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
          BridgeTran.push(tran);
          localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
        }
        dispatch({
          type: "HERTZ_SWAP",
          payload: {
            success: false,
            isClaim: true,
            isClaimVisible: true,
            isTradeDisabled: true,
            isApprovedVisable: false,
          },
        });
      } else {
        dispatch({
          type: "HERTZ_SWAP",
          payload: {
            success: true,
            isClaim: false,
            isClaimVisible: false,
            isTradeDisabled: false,
          },
        });
        dispatch({
          type: "SWAP_CLAIM_HERTZ",
          payload: {
            isClaim: false,
            isSwapCurrerncyDisabled: false,
            tradeValue: 0,
            isApprovedSwap: false,
            isTradeDisabled: false,
            isClaimVisible: false,
          },
        });
      }
    } else {
      swal(
        "Something went wrong",
        "Please try again after sometime",
        "warning"
      );
      dispatch({
        type: "SWAP_CLAIM_HERTZ",
        payload: {
          isClaim: false,
          isSwapCurrerncyDisabled: false,
          tradeValue: 0,
          isApprovedSwap: false,
          isTradeDisabled: false,
          isClaimVisible: false,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const SwapClaimHertz = (username, amount) => async (dispatch) => {
  let data = await transferHertzFromAdminToUser(username, "HTZ", amount);
  console.log(data);
  let tran = {
    pair: $("#currencySymbol1").text() + "_" + $("#currencySymbol2").text(),
    symbol: $("#currencySymbol2").text(),
    transaction: data.transaction_id,
    ammount: amount,
    status: "complete",
  };
  if (data.error === "Transaction failed") {
    swal("Transaction in Faild", "Your transaction is not complete", "warning");
    store.getState().ERC20Swap_Visibility = true;
    dispatch({
      type: "SWAP_CLAIM_HERTZ",
      payload: {
        isClaim: false,
        isSwapCurrerncyDisabled: false,
        tradeValue: 0,
        isApprovedSwap: false,
        isTradeDisabled: false,
        isClaimVisible: false,
      },
    });
  } else {
    swal(
      "Transaction in Process",
      "Your transaction will be reflected in sometime",
      "success"
    );

    console.log(tran);
    if (!localStorage.getItem("bridgeTranHistory")) {
      BridgeTran.push(tran);
      localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
    } else {
      BridgeTran = JSON.parse(localStorage.getItem("bridgeTranHistory"));
      BridgeTran.push(tran);
      localStorage.setItem("bridgeTranHistory", JSON.stringify(BridgeTran));
    }
    dispatch({
      type: "SWAP_CLAIM_HERTZ",
      payload: {
        isClaim: false,
        isSwapCurrerncyDisabled: false,
        tradeValue: 0,
        isApprovedSwap: false,
        isTradeDisabled: false,
        isClaimVisible: false,
      },
    });
    store.getState().ERC20Swap_Visibility = true;
    const data = await getAccount();

    console.log(data);

    store.dispatch({
      type: "LOCAL_ACCOUNT",
      payload: {
        htZbalance: data.balance,
      },
    });
    if (localStorage.getItem("hertzAccount")) {
      let JSONdata = JSON.parse(localStorage.getItem("hertzAccount"));
      // update next Time
      JSONdata.htZbalance = data.balance;
      localStorage.setItem("hertzAccount", JSON.stringify(JSONdata));
    }
    dispatch({
      type: "GET_ACCOUNT",
      payload: {
        account: data.account,
        balance: data.balance,
      },
    });
  }
};

export const DisconnectAccount = () => async (dispatch) => {
  localStorage.removeItem("hertzAccount");
  document.getElementById("walletAddress").innerText = "Address";
  dispatch({
    type: "DISCONNECT_ACCOUNT",
  });
};
