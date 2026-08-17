#!/usr/bin/env node
/**
 * Re-applies Windows compatibility patches to @benev/turtle after `npm ci`.
 *
 * OmniClip's static build (turtle-standard) has Windows bugs:
 *  - glob returns backslash paths → debase/partial math breaks (files land in
 *    x/x/..., index.css never copied)
 *  - `import(path)` with `C:\...` fails in ESM loader → must use file:// URLs
 *  - ignore patterns joined with backslashes are treated as escapes by glob
 *  - absolute "C:/..." paths confuse path/posix relative() → garbage hrefs
 *  - symlinked node_modules inside x/ gets globbed → executes demo turtle scripts
 *
 * Idempotent: safe to run repeatedly.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const T = join(root, "node_modules", "@benev", "turtle");

async function patch(rel, replacements) {
  const abs = join(T, rel);
  let src = await readFile(abs, "utf-8");
  let changed = false;
  for (const [oldS, newS] of replacements) {
    if (src.includes(newS)) continue; // already applied
    if (!src.includes(oldS)) continue; // nothing to patch
    src = src.split(oldS).join(newS);
    changed = true;
  }
  if (changed) await writeFile(abs, src);
  return changed;
}

await patch("x/utils/find_files.js", [
  [
    'import { join, resolve } from "path";',
    'import { resolve } from "path";',
  ],
  [
    '        const ignore = exclude.map(exclude => join(directory, exclude));\n        const full_paths = await glob(fullpattern, { ignore, nodir: true });',
    '        const ignore = exclude.map(exclude => (directory + "/" + exclude).split("\\\\").join("/"));\n        const full_paths = await glob(fullpattern, { ignore, nodir: true });',
  ],
  [
    '        return full_paths.map(relative => ({',
    '        return full_paths\n            .map(relative => relative.split("\\\\").join("/"))\n            .filter(relative => !/[/\\\\]node_modules[/\\\\]/.test(relative) && !/[/\\\\]\\.git[/\\\\]/.test(relative))\n            .map(relative => ({',
  ],
]);

await patch("x/build/routines/run_all_turtle_scripts.js", [
  [
    'import { dirname } from "path";',
    'import { dirname } from "path";\nimport { pathToFileURL } from "url";',
  ],
  ["await import(path.absolute)", "await import(pathToFileURL(path.absolute).href)"],
]);

await patch("x/build/parts/load_template_function.js", [
  [
    "export async function load_template_function(import_path_for_template_module) {",
    'import { pathToFileURL } from "url";\nexport async function load_template_function(import_path_for_template_module) {',
  ],
  ["await import(import_path_for_template_module)", "await import(pathToFileURL(import_path_for_template_module).href)"],
]);

await patch("x/build/parts/ascertain_html_destination_path.js", [
  [
    "const relative = join(output_directory, partial);",
    'const relative = join(output_directory, partial).split("\\\\").join("/");',
  ],
]);

await patch("x/build/parts/write_webpage.js", [
  [
    "const partial = debase_path(output_directory, destination);",
    'const partial = debase_path(output_directory, destination.split("\\\\").join("/"));',
  ],
  [
    "relative: join(output_directory, partial),",
    'relative: join(output_directory, partial).split("\\\\").join("/"),',
  ],
  [
    "web_root_for_output: final_destination.directory,",
    "web_root_for_output: resolve(output_directory),",
  ],
]);

await patch("x/build/parts/path/path_router.js", [
  [
    'import { PathVersioner } from "./subparts/path_versioner.js";',
    'import { fileURLToPath } from "url";\nimport { PathVersioner } from "./subparts/path_versioner.js";',
  ],
  [
    "export class PathRouter {\n    static make_path_routing_function({ destination_path, web_root_for_output, }) {",
    'const to_posix_absolute = (path) => {\n    const normalized = path.split("\\\\").join("/");\n    return normalized.startsWith("/") ? normalized : "/" + normalized;\n};\nexport class PathRouter {\n    static make_path_routing_function({ destination_path, web_root_for_output, }) {',
  ],
  [
    "destination_path,\n            web_root_for_output,\n            template_path: import_meta_url.slice(\"file://\".length),",
    "destination_path: to_posix_absolute(destination_path),\n            web_root_for_output: to_posix_absolute(web_root_for_output),\n            template_path: to_posix_absolute(fileURLToPath(import_meta_url)),",
  ],
]);

await patch("x/utils/hashing/compute_hash_for_file.js", [
  [
    "const file = await readFile(path, \"utf-8\");",
    'const real_path = path.replace(/^\\/([A-Za-z]:)/, "$1");\n        const file = await readFile(real_path, "utf-8");',
  ],
]);

console.log("turtle patches applied ✅ (idempotent)");
