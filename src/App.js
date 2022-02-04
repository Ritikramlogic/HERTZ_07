import "./App.css";
import React, { useEffect } from "react";
import { store } from "./Redux/store";
import Routers from "./Router/route";
import { useDispatch } from "react-redux";
import { SetContract } from "./Redux/Actions";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("hertzAccount")) {
      let data = JSON.parse(localStorage.getItem("hertzAccount"));

      store.dispatch({
        type: "LOCAL_ACCOUNT",
        payload: {
          account: data.account,
          username: data.username,
          token: data.token,
          htZbalance: data.htZbalance,
          tokens: data.tokens,
        },
      });

      //when metamsk is true
      if (data.isMetamaskConnect) {
        setTimeout(() => {
          dispatch(SetContract());
        }, 1000);
      }
    }
  });
  return (
    <div className="App">
      <Routers />
      <button
        onClick={() => {
          console.log(store.getState());
        }}
      >
        Click me
      </button>
    </div>
  );
}

export default App;
