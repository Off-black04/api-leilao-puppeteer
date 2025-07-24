// scraperZukerman.js
// Função que extrai dados do imóvel no Portal Zukerman usando Puppeteer com Stealth

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import 'dotenv/config';

// ativa stealth para evitar bloqueios
puppeteer.use(StealthPlugin());

/**
 * Extrai dados de imóvel a partir do link informado.
 * Usa navegador real para driblar bloqueios e captura dataLayer diretamente.
 * @param {string} link - URL do imóvel no Portal Zukerman
 * @returns {Promise<Object>} Objeto com campos extraídos
 */
export async function extrairDadosZukerman(link) {
  if (!link) throw new Error('Link é obrigatório');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    // user agent real para camuflar
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/114.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width:1280, height:800 });
    await page.goto(link, { waitUntil:'networkidle2', timeout:60000 });

    // Avalia no contexto da página
    const dados = await page.evaluate(() => {
      const text = sel => document.querySelector(sel)?.textContent.trim() || '';
      const titulo = text('h1');

      // Extrai dataLayer diretamente
      const dl = window.dataLayer && window.dataLayer[0] || {};
      const endereco = document.querySelector('meta[name="description"]')
        ?.content.split(' - ')[1].trim() || '';
      const bairro   = dl.bairro || '';
      const cidade   = dl.cidade || '';
      const estado   = dl.uf || '';
      const tipo     = dl.tipoImovel || '';
      const avaliacao= dl.price ? dl.price.toString() : '';

      const status       = text('.property-status-title');
      const ocupacao     = status;
      const lanceMinimo  = text('li.card-property-price[data-pracas="2"] .card-property-price-value');
      const dataLeilao   = text('li.card-property-price[data-pracas="2"] .card-property-price-data');

      return {
        titulo,
        endereco,
        bairro,
        cidade,
        estado,
        ocupacao,
        status,
        tipo,
        lanceMinimo,
        avaliacao,
        dataLeilao,
        score: 0,
        link: window.location.href
      };
    });

    console.log('✅ Dados extraídos com sucesso:', dados);
    return dados;
  } finally {
    await browser.close();
  }
}
