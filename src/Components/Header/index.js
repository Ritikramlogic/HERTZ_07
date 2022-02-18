import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { _2FAuthenticationModal } from "./_2FAuthenticationModal";
import { HertzModal } from "./HertzModal";
import { connect } from "react-redux";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

import {
  SetContract,
  GetLoginDetails,
  TwoFactorAuthentication,
  is2FAvisableChanged,
  DisconnectAccount,
} from "../../Redux/Actions";
import {
  connectWalletConnect,
  updateHertzBalance,
} from "../../Services/allFunction";
import { store } from "../../Redux/store";

function mapStateToProps(state) {
  return {
    account: state.account,
    htZbalance: state.htZbalance,
    is2FAvisable: state.is2FAvisable,
    contract: state.contract,
    metamaskBalance: state.metamaskBalance,
    metamaskWalletAddress: state.metamaskWalletAddress,
    NetworkName: state.NetworkName,
    tokens: state.tokens,
  };
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      _2FAcode: null,
      is2FAvisableChanged: false,
      hertzValue: {
        balance: 0,
      },
    };

    this.usernameChanged = this.usernameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.Login = this.Login.bind(this);
    this.is2FAvisableChanged = this.is2FAvisableChanged.bind(this);
    this.CodeChange = this.CodeChange.bind(this);
  }

  componentDidMount() {
    document
      .getElementById("dropdownMenuButton")
      .addEventListener("click", async () => await updateHertzBalance());
  }

  //Two factor Aucthetication Code
  CodeChange(e) {
    this.setState({ _2FAcode: e.target.value });
  }

  //Change State of 2FA visable
  is2FAvisableChanged() {
    window.$("#HertzModalCenter").modal("hide");
    window.$("#ConnectModal").modal("hide");
    window.$(".modal-backdrop").remove();
  }

  //Password Change
  usernameChanged(e) {
    this.setState({ username: e.target.value });
  }

  //Password Change
  passwordChanged(e) {
    this.setState({ password: e.target.value });
  }

  //Login button
  async Login() {
    await this.props.GetLoginDetails(this.state.username, this.state.password);
  }
  render() {
    return (
      <>
        <div
          className="section_bar sticky-top"
          style={{ backgroundColor: "#002853" }}
        >
          <div
            className="container-fluid px-md-2"
            ok
            if
            you
            face
            any
            problem
            then
            drop
            it
            here
          >
            <div className="row">
              <div className="col-md-12 col-12">
                <nav
                  className="navbar navbar-expand-lg navbar-light"
                  style={{ padding: 0 }}
                >
                  <Link className="navbar-brand" to="/">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/Hertz_Swap_Arrows_white.png"
                      }
                      className="rubik_logo"
                      alt=""
                    ></img>
                  </Link>
                  <button
                    className="navbar-toggler "
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul
                      className="navbar-nav mr-auto"
                      style={{ textAlign: "left" }}
                    >
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          to="/"
                          style={{
                            color:
                              this.props.PathName === "/" ? "#26c5eb" : "#fff",
                          }}
                        >
                          HTZ Bridge
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link "
                          style={{ color: "#fff" }}
                          to="/trade"
                          style={{
                            color:
                              this.props.PathName === "/trade"
                                ? "#26c5eb"
                                : "#fff",
                          }}
                        >
                          Trade
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          style={{ color: "#fff" }}
                          to="/liquidity"
                          style={{
                            color:
                              this.props.PathName === "/liquidity"
                                ? "#26c5eb"
                                : "#fff",
                          }}
                        >
                          Liquidity
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          style={{ color: "#fff" }}
                          to="/farm"
                          style={{
                            color:
                              this.props.PathName === "/farm"
                                ? "#26c5eb"
                                : "#fff",
                          }}
                        >
                          Farms
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          to="/info"
                          style={{
                            color:
                              this.props.PathName === "/info"
                                ? "#26c5eb"
                                : "#fff",
                          }}
                        >
                          Info
                        </NavLink>
                      </li>

                      <li className="nav-item d-none">
                        <a className="nav-link" href="#">
                          Bridge
                        </a>
                      </li>
                    </ul>
                    <div className="form-inline my-2 pl-md-3 pl-0">
                      <div className="haertxwallets d-flex align-items-center">
                        <div className="network_type_area">
                          <div
                            className={`mx-2 ${
                              this.props.htZbalance === 0 ||
                              this.props.htZbalance === "0.0 HTZ"
                                ? "text-danger"
                                : "text-success"
                            }`}
                            id="hertzAccount"
                          >
                            <span>Hertz</span> &nbsp;
                            <i className="fal fa-wallet"></i>
                            {this.props.htZbalance}
                          </div>
                        </div>
                        <div className="show_balance_area">
                          <div className="mx-2 text-white">
                            <span id="hertzBalance">Balance</span>
                          </div>
                        </div>
                        <div
                          className="mx-2 bh65cx"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          style={{ cursor: "pointer" }}
                        >
                          <span id="hertzWalletAddress">
                            {this.props.account === ""
                              ? "Username"
                              : this.props.account}
                          </span>
                          <div class="dropdown" style={{ display: "flex" }}>
                            <MdKeyboardArrowDown size={20} />

                            {this.props.tokens !== null ? (
                              <div
                                class="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                                style={{
                                  backgroundColor: "#012853",
                                  left: "-140px",
                                }}
                              >
                                {this.props.tokens.map((data, key) => (
                                  <a
                                    key={key}
                                    class="dropdown-item"
                                    href="#"
                                    style={{ color: "#fff" }}
                                  >
                                    <>{data.symbol}&nbsp;</>
                                    <div>
                                      <i className="fal fa-wallet"></i>
                                      {data.balance}
                                    </div>
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="two_btn_area">
                        <div className={`BNB_0 mx-2`}>
                          <div
                            className={`${
                              this.props.metamaskBalance === 0
                                ? "text-danger"
                                : "text-success"
                            }`}
                            id="ethNetwork"
                          >
                            {/* <span id="showNetworkType">HTZ-BEP20</span>&nbsp; */}
                            <span id="showNetworkType">
                              {this.props.NetworkName}
                            </span>
                            &nbsp;
                            <i className="fal fa-wallet"></i>
                          </div>
                        </div>
                        <div className="BNB_0 mx-2">
                          <span id="showBalance">
                            {this.props.metamaskBalance}
                          </span>
                        </div>
                        <div className="mx-2 bh65cx">
                          {/* <span id="walletAddress"> No Wallet Connect</span> */}

                          <span id="walletAddress">
                            {this.props.contract === null
                              ? "Address"
                              : this.props.metamaskWalletAddress}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        id="btn-connect"
                        className="btn btn_Connect_light mx-2"
                        data-toggle="modal"
                        data-target="#ConnectModal"
                        onClick={() => window.$("#ConnectModal").modal("show")}
                      >
                        Connect to a wallet
                      </button>
                      <img
                        src="https://cdn0.iconfinder.com/data/icons/rounded-set-4/48/logout-512.png"
                        width="32px"
                        style={{ cursor: "pointer" }}
                        onClick={this.props.DisconnectAccount}
                      ></img>
                      {/* <button
                        className="btn btn_Connect_light mx-2"
                        id="btn-disconnect"
                        onclick="onDisconnect()"
                        style={{ display: "none" }}
                      >
                        Disconnect
                      </button> */}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <ConnectModal SetContract={this.props.SetContract} />
        <HertzModal
          usernameChanged={this.usernameChanged}
          passwordChanged={this.passwordChanged}
          login={this.Login}
          is2FAvisable={this.props.is2FAvisable}
          is2FAvisableChanged={this.props.is2FAvisableChanged}
          CodeChange={this.CodeChange}
          code={this.state._2FAcode}
          TwoFactorAuthentication={this.props.TwoFactorAuthentication}
        />
        {/* //Second Header component Start  */}
        {/* <!--swapping first model--> */}
        <div
          class="modal fade"
          id="exampleModalCenter1"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  Select a token
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="sid_ebar mx-2">
                  <div class="sc-bEjcJn jLJzwT">
                    <input
                      type="text"
                      placeholder="search token name"
                      class="form-control address_search"
                      id="filter"
                    />
                  </div>

                  {/* <!--Token Select options div start--> */}
                  <div
                    id="symbol1"
                    class="token_list_all scrollbar_width"
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  {/* <!--Token Select options div end--> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--swapping second model--> */}
        <div
          class="modal fade"
          id="exampleModalCenter2"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  Select a token
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="sid_ebar mx-2">
                  <div class="sc-bEjcJn jLJzwT">
                    <input
                      type="text"
                      id="filterSwap1"
                      placeholder="search token name"
                      class="form-control address_search"
                    />
                  </div>

                  {/* <!--Token Select options div start--> */}
                  <div
                    id="symbol2"
                    class="token_list_all scrollbar_width"
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  {/* <!--Token Select options div end--> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--Show Liquidity pairs Start--> */}
        <div
          class="modal fade"
          id="exampleModalCenter5"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  Select a token
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="sid_ebar mx-2">
                  <div class="sc-bEjcJn jLJzwT">
                    <input
                      type="text"
                      placeholder="search token name"
                      class="form-control address_search"
                      id="filterLiquidity"
                    />
                  </div>

                  {/* <!--Token Select options div start--> */}
                  <div
                    id="swapTokeList"
                    class="token_list_all scrollbar_width"
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  {/* <!--Token Select options div end--> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--View all transaction--> */}
        <div
          class="modal fade viewall"
          id="swappingModelView"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  All Transactions
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class=" mt-3 table-responsive">
                  <h5 id="totalSwappingAmount"></h5>

                  <table class="table table-condensed">
                    <thead>
                      <tr>
                        <th>Pair</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Txn #</th>
                        <th>Txn #</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody id="swappingDetails"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--LIQUIDITY FIRST MODEL SYMBOL--> */}
        <div
          class="modal fade"
          id="exampleModalCenter3"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content WSUM_value_02">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">
                  Select a token
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fal fa-times-circle text-white"></i>
                </button>
              </div>
              <div class="modal-body">
                <div class="sid_ebar mx-2">
                  <div class="sc-bEjcJn jLJzwT">
                    <input
                      type="text"
                      id="filterLiq2"
                      placeholder="search token name"
                      class="form-control address_search"
                    />
                  </div>

                  {/* <!--Token Select options div start--> */}
                  <div
                    id="liquiditySymbol2"
                    class="token_list_all scrollbar_width scrollbar_width"
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  {/* <!--Token Select options div end--> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--TRANSACTION LOADER START--> */}
        <div
          id="loaderDiv"
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
            <p style={{ fontSize: " 22px", color: "white", fontWeight: "400" }}>
              Transaction in process, please wait
            </p>
            <img
              src="https://defi.hertz-network.com/wp-content/themes/twentytwenty/assets/images/loader.gif"
              width="150"
              title="wait for a mint to confirm transaction"
              alt="loader-image"
            />
          </div>
        </div>
        {/* <!--TRANSACTION LOADER END--> */}
        {/* <input type="hidden" id="token" value=""></input>
        <input type="hidden" id="username" value=""></input>
        <input type="hidden" id="account" value=""></input> */}
        <input type="hidden" id="metaMaskAccount" value=""></input>
        <input type="hidden" id="currentPrice" value=""></input>
      </>
    );
  }
}

//Connect Modal funcation
function ConnectModal(props) {
  return (
    <>
      <div
        class="modal fade modal_pd "
        id="ConnectModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="ConnectModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div
            class="modal-content"
            style={{
              background: "#032b5b",
              padding: "16px 0px",
              borderRadius: "23px",
              color: "#fff",
              letterSpacing: "1px",
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            <div class="modal-header">
              <h5
                class="modal-title"
                id="exampleModalLongTitle"
                style={{ flex: "1" }}
              >
                Connect wallet
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ outline: "none" }}
              >
                <RiCloseCircleLine size={30} color="#26c5eb" />
              </button>
            </div>
            <div class="modal-body">
              <div class="py-2">
                <HButton
                  type="button"
                  data-toggle="modal"
                  data-target="#HertzModalCenter"
                >
                  <span>Hertz Network</span>
                  <span class="d-grid">
                    <img
                      src="https://ramlogics.com/Defi_Hertz/wp-content/themes/twentytwenty/assets/images/HTZ-ERC-20-NEW.png"
                      alt="eth.png"
                      style={{ width: "32px" }}
                    ></img>
                  </span>
                </HButton>
              </div>
              <div class="py-2">
                <HButton
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModalCenterLonin"
                  onClick={props.SetContract}
                  data-dismiss="modal"
                >
                  <span>MetaMask</span>
                  <span class="d-grid">
                    <img
                      src={
                        process.env.PUBLIC_URL + "/assets/images/metamask.png"
                      }
                      class=""
                      alt="eth.png"
                      style={{ width: "32px" }}
                    ></img>
                  </span>
                </HButton>
              </div>
              <div class="py-2">
                <HButton
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModalCenterLonin"
                  // onClick={connectWalletConnect}
                >
                  <span>Wallet Connect</span>
                  <span class="d-grid">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/images/walletconnect.png"
                      }
                      alt="eth.png"
                      style={{ width: "32px", borderRadius: "999px" }}
                    ></img>
                  </span>
                </HButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// styled componets Section
const HButton = styled.button`
  width: 100%;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  transition: 0.5s;
  border: none;
  font-weight: bold;
`;
const NavLink = styled(Link)`
  color: #fff;
  :hover {
    color: #26c5eb !important;
  }
`;
const mapDispatchToProps = {
  SetContract: SetContract,
  GetLoginDetails: GetLoginDetails,
  TwoFactorAuthentication: TwoFactorAuthentication,
  is2FAvisableChanged: is2FAvisableChanged,
  DisconnectAccount: DisconnectAccount,
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);

// ritik.chhipa@ramlogics.com
// Rit@9001586400
