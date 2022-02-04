import $ from "jquery";
import { showAllFarmPlans } from "./farm";
import swal, { swalAlert } from "sweetalert";
import Web3 from "web3";
import { getAccount } from "../Api";

import { SetContract, SwapCurrency } from "../Redux/Actions";
import { store } from "../Redux/store";

export let serverApi = {
  apiHost: "https://ramlogics.com:9101",
  hertzApiHost: "https://api.hertz-network.com/v1",
};
export let provider = "";
/******** ethereum contract details**************************************/
export let ownerDetails = {
  abi: [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Burn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "limit", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "burnFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "nonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "permit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  ownerAddress: "0x41367F30f07cb55F684B1339D921999f7B8a76bD",
  contractAddress: "0x0F7E1E6C9b67972a0Ab31F47Ab3e94B60bE37D86",
};
/*********************************** ethereum contract end --------------------------------*/

/******** binance contract details**************************************/
export let binanceABi = [
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "uint8", name: "decimals_", type: "uint8" },
      { internalType: "uint256", name: "initialBalance_", type: "uint256" },
      { internalType: "address", name: "tokenOwner", type: "address" },
      {
        internalType: "address payable",
        name: "feeReceiver_",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "MintFinished", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approveAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "approveAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "finishMinting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintingFinished",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
    ],
    name: "recoverERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "transferAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "transferFromAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFromAndCall",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export let binancecontract = "0xb5BBA78B4dF2D47DD46078514a3e296AB3c344Fe";
export let binanceownerAddress = "0x41367F30f07cb55F684B1339D921999f7B8a76bD";

// Chain Ids
export const correctEthNetwork = 1;
export const correctBncNetwork = 56;
export let contractDecimal = "";
export let wallet;
export let web3;

// Checking the network connected or not
export var connectedNetwork = false;
export let connectedAccount;
export let metamaskcurrentBalance = 0.0;
let router;
export var today = new Date();
export var dd = String(today.getDate()).padStart(2, "0");
console.log(dd);
export var mm = String(today.getMonth() + 1).padStart(2, "0");
export var yyyy = today.getFullYear();
export let currentDate = `${yyyy}-${mm}-${dd}`;
// export let currentDate = `2022-03-06`;
export default function allFunction() {
  $(document).ready(() => {
    // // Showing the list of liquidity Pair tokens
    showMatchingSymbols("htz");
    // // SHOW TOKEN ON SWAP PAGE
    showMatchingLiquidityPair("htz", "hertz");
    // SHOW ALL FARM LIST
    showAllFarmPlans();
    // GET LATEST ESTIMATED GAS FEES
    getEstimatedGasFees();
  });
}
//function to add decimals
export const tokenDecimal = async () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts().then((accounts) => {
      ownerDetails.myContract.methods
        .decimals()
        .call({ from: accounts[0] })
        .then((decimals) => {
          resolve(decimals);
        })
        .catch(console.log);
    });
  });
};
const showCurrentNetwork = async (web3) => {
  //web3 = new window.Web3(window.ethereum);
  // console.log(web3);
  web3.eth.net.getId().then((netId) => {
    console.log(netId);
    let network;
    switch (netId) {
      // case 97:
      //   network = "BNB TestNet";
      //   break;
      // case 3:
      //   network = "ropsten";
      //   break;
      case 1:
        network = "Ethereum";
        break;
      case 56:
        network = "Binance";
        break;
      default:
        network = "Not Connected";
    }
    document.getElementById("showNetworkType").innerText = network;
  });
};

// MetaMask Connect functionality
export const connectMetaMask = async (provider) => {
  try {
    wallet = "Metamask";
    // provider = await window.web3.currentProvider;
    // window.ethereum.enable();

    connectWalletMetamask(provider);
  } catch (e) {
    return;
  }
};
// MetaMask connection
async function connectWalletMetamask(provider) {
  if (provider) {
    try {
      web3 = provider;
      let chainId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();
      connectedAccount = accounts[0];
      window.connectedAccount = connectedAccount;
      if (chainId === 1 || chainId === 3) {
        ownerDetails.myContract = new web3.eth.Contract(
          ownerDetails.abi,
          ownerDetails.contractAddress
        );
      } else if (chainId === 56 || chainId === 97) {
        ownerDetails.myContract = new web3.eth.Contract(
          binanceABi,
          binancecontract
        );
      }
      showHeaderDetails(connectedAccount);
      // showCurrentNetwork(web3);
      showCurrentBalance(web3);
      $(".modal-backdrop").removeClass("show");
      $("#exampleModalCenter").removeClass("show");
      $(".modal").css("display", "none");
      $(".modal-backdrop").css("display", "none");
      $("#ethNetwork").removeClass("text-danger");
      $("#ethNetwork").addClass("text-success");

      // document.querySelector("#btn-connect").style.display = "none";
      // document.querySelector("#btn-disconnect").style.display = "block";
    } catch (err) {
      console.log(err);
    }
  } else {
    swalAlert("error", "Not a Ethereum browser", "error");
  }
}

// Used to Check the Network change
window.ethereum._handleChainChanged = (e) => {
  if (connectedNetwork !== e.networkVersion) {
    if (JSON.parse(localStorage.getItem("hertzAccount"))) {
      let Connect = JSON.parse(localStorage.getItem("hertzAccount"));
      if (Connect.isMetamaskConnect === true) {
        console.log(store.getState().TradeSymbol.from);
        if (store.getState().TradeSymbol.from !== "HTZ") {
          store.dispatch(
            SwapCurrency(
              store.getState().TradeSymbol.to,
              store.getState().TradeSymbol.from
            )
          );
        }
        if (e.networkVersion == 1) {
          store.dispatch({
            type: "CURRENT_NETWORK",
            payload: {
              NetworkId: e.networkVersion,
              NetworkName: "Ethereum",
              TradeSymbol_TO: "HTZ ETH20",
            },
          });
          store.dispatch({ type: "CHNAGE_NETWORK" });
          store.dispatch(SetContract());
        } else if (e.networkVersion == 56) {
          store.dispatch({
            type: "CURRENT_NETWORK",
            payload: {
              NetworkId: e.networkVersion,
              NetworkName: "Binance",
              TradeSymbol_TO: "HTZ BEP20",
            },
          });
          store.dispatch({ type: "CHNAGE_NETWORK" });
          store.dispatch(SetContract());
        } else {
          store.dispatch({
            type: "CURRENT_NETWORK",
            payload: {
              NetworkId: e.networkVersion,
              NetworkName: "No Network",
            },
          });
          store.dispatch({ type: "CHNAGE_NETWORK" });
        }

        swalMainnet();
        connectedNetwork = e.networkVersion;
        updateSymbolList();
      }
    }
  }
};

// SHOW UPDATED SYMBOL LIST
export async function updateSymbolList() {
  let fetchURL = await fetch(`${serverApi.apiHost}/get-all-tokens`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  let response = await fetchURL.json();

  let symbol = $("#firstSymbol").val();
  document.getElementById("symbol1").innerHTML = "";
  document.getElementById("swapTokeList").innerHTML = "";
  document.getElementById("symbol2").innerHTML = "";

  document.getElementById("liquiditySymbol2").innerHTML = "";

  let swap = "";
  let liquidity = "";
  let MatchSymbol = "";

  response.result.map((Result) => {
    // console.log(Result);
    if (connectedNetwork == 3 || connectedNetwork == 1) {
      console.log("hgdjfkhkdjf", connectedNetwork);
      if (
        Result.address_type != "binance-coin" &&
        Result.address_type != "binance"
      ) {
        swap = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstList('${
          Result.tokens
        }','${Result.address_type}','${Result.image}')"><img src="${
          Result.image
        }" class="token_img_ss" alt="eth.png"  />  ${Result.tokens.toUpperCase()}</span>`;

        liquidity = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstLiquidityPair('${
          Result.tokens
        }','${Result.address_type}','${Result.image}')"><img src="${
          Result.image
        }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;

        if (symbol !== Result.tokens) {
          MatchSymbol = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
            Result.tokens
          }','${Result.address_type}','${Result.image}')"><img src="${
            Result.image
          }" class="token_img_ss" alt="eth.png"  /> ${Result.tokens.toUpperCase()}</span>`;
          document.getElementById("liquiditySymbol2").innerHTML += MatchSymbol;
          document.getElementById("symbol2").innerHTML += MatchSymbol;
          document.getElementById("symbol1").innerHTML += liquidity;
          document.getElementById("swapTokeList").innerHTML += swap;
        }
      }
    } else if (connectedNetwork == 97 || connectedNetwork == 56) {
      if (Result.address_type != "ethereum" && Result.address_type != "ether") {
        liquidity = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstLiquidityPair('${
          Result.tokens
        }','${Result.address_type}','${Result.image}')"><img src="${
          Result.image
        }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;
        swap = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstList('${
          Result.tokens
        }','${Result.address_type}','${Result.image}')"><img src="${
          Result.image
        }" class="token_img_ss" alt="eth.png"  />  ${Result.tokens.toUpperCase()}</span>`;

        if (symbol != Result.tokens) {
          MatchSymbol = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
            Result.tokens
          }','${Result.address_type}','${Result.image}')"><img src="${
            Result.image
          }" class="token_img_ss" alt="eth.png"  /> ${Result.tokens.toUpperCase()}</span>`;

          document.getElementById("liquiditySymbol2").innerHTML += MatchSymbol;
          document.getElementById("symbol2").innerHTML += MatchSymbol;
        }
        document.getElementById("symbol1").innerHTML += liquidity;
        document.getElementById("swapTokeList").innerHTML += swap;
      }
    } else {
      liquidity = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstLiquidityPair('${
        Result.tokens
      }','${Result.address_type}','${Result.image}')"><img src="${
        Result.image
      }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;
      swap = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="firstList('${
        Result.tokens
      }','${Result.address_type}','${Result.image}')"><img src="${
        Result.image
      }" class="token_img_ss" alt="eth.png"  />  ${Result.tokens.toUpperCase()}</span>`;
      if (symbol !== Result.tokens) {
        MatchSymbol = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
          Result.tokens
        }','${Result.address_type}','${Result.image}')"><img src="${
          Result.image
        }" class="token_img_ss" alt="eth.png"  /> ${Result.tokens.toUpperCase()}</span>`;
        document.getElementById("liquiditySymbol2").innerHTML += MatchSymbol;
        document.getElementById("symbol2").innerHTML += MatchSymbol;
      }
      document.getElementById("symbol1").innerHTML += liquidity;
      document.getElementById("swapTokeList").innerHTML += swap;
    }
  });
}

// Check the User Connecte to correct network or Not ! Display Swal Alert on Screen
export async function swalMainnet() {
  let web3 = new Web3(window.ethereum);
  const netId = web3.eth.net.getId();
  netId.then((result) => {
    if (result === correctEthNetwork || result === correctBncNetwork) {
      // swal.close();
      return;
    } else {
      swal({
        title: `Please Connect to the Correct Network!`,
        button: false,
        closeOnClickOutside: false,
      });
    }
  });
}
const showHeaderDetails = async (connectedAccount) => {
  console.log(connectedAccount);
  store.dispatch({
    type: "METAMASK_ADDRESS",
    payload: { metamaskWalletAddress: connectedAccount },
  });
  if (connectedAccount === undefined) {
    document.getElementById("walletAddress").innerText = "Not Connected";
    document.getElementById("metaMaskAccount").value = "Not Connected";
  } else {
    document.getElementById("walletAddress").innerText =
      connectedAccount.toLowerCase();
    document.getElementById("metaMaskAccount").value =
      connectedAccount.toLowerCase();
  }
};

const showCurrentBalance = async (web3) => {
  web3.eth
    .getBalance(connectedAccount)
    .then((balance) => {
      let currentBalance = web3.utils.fromWei(balance, "ether");
      // console.log(currentBalance)
      document.getElementById("showBalance").innerText =
        parseFloat(currentBalance).toFixed(4);
      store.dispatch({
        type: "METAMASK_BALANCE",
        payload: { metamaskBalance: parseFloat(currentBalance).toFixed(4) },
      });
      metamaskcurrentBalance = currentBalance;

      let localData = JSON.parse(localStorage.getItem("hertzAccount"));

      // update next Time
      localStorage.setItem(
        "hertzAccount",
        JSON.stringify({
          ...localData,
          isMetamaskConnect: true,
          // account: data.account,
          // token: store.getState().token,
          // username: store.getState().username,
          // htZbalance: data.balance,
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
// get current address / user
export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    if (connectedAccount !== (null || "" || undefined)) {
      resolve(connectedAccount);
    } else {
      reject(false);
    }
  });
}

// get current hertz user details
export async function getHertzUserDetails() {
  // var account = $("#account").val();
  // var username = $("#username").val();
  // var token = $("#token").val();

  var account = store.getState().account;
  var username = store.getState().username;
  var token = store.getState().token;
  return new Promise((resolve, reject) => {
    if (
      account !== (undefined || null || "") &&
      username !== (undefined || null || "") &&
      token !== (undefined || null || "")
    ) {
      resolve({
        userHertzAddress: account,
        userHertzUsername: username,
        userHertzToken: token,
      });
    } else {
      reject(false);
      swal({ title: "Please connect hertz wallet", button: false });
    }
  });
}

export async function insertPairAmount(amount, pair) {
  return new Promise((resolve, reject) => {
    let data = { amount: amount, pair: pair, time: currentDate };
    fetch(`${serverApi.apiHost}/insert-pair-amount`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.result === true) {
          resolve(1);
        } else if (result.result === false) {
          resolve(0);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// get the latest estimated gas fees
export async function getEstimatedGasFees() {
  return new Promise((resolve, reject) => {
    fetch(`${serverApi.apiHost}/get-estimated-fees`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code == 1) {
          resolve(result.result[0].estimateGasPrice);
        } else if (result.code == 0) {
          reject(result.code);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ####################### HERTZ USER FUNCTION END ####################################

// ############################# OWNER FUNCTIONS ################################

// GET THE OWNER ADDRESS
export async function ownerAddress() {
  return new Promise((resolve, reject) => {
    if (ownerDetails.myContract !== null) {
      resolve(ownerDetails.ownerAddress);
    } else {
      reject();
      swal("Address not found", "Please connect metamask", "warning");
    }
  });
}
//get hertz owner address
export async function getHertzOwner() {
  return new Promise((resolve, reject) => {
    fetch(`${serverApi.apiHost}/get-hertz-owner`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((address) => {
        resolve(address.result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
// balances
export async function walletBalances() {
  return new Promise((resolve, reject) => {
    getHertzUserDetails()
      .then((hertzUserDetails) => {
        fetch(
          `${serverApi.hertzApiHost}/balance?account=${hertzUserDetails.userHertzAddress}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + hertzUserDetails.userHertzToken,
            },
          }
        )
          .then((response) => response.json())
          .then((balanceDetails) => {
            resolve({
              result: balanceDetails.HTZ,
              tokens: balanceDetails.tokens,
            });
          })
          .catch((err) => {
            console.log("wallet balance is not fetching", err);
            reject(err);
          });
      })
      .catch((err) => {
        swal("Address not found", "Please connect hertz wallet", "warning");
        reject(err);
      });
  });
}

// TOKEN LIST IN LIQUIDITY ON PAGE LOAD
export function showMatchingSymbols(symbol) {
  let data = { symbol: symbol };

  fetch(`${serverApi.apiHost}/get-matching-symbols`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      document.getElementById("symbol2").innerHTML = "";

      result.result.map((Result) => {
        if (Result.token_B_symbols != symbol) {
          if (connectedNetwork == 3 || connectedNetwork == 1) {
            if (
              Result.address_type_2 != "binance-coin" &&
              Result.address_type_2 != "binance"
            ) {
              let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondList('${
                Result.token_B_symbols
              }','${Result.address_type_2}','${Result.token_image_2}')">
                <img src="${
                  Result.token_image_2
                }" class="token_img_ss" alt="eth.png"/> ${Result.token_B_symbols.toUpperCase()}</span>`;
              document.getElementById("symbol2").innerHTML += p2;
            }
          } else if (connectedNetwork == 97 || connectedNetwork == 56) {
            if (
              Result.address_type_2 != "ethereum" &&
              Result.address_type_2 != "ether"
            ) {
              let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondList('${
                Result.token_B_symbols
              }','${Result.address_type_2}','${Result.token_image_2}')">
                <img src="${
                  Result.token_image_2
                }" class="token_img_ss" alt="eth.png"/> ${Result.token_B_symbols.toUpperCase()}</span>`;
              document.getElementById("symbol2").innerHTML += p2;
            }
          }
        } else {
          let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondList('${
            Result.token_B_symbols
          }','${Result.address_type_2}','${Result.token_image_2}')">
          <img src="${
            Result.token_image_2
          }" class="token_img_ss" alt="eth.png"/> ${Result.token_B_symbols.toUpperCase()}</span>`;
          document.getElementById("symbol2").innerHTML += p2;
        }
      });
    })
    .catch((err) => {
      console.log("Err while getting matching pairs", err);
    });
}
// FIRST TOKEN LIST IN LIQUIDITY PAGE
window.firstList = function firstList(symbol1, address_type_2, imageURL) {
  $("#firstSymbol").val(symbol1);
  $("#pairArea1").html("");
  $("#pairArea1").html(
    `<span id="symbolImage1"><img src="${imageURL}" class="token_img_ss" alt="eth.png" /></span>&nbsp;<span id="currencySymbol1">${symbol1.toUpperCase()}</span>&nbsp; <i class="far fa-angle-down"></i>`
  );
  $("#pairArea2").html(
    `<span id="symbolImage2"><p class="mb-0">Select a token</p></span>&nbsp;<span id="currencySymbol2"></span> &nbsp; <i class="far fa-angle-down"></i>`
  );
  showMatchingSymbols(symbol1);
  $("#fromBalance").val("");
  $("#recipientAddress").val("");
  $("#Fees").text(0);
  $("#tokenPrice").text(0);
  $("#spreadFees").text(0);
  $(".amountGet").val("");
  $("#LiquidityProviderFee").text(0);
  $("#swapErrorMessage").text("");
};

// SECOND TOKEN LIST IN LIQUIDITY PAGE
window.secondList = function secondList(symbol2, address_type_2, imageURL) {
  $("#secondSymbol").val(symbol2);
  $("#pairArea2").html("");
  $("#pairArea2").html(
    `<span id="symbolImage2"><img src="${imageURL}" class="token_img_ss" alt="eth.png" /></span>&nbsp;<span id="currencySymbol2">${symbol2.toUpperCase()}</span>&nbsp; <i class="far fa-angle-down"></i>`
  );
  //get the pair in hidden input box
  let symbol1 = $("#firstSymbol").val();
  let pair = "".concat(symbol1, "_", symbol2.toLowerCase());
  $("#selectedPair").val(pair);
  getAddressTypes(pair).then().catch();
  $("#Fees").text(0);
  $("#tokenPrice").text(0);
  $("#spreadFees").text(0);
  $("#fromBalance").val("");
  $(".amountGet").val("");
  $("#LiquidityProviderFee").text(0);
  $("#swapErrorMessage").text("");
};

// TOKEN LIST IN SWAP ON PAGE LOAD
const showMatchingLiquidityPair = async (symbol, address_type) => {
  console.log(symbol, address_type);

  fetch(`${serverApi.apiHost}/get-all-tokens`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      document.getElementById("liquiditySymbol2").innerHTML = "";
      result.result.map((Result) => {
        if (Result.tokens !== symbol) {
          if (
            address_type == "ethereum" ||
            address_type == "ether" ||
            address_type == "binance" ||
            address_type == "binance-coin"
          ) {
            if (Result.tokens === "htz") {
              let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
                Result.tokens
              }','${Result.address_type}','${Result.image}')"><img src="${
                Result.image
              }" class="token_img_ss" alt="eth.png"  /> ${Result.tokens.toUpperCase()}</span>`;
              document.getElementById("liquiditySymbol2").innerHTML += p2;
            }
          } else if (symbol != "htz" && address_type == "hertz") {
            if (
              Result.address_type !== "ethereum" &&
              Result.address_type !== "ether" &&
              Result.address_type !== "binance-coin" &&
              Result.address_type !== "binance"
            ) {
              if (Result.tokens == "htz") {
                let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
                  Result.tokens
                }','${Result.address_type}','${Result.image}')"><img src="${
                  Result.image
                }" class="token_img_ss" alt="eth.png"  /> ${Result.tokens.toUpperCase()}</span>`;
                document.getElementById("liquiditySymbol2").innerHTML += p2;
              }
            }
          } else if (symbol == "htz") {
            if (Result.tokens != symbol) {
              if (connectedNetwork == 3 || connectedNetwork == 1) {
                if (
                  Result.address_type !== "binance-coin" &&
                  Result.address_type !== "binance"
                ) {
                  let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
                    Result.tokens
                  }','${Result.address_type}','${Result.image}')"><img src="${
                    Result.image
                  }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;
                  document.getElementById("liquiditySymbol2").innerHTML += p2;
                }
              } else if (connectedNetwork == 97 || connectedNetwork == 56) {
                if (
                  Result.address_type !== "ethereum" &&
                  Result.address_type !== "ether"
                ) {
                  let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${
                    Result.tokens
                  }','${Result.address_type}','${Result.image}')"><img src="${
                    Result.image
                  }" class="token_img_ss" alt="eth.png" />  ${Result.tokens.toUpperCase()}</span>`;
                  document.getElementById("liquiditySymbol2").innerHTML += p2;
                }
              } else {
                let p2 = `<span class="pairsWithSymbol" data-dismiss="modal" onclick="secondLiquiditySymbols('${Result.tokens}','${Result.address_type}','${Result.image}')"><img src="${Result.image}" class="token_img_ss" alt="eth.png" />  $Result.tokens.toUpperCase()}</span>`;
                document.getElementById("liquiditySymbol2").innerHTML += p2;
              }
            }
          }
        }
      });
    })
    .catch((err) => {
      console.log("Err while getting matching pairs", err);
    });
};

// FIRST TOKEN LIST IN SWAP
window.firstLiquidityPair = function firstLiquidityPair(
  symbol1,
  address_type1,
  imageURL
) {
  console.log(symbol1, address_type1);

  $("#firstSymbol").val(symbol1);
  $("#pairArea1").html("");
  $("#pairArea1").html(
    `<span id="symbolImage1"><img src="${imageURL}" class="token_img_ss" alt="eth.png" /></span>&nbsp;<span id="currencySymbol1">${symbol1.toUpperCase()}</span>&nbsp; <i class="far fa-angle-down"></i>`
  );
  $("#pairArea2").html(
    `<span id="symbolImage2"><p class="mb-0">Select a token</p></span>&nbsp;<span id="currencySymbol2"></span> &nbsp; <i class="far fa-angle-down"></i>`
  );
  showMatchingLiquidityPair(symbol1, address_type1);
  getTokenAddress(symbol1)
    .then((result) => {
      $("#firstAddressType").val(result[0].address_type);
    })
    .catch((err) => console.log(err));
};

// SECOND TOKEN LIST IN SWAP
window.secondLiquiditySymbols = function secondLiquiditySymbols(
  symbol2,
  address_type2,
  imageURL
) {
  // for liquidity input
  $("#firstTokenAmount").val("");
  $("#secondTokenAmount").val("");
  $("#secondSymbol").val(symbol2);
  $("#pairArea2").html("");
  $("#pairArea2").html(
    `<span id="symbolImage2"><img src="${imageURL}" class="token_img_ss" alt="eth.png" /></span>&nbsp;<span id="currencySymbol2">${symbol2.toUpperCase()}</span>&nbsp; <i class="far fa-angle-down"></i>`
  );
  //get the pair in hidden input box
  let symbol1 = $("#firstSymbol").val();

  $("#fromBalance").val(0);
  $("#Fees").text(0);
  $("#tokenPrice").text(0);
  $("#spreadFees").text(0);
  $(".amountGet").val(0);
  $("#LiquidityProviderFee").text(0);
  $("#tokenPriceImpact").text(0);

  let pair = "".concat(symbol1, "_", symbol2.toLowerCase());
  $("#selectedPair").val(pair);
  getTokenAddress(symbol2)
    .then((result) => {
      $("#secondAddressType").val(result[0].address_type);
      let addressType1 = $("#firstAddressType").val();
      $("#addressTypes").val(`${addressType1}_${result[0].address_type}`);
      var selectedPair = document.getElementById("selectedPair").value;
      var addressTypes = document.getElementById("addressTypes").value;
      var showSwappingDetailsBtn = document.querySelector(
        "#showSwappingDetails"
      );
      var showTotalLiquidityBtn = document.querySelector(
        "#showTotalLiquidityBtn"
      );
      getPerTokenPayable(pair, addressTypes).then().catch();

      if (selectedPair != (undefined || null || "")) {
        addressType1 = addressTypes.split("_")[0];

        // CHANGE FUNCTION FOR SWAPPING PAGE

        if (addressType1 == "ethereum") {
          if (showSwappingDetailsBtn !== null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                showSwappingDetailsBtn.setAttribute(
                  "onclick",
                  `showSwappingDetailsByUser('${currentUserAddress}','${selectedPair}')`
                );
              })
              .catch((err) => console.log(err));
          }
        } else if (addressType1 == "hertz") {
          if (showSwappingDetailsBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showSwappingDetailsBtn.setAttribute(
                      "onclick",
                      `showSwappingDetailsByUser('${hertzUserDetails.userHertzAddress}','${selectedPair}')`
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        } else if (addressType1 == "ether") {
          if (showSwappingDetailsBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                showSwappingDetailsBtn.setAttribute(
                  "onclick",
                  `showSwappingDetailsByUser('${currentUserAddress}','${selectedPair}')`
                );
              })
              .catch((err) => console.log(err));
          }
        }

        // CHANGE FUNCTION FOR LIQUIDITY PAGE
        if (addressTypes == "hertz_ethereum") {
          if (showTotalLiquidityBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showTotalLiquidityBtn.setAttribute(
                      "onclick",
                      `showLiquidityByAddressAndPair('${selectedPair}','${hertzUserDetails.userHertzAddress}','${currentUserAddress}')`
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        } else if (addressTypes == "ethereum_hertz") {
          if (showTotalLiquidityBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showTotalLiquidityBtn.setAttribute(
                      "onclick",
                      `showLiquidityByAddressAndPair('${selectedPair}','${currentUserAddress}','${hertzUserDetails.userHertzAddress}')`
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        } else if (addressTypes == "ether_hertz") {
          if (showTotalLiquidityBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showTotalLiquidityBtn.setAttribute(
                      "onclick",
                      `showLiquidityByAddressAndPair('${selectedPair}','${currentUserAddress}','${hertzUserDetails.userHertzAddress}')`
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        } else if (addressTypes == "hertz_ether") {
          if (showTotalLiquidityBtn != null) {
            getCurrentUser()
              .then((currentUserAddress) => {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showTotalLiquidityBtn.setAttribute(
                      "onclick",
                      `showLiquidityByAddressAndPair('${selectedPair}','${hertzUserDetails.userHertzAddress}','${currentUserAddress}')`
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        } else if (addressTypes == "hertz_hertz") {
          if (showTotalLiquidityBtn != null) {
            getHertzUserDetails()
              .then((hertzUserDetails) => {
                showTotalLiquidityBtn.setAttribute(
                  "onclick",
                  `showLiquidityByAddressAndPair('${selectedPair}','${hertzUserDetails.userHertzAddress}','${hertzUserDetails.userHertzAddress}')`
                );
              })
              .catch((err) => console.log(err));
          }
        }
      }
    })
    .catch((err) => console.log(err));
};
//To Get From input Balance
export async function fromBal() {
  return new Promise((resolve, reject) => {
    let fromInputBalance = document.getElementById("fromBalance").value;
    if (fromInputBalance > 0 || fromInputBalance >= ownerDetails.myContract) {
      resolve(fromInputBalance);
      document.getElementById("recipientAddress").value = "";
      document.getElementById("fromBalance").value = "";
      document.getElementById("Fees").innerHTML = 0;
      document.getElementById("tokenPriceImpact").innerHTML = 0;
      document.getElementById("tokenPrice").innerHTML = 0;
    } else {
      swal({
        title: "Invalid Amount",
        text: "Please enter a valid amount",
        icon: "warning",
        button: "ok",
      });
      reject(false);
    }
  });
}

//  TOTAL LIQUIDITY POOL AMOUNT
export async function getTotalPoolAmount(pair, symbol) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair, symbol: symbol };

    fetch(`${serverApi.apiHost}/get-pool-amount/`, {
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
//get address types
export async function getAddressTypes(pair) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair };
    fetch(`${serverApi.apiHost}/get-address-types`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.result.length) {
          let addressType = "".concat(
            result.result[0].address_type_1,
            "_",
            result.result[0].address_type_2
          );
          $("#addressTypes").val(addressType);
          var selectedPair = document.getElementById("selectedPair").value;
          var addressTypes = document.getElementById("addressTypes").value;
          var showSwappingDetailsBtn = document.querySelector(
            "#showSwappingDetails"
          );
          var showTotalLiquidityBtn = document.querySelector(
            "#showTotalLiquidityBtn"
          );
          getPerTokenPayable(pair, addressType).then().catch();
          if (selectedPair != (undefined || null || "")) {
            let addressType1 = addressTypes.split("_")[0];
            // CHANGE FUNCTION FOR SWAPPING PAGE
            if (addressType1 == "ethereum") {
              if (showSwappingDetailsBtn !== null) {
                getCurrentUser()
                  .then((currentUserAddress) => {
                    showSwappingDetailsBtn.setAttribute(
                      "onclick",
                      `showSwappingDetailsByUser('${currentUserAddress}','${selectedPair}')`
                    );
                  })
                  .catch((err) => console.log(err));
              }
            } else if (addressType1 == "hertz") {
              if (showSwappingDetailsBtn !== null) {
                getCurrentUser()
                  .then((currentUserAddress) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails) => {
                        showSwappingDetailsBtn.setAttribute(
                          "onclick",
                          `showSwappingDetailsByUser('${hertzUserDetails.userHertzAddress}','${selectedPair}')`
                        );
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            } else if (addressType1 == "ether") {
              if (showSwappingDetailsBtn != null) {
                getCurrentUser()
                  .then((currentUserAddress) => {
                    showSwappingDetailsBtn.setAttribute(
                      "onclick",
                      `showSwappingDetailsByUser('${currentUserAddress}','${selectedPair}')`
                    );
                  })
                  .catch((err) => console.log(err));
              }
            }
            // CHANGE FUNCTION FOR LIQUIDITY PAGE
            if (addressTypes == "ether_hertz") {
              if (showTotalLiquidityBtn != null) {
                getCurrentUser()
                  .then((currentUserAddress) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails) => {
                        showTotalLiquidityBtn.setAttribute(
                          "onclick",
                          `showLiquidityByAddressAndPair('${selectedPair}','${currentUserAddress}','${hertzUserDetails.userHertzAddress}')`
                        );
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            } else if (addressTypes == "hertz_ether") {
              if (showTotalLiquidityBtn != null) {
                getCurrentUser()
                  .then((currentUserAddress) => {
                    getHertzUserDetails()
                      .then((hertzUserDetails) => {
                        showTotalLiquidityBtn.setAttribute(
                          "onclick",
                          `showLiquidityByAddressAndPair('${selectedPair}','${hertzUserDetails.userHertzAddress}','${currentUserAddress}')`
                        );
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            } else if (addressTypes == "hertz_hertz") {
              if (showTotalLiquidityBtn != null) {
                getHertzUserDetails()
                  .then((hertzUserDetails) => {
                    showTotalLiquidityBtn.setAttribute(
                      "onclick",
                      `showLiquidityByAddressAndPair('${selectedPair}','${hertzUserDetails.userHertzAddress}','${hertzUserDetails.userHertzAddress}')`
                    );
                  })
                  .catch((err) => console.log(err));
              }
            }
          }
          resolve(result.result);
        } else {
          reject(false);
        }
      })
      .catch((err) => {
        swal("Pair not found", "Please select a valid pair", "warning");
      });
  });
}
async function getTokenAddress(symbol) {
  return new Promise((resolve, reject) => {
    let data = { symbol: symbol };
    fetch(`${serverApi.apiHost}/get-token-addressType`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        resolve(result.result);
      })
      .catch((err) => {
        console.log("Err while getting matching pairs", err);
      });
  });
}

// GET PAYABLE AMOUNT OF PER TOKEN
export async function getPerTokenPayable(pair, addressType) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair, addressType: addressType };
    fetch(`${serverApi.apiHost}/get-payable-of-per-token`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        if (result.code === 1) {
          let symbol1 = pair.split("_")[0];
          let symbol2 = pair.split("_")[1];
          $("#payableAmountDiv").css("display", "block");

          if (
            result.result.firstTokenPayableAmount === 0 &&
            result.result.secondTokenPayableAmount === 0
          ) {
            $("#firstLiquidityProvider").text(
              "You are the first liquidity provider"
            );

            $("#payableAmountDiv").css("display", "none");

            let firstInputAmount = $("#firstTokenAmount").val();
            let secondInputAmount = $("#secondTokenAmount").val();

            if (
              parseFloat(secondInputAmount) > 0 &&
              parseFloat(firstInputAmount) > 0
            ) {
              $("#firstTokenWithPair").text(
                Number(firstInputAmount / secondInputAmount).toFixed(4)
              );
              $("#secondTokenWithPair").text(
                Number(secondInputAmount / secondInputAmount).toFixed(4)
              );
            } else {
              $("#firstTokenWithPair").text("-");
              $("#secondTokenWithPair").text("-");
            }
            $("#secondTokenPayableAmount").text(
              `${symbol1.toUpperCase()} per ${symbol2.toUpperCase()} `
            );
            $("#firstTokenPayableAmount").text(
              `${symbol2.toUpperCase()} per ${symbol1.toUpperCase()} `
            );
          } else {
            $("#firstLiquidityProvider").text("");

            $("#firstTokenWithPair").text(
              `${Number(result.result.firstTokenPayableAmount).toFixed(4)}`
            );
            $("#secondTokenWithPair").text(
              `${Number(result.result.secondTokenPayableAmount).toFixed(4)}`
            );
            $("#secondTokenPayableAmount").text(
              `${symbol2.toUpperCase()} per ${symbol1.toUpperCase()} `
            );
            $("#firstTokenPayableAmount").text(
              `${symbol1.toUpperCase()} per ${symbol2.toUpperCase()} `
            );
          }
          resolve(result);
        } else {
          $("#payableAmountDiv").css("display", "none");
        }
      })
      .catch((err) => reject(err));
  });
}

// ############################ SOME OTHER FUNCTIONS #############################

// GENERATE RANDOM
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateString(length = 8) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// ############################ MASTER FUNCTIONS END ############################

// ############################## USER WALLET FUNCTIONS #########################

// get current user balance
export async function getCurrentUserBalance() {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((userAddress) => {
        web3.eth
          .getBalance(userAddress)
          .then((balance) => {
            let currentBalance = web3.utils.fromWei(balance, "ether");
            console.log("wallet balance :", currentBalance);
            resolve(currentBalance);
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      })
      .catch((err) => {
        swal("Address not found", "Please connect metamask", "warning");
        reject(err);
      });
  });
}

// get current user balance
export async function getCurrentUserTokenBalance() {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((userAddress) => {
        tokenDecimal()
          .then((decimals) => {
            ownerDetails.myContract.methods
              .balanceOf(userAddress)
              .call()
              .then((balance) => {
                let finalValue = (balance / 10 ** decimals).toFixed(decimals);
                resolve(finalValue);
              })
              .catch((err) => {
                console.log("Err while getting token balance :", err);
                reject();
              });
          })
          .catch((err) => {
            reject("Token decimal not found:", err);
          });
      })
      .catch((err) => {
        reject(err);
        swal("Address not found", "Please connect metamask", "warning");
      });
  });
}
// check pair
export async function checkPairExists(pair) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair };
    fetch(`${serverApi.apiHost}/check-pair`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.result.length) {
          resolve(result.result);
        } else {
          reject(result.result);
        }
      })
      .catch((err) => {
        reject(err);
        swal("Pair not found", "Please select a valid pair", "warning");
      });
  });
}
// get the dynamic pairs
export async function getPair() {
  return new Promise((resolve, reject) => {
    let symbol1 = $("#firstSymbol").val();
    let symbol2 = $("#secondSymbol").val();

    console.log(symbol1, symbol2);
    if (
      symbol1 !== (undefined || null || "") &&
      symbol2 != (undefined || null || "")
    ) {
      let pair = "".concat(symbol1, "_", symbol2);
      resolve(pair);
    } else {
      reject("No pair found");
    }
  });
}

//get swapping fees
export async function getSwappingFees(pair) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair };
    fetch(`${serverApi.apiHost}/get-swapping-fee-details`, {
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
            fees: result.result.fees,
            spreadFee: result.result.spread_fee,
          });
        } else if (result.code == 0) {
          reject(result.result.message);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// GET LIQUIDITY PAIR POOL DETAILS
export async function getLiquidityPoolDetails(pair) {
  return new Promise((resolve, reject) => {
    let data = { pair: pair };
    fetch(`${serverApi.apiHost}/get-liquidity-pool-details`, {
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
          reject(result.result);
        }
      })
      .catch((err) => console.log(err));
  });
}

export async function updateHertzBalance() {
  //for update Hertz balance
  let AccountDetails = await getAccount();
  console.log(AccountDetails.balance);
  store.dispatch({
    type: "HTZ_BALANCE_UPDATE",
    payload: {
      htZbalance: AccountDetails.balance,
    },
  });
  if (localStorage.getItem("hertzAccount")) {
    let JSONdata = JSON.parse(localStorage.getItem("hertzAccount"));
    // update next Time
    JSONdata.htZbalance = AccountDetails.balance;
    localStorage.setItem("hertzAccount", JSON.stringify(JSONdata));
  }
}
