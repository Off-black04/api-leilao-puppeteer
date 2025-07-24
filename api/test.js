// test.js
import "dotenv/config";                       // carrega SCRAPER_API_KEY do .env
import { extrairDadosZukerman } from "./scraperZukerman.js";

(async () => {
  try {
    const link = "https://www.portalzuk.com.br/imovel/mg/belo-horizonte/planalto/rua-risoleta-pinto-sardinha-750/33641-206348";
    const dados = await extrairDadosZukerman(link);
    console.log("🚀 Dados extraídos:", JSON.stringify(dados, null, 2));
  } catch (err) {
    console.error("❌ Erro no teste:", err);
  }
})();
