import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import ChapterList from "./ChapterList";
import Footer from "./Footer";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../styles/App.css";
import {
  OPENAI_API_KEY,
  TRANSLATE_TO_ENGLISH_PROMPT,
  TRANSLATION_FORMAT_PROMPT,
  TRANSLATION_ENDPOINT,
  TRANSLATION_MODEL,
} from "../translations/prompts.js";

const Viewer = () => {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("apiKey") || ""
  );

  const [chapters, setChapters] = useState(() => {
    const savedChapters = localStorage.getItem("chapters");
    return savedChapters ? JSON.parse(savedChapters) : [];
  });
  const [selectedChapter, setSelectedChapter] = useState(() => {
    const savedSelectedChapter = localStorage.getItem("selectedChapter");
    return savedSelectedChapter ? parseInt(savedSelectedChapter, 10) : null;
  });
  const [translations, setTranslations] = useState(() => {
    const savedTranslations = localStorage.getItem("translations");
    return savedTranslations ? JSON.parse(savedTranslations) : {};
  });
  const [glossary, setGlossary] = useState(() => {
    const savedGlossary = localStorage.getItem("glossary");
    return savedGlossary
      ? JSON.parse(savedGlossary)
      : {
          terms: [],
          characters: [],
        };
  });
  const [isTranslating, setIsTranslating] = useState(false);
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
      "(第[一二三四五六七八九十百千零0-9]+章[\\s\\S]*?)(?=第[一二三四五六七八九十百千零0-9]+章|$)"
  );

  const [clickedLine, setClickedLine] = useState(null);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const savedFileContent = localStorage.getItem("fileContent");
    if (savedFileContent && chapters.length === 0) {
      const extractedChapters = extractChapters(savedFileContent);
      setChapters(extractedChapters);
    }
  }, [chapters]);

  useEffect(() => {
    if (chapters.length > 0) {
      localStorage.setItem("chapters", JSON.stringify(chapters));
    }
  }, [chapters]);

  useEffect(() => {
    if (selectedChapter !== null) {
      localStorage.setItem("selectedChapter", selectedChapter);
    }
  }, [selectedChapter]);

  useEffect(() => {
    localStorage.setItem("translations", JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    localStorage.setItem("glossary", JSON.stringify(glossary));
  }, [glossary]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let fileContent = e.target.result;

      // Remove leading whitespace from each line while preserving newlines
      fileContent = fileContent
        .split("\n") // Split content into lines
        .map((line) => line.replace(/^\s+/, "")) // Remove leading whitespace
        .join("\n"); // Join lines back into a single string

      localStorage.setItem("fileContent", fileContent);
      const extractedChapters = extractChapters(fileContent);
      setChapters(extractedChapters);
      setSelectedChapter(0);
      setTranslations({});
      setGlossary({ terms: [], characters: [] }); // Reset glossary
      localStorage.removeItem("chapters");
      localStorage.removeItem("selectedChapter");
      localStorage.removeItem("translations");
      localStorage.removeItem("glossary");
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

  const clearTranslation = () => {
    setTranslations((prev) => {
      const updated = { ...prev };
      delete updated[selectedChapter];
      return updated;
    });
  };
  const handleTranslate = async () => {
    if (!chapters[selectedChapter]) return;

    // Split the content into chunks of ~300 characters, stopping at the next new line
    const splitTextIntoChunks = (text, maxChunkSize) => {
      const lines = text.split("\n");
      const chunks = [];
      let currentChunk = "";

      for (const line of lines) {
        if ((currentChunk + line + "\n").length > maxChunkSize) {
          chunks.push(currentChunk.trim());
          currentChunk = line + "\n\n\n";
        } else {
          currentChunk += line + "\n\n";
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      return chunks;
    };

    const contentToTranslate = chapters[selectedChapter]
      .split("\n")
      .map((line) => line.trim())
      .join("\n\n");

    const chunks = splitTextIntoChunks(contentToTranslate, 300);

    const glossaryTerms = glossary.terms
      .map((term) => `"${term["term in original"]}": "${term["translation"]}"`)
      .join(",\n");

    const glossaryCharacters = glossary.characters
      .map(
        (char) =>
          `{"name in original": "${char["name in original"]}", "name in translation": "${char["name in translation"]}", "gender": "${char["gender"]}"}`
      )
      .join(",\n");

    setIsTranslating(true);

    try {
      const translateChunk = async (chunk, attempt = 1) => {
        try {
          const response = await axios.post(
            TRANSLATION_ENDPOINT,
            {
              model: TRANSLATION_MODEL,
              messages: [
                {
                  role: "user",
                  content: `${TRANSLATE_TO_ENGLISH_PROMPT} \n ${TRANSLATION_FORMAT_PROMPT} \n Here is the existing glossary of terms:\n${glossaryTerms}\n\nHere is the existing characters:\n${glossaryCharacters}\n\n`,
                },
                {
                  role: "user",
                  content: chunk,
                },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );

          const rawContent = response.data.choices[0].message.content;

          let parsedResponse;
          try {
            parsedResponse = JSON.parse(rawContent);
          } catch (parseError) {
            const cleanedContent = rawContent
              .replace(/\n/g, "TEMPORARY_LONG_STRING_FOR_NEWLINE")
              .replace(/\\"/g, "TEMPORARY_LONG_STRING_FOR_QUOTES")
              .replace(/\\/g, "")
              .replace(/TEMPORARY_LONG_STRING_FOR_NEWLINE/g, "\n")
              .replace(/TEMPORARY_LONG_STRING_FOR_QUOTES/g, '\\"');
            parsedResponse = JSON.parse(cleanedContent);
          }

          // Validate parsed response
          if (!parsedResponse["TRANSLATION"]) {
            throw new Error('Missing "TRANSLATION" in response.');
          }

          // Extract NEW_TERMS and NEW_CHARACTERS
          return {
            translation: parsedResponse["TRANSLATION"],
            newTerms: parsedResponse["NEW_TERMS"] || [],
            newCharacters: parsedResponse["NEW_CHARACTERS"] || [],
          };
        } catch (error) {
          if (attempt < 5) {
            console.warn(`Translation attempt ${attempt} failed. Retrying...`);
            return await translateChunk(chunk, attempt + 1);
          } else {
            console.error(
              `Translation failed after 5 attempts. Returning original text. Error: ${error}`
            );
            return { translation: chunk, newTerms: [], newCharacters: [] };
          }
        }
      };

      const translatedChunksPromises = chunks.map((chunk) =>
        translateChunk(chunk)
      );
      const translatedResults = await Promise.all(translatedChunksPromises);

      // Extract translations, new terms, and new characters
      const fullTranslation = translatedResults
        .map((result) => result.translation)
        .join("\n\n");
      const newTerms = translatedResults.flatMap((result) => result.newTerms);
      const newCharacters = translatedResults.flatMap(
        (result) => result.newCharacters
      );

      // Update translations
      setTranslations((prev) => ({
        ...prev,
        [selectedChapter]: fullTranslation,
      }));

      // Update glossary terms
      const addedTermsSet = new Set();
      const uniqueNewTerms = newTerms.filter((newTerm) => {
        const termKey = newTerm["term in original"];
        if (
          termKey &&
          !addedTermsSet.has(termKey) &&
          !glossary.terms.some(
            (existingTerm) => existingTerm["term in original"] === termKey
          )
        ) {
          addedTermsSet.add(termKey);
          return true;
        }
        return false;
      });

      if (uniqueNewTerms.length > 0) {
        setGlossary((prevGlossary) => ({
          ...prevGlossary,
          terms: [...prevGlossary.terms, ...uniqueNewTerms],
        }));
      }

      // Update glossary characters
      const addedCharactersSet = new Set();
      const uniqueNewCharacters = newCharacters.filter((newChar) => {
        const charKey = newChar["name in original"];
        if (
          charKey &&
          !addedCharactersSet.has(charKey) &&
          !glossary.characters.some(
            (existingChar) => existingChar["name in original"] === charKey
          )
        ) {
          addedCharactersSet.add(charKey);
          return true;
        }
        return false;
      });

      if (uniqueNewCharacters.length > 0) {
        setGlossary((prevGlossary) => ({
          ...prevGlossary,
          characters: [...prevGlossary.characters, ...uniqueNewCharacters],
        }));
      }
    } catch (error) {
      console.error("Translation failed", error);
      alert(
        "An error occurred during translation. Please check the console for details."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLineClick = (line) => {
    setClickedLine(line);
    setIsLineModalOpen(true);
  };

  const deleteLineFromAllChapters = () => {
    const updatedChapters = chapters.map((chapter) =>
      chapter
        .split("\n")
        .filter((line) => line.trim() !== clickedLine.trim())
        .join("\n")
    );
    setChapters(updatedChapters);
    setIsLineModalOpen(false);
  };

  const addGlossaryEntry = (entry, type) => {
    setGlossary((prevGlossary) => {
      const updated = { ...prevGlossary };
      updated[type] = [...(updated[type] || []), entry];
      return updated;
    });
  };

  const deleteGlossaryEntry = (index, type) => {
    setGlossary((prevGlossary) => {
      const updatedGlossary = { ...prevGlossary };
      updatedGlossary[type].splice(index, 1);
      return updatedGlossary;
    });
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
      if (nearBottom && selectedChapter < chapters.length - 1) {
        setSelectedChapter((prev) => prev + 1);
        contentRef.current.scrollTop = 0;
      }
    }
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
                className="translate-button-container"
                style={{ padding: `0 ${viewerPadding}px` }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  style={{ marginRight: "8px" }}
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearTranslation}
                  style={{ marginRight: "8px" }}
                >
                  Clear Translation
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setIsGlossaryModalOpen(true)}
                >
                  Glossary
                </Button>
              </div>
              <div>
                {(translations[selectedChapter] || chapters[selectedChapter])
                  .split("\n")
                  .map((line, index) => (
                    <p
                      key={index}
                      className="line hoverable-line"
                      style={{
                        fontSize: `${fontSize}px`,
                        padding: `0 ${viewerPadding}px`,
                      }}
                      onClick={() => handleLineClick(line)}
                    >
                      {line}
                    </p>
                  ))}
              </div>
              <div className="scroll-padding">
                <p className="scroll-message">Scroll to continue</p>
              </div>
            </div>
          ) : (
            <p>Select a chapter to view its content.</p>
          )}
        </div>
      </div>
      <Footer
        onNextChapter={() => setSelectedChapter((prev) => prev + 1)}
        onPrevChapter={() => setSelectedChapter((prev) => prev - 1)}
        hasNext={selectedChapter < chapters.length - 1}
        hasPrev={selectedChapter > 0}
      />
      <Modal
        open={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            minWidth: "300px",
          }}
        >
          <h2 id="modal-title">Delete Line</h2>
          <p id="modal-description">
            Are you sure you want to delete this line from all chapters?
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="error"
              onClick={deleteLineFromAllChapters}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsLineModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        aria-labelledby="glossary-title"
        aria-describedby="glossary-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px", // Optional to limit the width
            maxHeight: "80vh", // Restrict maximum height
            overflow: "hidden", // Ensure only the inner content scrolls
          }}
        >
          <h2 id="glossary-title">Glossary</h2>
          <div
            style={{
              maxHeight: "60vh", // Set a fixed height for the scrollable area
              overflowY: "auto", // Enable vertical scrolling
              paddingRight: "16px", // Add padding for better UX
            }}
          >
            <h3>Terms</h3>
            <ul>
              {glossary.terms.map((entry, index) => (
                <li key={index}>
                  {entry["term in original"]} → {entry["translation"]}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteGlossaryEntry(index, "terms")}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
            <TextField
              label="Add Term (Format: Original:Translated)"
              variant="outlined"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  const [original, translated] = e.target.value.split(":");
                  if (original && translated) {
                    addGlossaryEntry({ original, translated }, "terms");
                    e.target.value = "";
                  } else {
                    alert("Invalid format. Use 'Original:Translated'.");
                  }
                }
              }}
            />
            <h3>Characters</h3>
            <ul>
              {glossary.characters.map((char, index) => (
                <li key={index}>
                  {char["name in original"]} → {char["name in translation"]} (
                  {char["gender"]})
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteGlossaryEntry(index, "characters")}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
            <TextField
              label="Add Character (Format: Original:Translated:Gender)"
              variant="outlined"
              size="small"
              style={{ marginTop: "16px", width: "100%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  const [original, translated, gender] =
                    e.target.value.split(":");
                  if (original && translated && gender) {
                    addGlossaryEntry(
                      { original, translated, gender: gender.toLowerCase() },
                      "characters"
                    );
                    e.target.value = "";
                  } else {
                    alert(
                      "Invalid format. Use 'Original:Translated:Gender'. Gender should be 'man', 'woman', or 'it'."
                    );
                  }
                }
              }}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Viewer;
