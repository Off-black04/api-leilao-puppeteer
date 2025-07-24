import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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"
});

export async function analisarImovelComGPT(dados) {
  const prompt = `
Você é um especialista em análise de leilões de imóveis. Com base nas informações a seguir, crie um relatório completo e objetivo, destacando:

- Avaliação vs. Lance Mínimo
- Oportunidade percebida
- Status e Ocupação
- Pontos de atenção
- Sugestão para o investidor

Dados do imóvel:
${JSON.stringify(dados, null, 2)}
`;

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Você é um analista de imóveis experiente, especialista em leilões." },
      { role: "user", content: prompt }
    ]
  });

  return chatResponse.choices[0].message.content;
}
