import { Tool } from "@/src/types";

export const SITE_NAME = "Yuitility";
export const SITE_URL = "https://yuitility.app";
export const SITE_DESCRIPTION =
  "Free, private browser tools for PDFs, images, calculations, developer workflows, and everyday tasks.";

export const toolPath = (toolId: string) => `/tools/${toolId}`;

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

const categoryKeywords: Record<string, string[]> = {
  finance: ["financial calculator", "calculator online", "free calculator"],
  utility: ["online utility", "browser tool", "free online tool"],
  developer: ["developer tool", "web tool", "free developer utility"],
  pdf: ["PDF tool online", "private PDF tool", "free PDF utility"],
  media: ["image tool online", "private image tool", "free media utility"],
};

export function getToolKeywords(tool: Tool) {
  return [
    tool.title,
    `${tool.title} online`,
    `free ${tool.title.toLowerCase()}`,
    `${tool.title.toLowerCase()} in browser`,
    ...(categoryKeywords[tool.category] ?? categoryKeywords.utility),
  ];
}

export function getToolSteps(tool: Tool) {
  if (tool.category === "finance") {
    return [
      "Enter the values for your scenario.",
      `Review the ${tool.title.toLowerCase()} result as you adjust the inputs.`,
      "Use the result to compare options or plan your next step.",
    ];
  }

  if (tool.category === "pdf" || tool.category === "media" || /image|pdf|zip|collage|meme|favicon/i.test(tool.id)) {
    return [
      "Choose or drag in the file you want to work with.",
      "Set the options that match your output.",
      "Preview, copy, or download the finished result directly from your browser.",
    ];
  }

  return [
    "Add the text, values, or data you want to work with.",
    "Adjust the available settings and review the live result.",
    "Copy, export, or save the finished result when you are ready.",
  ];
}

export function getToolFaqs(tool: Tool) {
  return [
    {
      question: `Is the ${tool.title} free to use?`,
      answer: `Yes. Yuitility provides the ${tool.title} as a free browser-based tool with no account required.`,
    },
    {
      question: `Does the ${tool.title} upload my data?`,
      answer:
        "Your inputs are handled in your browser for the tool experience. Files and data are not sent to a Yuitility processing server.",
    },
    {
      question: `How do I use the ${tool.title}?`,
      answer: `Open the tool, follow the on-screen controls, and use the live result or download action when it is ready.`,
    },
  ];
}

export function getCategoryName(category: string) {
  const categories: Record<string, string> = {
    finance: "Finance & Wealth",
    utility: "Utilities & Media",
    developer: "Developer & Design Tools",
    pdf: "PDF Tools",
    media: "Image & Media Tools",
  };
  return categories[category] || category;
}
