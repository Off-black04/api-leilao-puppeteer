import fs from "fs/promises";
// Importa diretamente o parser sem o carregamento de teste
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import * as cheerio from "cheerio";

/**
 * Extrai campos de um PDF de edital.
 * @param {string} filePath - Caminho temporário do PDF enviado
 */
export async function extrairDadosEditalPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const { text } = await pdfParse(dataBuffer);

  // Usa regex para extrair cada campo
  const numeroProcesso = /PROCESSO Nº[:\s]*([\d\.\-\/]+)/i.exec(text)?.[1] || "";
  const acao            = /AÇÃO[:\s]*([^\n]+)/i.exec(text)?.[1].trim() || "";
  const primeiraPraca   = /1ª PRAÇA[:\s]*([^\n]+)/i.exec(text)?.[1].trim() || "";
  const segundaPraca    = /2ª PRAÇA[:\s]*([^\n]+)/i.exec(text)?.[1].trim() || "";
  const valorAvaliacao  = /VALOR DE AVALIAÇÃO[:\s]*R\$\s*([\d\.\,]+)/i.exec(text)?.[1] || "";
  const debitoProcesso  = /DÉBITO DO PROCESSO.*?[:\s]*R\$\s*([\d\.\,]+)/i.exec(text)?.[1] || "";
  const descricaoBem    = /DESCRIÇÃO DO\(S\) BEM\(NS\):([\s\S]*?)MATRÍCULA/i.exec(text)?.[1].trim() || "";

  return {
    numeroProcesso,
    acao,
    primeiraPraca,
    segundaPraca,
    valorAvaliacao,
    debitoProcesso,
    descricaoBem,
    textoCompletoEdital: text,
  };
}

/**
 * Extrai campos de um HTML de edital.
 * @param {string} filePath - Caminho temporário do HTML enviado
 */
export async function extrairDadosEditalHTML(filePath) {
  const html = await fs.readFile(filePath, "utf-8");
  const $ = cheerio.load(html);
  const bodyText = $("body").text();

  // Mesmas regex, agora sobre o texto do body
  const numeroProcesso = /PROCESSO Nº[:\s]*([\d\.\-\/]+)/i.exec(bodyText)?.[1] || "";
  const acao            = /AÇÃO[:\s]*([^\n]+)/i.exec(bodyText)?.[1].trim() || "";
  const primeiraPraca   = /1ª PRAÇA[:\s]*([^\n]+)/i.exec(bodyText)?.[1].trim() || "";
  const segundaPraca    = /2ª PRAÇA[:\s]*([^\n]+)/i.exec(bodyText)?.[1].trim() || "";
  const valorAvaliacao  = /VALOR DE AVALIAÇÃO[:\s]*R\$\s*([\d\.\,]+)/i.exec(bodyText)?.[1] || "";
  const debitoProcesso  = /DÉBITO DO PROCESSO.*?[:\s]*R\$\s*([\d\.\,]+)/i.exec(bodyText)?.[1] || "";
  const descricaoBem    = /DESCRIÇÃO DO\(S\) BEM\(NS\):([\s\S]*?)MATRÍCULA/i.exec(bodyText)?.[1].trim() || "";

  return {
    numeroProcesso,
    acao,
    primeiraPraca,
    segundaPraca,
    valorAvaliacao,
    debitoProcesso,
    descricaoBem,
    textoCompletoEdital: bodyText.trim(),
  };
}
