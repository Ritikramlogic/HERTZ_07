import React, { Component } from "react";
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <footer
          className="footer_bottom"
          style={{ backgroundColor: "#002853", border: "none" }}
        >
          <div className="container-fluid px-md-3 py-md-1 py-3">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a href="https://ramlogics.com/Defi_Hertz">
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/images/Hertz_netwokr.png"
                  }
                  className="rubik_logo"
                  alt=""
                ></img>
              </a>
              <h6
                className="font-weight-normal text-white"
                style={{ margin: 0 }}
              >
                Copyright 2021 © All rights Reserved.
              </h6>
            </div>
          </div>
        </footer>
      </>
    );
  }
}

export default Footer;
