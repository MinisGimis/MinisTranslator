import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import "./styles/App.css";

const App = () => {
  const [chineseVariant, setChineseVariant] = useState(
    localStorage.getItem("chineseVariant") || "simplified"
  );
  const [showPinyin, setShowPinyin] = useState(
    localStorage.getItem("showPinyin") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("chineseVariant", chineseVariant);
  }, [chineseVariant]);

  useEffect(() => {
    localStorage.setItem("showPinyin", showPinyin);
  }, [showPinyin]);

  return (
    <AppRouter
      chineseVariant={chineseVariant}
      setChineseVariant={setChineseVariant}
      showPinyin={showPinyin}
      setShowPinyin={setShowPinyin}
    />
  );
};

export default App;
