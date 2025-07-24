// api/scraperCaixa.js
import puppeteer from "puppeteer";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

export async function extrairDadosCaixa(link) {
  let finalUrl = link;

  // Puppeteer: submete formulário se existir
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });

  const form = await page.$("form#frm_detalhe");
  if (form) {
    await form.evaluate(f => f.submit());
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 0 });
    finalUrl = page.url();
  }
  await browser.close();

  // Fetch + Cheerio
  const proxyUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(finalUrl)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(`ScraperAPI erro: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Usa IDs padrão da Caixa
  const dados = {
    titulo:        $("h1").first().text().trim() || "",
    endereco:      $("#lblEndereco").text().trim() || "",
    bairro:        $("#lblBairro").text().trim()   || "",
    cidadeUF:      $("#lblCidade").text().trim()   || "",
    tipoImovel:    $("#lblTipoImovel").text().trim()   || "",
    ocupacao:      $("#lblSituacao").text().trim()     || "",  // se existir
    lanceInicial:  $("#lblLanceInicial").text().trim()  || "",
    valorAvaliacao:$("#lblValorAvaliacao").text().trim()|| "",
    dataLeilao:    $("#lblDataLeilao").text().trim()    || "",
    status:        $("#lblStatusLeilao").text().trim()  || "",
    link: finalUrl
  };

  console.log("✅ Dados Caixa extraídos:", dados);
  return dados;
}
