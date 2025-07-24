// api/analisarEdital.js
import {
  extrairDadosEditalHTML,
  extrairDadosEditalPDF,
} from "./scraperEdital.js";
import { analisarImovelComGPT } from "./analisarViaOpenAI.js";

/**
 * Dado o caminho do arquivo e seu MIME type, extrai
 * os dados do edital e gera o relatório via GPT.
 *
 * @param {string} filePath – caminho temporário do arquivo
 * @param {string} mimeType – tipo MIME do arquivo (application/pdf ou text/html)
 * @returns {Promise<Object>} – objeto com todos os campos extraídos + relatorio
 */
export async function analisarEdital(filePath, mimeType) {
  let dados;

  // 1) Extrai campos conforme o tipo
  if (mimeType === "application/pdf") {
    dados = await extrairDadosEditalPDF(filePath);
  } else {
    dados = await extrairDadosEditalHTML(filePath);
  }

  // 2) Gera relatório via OpenAI
  let relatorio;
  try {
    relatorio = await analisarImovelComGPT(dados);
  } catch (err) {
    console.warn(
      "⚠️ Falha ao gerar relatório via GPT, usando fallback:",
      err.message
    );
    relatorio = "RELATÓRIO DUMMY: Extração concluída com sucesso.";
  }

  // 3) Retorna combinação de dados e relatório
  return { ...dados, relatorio };
}
