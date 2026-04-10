import { execSync } from "child_process";
import * as vm from "vm";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface RunResult {
  passed: boolean;
  results: TestCaseResult[];
  error?: string;
  runtime?: string;
}

const TIMEOUT_MS = 5000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function tmpFile(ext: string, content: string): string {
  const file = path.join(os.tmpdir(), `ip_run_${Date.now()}${ext}`);
  fs.writeFileSync(file, content, "utf8");
  return file;
}

function cleanup(...files: string[]) {
  for (const f of files) {
    try { fs.unlinkSync(f); } catch { /* ignore */ }
  }
}

function runShell(cmd: string): { stdout: string; stderr: string; ok: boolean } {
  try {
    const stdout = execSync(cmd, { timeout: TIMEOUT_MS, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    return { stdout: stdout.trim(), stderr: "", ok: true };
  } catch (e: any) {
    return { stdout: "", stderr: (e.stderr ?? e.message ?? "").toString().trim(), ok: false };
  }
}

// ── Language runners ──────────────────────────────────────────────────────────

function runJavaScript(code: string, testCases: { input: string; expectedOutput: string }[]): RunResult {
  const results: TestCaseResult[] = [];

  for (const tc of testCases) {
    try {
      // Wrap user code + call with the raw input expression
      const script = `
${code}
(function(){
  try {
    const __args = [${tc.input}];
    const __fn = (typeof solution !== 'undefined') ? solution
               : (typeof twoSum !== 'undefined') ? twoSum
               : (typeof reverseString !== 'undefined') ? reverseString
               : (typeof isValid !== 'undefined') ? isValid
               : (typeof search !== 'undefined') ? search
               : Object.values(this).find(v => typeof v === 'function');
    const __result = __fn(...__args);
    return JSON.stringify(__result);
  } catch(e) { return '__ERR:' + e.message; }
}).call({})`;

      const ctx = vm.createContext({});
      const actual = vm.runInContext(script, ctx, { timeout: TIMEOUT_MS }) as string;

      if (actual?.startsWith("__ERR:")) {
        results.push({ input: tc.input, expected: tc.expectedOutput, actual: "", passed: false, error: actual.slice(6) });
      } else {
        const passed = actual?.trim() === tc.expectedOutput.trim() ||
                       actual?.replace(/\s/g, "") === tc.expectedOutput.replace(/\s/g, "");
        results.push({ input: tc.input, expected: tc.expectedOutput, actual: actual ?? "", passed });
      }
    } catch (e: any) {
      results.push({ input: tc.input, expected: tc.expectedOutput, actual: "", passed: false, error: e.message });
    }
  }

  return { passed: results.every((r) => r.passed), results };
}

function runPython(code: string, testCases: { input: string; expectedOutput: string }[]): RunResult {
  const results: TestCaseResult[] = [];

  for (const tc of testCases) {
    const runner = `
import json, sys

${code}

try:
    args = [${tc.input}]
    import inspect
    fns = [v for k,v in list(locals().items()) if callable(v) and not k.startswith('_')]
    fn = fns[-1] if fns else None
    result = fn(*args) if fn else None
    print(json.dumps(result))
except Exception as e:
    print("__ERR:" + str(e), file=sys.stderr)
    sys.exit(1)
`;
    const file = tmpFile(".py", runner);
    const { stdout, stderr, ok } = runShell(`python3 "${file}"`);
    cleanup(file);

    if (!ok || stderr.startsWith("__ERR:")) {
      results.push({ input: tc.input, expected: tc.expectedOutput, actual: "", passed: false, error: stderr || "Runtime error" });
    } else {
      const actual = stdout.trim();
      const passed = actual === tc.expectedOutput.trim() || actual.replace(/\s/g, "") === tc.expectedOutput.replace(/\s/g, "");
      results.push({ input: tc.input, expected: tc.expectedOutput, actual, passed });
    }
  }

  return { passed: results.every((r) => r.passed), results };
}

function runJava(code: string, testCases: { input: string; expectedOutput: string }[]): RunResult {
  const results: TestCaseResult[] = [];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ip_java_"));

  // Compile once
  const javaFile = path.join(dir, "Solution.java");
  fs.writeFileSync(javaFile, code, "utf8");
  const compile = runShell(`javac "${javaFile}"`);
  if (!compile.ok) {
    cleanup(javaFile);
    return { passed: false, results: [], error: compile.stderr || "Compilation failed" };
  }

  for (const tc of testCases) {
    const { stdout, stderr, ok } = runShell(`cd "${dir}" && java Solution ${tc.input}`);
    if (!ok) {
      results.push({ input: tc.input, expected: tc.expectedOutput, actual: "", passed: false, error: stderr });
    } else {
      const actual = stdout.trim();
      const passed = actual === tc.expectedOutput.trim();
      results.push({ input: tc.input, expected: tc.expectedOutput, actual, passed });
    }
  }

  try { fs.rmSync(dir, { recursive: true }); } catch { /* ignore */ }
  return { passed: results.every((r) => r.passed), results };
}

function runCpp(code: string, testCases: { input: string; expectedOutput: string }[]): RunResult {
  const results: TestCaseResult[] = [];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ip_cpp_"));
  const srcFile = path.join(dir, "solution.cpp");
  const binFile = path.join(dir, "solution");

  fs.writeFileSync(srcFile, code, "utf8");
  const compile = runShell(`g++ -o "${binFile}" "${srcFile}" -std=c++17`);
  if (!compile.ok) {
    try { fs.rmSync(dir, { recursive: true }); } catch { /* ignore */ }
    return { passed: false, results: [], error: compile.stderr || "Compilation failed" };
  }

  for (const tc of testCases) {
    const { stdout, stderr, ok } = runShell(`echo "${tc.input}" | "${binFile}"`);
    if (!ok) {
      results.push({ input: tc.input, expected: tc.expectedOutput, actual: "", passed: false, error: stderr });
    } else {
      const actual = stdout.trim();
      const passed = actual === tc.expectedOutput.trim();
      results.push({ input: tc.input, expected: tc.expectedOutput, actual, passed });
    }
  }

  try { fs.rmSync(dir, { recursive: true }); } catch { /* ignore */ }
  return { passed: results.every((r) => r.passed), results };
}

// ── Public API ────────────────────────────────────────────────────────────────

export class CodeRunnerService {
  run(
    code: string,
    language: string,
    testCases: { input: string; expectedOutput: string }[]
  ): RunResult {
    const start = Date.now();
    let result: RunResult;

    switch (language) {
      case "javascript":
      case "typescript":
        result = runJavaScript(code, testCases);
        break;
      case "python":
        result = runPython(code, testCases);
        break;
      case "java":
        result = runJava(code, testCases);
        break;
      case "cpp":
        result = runCpp(code, testCases);
        break;
      default:
        result = { passed: false, results: [], error: `Language "${language}" is not supported.` };
    }

    result.runtime = `${Date.now() - start}ms`;
    return result;
  }
}
