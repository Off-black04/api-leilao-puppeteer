import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Calculator,
  Trophy,
  DollarSign,
  Lightbulb
} from "lucide-react";
import { Property, CompetitorPrediction } from "@/types/property";

interface CompetitorPredictorProps {
  property: Property;
}

const CompetitorPredictor = ({ property }: CompetitorPredictorProps) => {
  const [bidAmount, setBidAmount] = useState([property.minimumBid]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculatePrediction = (amount: number): CompetitorPrediction => {
    const marketRatio = amount / property.marketValue;
    const minimumRatio = amount / property.minimumBid;
    
    // Simulate competitor calculation based on property characteristics
    let expectedCompetitors = 8;
    if (property.iplIndex > 7) expectedCompetitors = 15;
    else if (property.iplIndex > 5) expectedCompetitors = 12;
    else if (property.iplIndex < 3) expectedCompetitors = 4;
    
    // Adjust based on bid amount
    if (minimumRatio > 1.5) expectedCompetitors = Math.max(1, expectedCompetitors - 5);
    else if (minimumRatio > 1.2) expectedCompetitors = Math.max(2, expectedCompetitors - 3);
    
    const profitMargin = ((property.marketValue - amount) / amount) * 100;
    
    let riskLevel: "Baixo" | "Médio" | "Alto" = "Médio";
    if (profitMargin > 40) riskLevel = "Baixo";
    else if (profitMargin < 20) riskLevel = "Alto";
    
    const maxRecommendedBids = Math.ceil(expectedCompetitors * 0.8);
    
    let recommendation = "";
    if (profitMargin > 50) {
      recommendation = "Excelente oportunidade! Lance recomendado.";
    } else if (profitMargin > 30) {
      recommendation = "Boa oportunidade com margem de lucro atrativa.";
    } else if (profitMargin > 15) {
      recommendation = "Oportunidade moderada. Avalie outros fatores.";
    } else {
      recommendation = "Lance acima do recomendado. Alto risco.";
    }
    
    return {
      maxRecommendedBids,
      expectedCompetitors,
      profitMarginAt: {
        bid1: ((property.marketValue - property.minimumBid) / property.minimumBid) * 100,
        bid5: ((property.marketValue - property.minimumBid * 1.2) / (property.minimumBid * 1.2)) * 100,
        bid10: ((property.marketValue - property.minimumBid * 1.5) / (property.minimumBid * 1.5)) * 100,
      },
      riskLevel,
      recommendation
    };
  };

  const prediction = calculatePrediction(bidAmount[0]);
  const currentProfitMargin = ((property.marketValue - bidAmount[0]) / bidAmount[0]) * 100;

  return (
    <div className="space-y-6">
      {/* Preditor Header */}
      <Card className="shadow-gold bg-gradient-gold text-primary border border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Preditor de Concorrência Ninja
            <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
              IA Exclusiva
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              Você pode dar até {property.maxBidsRecommended || 8} lances
            </div>
            <div className="text-lg mb-3">
              e ainda ter lucro de {property.expectedProfit || 30}% ou mais
            </div>
            <p className="text-sm text-primary/80">
              Análise baseada em histórico de leilões similares e comportamento de compradores
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Simulador de Lance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Simulador de Lance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Valor do seu lance:</span>
              <span className="text-lg font-bold text-accent">{formatCurrency(bidAmount[0])}</span>
            </div>
            <Slider
              value={bidAmount}
              onValueChange={setBidAmount}
              max={property.marketValue}
              min={property.minimumBid}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Lance mín: {formatCurrency(property.minimumBid)}</span>
              <span>Valor mercado: {formatCurrency(property.marketValue)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center border-accent/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-1">
                {prediction.expectedCompetitors}
              </div>
              <div className="text-sm text-muted-foreground">
                Competidores estimados
              </div>
            </Card>

            <Card className="p-4 text-center border-accent/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-1">
                {currentProfitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Margem de lucro
              </div>
            </Card>

            <Card className="p-4 text-center border-accent/20">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className={`h-8 w-8 ${
                  prediction.riskLevel === 'Baixo' ? 'text-accent' : 
                  prediction.riskLevel === 'Médio' ? 'text-warning' : 'text-destructive'
                }`} />
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                prediction.riskLevel === 'Baixo' ? 'text-accent' : 
                prediction.riskLevel === 'Médio' ? 'text-warning' : 'text-destructive'
              }`}>
                {prediction.riskLevel}
              </div>
              <div className="text-sm text-muted-foreground">
                Nível de risco
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Análise Detalhada */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Análise de Cenários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="font-semibold">1º Lance</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(property.minimumBid)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={prediction.profitMarginAt.bid1} className="flex-1" />
                <span className="text-sm font-medium text-accent">
                  {prediction.profitMarginAt.bid1.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-warning" />
                <span className="font-semibold">5º Lance</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(property.minimumBid * 1.2)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={prediction.profitMarginAt.bid5} className="flex-1" />
                <span className="text-sm font-medium text-warning">
                  {prediction.profitMarginAt.bid5.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-destructive" />
                <span className="font-semibold">10º Lance</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(property.minimumBid * 1.5)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={Math.max(0, prediction.profitMarginAt.bid10)} className="flex-1" />
                <span className="text-sm font-medium text-destructive">
                  {prediction.profitMarginAt.bid10.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendação */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Recomendação da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 mb-4">
            <p className="text-sm leading-relaxed">{prediction.recommendation}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-accent">Pontos Positivos:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Desconto de {property.discount}% sobre o valor de mercado</li>
                <li>• IPL {property.iplIndex} - {property.iplClassification}</li>
                <li>• Localização em {property.city}, {property.state}</li>
                {property.financing && <li>• Aceita financiamento bancário</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-warning">Pontos de Atenção:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Imóvel {property.status.toLowerCase()}</li>
                <li>• Leilão {property.auctionType.toLowerCase()}</li>
                <li>• {prediction.expectedCompetitors} competidores estimados</li>
                <li>• Risco classificado como {prediction.riskLevel.toLowerCase()}</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              Criar Alerta para este Leilão
            </Button>
            <Button variant="outline" className="flex-1 border-accent text-accent hover:bg-accent/10">
              Baixar Relatório Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorPredictor;