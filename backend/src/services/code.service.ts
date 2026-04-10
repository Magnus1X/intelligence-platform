import { aiService } from "./ai.service";

export class CodeService {
  async analyze(code: string, language: string) {
    return aiService.analyzeCode(code, language);
  }

  async explain(code: string, language: string) {
    const explanation = await aiService.explainCode(code, language);
    return { explanation };
  }
}
