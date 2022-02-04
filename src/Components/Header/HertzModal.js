import React from "react";
import { _2FAuthenticationModal } from "./_2FAuthenticationModal";
import { RiCloseCircleLine } from "react-icons/ri";
export const HertzModal = (props) => {
  return (
    <>
      <div
        className="modal fade"
        id="HertzModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="HertzModalCenter"
        aria-hidden="true"
        style={{ paddingLeft: 0, paddingRight: "0px" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content"
            style={{
              background: "#032b5b",
              padding: "16px",
              borderRadius: "23px",
              color: "#fff",
              letterSpacing: "1px",
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            <div className="modal-header" style={{ border: "none" }}>
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
            <div>
              {props.is2FAvisable ? (
                <_2FAuthenticationModal
                  is2FAvisableChanged={props.is2FAvisableChanged}
                  CodeChange={props.CodeChange}
                  code={props.code}
                  TwoFactorAuthentication={props.TwoFactorAuthentication}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src="https://hertz-network.com/wp-content/uploads/elementor/thumbs/HTZ-logo-only-blue-white-p4p2ldidtq3ndb8678kf2snlwefybhkycazbj9e3gk.png"
                    style={{ marginBottom: "10px" }}
                  ></img>
                  <h2
                    style={{
                      color: "white",
                      fontSize: "26px",
                      fontWeight: "500",
                      marginBottom: "20px",
                    }}
                  >
                    Login
                  </h2>
                  <input
                    placeholder="Username"
                    onChange={(e) => props.usernameChanged(e)}
                    style={{
                      borderRadius: " 6px",
                      border: "1px solid #26c5ebc9",
                      width: "280px",
                      height: " 30px",
                      marginBottom: "15px",
                      padding: "0px 0px 0px 10px",
                      color: "#000",
                      fontFamily: '"Rubik", sans-serif',
                    }}
                  ></input>
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => props.passwordChanged(e)}
                    style={{
                      borderRadius: " 6px",
                      border: "1px solid #26c5ebc9",
                      width: "280px",
                      height: " 30px",
                      marginBottom: "15px",
                      padding: "0px 0px 0px 10px",
                      color: "#000",
                      fontFamily: '"Rubik", sans-serif',
                    }}
                  ></input>
                  <div
                    style={{
                      display: "flex",
                      margin: "10px 0px 0px",
                      width: "280px",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={props.login}
                      style={{
                        backgroundColor: "#1ea2c1",
                        border: "none",
                        borderRadius: "6px",
                        width: "45%",
                        color: "white",
                        height: "30px",
                        margin: " 0px 0px",
                        fontFamily: "'Rubik', sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Login
                    </button>
                    <button
                      style={{
                        backgroundColor: "#1ea2c1",
                        border: "none",
                        borderRadius: "6px",
                        width: "45%",
                        color: "white",
                        height: "30px",
                        margin: " 0px 0px",
                        fontFamily: "'Rubik', sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      Register
                    </button>
                  </div>
                  <div style={{ color: "white", margin: "15px 0px 0px" }}>
                    &nbsp;
                  </div>
                  <div id="usernotfound"></div>
                  <a
                    target="_blank"
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                    href="https://wallet.hertz-network.com/settings"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
