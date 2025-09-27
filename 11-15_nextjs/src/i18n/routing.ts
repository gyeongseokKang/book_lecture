import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ko"],

  // Used when no locale matches

  localePrefix: "as-needed",

  defaultLocale: "en",
  localeDetection: false,
});
