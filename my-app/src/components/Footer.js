import React from "react";
import "../styles/App.css";
import Button from "@mui/material/Button";

const Footer = ({ onNextChapter, onPrevChapter, hasNext, hasPrev }) => (
  <div className="footer">
    <Button
      variant="contained"
      color="primary"
      onClick={onPrevChapter}
      disabled={!hasPrev}
      className="nav-button"
    >
      Previous Chapter
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={onNextChapter}
      disabled={!hasNext}
      className="nav-button"
    >
      Next Chapter
    </Button>
  </div>
);

export default Footer;
