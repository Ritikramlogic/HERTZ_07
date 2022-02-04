import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdWatchLater } from "react-icons/md";
import $ from "jquery";
import {
  GetAccount,
  TradeFromTO,
  SetSwap,
  TransferHertzToUser,
  GetsufficientBalance,
  ClaimHertz,
  TranscationStatus,
  SwapCurrency,
  ApproveCondition,
  ApproversCheck,
  SwapClaimHertz,
  HertzSwap,
  HTZ_to_ERC20Claim,
  ERC20_to_HTZClaim,
} from "../Redux/Actions/index";
import swal from "sweetalert";
import { store } from "../Redux/store";

// map state to props
function mapStateToProps(state) {
  return {
    account: state.account,
    isSwapDisabled: state.isSwapDisabled,
    tradeValue: state.tradeValue,
    htZbalance: state.htZbalance,
    isSufficientBalance: state.isSufficientBalance,
    contract: state.contract,
    isClaimReward: state.isClaimReward,
    isTradeDisabled: state.isTradeDisabled,
    isApproved: state.isApproved,
    TradeSymbol: state.TradeSymbol,
    metamaskBalance: state.metamaskBalance,
    isContractSwap: state.isContractSwap,
    htzSwapContract: state.htzSwapContract,
    htzContract: state.htzContract,
    isClaimRewardVisible: state.isClaimRewardVisible,
    isClaim: state.isClaim,
    isSwapCurrerncyDisabled: state.isSwapCurrerncyDisabled,
    htzBEP20Balance: state.htzBEP20Balance,
    HTZ_to_ERC20Contract: state.HTZ_to_ERC20Contract,
    ERC20Swap_Visibility: state.ERC20Swap_Visibility,
  };
}

// TradePage class start here

class TradePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: this.props.htZbalance,
      transactions: null,
      ERC20Swap_Visibility: true,
    };
    this.SwapClick = this.SwapClick.bind(this);
    this.tradeValueChange = this.tradeValueChange.bind(this);
    this.claimHertz = this.claimHertz.bind(this);
    this.transcationStatus = this.transcationStatus.bind(this);
    this.HTZ_to_ERC20_Claim = this.HTZ_to_ERC20_Claim.bind(this);
  }

  tradeValueChange(e) {
    let string = this.props.htZbalance;
    let balance =
      this.props.TradeSymbol.from === "HTZ"
        ? parseFloat(string.match(/([0-9]+\.[0-9]+)/g, ""))
        : this.props.htzBEP20Balance;

    // console.log(balance);
    // console.log(this.props.metamaskBalance);
    // if (this.state.balance >= e.target.value && e.target.value > 0) {

    if (
      balance >= e.target.value &&
      e.target.value > 0
      // this.props.metamaskBalance > e.target.value
    ) {
      this.props.TradeFromTO(e.target.value);
      this.props.TradeSymbol.from === "HTZ"
        ? this.props.SetSwap(false)
        : this.props.ApproveCondition(true);
    } else {
      this.props.TradeSymbol.from === "HTZ"
        ? this.props.SetSwap(true)
        : this.props.ApproveCondition(false);
      this.props.TradeFromTO(e.target.value);
    }

    if (balance < e.target.value && e.target.value > 0) {
      this.props.GetsufficientBalance(false);
    } else {
      this.props.GetsufficientBalance(true);
    }
  }

  async transcationStatus() {
    this.setState({ transactions: await this.props.TranscationStatus() });
  }
  SwapClick() {
    let string = this.props.htZbalance;
    // console.log(parseFloat(string.match(/([0-9]+\.[0-9]+)/g, "")));
    // console.log(this.props.htzBEP20Balance);
    // console.log(this.props.tradeValue);
    // console.log(this.props.htzBEP20Balance > this.props.tradeValue);
    // this.props.metamaskBalance;
    if (this.props.metamaskBalance > 0.0002) {
      this.props.TransferHertzToUser(
        this.props.account,
        "ramlogicsabh",
        "HTZ",
        this.props.tradeValue
      );
    } else {
      swal(
        "You dont have Sufficent Fund for Transcation",
        "Please Add fund in Metamask Wallet",
        "warning"
      );
    }
  }
  async HTZ_to_ERC20_Claim() {
    console.log(this.props.tradeValue);
    console.log(this.props.HTZ_to_ERC20Contract);
    this.props.HTZ_to_ERC20Claim(
      this.props.HTZ_to_ERC20Contract,
      this.props.tradeValue
    );
  }
  async claimHertz() {
    console.log(this.props.tradeValue);
    this.props.ClaimHertz(this.props.contract, this.props.tradeValue);
  }

  render() {
    return (
      <>
        <Section>
          <Container>
            <Wrapper>
              {/* //Heading Container */}
              <HeadingWrapper>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/Hertz_Swap_Arrows_white.png"
                  }
                  alt=""
                  width="75%"
                ></img>
                <hr style={{ borderColor: "#26c5eb" }} />
              </HeadingWrapper>

              {/* Main container  */}

              <MainWrapper>
                <RowWrapper>
                  <div class="col">
                    <div>
                      <h5
                        style={{
                          fontWeight: "bold",
                          color: "#26c5eb",
                          marginLeft: "20px",
                        }}
                      >
                        HTZ Bridge
                      </h5>
                    </div>
                  </div>
                  <div
                    data-toggle="modal"
                    data-target="#TranscationModalCenter"
                  >
                    <div
                      style={{
                        color: "#6698cd",
                      }}
                    >
                      <MdWatchLater size={25} color="#26c5eb" />
                    </div>
                  </div>
                </RowWrapper>
                <FarmWrapper>
                  <div style={{ display: "flex", fontWeight: "bold" }}>
                    Your Swap
                  </div>
                  <InputContainer>
                    <div>
                      <RowWrapper>
                        <span>From</span>
                        <small></small>
                      </RowWrapper>
                      {this.props.isTradeDisabled ? (
                        <RowInputWrapper>
                          <div
                            style={{
                              display: "flex",
                              maxWidth: "173px",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            {this.props.tradeValue}
                          </div>
                          <button>
                            {this.props.TradeSymbol.from === "HTZ" ? (
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/images/HTZ_round.png"
                                }
                                width="26"
                                style={{ marginRight: "10px" }}
                              ></img>
                            ) : (
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/images/HTZ_BEP-20_round.png"
                                }
                                width="26"
                                style={{ marginRight: "10px" }}
                              ></img>
                            )}
                            <span id="currencySymbol1">
                              {this.props.TradeSymbol.from}
                            </span>
                          </button>
                        </RowInputWrapper>
                      ) : (
                        <RowInputWrapper>
                          <input
                            type="text"
                            id="fromBalance"
                            placeholder="0.0"
                            onChange={(e) => this.tradeValueChange(e)}
                            // value={this.props.tradeValue}
                          ></input>
                          <button>
                            {this.props.TradeSymbol.to === "HTZ" ? (
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/images/HTZ_round.png"
                                }
                                width="26"
                                style={{ marginRight: "10px" }}
                              ></img>
                            ) : (
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/images/HTZ_BEP-20_round.png"
                                }
                                width="26"
                                style={{ marginRight: "10px" }}
                              ></img>
                            )}
                            <span id="currencySymbol1">
                              {this.props.TradeSymbol.from}
                            </span>
                          </button>
                        </RowInputWrapper>
                      )}
                    </div>
                  </InputContainer>

                  {/* Swap icon  */}

                  <div>
                    <div>
                      <i
                        onClick={
                          this.props.isSwapCurrerncyDisabled
                            ? null
                            : () => {
                                this.props.SwapCurrency(
                                  this.props.TradeSymbol.to,
                                  this.props.TradeSymbol.from
                                );
                              }
                        }
                        class="fad fa-arrow-alt-circle-down text-center text-white"
                        aria-hidden="true"
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>

                  {/* Input Container  */}
                  <InputContainer>
                    <div>
                      <RowWrapper>
                        <span>To (estimated)</span>
                        <small></small>
                      </RowWrapper>
                      <RowInputWrapper>
                        <div
                          placeholder="0.0"
                          style={{
                            display: "flex",
                            maxWidth: "173px",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          {this.props.tradeValue}
                        </div>
                        <button>
                          {this.props.TradeSymbol.to === "HTZ" ? (
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/HTZ_round.png"
                              }
                              width="26"
                              style={{ marginRight: "10px" }}
                            ></img>
                          ) : (
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/HTZ_BEP-20_round.png"
                              }
                              width="26"
                              style={{ marginRight: "10px" }}
                            ></img>
                          )}
                          <span id="currencySymbol2">
                            {this.props.TradeSymbol.to}
                          </span>
                          {/* <i className="far fa-angle-down"></i> */}
                        </button>
                      </RowInputWrapper>
                    </div>
                  </InputContainer>

                  {/* HTZ->BEP20 button */}
                  <SwapButtonWrapper>
                    <div className="swap_tab_04 md-3 py-3">
                      <div
                        className="form_area_btn"
                        style={{ display: "flex" }}
                      >
                        <>
                          {this.props.isSwapDisabled.visible ? (
                            <button
                              className="btn_outline_light w-100"
                              style={{
                                backgroundColor: this.props.isSwapDisabled
                                  .condition
                                  ? "white"
                                  : "#26c5eb",
                                color: this.props.isSwapDisabled.condition
                                  ? "grey"
                                  : "white",
                                fontWeight: "bold",
                                cursor: this.props.isSwapDisabled.condition
                                  ? "default"
                                  : "pointer",
                              }}
                              id="swappingBtn"
                              disabled={this.props.isSwapDisabled.condition}
                              onClick={
                                this.props.isSwapDisabled.condition
                                  ? null
                                  : this.props.isSwapDisabled.SwapSymbol ===
                                    "HTZ"
                                  ? this.SwapClick
                                  : () => alert("Swap is called")
                              }
                            >
                              SWAP
                            </button>
                          ) : null}
                        </>

                        {this.props.isClaimReward ? (
                          <button
                            className="btn_outline_light w-100"
                            style={{
                              backgroundColor:
                                // this.props.contract === null
                                store.getState().NetworkName === "No Network"
                                  ? "grey"
                                  : "#26c5eb",
                              margin: "0 20px",
                            }}
                            onClick={
                              // this.props.contract === null
                              //   ? null
                              //   : this.claimHertz

                              store.getState().NetworkName === "No Network"
                                ? null
                                : store.getState().NetworkName === "Binance"
                                ? this.claimHertz
                                : this.HTZ_to_ERC20_Claim
                            }
                          >
                            Claim {store.getState().TradeSymbol.to}
                          </button>
                        ) : null}
                      </div>

                      {/* BEP20->HTZ button */}
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {store.getState().NetworkName === "Binance" ||
                        store.getState().NetworkName === "No Network" ? (
                          <>
                            <div
                              style={{
                                width: this.props.isApproved.isApprovedSwap
                                  ? 0
                                  : "100%",
                              }}
                            >
                              {this.props.isApproved.isVisible ? (
                                <button
                                  className="btn_outline_light w-100"
                                  style={{
                                    backgroundColor: this.props.isApproved
                                      .condition
                                      ? "#26c5eb"
                                      : "grey",
                                    cursor: this.props.isApproved.condition
                                      ? "pointer"
                                      : "default",
                                    display: this.props.isApproved
                                      .isApprovedSwap
                                      ? "none"
                                      : "grid",
                                  }}
                                  onClick={
                                    this.props.isApproved.condition
                                      ? () =>
                                          this.props.ApproversCheck(
                                            this.props.htzContract,
                                            this.props.tradeValue
                                          )
                                      : null
                                  }
                                >
                                  Approve
                                </button>
                              ) : null}
                            </div>

                            {this.props.isApproved.isApprovedSwap &&
                            this.props.isApproved.isVisible ? (
                              <div
                                style={{
                                  width: this.props.isApproved.success
                                    ? "100%"
                                    : 0,
                                }}
                              >
                                <button
                                  className="btn_outline_light w-100"
                                  style={{
                                    backgroundColor: this.props.isApproved
                                      .success
                                      ? "#26c5eb"
                                      : "grye",
                                    cursor: this.props.isApproved.success
                                      ? "pointer"
                                      : "default",
                                    display: !this.props.isApproved.success
                                      ? "none"
                                      : "grid",
                                  }}
                                  id="swappingBtn"
                                  disabled={!this.props.isApproved.success}
                                  // onClick={this.SwapClick}
                                  onClick={
                                    this.props.isApproved.success
                                      ? () =>
                                          this.props.HertzSwap(
                                            this.props.htzSwapContract,
                                            this.props.tradeValue
                                          )
                                      : () => alert("success is failed ")
                                  }
                                >
                                  SWAP
                                </button>
                              </div>
                            ) : null}

                            {this.props.isApproved.isClaimVisible ? (
                              <div
                                style={{
                                  width: this.props.isApproved.isClaimVisible
                                    ? "100%"
                                    : 0,
                                }}
                              >
                                <button
                                  className="btn_outline_light w-100"
                                  style={{
                                    backgroundColor: this.props.isApproved
                                      .isClaim
                                      ? "#26c5eb"
                                      : "grey",
                                    cursor: this.props.isApproved.isClaim
                                      ? "pointer"
                                      : "default",
                                  }}
                                  id="swappingBtn"
                                  disabled={!this.props.isApproved.isClaim}
                                  // onClick={this.SwapClick}
                                  onClick={
                                    this.props.isApproved.isClaim
                                      ? () =>
                                          this.props.SwapClaimHertz(
                                            this.props.account,
                                            this.props.tradeValue
                                          )
                                      : () => alert("success is failed ")
                                  }
                                >
                                  Claim HTZ
                                </button>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {store.getState().TradeSymbol.from ===
                              "HTZ ETH20" && this.props.ERC20Swap_Visibility ? (
                              <>
                                <button
                                  className="btn_outline_light w-100"
                                  style={{
                                    backgroundColor: "#26c5eb",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    this.props.ERC20_to_HTZClaim(
                                      this.props.HTZ_to_ERC20Contract,
                                      this.props.tradeValue
                                    );
                                  }}
                                >
                                  SWAP
                                </button>
                              </>
                            ) : null}
                            {this.props.isApproved.isClaimVisible ? (
                              <div style={{ width: "100%" }}>
                                <button
                                  className="btn_outline_light w-100"
                                  style={{
                                    backgroundColor: this.props.isApproved
                                      .isClaim
                                      ? "#26c5eb"
                                      : "grey",
                                    cursor: this.props.isApproved.isClaim
                                      ? "pointer"
                                      : "default",
                                  }}
                                  id="swappingBtn"
                                  disabled={!this.props.isApproved.isClaim}
                                  // onClick={this.SwapClick}
                                  onClick={
                                    this.props.isApproved.isClaim
                                      ? () =>
                                          this.props.SwapClaimHertz(
                                            this.props.account,
                                            this.props.tradeValue
                                          )
                                      : () => alert("success is failed ")
                                  }
                                >
                                  Claim HTZ
                                </button>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>

                      {/* <button onClick={this.props.TranscationStatus}>
                        Click me{" "}
                      </button> */}
                    </div>
                  </SwapButtonWrapper>
                </FarmWrapper>
              </MainWrapper>
            </Wrapper>
          </Container>
          {/* <SlippingModal /> */}
          <TranscationModal
            transcationStatus={this.transcationStatus}
            transactions={this.state.transactions}
          />
        </Section>
      </>
    );
  }
}

//TranscationModal for check status of transaction

const TranscationModal = (props) => {
  return (
    <>
      {/* <!--View all transaction--> */}

      <div
        id="TranscationModalCenter"
        aria-labelledby="TranscationModalCenterTitle"
        onFocus={props.transcationStatus}
        class="modal fade viewall"
        tabindex="-1"
        role="dialog"
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
                      <th>Symbol</th>
                      <th>Transcation#</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody id="swappingDetails" style={{ height: "100%" }}>
                    {false ? (
                      <tr>
                        <td colspan="7" class="text-center">
                          Please select pair
                        </td>
                      </tr>
                    ) : (
                      <>
                        {/* {props.transactions === null ? (
                          "Loading"
                        ) : ( */}
                        {localStorage.getItem("bridgeTranHistory") ? (
                          <>
                            {JSON.parse(
                              localStorage.getItem("bridgeTranHistory")
                            )
                              .reverse()
                              .map((data, key) => (
                                // store.getState().NetworkId==56?"Binance":null

                                <>
                                  {data.pair.match(/[BEP20]+/g)[0] ===
                                    "BEP20" &&
                                  store.getState().NetworkId == 56 ? (
                                    <tr
                                      colspan="7"
                                      class="text-color-success text-center"
                                      key={key}
                                    >
                                      <td>{data.pair}</td>
                                      <td>{data.symbol}</td>
                                      <td>
                                        <span class="liqui_hash_id">
                                          {data.transaction}
                                        </span>
                                      </td>
                                      <td>{data.ammount}</td>
                                      <td>{data.status}</td>
                                    </tr>
                                  ) : null}
                                  {data.pair.match(/[BEP20]+/g)[0] !==
                                    "BEP20" &&
                                  store.getState().NetworkId == 1 ? (
                                    <tr
                                      colspan="7"
                                      class="text-color-success text-center"
                                      key={key}
                                    >
                                      <td>{data.pair}</td>
                                      <td>{data.symbol}</td>
                                      <td>
                                        <span class="liqui_hash_id">
                                          {data.transaction}
                                        </span>
                                      </td>
                                      <td>{data.ammount}</td>
                                      <td>{data.status}</td>
                                    </tr>
                                  ) : null}
                                </>
                              ))}
                          </>
                        ) : (
                          "Loading"
                        )}

                        {/* )
                        } */}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Section = styled.div`
  padding: 100px 0 0 0;
  margin: 0 auto;
  min-height: 100vh;
  background-image: url("../images/bg1.png");
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
`;

const Container = styled.div``;

const Wrapper = styled.div`
  max-width: 400px;
  background: #0053ac;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
`;

const HeadingWrapper = styled.div`
  background: transparent;
  padding: 14px 0;
  margin-bottom: 0 ;
}
`;
const MainWrapper = styled.div``;
const RowWrapper = styled.div`
  display: flex;
`;
const FarmWrapper = styled.div`
  color: #fff;
`;
const InputContainer = styled.div`
  background-color: #033163;
  border-radius: 10px;
  padding: 15px;
  margin: 1rem 0;
  border-radius: 24px;
  input {
    background: transparent;
    border: none;
    outline: none;
    ::placeholder {
      color: #fff;
      font-weight: bold;
    }
  }
  button {
    background-color: transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
  }
`;
const RowInputWrapper = styled.div`
  display: flex;
  padding: 13px 0.75rem;
  background-color: #fff0;
  border: 1px solid #26c5eb;
  margin-bottom: 1rem;
  justify-content: space-between;
  input {
    color: #fff;
  }
  span {
    color: #fff;
    font-weight: bold;
  }
`;

const FeesContainer = styled.div``;
const SwapButtonWrapper = styled.div``;
const Table = styled.table`
  border: 1px solid #01193247;
  th {
    border: 1px solid #01193247;
    background: #26c5eb !important;
    color: #fff;
  }
`;

const mapDispatchToProps = {
  GetAccount: GetAccount,
  TradeFromTO: TradeFromTO,
  SetSwap: SetSwap,
  HTZ_to_ERC20Claim: HTZ_to_ERC20Claim,
  GetsufficientBalance: GetsufficientBalance,
  TransferHertzToUser: TransferHertzToUser,
  ClaimHertz: ClaimHertz,
  TranscationStatus: TranscationStatus,
  SwapCurrency: SwapCurrency,
  ApproveCondition: ApproveCondition,
  ApproversCheck: ApproversCheck,
  HertzSwap: HertzSwap,
  SwapClaimHertz: SwapClaimHertz,
  ERC20_to_HTZClaim: ERC20_to_HTZClaim,
};
export default connect(mapStateToProps, mapDispatchToProps)(TradePage);
