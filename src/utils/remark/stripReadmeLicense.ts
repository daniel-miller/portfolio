import type { Root } from "mdast";
import type { VFile } from "vfile";

export default function stripReadmeLicense() {
  return (tree: Root, file: VFile) => {
    const path = (file.history?.[0] ?? file.path ?? "").replace(/\\/g, "/").toLowerCase();
    if (!path.endsWith("/readme.md")) return;

    const idx = tree.children.findIndex(node => {
      if (node.type !== "heading" || node.depth !== 2) return false;
      const first = node.children?.[0];
      return first?.type === "text" && first.value === "License";
    });
    if (idx === -1) return;

    const cut = idx > 0 && tree.children[idx - 1].type === "thematicBreak" ? idx - 1 : idx;
    tree.children.splice(cut);
  };
}
