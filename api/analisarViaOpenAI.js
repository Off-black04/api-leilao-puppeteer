// api/analisarViaOpenAI.js
import OpenAI from "openai";

const openai = new OpenAI();

export async function analisarImovelComGPT(dados) {
  // Template fixo para o relatório
  const template = `
# Relatório de Análise de Edital

**Processo Nº:** {{numeroProcesso}}  
**Ação:** {{acao}}  
**Modalidade:** Edital de Hasta Pública  

---

## 1. Resumo Executivo
- **Bem:** {{descricaoBemResumo}}  
- **1ª Praça:** {{primeiraPraca}}  
- **2ª Praça:** {{segundaPraca}}  
- **Valor de Avaliação:** R$ {{valorAvaliacao}}  
- **Dívida Condominial:** R$ {{debitoProcesso}}  

---

## 2. Preditor de Concorrência
- **Estimativa de Participantes:**  
  - 1ª Praça: {{preditor.concorrentes1}}  
  - 2ª Praça: {{preditor.concorrentes2}}  
- **Nível de Disputa:**  
  - 1ª Praça: {{preditor.nivel1}}  
  - 2ª Praça: {{preditor.nivel2}}  
- **Fatores influenciadores:**  
  - Localização (${dados.cidade}/${dados.estado})  
  - Desconto sobre avaliação: {{preditor.desconto}}%  

---

## 3. Análise Financeira
- **Lance Mínimo:** R$ ${dados.lanceMinimo || dados.valorCausa}  
- **Margem de Segurança:** {{margemSeguranca}}%  
- **Custo Estimado de Desocupação/Reparo:** R$ {{custoAdicional}}  

---

## 4. Pontos de Atenção e Riscos
- **Ocorrência de ocupação:** ${dados.ocupacao || "—"}  
- **Débitos e Ônus:** R$ ${dados.debitoProcesso || "0"}, taxas adicionais: R$ {{taxas}}  
- **Questões Judiciais:** Publicação em ${dados.dataPublicacao}  

---

## 5. Estratégia de Lance
- **Entrada (1ª Praça):** R$ {{sugestaoLance1}}  
- **Máximo (2ª Praça):** R$ {{sugestaoLance2}}  
- **Incrementos mínimos:** Conforme edital  
- **Ponto de Saída:** R$ {{tetoLance}}  

---

## 6. Conclusão e Recomendações
> Com base nos dados, recomenda-se **participar** do leilão, mantendo lance máximo em R$ {{tetoLance}} para preservar margem de segurança.

---

**Link do Edital:** (via upload)  
**Data de Geração:** {{dataAtual}}
`;

  // Monta o prompt substituindo as variáveis conhecidas
  const filled = template
    .replace("{{numeroProcesso}}", dados.numeroProcesso)
    .replace("{{acao}}", dados.acao || "—")
    .replace("{{descricaoBemResumo}}", dados.descricaoBem?.slice(0, 100) || "—")
    .replace("{{primeiraPraca}}", dados.primeiraPraca)
    .replace("{{segundaPraca}}", dados.segundaPraca)
    .replace("{{valorAvaliacao}}", dados.valorAvaliacao)
    .replace("{{debitoProcesso}}", dados.debitoProcesso || "0")
    // placeholders para o GPT preencher:
    // preditor, margemSeguranca, custoAdicional, taxas, sugestaoLance1, sugestaoLance2, tetoLance, dataAtual
    .replace("{{preditor.concorrentes1}}", "")
    .replace("{{preditor.concorrentes2}}", "")
    .replace("{{preditor.nivel1}}", "")
    .replace("{{preditor.nivel2}}", "")
    .replace("{{preditor.desconto}}", "")
    .replace("{{margemSeguranca}}", "")
    .replace("{{custoAdicional}}", "")
    .replace("{{taxas}}", "")
    .replace("{{sugestaoLance1}}", "")
    .replace("{{sugestaoLance2}}", "")
    .replace("{{tetoLance}}", "")
    .replace("{{dataAtual}}", new Date().toLocaleString("pt-BR"));

  // Envia ao GPT
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em análise de leilões. Preencha as partes em branco do relatório com base nos dados fornecidos, fazendo estimativas ponderadas quando necessário.",
      },
      { role: "user", content: filled },
    ],
    temperature: 0.7,
  });

  // Retorna o texto gerado
  return response.choices[0].message.content;
}
