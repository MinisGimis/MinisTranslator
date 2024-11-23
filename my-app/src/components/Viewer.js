import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import ChapterList from "./ChapterList";
import Footer from "./Footer";
import Button from "@mui/material/Button";
import "../styles/App.css";

const Viewer = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterList, setShowChapterList] = useState(true);
  const [fontSize, setFontSize] = useState(
    () => parseInt(localStorage.getItem("fontSize"), 10) || 16
  );
  const [viewerPadding, setViewerPadding] = useState(
    () => parseInt(localStorage.getItem("viewerPadding"), 10) || 16
  );
  const [chapterRegex, setChapterRegex] = useState(
    () =>
      localStorage.getItem("chapterRegex") ||
      "(第[一二三四五六七八九十百千零\\d]+章[\\s\\S]*?)(?=第[一二三四五六七八九十百千零\\d]+章|$)"
  );

  const contentRef = useRef(null);

  useEffect(() => {
    const savedFileContent = localStorage.getItem("fileContent");
    const savedSelectedChapter = localStorage.getItem("selectedChapter");

    if (savedFileContent) {
      const extractedChapters = extractChapters(savedFileContent);
      setChapters(extractedChapters);
    }

    if (savedSelectedChapter && savedFileContent) {
      const chapterIndex = parseInt(savedSelectedChapter, 10);
      if (chapterIndex >= 0) {
        setSelectedChapter(chapterIndex);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedChapter !== null) {
      localStorage.setItem("selectedChapter", selectedChapter);
    }
  }, [selectedChapter]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;

      localStorage.setItem("fileContent", fileContent);
      const extractedChapters = extractChapters(fileContent);
      setChapters(extractedChapters);
      setSelectedChapter(0);
    };
    reader.readAsText(file);
  };

  const extractChapters = (content) => {
    const chapterRegexPattern = new RegExp(chapterRegex, "g");
    const matches = [];
    let match;

    while ((match = chapterRegexPattern.exec(content)) !== null) {
      matches.push(match[0].trim());
    }

    return matches;
  };

  const formatContent = (content) => {
    if (!content) return null;
    const lines = content
      .split("\n")
      .map((line) => line.replace(/^\s+/, ""))
      .map((line, index) => (
        <p
          key={index}
          style={{
            fontSize: `${fontSize}px`,
            padding: `0 ${viewerPadding}px`,
          }}
          className="line"
        >
          {line}
        </p>
      ));
    return lines;
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
      if (nearBottom && selectedChapter < chapters.length - 1) {
        setSelectedChapter(selectedChapter + 1);
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const handleTranslate = () => {
    // TO DO: TRANSLATION LOGIC
    alert("Translation feature coming soon!");
  };

  return (
    <div className="viewer-container">
      <Header
        chapters={chapters}
        selectedChapter={selectedChapter}
        showChapterList={showChapterList}
        setShowChapterList={setShowChapterList}
        onFileUpload={handleFileUpload}
        fontSize={fontSize}
        setFontSize={setFontSize}
        viewerPadding={viewerPadding}
        setViewerPadding={setViewerPadding}
        chapterRegex={chapterRegex}
        setChapterRegex={setChapterRegex}
      />
      <div className="viewer-content">
        {showChapterList && (
          <ChapterList
            chapters={chapters}
            selectedChapter={selectedChapter}
            onSelectChapter={setSelectedChapter}
          />
        )}
        <div
          className="chapter-viewer"
          ref={contentRef}
          onScroll={handleScroll}
        >
          {selectedChapter !== null && chapters[selectedChapter] ? (
            <div>
              <div
                style={{
                  padding: `0 ${viewerPadding}px`,
                  marginBottom: "16px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTranslate}
                >
                  {" "}
                  Translate
                </Button>
              </div>

              {formatContent(chapters[selectedChapter])}
            </div>
          ) : (
            <p>Select a chapter to view its content.</p>
          )}
        </div>
      </div>
      <Footer
        onNextChapter={() => setSelectedChapter(selectedChapter + 1)}
        onPrevChapter={() => setSelectedChapter(selectedChapter - 1)}
        hasNext={selectedChapter < chapters.length - 1}
        hasPrev={selectedChapter > 0}
      />
    </div>
  );
};

export default Viewer;
