import devindexMenu from "@forsakringskassan/devindex-menu";

devindexMenu([
  {
    key: "api-alternatives",
    title: "Alternatives",
    options: [
      { title: "Default", value: "default" },
      { title: "One Alternative", value: "one-alternative" },
      { title: "Two Alternatives", value: "two-alternatives" },
    ],
  },
  {
    key: "api-ombud",
    title: "Ombud",
    options: [
      { title: "Default", value: "default" },
      { title: "Very Slow response", value: "very-slow-response" },
      { title: "Slower response", value: "slow-response" },
      { title: "Slow Not Found", value: "slow-not-found" },
    ],
  },
]);

import "./main";
