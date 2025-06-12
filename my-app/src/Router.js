import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Viewer from "./components/Viewer.js";
// Assuming Header is rendered within Viewer or another component rendered by Viewer
// If Header is rendered here, it should be imported and receive props as well.

function AppRouter({
  chineseVariant,
  setChineseVariant,
  showPinyin,
  setShowPinyin,
}) {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Viewer
              chineseVariant={chineseVariant}
              setChineseVariant={setChineseVariant}
              showPinyin={showPinyin}
              setShowPinyin={setShowPinyin}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
