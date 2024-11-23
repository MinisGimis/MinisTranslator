export const TRANSLATE_TO_ENGLISH_PROMPT =
  "Can you translate this chinese web novel into English? Please try to keep the punctuation, swearing, meaning, and connotation the same. Some words might be internet slang or have sexual meanings. Please make it in normal English rather than a formal essay. Note that this is in past tense.";

export const OPENAI_API_KEY = "";

export const TRANSLATION_ENDPOINT =
  "https://api.openai.com/v1/chat/completions";

export const TRANSLATION_MODEL = "gpt-4o-mini";

export const TRANSLATION_FORMAT_PROMPT =
  'Please use existing term and character translations if it exists. Try to keep the any newlines present in the original text. Please return the translation as well as any new terms and characters with the following JSON format: {"TRANSLATION": "TRANSLATED STRING (with new lines)" , "NEW_TERMS": [{term in original: original term, translation: translated term}, ...], "NEW_CHARACTERS": [{name in original: original name, name in translation: translated name, gender: man or woman or it}]}, DO NOT INCLUDE NEW LINES OR SPACES IN THE JSON OUTSIDE OF THE TRANSLATION';
