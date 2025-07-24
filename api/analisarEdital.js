import pdfParse from "pdf-parse";

export async function extrairDadosDoPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    const texto = data.text;

    // Aqui você pode personalizar as extrações com regex
    const titulo = (texto.match(/(IMÓVEL.*?)\n/) || [])[1] || "Título não encontrado";
    const endereco = (texto.match(/Endereço:(.*)/i) || [])[1]?.trim() || "";
    const cidade = (texto.match(/Cidade:(.*)/i) || [])[1]?.trim() || "";
    const estado = (texto.match(/UF:(.*)/i) || [])[1]?.trim() || "";
    const avaliacao = (texto.match(/Avaliação:.*?([\d.,]+)/i) || [])[1] || "";
    const lanceMinimo = (texto.match(/Lance (Inicial|Mínimo):.*?([\d.,]+)/i) || [])[2] || "";
    const dataLeilao = (texto.match(/Data do Leilão: (.*)/i) || [])[1]?.trim() || "";
    const tipo = (texto.match(/Tipo do Imóvel:(.*)/i) || [])[1]?.trim() || "";
    const ocupacao = (texto.match(/Ocupação:(.*)/i) || [])[1]?.trim() || "";

    return {
      titulo,
      endereco,
      cidade,
      estado,
      avaliacao,
      lanceMinimo,
      dataLeilao,
      tipo,
      ocupacao,
      status: "Em análise",
      score: 0,
      link: null
    };
  } catch (err) {
    console.error("Erro ao ler PDF:", err);
    return { erro: "Não foi possível extrair dados do PDF" };
  }
}
