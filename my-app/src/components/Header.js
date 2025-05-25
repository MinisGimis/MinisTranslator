import React, { useState } from "react";
import SettingsMenu from "./SettingsMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import "../styles/App.css";

const Header = ({
  chapters,
  selectedChapter,
  showChapterList,
  setShowChapterList,
  onFileUpload,
  fontSize,
  setFontSize,
  viewerPadding,
  setViewerPadding,
  chapterRegex,
  setChapterRegex,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="header">
      <div className="settings-container">
        <IconButton
          aria-label="settings"
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          size="large"
        >
          <SettingsIcon fontSize="large" />
        </IconButton>
        {isSettingsOpen && (
          <SettingsMenu
            showChapterList={showChapterList}
            setShowChapterList={setShowChapterList}
            fontSize={fontSize}
            setFontSize={setFontSize}
            viewerPadding={viewerPadding}
            setViewerPadding={setViewerPadding}
            onFileUpload={onFileUpload}
            chapterRegex={chapterRegex}
            setChapterRegex={setChapterRegex}
          />
        )}
      </div>
      {chapters.length > 0 ? (
        <div className="dynamic-header">
          <h1 className="chapter-title">
            {chapters[selectedChapter]?.split("\n")[0] || "Select a Chapter"}
          </h1>
        </div>
      ) : (
        <div className="upload-container">
          <h1>Upload a Novel</h1>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
