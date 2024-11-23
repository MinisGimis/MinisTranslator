import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../styles/App.css";

const SettingsMenu = ({
  showChapterList,
  setShowChapterList,
  fontSize,
  setFontSize,
  viewerPadding,
  setViewerPadding,
  onFileUpload,
  chapterRegex,
  setChapterRegex,
}) => {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localPadding, setLocalPadding] = useState(viewerPadding);
  const [localChapterRegex, setLocalChapterRegex] = useState(chapterRegex);
  const [apiKey] = useState(() => localStorage.getItem("apiKey") || "");

  useEffect(() => {
    setFontSize(localFontSize);
    localStorage.setItem("fontSize", localFontSize);
  }, [localFontSize, setFontSize]);

  useEffect(() => {
    setViewerPadding(localPadding);
    localStorage.setItem("viewerPadding", localPadding);
  }, [localPadding, setViewerPadding]);

  useEffect(() => {
    setChapterRegex(localChapterRegex);
    localStorage.setItem("chapterRegex", localChapterRegex);
  }, [localChapterRegex, setChapterRegex]);

  const handleFontSizeChange = (event, newValue) => {
    setLocalFontSize(newValue);
  };

  const handlePaddingChange = (event, newValue) => {
    setLocalPadding(newValue);
  };

  const handleChapterRegexChange = (event) => {
    setLocalChapterRegex(event.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    localStorage.setItem("apiKey", apiKey);
    alert("API Key saved successfully.");
  };

  return (
    <div className="settings-menu">
      <h3 className="settings-title">Settings</h3>
      <div className="settings-item">
        <span className="settings-label">Show Chapters</span>
        <Switch
          checked={showChapterList}
          onChange={() => setShowChapterList((prev) => !prev)}
          color="primary"
        />
      </div>
      <div className="settings-item">
        <span className="settings-label">Font Size</span>
        <Slider
          value={localFontSize}
          min={12}
          max={48}
          step={1}
          onChange={handleFontSizeChange}
          aria-labelledby="font-size-slider"
          valueLabelDisplay="auto"
        />
      </div>
      <div className="settings-item">
        <span className="settings-label">Viewer Padding</span>
        <Slider
          value={localPadding}
          min={0}
          max={64}
          step={4}
          onChange={handlePaddingChange}
          aria-labelledby="padding-slider"
          valueLabelDisplay="auto"
        />
      </div>
      <div className="settings-item">
        <label className="settings-label">Chapter Regex</label>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={localChapterRegex}
          onChange={handleChapterRegexChange}
          placeholder="Enter chapter regex"
        />
      </div>
      <div className="settings-item">
        <label className="settings-label">Import New File</label>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      <div className="settings-item">
        <label className="settings-label">API Key</label>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API key"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={saveApiKey}
          style={{ marginLeft: "8px" }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SettingsMenu;
