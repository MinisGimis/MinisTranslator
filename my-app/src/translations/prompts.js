export const TRANSLATE_TO_ENGLISH_PROMPT =
  "Can you translate this chinese web novel into English? YOU MUST KEEP THE punctuation, swearing, meaning, and connotation the same. Some words might be internet slang or have sexual meanings. Please make it in normal English rather than a formal essay. Note that this is in past tense.";

export const TRANSLATION_ENDPOINT =
  "https://api.openai.com/v1/chat/completions";

export const TRANSLATION_MODEL = "gpt-4o-mini";

export const TRANSLATION_FORMAT_PROMPT =
  'Please translate the following text. Use **existing translations for terms and character names if they are available**. Maintain any **newlines from the original text** in the translation. Your output MUST include: \n1. The translated text. \n2. Any NEW TERMS introduced in this passage that are not already in the existing translations. \n3. Any NEW CHARACTERS introduced, with gender specified.\nReturn your result in the following strict JSON format (DO NOT include any newlines or extra spaces outside the "TRANSLATION" field): \n{"TRANSLATION": "TRANSLATED STRING (with preserved newlines)", "NEW_TERMS": [{"term in original": "original term", "translation": "translated term"}], "NEW_CHARACTERS": [{"name in original": "original name", "name in translation": "translated name", "gender": "man" | "woman" | "it"}]}';

export const CLEANUP_GLOSSARY_PROMPT = `
Review the provided glossary list, which is a JSON string containing "terms" and "characters" arrays.
Your task is to:
1. Identify and remove duplicate entries. For terms, a duplicate is based on the original term. For characters, a duplicate is based on the original name. If duplicates are found, keep the entry with the most accurate or common translation.
2. Update translations to their most common usage or provide corrected/improved translations where appropriate.
3. Ensure consistent and clean formatting for each term and character (e.g., capitalization, spacing).
4. Return a single JSON object with exactly two keys: "cleaned_terms" and "cleaned_characters".

- "cleaned_terms": This must be an array of objects. Each object in this array must have exactly two keys:
  - "original": The original term (string).
  - "translation": The cleaned and corrected translation (string).

- "cleaned_characters": This must be an array of objects. Each object in this array must have exactly three keys:
  - "original_name": The original character name (string).
  - "translated_name": The cleaned and corrected translated name (string).
  - "gender": The character's gender (string, e.g., "man", "woman", "it").

Example of the required output format:
{
  "cleaned_terms": [
    {"original": "你好", "translation": "Hello"},
    {"original": "世界", "translation": "World"}
  ],
  "cleaned_characters": [
    {"original_name": "张三", "translated_name": "Zhang San", "gender": "man"}
  ]
}

Ensure your response is ONLY this JSON object, with no other text or explanations before or after it. The input JSON structure may differ from this output structure; you must transform it.
`;
