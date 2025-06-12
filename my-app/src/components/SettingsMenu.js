import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../styles/App.css";

const suggestedRegexes = [
  {
    label: "Numeric Chapters (e.g., 001., 002.)",
    value: "(\\d{3}\\.{[\\s\\S]*?)(?=\\d{3}\\.|$)",
  },
  {
    label: "Chinese Chapters (e.g., 第一章)",
    value:
      "(第[一二三四五六七八九十百千零0-9]+章[\\s\\S]*?)(?=第[一二三四五六七八九十百千零0-9]+章|$)",
  },
];

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
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("apiKey") || ""
  );
  const [autoTranslateNext, setAutoTranslateNext] = useState(() => {
    const storedValue = localStorage.getItem("autoTranslateNext");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const [chineseVariant, setChineseVariant] = useState(
    () => localStorage.getItem("chineseVariant") || "simplified"
  );
  const [showPinyin, setShowPinyin] = useState(() => {
    const storedPinyin = localStorage.getItem("showPinyin");
    return storedPinyin ? JSON.parse(storedPinyin) : false;
  });

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

  useEffect(() => {
    localStorage.setItem(
      "autoTranslateNext",
      JSON.stringify(autoTranslateNext)
    );
  }, [autoTranslateNext]);

  useEffect(() => {
    localStorage.setItem("chineseVariant", chineseVariant);
  }, [chineseVariant]);

  useEffect(() => {
    localStorage.setItem("showPinyin", JSON.stringify(showPinyin));
  }, [showPinyin]);

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
        <span className="settings-label">Auto translate next</span>
        <Switch
          checked={autoTranslateNext}
          onChange={() => setAutoTranslateNext((prev) => !prev)}
          color="primary"
        />
      </div>
      <div className="settings-item">
        <FormControlLabel
          control={
            <Switch
              checked={chineseVariant === "traditional"}
              onChange={() =>
                setChineseVariant((prev) =>
                  prev === "simplified" ? "traditional" : "simplified"
                )
              }
              color="primary"
            />
          }
          label="Traditional Chinese"
        />
      </div>
      <div className="settings-item">
        <FormControlLabel
          control={
            <Switch
              checked={showPinyin}
              onChange={() => setShowPinyin((prev) => !prev)}
              color="primary"
            />
          }
          label="Show Pinyin"
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
      <Box
        sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
      >
        <span className="settings-label" style={{ marginBottom: "4px" }}>
          Suggestions:
        </span>
        {suggestedRegexes.map((regex) => (
          <Button
            key={regex.label}
            variant="outlined"
            size="small"
            onClick={() => setLocalChapterRegex(regex.value)}
            sx={{ textTransform: "none", justifyContent: "flex-start" }}
          >
            {regex.label}
          </Button>
        ))}
      </Box>
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
