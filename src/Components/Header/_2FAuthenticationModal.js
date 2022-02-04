import React from "react";
import { Modal, Button } from "react-bootstrap";
export const _2FAuthenticationModal = (props) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <img src="https://hertz-network.com/wp-content/uploads/elementor/thumbs/HTZ-logo-only-blue-white-p4p2ldidtq3ndb8678kf2snlwefybhkycazbj9e3gk.png"></img>
        <h2
          style={{
            color: "white",
            fontSize: "26px",
            fontWeight: "500",
            padding: "10px",
          }}
        >
          2FA Confirmation
        </h2>
        <input
          placeholder="2FA Code"
          style={{
            borderRadius: "6px",
            border: "1px solid #26c5ebc9",
            width: "300px",
            height: " 30px",
            marginBottom: "15px",
            padding: "0px 0px 0px 20px",
            color: "#000",
            fontFamily: '"Rubik", sans-serif',
          }}
          onChange={(e) => props.CodeChange(e)}
        ></input>
        <div
          style={{
            display: "flex",
            margin: "10px 0px 0px",
            width: "290px",
            justifyContent: "space-between",
          }}
        >
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
            onClick={async () => {
              props.TwoFactorAuthentication(props.code);
            }}
          >
            Confirm
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
            onClick={props.is2FAvisableChanged}
          >
            Cancel
          </button>
        </div>
        <div style={{ margin: "15px 0px 0px", color: "white" }}></div>
      </div>

      {/* React Bootstrap Modal  */}
      {/* 
      <Modal.Header closeButton>
        <h2
          style={{
            color: "black",
            fontSize: "26px",
            fontWeight: "500",
            padding: "10px",
          }}
        >
          2FA Confirmation
        </h2>
      </Modal.Header> */}
      {/* <Modal.Body
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <input
          placeholder="2FA Code"
          style={{
            borderRadius: "6px",
            border: "1px solid #26c5ebc9",
            width: "300px",
            height: " 30px",
            marginBottom: "15px",
            padding: "0px 0px 0px 20px",
            color: "#000",
            fontFamily: '"Rubik", sans-serif',
          }}
          onChange={(e) => props.CodeChange(e)}
        ></input>
        <div
          style={{
            display: "flex",
            margin: "10px 0px 0px",
            width: "290px",
            justifyContent: "space-between",
          }}
        >
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
            onClick={async () => {
              props.TwoFactorAuthentication(props.code);
            }}
          >
            Confirm
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
            onClick={props.is2FAvisableChanged}
          >
            Cancel
          </button>
        </div>
      </Modal.Body> */}
    </>
  );
};
