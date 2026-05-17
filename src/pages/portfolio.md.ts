import type { APIRoute } from "astro";
import readme from "../../README.md?raw";

const body = readme
  .replace(/^#[^\n]*/, "# Daniel Miller - Career Portfolio")
  .replace(/\n+(?:---\n+)?## License[\s\S]*$/, "\n");

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="daniel-miller-portfolio.md"',
    },
  });
