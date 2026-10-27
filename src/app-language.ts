// English is the source language. Add other locales explicitly when supported.
export const APP_LANGUAGE = "en";
export const APP_LOCALE = "en-GB";

export const normaliseSearchText = (text: string) =>
  text.toLocaleLowerCase(APP_LOCALE);
