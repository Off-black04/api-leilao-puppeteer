import express from "express";
import cors from "cors";
import { extrairDadosZukerman } from "./scraperZukerman.js";
import { analisarImovelComGPT } from "./analisarViaOpenAI.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analisar-link", async (req, res) => {
  const { link } = req.body;

  if (!link.includes("portalzuk.com.br")) {
    return res.status(400).json({ erro: "Link não suportado" });
  }

  try {
    const dados = await extrairDadosZukerman(link);

    if (dados?.erro) {
      return res.status(500).json({ erro: "Erro na raspagem dos dados." });
    }

    const relatorio = await analisarImovelComGPT(dados);
    return res.json({ ...dados, relatorio });

  } catch (err) {
    console.error("❌ Erro geral:", err);
    res.status(500).json({ erro: "Erro ao processar análise." });
  }
});

app.listen(3001, () => {
  console.log("✅ API com análise via GPT rodando na porta 3001");
});
