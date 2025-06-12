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
 * Detects the Chinese variant (traditional or simplified) of a given text sample.
 * @param {string} textSample A sample of text to analyze.
 * @returns {string} 'traditional', 'simplified'. Defaults to 'simplified'.
 */
export const detectVariant = (textSample) => {
  if (!textSample || typeof textSample !== "string" || textSample.length < 5) {
    return "simplified"; // Default for very short or invalid input
  }

  // More extensive sets might be slightly more accurate but increase overhead.
  // These are chosen for being common and mostly unambiguous.
  const traditionalChars = new Set([
    "語", //语
    "國", //国
    "發", //发
    "電", //电
    "見", //见
    "馬", //马
    "時", //时
    "為", //为
    "個", //个
    "開", //开
    "東", //东
    "車", //车
    "長", //长
    "門", //门
    "選", //选
  ]);

  const simplifiedChars = new Set([
    "语", //語
    "国", //國
    "发", //發
    "电", //電
    "见", //見
    "马", //馬
    "时", //時
    "为", //為
    "个", //個
    "开", //開
    "东", //東
    "车", //車
    "长", //長
    "门", //門
    "选", //選
  ]);

  let traditionalCount = 0;
  let simplifiedCount = 0;

  // Iterate up to a certain number of characters to keep it performant
  const sampleLength = Math.min(textSample.length, 1000); // Analyze up to 1000 chars

  for (let i = 0; i < sampleLength; i++) {
    const char = textSample[i];
    if (traditionalChars.has(char)) {
      traditionalCount++;
    } else if (simplifiedChars.has(char)) {
      simplifiedCount++;
    }
  }

  // Basic heuristic:
  // If one count is significantly higher (e.g., more than double, or a certain threshold difference)
  // This can be refined based on testing with various texts.
  if (traditionalCount > simplifiedCount && traditionalCount > 2) {
    // Check if traditional count is substantially greater
    if (simplifiedCount === 0 || traditionalCount / simplifiedCount > 1.5) {
      return "traditional";
    }
  }

  if (simplifiedCount > traditionalCount && simplifiedCount > 2) {
    // Check if simplified count is substantially greater
    if (traditionalCount === 0 || simplifiedCount / traditionalCount > 1.5) {
      return "simplified";
    }
  }

  // If counts are close, or neither is high enough, or only one type found but very few.
  // Defaulting to simplified as per instructions.
  // One could also return 'unknown' or rely on a larger sample if this isn't decisive enough.
  return "simplified";
};
