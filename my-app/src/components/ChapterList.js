import React from "react";
import "../styles/App.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ChapterList = ({
  chapters,
  selectedChapter,
  onSelectChapter,
  translations,
}) => (
  <div className="chapter-list">
    <h2>Chapters ({chapters.length})</h2>
    <List className="chapter-ul">
      {chapters.map((chapter, index) => (
        <ListItem
          key={index}
          disablePadding
          className={`chapter-item ${
            selectedChapter === index ? "selected" : ""
          }`}
        >
          <ListItemButton
            selected={selectedChapter === index}
            onClick={() => onSelectChapter(index)}
            className="chapter-button"
          >
            <ListItemText
              primary={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {chapter.split("\n")[0]}
                  {translations &&
                    translations[index] &&
                    typeof translations[index] === "string" &&
                    translations[index].trim() !== "" && (
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        style={{ marginLeft: "8px", color: "green" }}
                      />
                    )}
                </span>
              }
              primaryTypographyProps={{
                style: {
                  fontWeight: selectedChapter === index ? "bold" : "normal",
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </div>
);

export default ChapterList;
