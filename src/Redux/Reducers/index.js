const initialState = {
  NetworkId: null,
  NetworkName: "No Network",
  poolPair: "bshd_htz",
  tokenSymbol: "htz",
  account: "",
  username: "",
  token: "",
  tokens: null,
  // isSwapDisabled: true,
  isSwapDisabled: {
    condition: true,
    SwapSymbol: "HTZ",
    visible: true,
  },
  ERC20Swap_Visibility: true,
  htZbalance: "0.0 HTZ",
  tradeValue: 0,
  contract: null,
  htzContract: null,
  htzBEP20Balance: 0,
  htzSwapContract: null,
  htzBNBSwapContract: null,
  HTZ_to_ERC20Contract: null,
  isSufficientBalance: true,
  is2FAvisable: false,
  isTransaction: false,
  transcations: null,
  isClaimReward: false,
  isClaimRewardVisible: true,
  isTradeDisabled: true,
  isApproved: {
    isVisible: false,
    condition: false,
    success: false,
    isApprovedSwap: false,
    isClaim: false,
    isClaimVisible: false,
  },
  isSwapCurrerncyDisabled: false,
  metamaskBalance: 0,
  metamaskWalletAddress: "",
  TradeSymbol: {
    from: "HTZ",
    to: "HTZ BEP20",
  },
  isContractSwap: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Account details of user
    case "GET_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
        htZbalance: action.payload.balance,
        // htZbalance: 123,
      };
    case "METAMASK_ADDRESS":
      return {
        ...state,
        metamaskWalletAddress: action.payload.metamaskWalletAddress,
      };
    case "METAMASK_BALANCE":
      return {
        ...state,
        metamaskBalance: action.payload.metamaskBalance,
      };
    // Set Trade Value
    case "SET_TRADE_FROM_TO":
      return { ...state, tradeValue: action.payload };

    // Set Swap condition
    case "SET_SWAP":
      return {
        ...state,
        isSwapDisabled: {
          ...state.isSwapDisabled,
          condition: action.payload,
        },
      };

    //Set Contract Value
    case "SET_CONTRACT":
      return {
        ...state,
        contract: action.payload.contract,
        htzContract: action.payload.htzContract,
        metamaskBalance: action.payload.metamaskBalance,
        htzBEP20Balance: action.payload.htzBEP20Balance,
        metamaskWalletAddress: action.payload.metamaskWalletAddress,
        htzSwapContract: action.payload.htzSwapContract,
        htzBNBSwapContract: action.payload.htzBNBSwapContract,
      };

    //Transfer Token
    case "TRANSFER_TOKEN":
      return {
        ...state,
        contract: action.payload,
      };

    case "GET_SUFFICIENT_BALANCE":
      return {
        ...state,
        isSufficientBalance: action.payload,
      };
    case "GET_LOGIN_DETAILS":
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
        is2FAvisable: action.payload.is2FAvisable,
        isTradeDisabled: action.payload.isTradeDisabled,
      };
    case "TRANSFER_FROM_TO":
      return {
        ...state,
        isTransaction: action.payload.isTransaction,
        isTradeDisabled: action.payload.isTradeDisabled,
        isSwapDisabled: {
          ...state.isSwapDisabled,
          condition: action.payload.isSwapDisabled,
          visible: action.payload.isSwapDisabled_visible,
        },
        isClaimReward: action.payload.isClaimReward,
        isSwapCurrerncyDisabled: action.payload.isSwapCurrerncyDisabled,
      };
    case "CLAIM_HERTZ":
      return {
        ...state,
        isClaimReward: action.payload.isClaimReward,
        tradeValue: action.payload.tradeValue,
        isTradeDisabled: action.payload.isTradeDisabled,
        isSwapCurrerncyDisabled: action.payload.isSwapCurrerncyDisabled,
        isSwapDisabled: {
          ...state.isSwapDisabled,
          visible: action.payload.isSwapDisabled_visible,
        },
      };
    case "SWAP_CURRENCY":
      return {
        ...state,
        TradeSymbol: {
          from: action.payload.from,
          to: action.payload.to,
        },
        isSwapDisabled: {
          ...state.isSwapDisabled,
          visible: state.TradeSymbol.from !== "HTZ" ? true : false,
          isClaimRewardVisible: !state.isClaimRewardVisible,
        },

        isApproved: {
          ...state.isApproved,
          isVisible: state.TradeSymbol.from === "HTZ" ? true : false,
        },
      };
    case "APPROVE_CONTRACT":
      return {
        ...state,
        isApproved: {
          ...state.isApproved,
          isVisible: action.payload.isVisible,
          condition: action.payload.condition,
        },
      };

    case "APPROVE_CHECK":
      return {
        ...state,
        isApproved: {
          ...state.isApproved,
          success: action.payload.success,
          condition: action.payload.condition,
          isApprovedSwap: action.payload.isApprovedSwap,
        },
        isSwapCurrerncyDisabled: action.payload.isSwapCurrerncyDisabled,
        isTradeDisabled: action.payload.isTradeDisabled,
      };

    case "APPROVE_CONDITION":
      return {
        ...state,
        isApproved: {
          ...state.isApproved,
          condition: action.payload,
        },
      };
    case "HERTZ_SWAP":
      return {
        ...state,
        isApproved: {
          ...state.isApproved,
          success: action.payload.success,
          isClaim: action.payload.isClaim,
          isClaimVisible: action.payload.isClaimVisible,
          isVisable: action.payload.isApprovedVisable,
        },
        isTradeDisabled: action.payload.isTradeDisabled,
      };
    case "SWAP_CLAIM_HERTZ":
      return {
        ...state,
        isApproved: {
          ...state.isApproved,
          isClaim: action.payload.isClaim,
          isApprovedSwap: action.payload.isApprovedSwap,
          isClaimVisible: action.payload.isClaimVisible,
        },
        isSwapCurrerncyDisabled: action.payload.isSwapCurrerncyDisabled,
        tradeValue: action.payload.tradeValue,
        isTradeDisabled: action.payload.isTradeDisabled,
      };
    case "LOCAL_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
        username: action.payload.username,
        token: action.payload.token,
        htZbalance: action.payload.htZbalance,
        tokens: action.payload.tokens,
        is2FAvisable: false,
        isTradeDisabled: false,
      };
    case "DISCONNECT_ACCOUNT":
      return {
        NetworkId: null,
        NetworkName: "No Network",
        account: "",
        username: "",
        token: "",
        tokens: null,
        // isSwapDisabled: true,
        isSwapDisabled: {
          condition: true,
          SwapSymbol: "HTZ",
          visible: true,
        },
        htZbalance: "0.0 HTZ",
        tradeValue: 0,
        contract: null,
        htzContract: null,
        htzSwapContract: null,
        isSufficientBalance: true,
        is2FAvisable: false,
        isTransaction: false,
        transcations: null,
        isClaimReward: false,
        isClaimRewardVisible: true,
        isTradeDisabled: true,
        isApproved: {
          isVisible: false,
          condition: false,
          success: false,
          isApprovedSwap: false,
          isClaim: false,
          isClaimVisible: false,
        },
        isSwapCurrerncyDisabled: false,
        metamaskBalance: 0,
        metamaskWalletAddress: "",
        TradeSymbol: {
          from: "HTZ",
          to: "HTZ BEP20",
        },
        isContractSwap: false,
      };
    case "CURRENT_NETWORK":
      return {
        ...state,
        NetworkId: action.payload.NetworkId,
        NetworkName: action.payload.NetworkName,
        TradeSymbol: {
          ...state.TradeSymbol,
          to: action.payload.TradeSymbol_TO,
        },
      };

    case "SET_HTZ_TO_ERC20_CONTRACT":
      return {
        ...state,
        HTZ_to_ERC20Contract: action.payload.HTZ_to_ERC20Contract,
      };

    case "CHNAGE_NETWORK":
      return {
        ...state,
        isApproved: {
          isVisible: false,
          condition: false,
          success: false,
          isApprovedSwap: false,
          isClaim: false,
          isClaimVisible: false,
        },
      };

    case "HTZ_BALANCE_UPDATE":
      return {
        ...state,
        htZbalance: action.payload.htZbalance,
      };
    default:
      return state;
  }
};
