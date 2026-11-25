const BLOCK_NODE_TYPES = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "codeBlock",
  "listItem",
]);

function convertNodeToText(node) {
  if (!node) {
    return "";
  }

  // Normal text
  if (node.type === "text") {
    return node.text ?? "";
  }

  // Line break
  if (node.type === "hardBreak") {
    return "\n";
  }

  // User mention
  if (node.type === "mention") {
    return node.attrs?.text ?? "";
  }

  // Emoji
  if (node.type === "emoji") {
    return node.attrs?.text ?? "";
  }

  // Bullet list
  if (node.type === "bulletList") {
    return (node.content ?? [])
      .map((item) => `• ${convertNodeToText(item).trim()}`)
      .join("\n");
  }

  // Ordered list
  if (node.type === "orderedList") {
    return (node.content ?? [])
      .map((item, index) => `${index + 1}. ${convertNodeToText(item).trim()}`)
      .join("\n");
  }

  // Table cells
  if (node.type === "tableRow") {
    return (node.content ?? []).map(convertNodeToText).join(" | ");
  }

  // Table rows
  if (node.type === "table") {
    return (node.content ?? []).map(convertNodeToText).join("\n");
  }

  // Process nested content
  const text = (node.content ?? []).map(convertNodeToText).join("");

  // Add line breaks for block elements
  if (BLOCK_NODE_TYPES.has(node.type)) {
    return `${text}\n`;
  }

  return text;
}

export function parseAdfToText(adf) {
  if (!adf) {
    return "";
  }

  // Handle plain text defensively
  if (typeof adf === "string") {
    return adf;
  }

  const text = convertNodeToText(adf);

  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
