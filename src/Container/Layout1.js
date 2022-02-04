import React, { useEffect } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { useLocation } from "react-router-dom";
export default function Layout1(props) {
  const PathName = useLocation().pathname;
  return (
    <>
      <Header PathName={PathName} />
      {props.children}
      <Footer />
    </>
  );
}
