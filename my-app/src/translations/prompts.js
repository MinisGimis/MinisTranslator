export const TRANSLATE_TO_ENGLISH_PROMPT =
  "Can you translate this chinese web novel into English? YOU MUST KEEP THE punctuation, swearing, meaning, and connotation the same. Some words might be internet slang or have sexual meanings. Please make it in normal English rather than a formal essay. Note that this is in past tense.";

export const TRANSLATION_ENDPOINT =
  "https://api.openai.com/v1/chat/completions";

export const TRANSLATION_MODEL = "gpt-4o-mini";

export const TRANSLATION_FORMAT_PROMPT =
  'Please translate the following text. Use **existing translations for terms and character names if they are available**. Maintain any **newlines from the original text** in the translation. Your output MUST include: \n1. The translated text. \n2. Any NEW TERMS introduced in this passage that are not already in the existing translations. \n3. Any NEW CHARACTERS introduced, with gender specified.\nReturn your result in the following strict JSON format (DO NOT include any newlines or extra spaces outside the "TRANSLATION" field): \n{"TRANSLATION": "TRANSLATED STRING (with preserved newlines)", "NEW_TERMS": [{"term in original": "original term", "translation": "translated term"}], "NEW_CHARACTERS": [{"name in original": "original name", "name in translation": "translated name", "gender": "man" | "woman" | "it"}]}';

export const CLEANUP_GLOSSARY_PROMPT = `
Review the following list of terms and characters.
Your task is to:
1. Remove any duplicate entries.
2. Correct translations to their most common usage or provide better translations where applicable.
3. Ensure consistent formatting across all entries.
4. Return the cleaned list in the exact same JSON structure as the input.
`;
