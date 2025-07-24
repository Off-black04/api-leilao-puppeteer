import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

import { analisarEdital } from "./analisarEdital.js";

const upload = multer({ dest: "uploads/" });
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "API de Edital OK" });
});

// Upload de edital (PDF ou HTML)
app.post(
  "/upload-edital",
  upload.single("edital"),
  async (req, res) => {
    try {
      // Validação
      if (!req.file) {
        return res
          .status(400)
          .json({ erro: "Nenhum arquivo enviado no campo 'edital'." });
      }

      const { mimetype, path: filePath } = req.file;

      // Usa nossa função única para extrair e analisar
      const resultado = await analisarEdital(filePath, mimetype);

      return res.json(resultado);
    } catch (err) {
      console.error("❌ Erro no upload/extrair edital:", err);
      return res
        .status(500)
        .json({ erro: "Erro interno ao processar o edital." });
    }
  }
);

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API de Edital rodando na porta ${PORT}`);
});
