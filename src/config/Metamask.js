import Web3 from "web3";
import React from "react";
import { ethers } from "ethers";
import { ContractAddress, ContractABI } from "../Contract/config";
import { connect } from "react-redux";
import { SetContract } from "../Redux/Actions/index";

async function metamaskConnect() {
  //When metamask is Installed
  if (typeof window.ethereum !== "undefined") {
    alert("MetaMask is installed!");

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    var web3 = new Web3(window.ethereum);

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });

    window.account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
    if ((await web3.eth.getChainId()) === 56) {
      console.log("yess");
      //   console.log(this.state.changed);

      // Account Balance Check
    } else {
      this.setState({ changed: true });
      alert("Please switch ");
    }

    const signer = await provider.getSigner();

    //Get Account details from metamask
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const data = new ethers.Contract(ContractAddress, ContractABI, signer);

    console.log(data);
    // SetContract();

    //Create the contract
    // this.setState({
    //   address: account[0],
    //   contract: new ethers.Contract(ContractAddress, ContractABI, signer),
    //   isReward: true,
    // });

    // this.setState({
    //   address: account[0],
    // });
  } else {
    alert("MetaMask is not installed!");
  }
}
const mapDispatchToProps = {
  SetContract: SetContract,
};

export default connect(mapDispatchToProps)(metamaskConnect);
