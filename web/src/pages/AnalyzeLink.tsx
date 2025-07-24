import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AnalyzeLink() {
  const [url, setUrl] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analisarLink() {
    if (!url) return toast.error("Cole o link do imóvel.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/analisar-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: url }),
      });

      if (!res.ok) throw new Error("Erro ao analisar link.");

      const data = await res.json();
      setResultado(data);
      toast.success("Análise via link concluída!");
    } catch (err) {
      toast.error("Erro ao analisar link.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function analisarEdital() {
    if (!arquivo) return toast.error("Envie um edital em PDF!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("edital", arquivo);

      const res = await fetch("http://localhost:3001/analisar-edital", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao analisar edital.");

      const data = await res.json();
      setResultado(data);
      toast.success("Análise via edital concluída!");
    } catch (err) {
      toast.error("Erro ao analisar edital.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Analisar Imóvel</h1>

      {/* Link */}
      <div className="space-y-2">
        <Input
          placeholder="Cole o link do imóvel"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={analisarLink} disabled={loading}>
          {loading ? "Analisando..." : "Analisar Link"}
        </Button>
      </div>

      <hr className="my-4" />

      {/* PDF */}
      <div className="space-y-2">
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => setArquivo(e.target.files?.[0] || null)}
        />
        <Button onClick={analisarEdital} disabled={loading}>
          {loading ? "Analisando..." : "Analisar Edital PDF"}
        </Button>
      </div>

      {/* Resultado */}
      {resultado && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p><strong>Título:</strong> {resultado.titulo}</p>
            <p><strong>Endereço:</strong> {resultado.endereco}</p>
            <p><strong>Cidade:</strong> {resultado.cidade}</p>
            <p><strong>Estado:</strong> {resultado.estado}</p>
            <p><strong>Ocupação:</strong> {resultado.ocupacao}</p>
            <p><strong>Tipo:</strong> {resultado.tipo}</p>
            <p><strong>Avaliação:</strong> {resultado.avaliacao}</p>
            <p><strong>Lance Mínimo:</strong> {resultado.lanceMinimo}</p>
            <p><strong>Status:</strong> {resultado.status}</p>
            <p><strong>Data do Leilão:</strong> {resultado.dataLeilao}</p>
            <p><strong>Score:</strong> {resultado.score}</p>
            {resultado.link && (
              <p>
                <strong>Ver imóvel original:</strong>{" "}
                <a
                  href={resultado.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Acessar link
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
