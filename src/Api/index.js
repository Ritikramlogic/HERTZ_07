import { store } from "../Redux/store";
import axios from "axios";
// Get Token Details when user login
const BASE_URL = "https://api.hertz-network.com";
const INFO_URL = "http://ramlogics.com/backend/HERTZ_PHP/";

//Two factor Authentication
export async function do2FAuthentication(_code) {
  let _data;
  await fetch(BASE_URL + "/2fa/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
    },
    body: JSON.stringify({
      code: _code,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        _data = { error: data };
      } else {
        _data = { error: false };
      }
    });
  return _data;
}

//  Transfer HERTZ to user account and
export async function transferHertzToUser(
  accountFrom,
  address,
  symbol,
  amount
) {
  let _data;
  await fetch(
    BASE_URL +
      `/v1/transfer?account=${accountFrom}&to=${address}&amount=${amount}&symbol=${symbol.toUpperCase()}&memo=Testing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => (_data = data));
  return _data;
}

// Get Account Details of login user
export const getAccount = async () => {
  let _data;
  // v1/all
  // await fetch(BASE_URL + `/accounts/accounts`, {
  await fetch(BASE_URL + `/v1/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data[0];
      store.getState().tokens = _data.tokens;
    })
    .catch((e) => console.log(e));
  return _data;
};

//Transfer Token to other account

export const transferToken = async (data) => {
  let _data;
  _data = await fetch(BASE_URL + `/accounts/transfer`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.log({ heading: "Failed", body: "Please enable 2FA." });
    });
};

export const getLoginResponse = async (username, password) => {
  let _data;
  await fetch("https://api.hertz-network.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("TOKEN_AUTH", data.token);
      _data = data;
    })
    .catch((error) => console.log(error));
  return _data;
};

export async function getTransactionhistory() {
  let _data;
  await fetch(BASE_URL + "/v1/transactions?account=ramlogicsrit&symbol=HTZ", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
    },
  })
    .then((data) => data.json())
    .then((value) => (_data = value))
    .catch((err) => console.log(err));
  return _data;
}

export async function transferHertzFromAdminToUser(address, symbol, amount) {
  let _data;
  await fetch(
    BASE_URL +
      `/v1/transfer?account=ramlogicsabh&to=${address}&amount=${amount}&symbol=${symbol.toUpperCase()}&memo=Testing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("TOKEN_AUTH")}`,
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiaGlzaGVrLnNheGVuYUByYW1sb2dpY3MuY29tIiwiaWF0IjoxNjQwMDg1ODQxfQ.dTmudO0I5vC1WxEwSumvXAm5xYZ85rkxVZ1EWsj61Z0"}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => (_data = data));
  return _data;
}

export async function volData() {
  let _data;
  await fetch("https://ramlogics.com/backend/HERTZ_PHP/volData.php", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data;
    });
  return _data;
}

export async function TokenData() {
  let _data;
  await fetch("https://ramlogics.com/backend/HERTZ_PHP/topTokens.php", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data;
    });
  return _data;
}

export async function sumAmountAnalytics(symbol) {
  let _data;
  await fetch(INFO_URL + "/sum_amount_analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: symbol,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data;
    });
  return _data;
}

export async function TopPools() {
  let _data;
  await fetch("https://ramlogics.com/backend/HERTZ_PHP/topPools.php", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data;
    });
  return _data;
}

export async function TransacSwapping() {
  let _data;
  fetch("https://ramlogics.com/backend/HERTZ_PHP/TransSwapping.php", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      _data = data;
    });
  return _data;
}

export async function PoolInfo(pairData) {
  let _data;
  await fetch(
    "https://ramlogics.com/backend/HERTZ_PHP/topPoolsPairs.php?pair=" +
      pairData,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      _data = data;
      console.log(data);
    });
  return _data;
}

export async function TokenInfoPair(pairData) {
  let _data;
  await fetch(
    "https://ramlogics.com/backend/HERTZ_PHP/topTokenpair.php?pair=" + pairData,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      _data = data;
      console.log(data);
    });
  return _data;
}
