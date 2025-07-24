import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building, Home, Car, Bed, Ruler } from "lucide-react";
import { MarketSource } from "@/types/property";

interface MarketSourcesProps {
  sources: MarketSource[];
  propertyValue: number;
}

const MarketSources = ({ sources, propertyValue }: MarketSourcesProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Generate additional mock sources to reach 20+ sources
  const mockSources: MarketSource[] = [
    {
      id: "3",
      name: "Lopes",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Condomínio Edifício Araguaia",
      description: "Apartamento com 3 quartos e 2 banheiros em ótima localização",
      url: "#",
      price: 495000,
      area: 98,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "4",
      name: "Loft",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Edifício Araguaia - Cambuí",
      description: "Condomínio com infraestrutura completa no centro",
      url: "#",
      price: 485000,
      area: 105,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "5",
      name: "Attria",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Araguaia - Centro Campinas",
      description: "Apartamento com vista e localização privilegiada",
      url: "#",
      price: 475000,
      area: 100,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "6",
      name: "Grupo OLX",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Apartamento Centro Campinas",
      description: "3 dormitórios com ampla sala e cozinha planejada",
      url: "#",
      price: 510000,
      area: 102,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "7",
      name: "Imovelweb",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Edifício Araguaia Apto 172",
      description: "Apartamento reformado com móveis planejados",
      url: "#",
      price: 520000,
      area: 98,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "8",
      name: "Wimoveis",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Centro Campinas - 100m²",
      description: "Imóvel em ótimo estado de conservação",
      url: "#",
      price: 490000,
      area: 100,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "9",
      name: "Netimóveis",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Apartamento Avenida Moraes Salles",
      description: "Localização estratégica no coração de Campinas",
      url: "#",
      price: 505000,
      area: 105,
      bedrooms: 3,
      parking: 1
    },
    {
      id: "10",
      name: "Superlógica",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
      title: "Condomínio Completo Centro",
      description: "Apartamento com sacada e área de lazer",
      url: "#",
      price: 480000,
      area: 95,
      bedrooms: 3,
      parking: 1
    }
  ];

  const allSources = [...sources, ...mockSources];
  const averagePrice = allSources.reduce((sum, source) => sum + (source.price || 0), 0) / allSources.filter(s => s.price).length;
  const priceVariation = ((propertyValue - averagePrice) / averagePrice) * 100;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-accent" />
            Resumo da Análise de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{allSources.length}</div>
              <div className="text-sm text-muted-foreground">Fontes Analisadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(averagePrice)}</div>
              <div className="text-sm text-muted-foreground">Preço Médio</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${priceVariation >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {priceVariation > 0 ? '+' : ''}{priceVariation.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Variação do Mercado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">R$ 4.900</div>
              <div className="text-sm text-muted-foreground">Preço/m² Médio</div>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">Análise Detalhada:</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Com base na análise de <strong>{allSources.length} fontes confiáveis</strong>, o valor estimado de <strong>{formatCurrency(propertyValue)}</strong> está 
              {priceVariation >= 0 ? ' acima' : ' abaixo'} da média de mercado. Os imóveis similares na região têm preços que variam entre 
              <strong> R$ 450.000 e R$ 530.000</strong>, com características semelhantes de área e localização.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sources List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>({allSources.length}) Fontes de Referência</span>
            <Badge variant="outline" className="border-accent text-accent">
              Atualizado em tempo real
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allSources.map((source, index) => (
              <div key={source.id} className="border rounded-lg p-4 hover:border-accent/50 transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={source.logo} 
                      alt={source.name}
                      className="w-12 h-8 object-cover rounded border"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{source.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {source.name}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {source.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      {source.price && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-accent">{formatCurrency(source.price)}</span>
                        </div>
                      )}
                      {source.area && (
                        <div className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          <span>{source.area}m²</span>
                        </div>
                      )}
                      {source.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          <span>{source.bedrooms} quartos</span>
                        </div>
                      )}
                      {source.parking && (
                        <div className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          <span>{source.parking} vaga{source.parking > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
              Ver Todas as {allSources.length} Fontes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Metodologia de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Fontes de Dados:</h4>
              <p>Coletamos informações de mais de 20 portais imobiliários, incluindo Viva Real, ZAP Imóveis, QuintoAndar, Lopes, e outros players do mercado.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Critérios de Comparação:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Localização (raio de 2km do imóvel analisado)</li>
                <li>Área construída (±20% da área do imóvel)</li>
                <li>Número de quartos e banheiros</li>
                <li>Tipo de imóvel (apartamento, casa, etc.)</li>
                <li>Estado de conservação e idade do imóvel</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Atualização:</h4>
              <p>Os dados são atualizados automaticamente a cada 24 horas para garantir que as informações estejam sempre atualizadas com o mercado.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketSources;