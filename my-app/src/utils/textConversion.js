import { Converter } from "opencc-js";
import pinyin from "pinyin";

/**
 * Converts text from simplified Chinese to traditional Chinese.
 * Uses s2twp.json for conversion (Simplified to Traditional, Taiwan and Hong Kong variants including phrasing).
 * @param {string} text The text to convert.
 * @returns {string} The converted traditional Chinese text.
 */
export const convertToTraditional = (text) => {
  if (!text) {
    return "";
  }
  const converter = new Converter({ from: "cn", to: "twp" });
  return converter(text);
};

/**
 * Generates Pinyin for the given text.
 * @param {string} text The text for which to generate Pinyin.
 * @returns {Array<Array<string>>} An array of arrays, where each inner array contains Pinyin strings for a character.
 *                                Returns an empty array if input is empty or not a string.
 */
export const getPinyin = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }
  // pinyin() returns an array of arrays, e.g., [["zhōng"], ["wén"]]
  // We will directly return this structure.
  // style: STYLE_TONE for tone marks.
  // segment: true to handle word segmentation if desired by the library, though for char-by-char it's less critical.
  // heteronym: false to get only the most common pronunciation.
  return pinyin(text, {
    style: pinyin.STYLE_TONE,
    segment: true,
    heteronym: false,
  });
};
