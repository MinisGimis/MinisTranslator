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

/**
 * Attempts to detect the Chinese variant (simplified or traditional) from a sample text.
 * This is a simple heuristic and not guaranteed to be accurate.
 * @param {string} textSample A sample of text (e.g., first 200 characters).
 * @returns {"simplified" | "traditional" | "unknown"} The detected variant or "unknown".
 */
export const detectChineseVariant = (textSample) => {
  if (!textSample || typeof textSample !== "string") {
    return "unknown";
  }

  // Characters more common or unique to Traditional Chinese
  const traditionalChars = new Set(['憂', '慮', '麵', '開', '關', '蘋', '藝', '體', '貝', '見']);
  // Characters more common or unique to Simplified Chinese
  const simplifiedChars = new Set(['忧', '虑', '面', '开', '关', '苹', '艺', '体', '贝', '见']);

  let traditionalCount = 0;
  let simplifiedCount = 0;
  const sampleLength = Math.min(textSample.length, 200); // Analyze up to 200 chars

  for (let i = 0; i < sampleLength; i++) {
    const char = textSample[i];
    if (traditionalChars.has(char)) {
      traditionalCount++;
    }
    if (simplifiedChars.has(char)) {
      simplifiedCount++;
    }
  }

  // Basic decision logic
  // If one count is significantly higher, or if one count is present and the other is zero.
  if (traditionalCount > simplifiedCount && traditionalCount > 2) {
    return "traditional";
  }
  if (simplifiedCount > traditionalCount && simplifiedCount > 2) {
    return "simplified";
  }
  if (traditionalCount > 0 && simplifiedCount === 0) {
    return "traditional";
  }
  if (simplifiedCount > 0 && traditionalCount === 0) {
    return "simplified";
  }

  // If counts are low or ambiguous, default to unknown or a preferred default.
  // For this case, if counts are very close and low, it's hard to tell.
  // If counts are both 0, it might not be Chinese text or uses characters not in our sets.
  return "unknown"; // Or could return "simplified" as a general default
};
