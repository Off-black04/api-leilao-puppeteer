import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Home, 
  Car, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  Share,
  Download,
  Calculator,
  Brain,
  Scale,
  FileText,
  CheckCircle
} from "lucide-react";
import { Property } from "@/types/property";
import { mockProperties } from "@/data/mockProperties";
import CompetitorPredictor from "./CompetitorPredictor";
import MarketSources from "./MarketSources";

interface PropertyData {
  id: string;
  title: string;
  address: string;
  area: number;
  parking: number;
  type: string;
  status: string;
  financing: boolean;
  builtArea: number;
  auctionType: string;
  minimumBid: number;
  marketValue: number;
  discount: number;
  description: string;
  images: string[];
  iplIndex: number;
  iplClassification: string;
  profitMargin: number;
  risk: number;
  opportunity: number;
  auctioneer: string;
  auctionDate: string;
  evaluatorValue: number;
}

interface PropertyAnalysisProps {
  onBack?: () => void;
  propertyId?: string | null;
}

const PropertyAnalysis = ({ onBack, propertyId }: PropertyAnalysisProps = {}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find the property by ID or use the first one as fallback
  const propertyData: Property = mockProperties.find(p => p.id === propertyId) || mockProperties[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyData.images.length - 1 : prev - 1
    );
  };

  // Financing Calculator State
  const [financingType, setFinancingType] = useState<'PRICE' | 'SAC'>('PRICE');
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [interestRate, setInterestRate] = useState(9.5);
  const [numberOfInstallments, setNumberOfInstallments] = useState(240);
  const [monthsToSale, setMonthsToSale] = useState(10);
  const [marketValue, setMarketValue] = useState(490000);
  const [auctionValue, setAuctionValue] = useState(254600);
  const [monthlyIPTU, setMonthlyIPTU] = useState(180);
  const [monthlyCondominium, setMonthlyCondominium] = useState(450);
  const [additionalExpenses, setAdditionalExpenses] = useState(0);
  const [monthlyAppreciation, setMonthlyAppreciation] = useState(0.3);

  // Calculate values
  const propertyValue = auctionValue;
  const downPayment = propertyValue * (downPaymentPercent / 100);
  const financedAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 100 / 12;

  // PRICE Calculation (Fixed Payments)
  const calculatePRICE = () => {
    if (monthlyRate === 0) return { installment: financedAmount / numberOfInstallments };
    
    const installment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfInstallments)) / 
                       (Math.pow(1 + monthlyRate, numberOfInstallments) - 1);
    
    return { installment };
  };

  // SAC Calculation (Constant Amortization)
  const calculateSAC = () => {
    const amortization = financedAmount / numberOfInstallments;
    const firstInstallment = amortization + (financedAmount * monthlyRate);
    const lastInstallment = amortization + (amortization * monthlyRate);
    
    return { firstInstallment, lastInstallment, amortization };
  };

  // Calculate complete payment table
  const calculatePaymentTable = () => {
    const table = [];
    
    if (financingType === 'PRICE') {
      const priceResult = calculatePRICE();
      let balance = financedAmount;
      
      for (let i = 0; i < numberOfInstallments; i++) {
        const interest = balance * monthlyRate;
        const amortization = priceResult.installment - interest;
        balance = balance - amortization;
        
        table.push({
          month: i + 1,
          installment: priceResult.installment,
          amortization: amortization,
          interest: interest,
          balance: balance
        });
      }
    } else {
      // SAC
      const amortization = financedAmount / numberOfInstallments;
      let balance = financedAmount;
      
      for (let i = 0; i < numberOfInstallments; i++) {
        const interest = balance * monthlyRate;
        const installment = amortization + interest;
        balance = balance - amortization;
        
        table.push({
          month: i + 1,
          installment: installment,
          amortization: amortization,
          interest: interest,
          balance: balance
        });
      }
    }
    
    return table;
  };

  const paymentTable = calculatePaymentTable();
  const firstPayment = paymentTable[0];
  const lastPayment = paymentTable[paymentTable.length - 1];
  
  // Calculate total payments until sale
  const totalPaidUntilSale = paymentTable.slice(0, monthsToSale).reduce((sum, payment) => sum + payment.installment, 0);
  const totalExpenses = (monthlyIPTU + monthlyCondominium + additionalExpenses) * monthsToSale;
  const totalInvestment = downPayment + totalPaidUntilSale + totalExpenses;
  const propertyAppreciation = marketValue * (monthlyAppreciation / 100) * monthsToSale;
  const estimatedProfit = propertyAppreciation - totalPaidUntilSale - additionalExpenses;
  const totalROI = (estimatedProfit / totalInvestment) * 100;
  const monthlyROI = totalROI / monthsToSale;

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-accent hover:bg-accent/10"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Resultados
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-primary text-white rounded-xl p-6 shadow-elegant border border-accent/20">
          <h1 className="text-3xl font-bold mb-2">{propertyData.title}</h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{propertyData.address}, {propertyData.city}, {propertyData.state}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-accent hover:bg-accent/10 hover:text-accent"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver no Google Maps
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Imagens */}
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={propertyData.images[currentImageIndex]} 
                    alt="Imagem do imóvel"
                    className="w-full h-64 lg:h-96 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {propertyData.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-accent' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {propertyData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-smooth ${
                        index === currentImageIndex 
                          ? 'border-accent shadow-gold' 
                          : 'border-transparent hover:border-accent/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-accent" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Imóvel</span>
                    <span className="font-medium">{propertyData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Situação</span>
                    <Badge variant="secondary">{propertyData.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Financiamento</span>
                    <Badge variant="outline" className="border-accent text-accent">
                      {propertyData.financing ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Área Construída</span>
                    <span className="font-medium">{propertyData.builtArea}m²</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Informações do Leilão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Leilão</span>
                    <span className="font-medium">{propertyData.auctionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lance Mínimo</span>
                    <span className="font-bold text-accent">
                      {formatCurrency(propertyData.minimumBid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data do Leilão</span>
                    <span className="font-medium">{formatDate(propertyData.auctionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <Badge className="bg-accent text-accent-foreground font-bold">
                      {propertyData.discount}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Descrição */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {propertyData.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações Rápidas */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Home className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-sm text-muted-foreground">Área</div>
                  <div className="text-xl font-bold">{propertyData.area} m²</div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Car className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-sm text-muted-foreground">Vagas</div>
                  <div className="text-xl font-bold">{propertyData.parking}</div>
                </CardContent>
              </Card>
            </div>

            {/* Índice IPL */}
            <Card className="shadow-gold bg-gradient-gold text-primary border border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Índice IPL
                  <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
                    Exclusivo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-primary">{propertyData.iplIndex}</div>
                  <div className="text-lg font-semibold mb-3 text-primary">
                    {propertyData.iplClassification}
                  </div>
                  <p className="text-sm text-primary/80">
                    Análise baseada em margem de lucro, risco e oportunidade
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Leiloeiro */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Leiloeiro</div>
                <div className="font-bold text-lg mb-3">{propertyData.auctioneer}</div>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no site do leiloeiro
                </Button>
              </CardContent>
            </Card>

            {/* Valores Principais */}
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <Badge className="mb-2 bg-accent text-accent-foreground">1ª Praça</Badge>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {formatCurrency(propertyData.minimumBid)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Menor valor entre as praças disponíveis
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <Badge variant="outline" className="mb-2">Oficial</Badge>
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(propertyData.evaluatorValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avaliação do Leiloeiro
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <Badge className="mb-2 bg-accent text-accent-foreground">Estimado</Badge>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {formatCurrency(propertyData.marketValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor de Mercado
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {propertyData.iplIndex}
              </div>
              <p className="text-muted-foreground">IPL Score</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatCurrency(propertyData.minimumBid)}
              </div>
              <p className="text-muted-foreground">Preço Atual</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {formatCurrency(propertyData.evaluatorValue)}
              </div>
              <p className="text-muted-foreground">Avaliação IA</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {((propertyData.evaluatorValue - propertyData.minimumBid) / propertyData.minimumBid * 100).toFixed(1)}%
              </div>
              <p className="text-muted-foreground">Potencial</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Value Analysis */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-accent" />
              Análise de Valor de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-foreground">R$ 8.750/m²</div>
                <p className="text-muted-foreground">Preço por m²</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-green-500">+12.5%</div>
                <p className="text-muted-foreground">Valorização 12m</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">R$ 9.200/m²</div>
                <p className="text-muted-foreground">Média da Região</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Comparação com Imóveis Similares</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/10 rounded">
                  <span className="text-foreground">Apartamento 95m² - Rua Paralela</span>
                  <span className="font-semibold text-foreground">R$ 850.000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/10 rounded">
                  <span className="text-foreground">Apartamento 88m² - Mesma Quadra</span>
                  <span className="font-semibold text-foreground">R$ 780.000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/10 rounded">
                  <span className="text-foreground">Apartamento 102m² - 2 Quadras</span>
                  <span className="font-semibold text-foreground">R$ 925.000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Locations */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-accent" />
              Locais Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Transporte</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metrô Consolação</span>
                    <span className="text-foreground">350m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ponto de Ônibus</span>
                    <span className="text-foreground">80m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terminal Rodoviário</span>
                    <span className="text-foreground">2.1km</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Serviços</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital Sírio-Libanês</span>
                    <span className="text-foreground">1.2km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shopping Copacabana</span>
                    <span className="text-foreground">800m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Universidade Mackenzie</span>
                    <span className="text-foreground">600m</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Lazer & Cultura</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parque Augusta</span>
                    <span className="text-foreground">400m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teatro Municipal</span>
                    <span className="text-foreground">1.5km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MASP</span>
                    <span className="text-foreground">900m</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Comércio</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supermercado Pão de Açúcar</span>
                    <span className="text-foreground">200m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farmácia Drogasil</span>
                    <span className="text-foreground">150m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Academia Smart Fit</span>
                    <span className="text-foreground">300m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Analysis */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calculator className="h-5 w-5 text-accent" />
              Análise Financeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-500">4.2%</div>
                <p className="text-muted-foreground">Rentabilidade/mês</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-500">R$ 4.800</div>
                <p className="text-muted-foreground">Aluguel Estimado</p>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">18 meses</div>
                <p className="text-muted-foreground">Payback</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-500">8.5%</div>
                <p className="text-muted-foreground">ROI Anual</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Custos Mensais</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPTU</span>
                    <span className="text-foreground">R$ 180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condomínio</span>
                    <span className="text-foreground">R$ 450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seguro</span>
                    <span className="text-foreground">R$ 120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manutenção</span>
                    <span className="text-foreground">R$ 200</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">R$ 950</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Projeção 5 Anos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renda Total</span>
                    <span className="text-green-500">R$ 288.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custos Totais</span>
                    <span className="text-red-500">R$ 57.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valorização</span>
                    <span className="text-green-500">R$ 125.000</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Lucro Líquido</span>
                      <span className="text-green-500">R$ 356.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Calculator */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calculator className="h-5 w-5 text-accent" />
              Calculadora de Financiamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Financing Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Tipo de Financiamento</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="financingType"
                    value="PRICE"
                    checked={financingType === 'PRICE'}
                    onChange={(e) => setFinancingType(e.target.value as 'PRICE' | 'SAC')}
                    className="h-4 w-4 text-accent"
                  />
                  <div>
                    <div className="font-medium text-foreground">PRICE</div>
                    <div className="text-sm text-muted-foreground">Parcelas fixas ao longo do financiamento</div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="financingType"
                    value="SAC"
                    checked={financingType === 'SAC'}
                    onChange={(e) => setFinancingType(e.target.value as 'PRICE' | 'SAC')}
                    className="h-4 w-4 text-accent"
                  />
                  <div>
                    <div className="font-medium text-foreground">SAC</div>
                    <div className="text-sm text-muted-foreground">Amortização constante, parcelas decrescentes</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Down Payment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Percentual de Entrada</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-3xl font-bold text-accent">{downPaymentPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>90%</span>
                </div>
                <div className="flex justify-between text-sm text-foreground">
                  <span>Valor da entrada: {formatCurrency(downPayment)}</span>
                  <span>|</span>
                  <span>Valor financiado: {formatCurrency(financedAmount)}</span>
                </div>
              </div>
            </div>

            {/* Months to Sale */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Meses até a Venda</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={monthsToSale}
                    onChange={(e) => setMonthsToSale(Number(e.target.value))}
                    className="w-24 p-2 border border-border rounded text-foreground bg-background"
                  />
                  <span className="text-foreground">meses</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Tempo que pretende manter o imóvel antes de vender
                </div>
              </div>
            </div>

            {/* Financing Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Parâmetros do Financiamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Taxa de juros ao ano (a.a.)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-24 p-2 border border-border rounded text-foreground bg-background"
                      step="0.1"
                    />
                    <span className="text-foreground">%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Taxa mensal: {(interestRate / 12).toFixed(2)}%
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Número de parcelas</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={numberOfInstallments}
                      onChange={(e) => setNumberOfInstallments(Number(e.target.value))}
                      className="w-24 p-2 border border-border rounded text-foreground bg-background"
                    />
                    <span className="text-foreground">meses</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(numberOfInstallments / 12)} anos e {numberOfInstallments % 12} meses
                  </div>
                </div>
              </div>
            </div>

            {/* Property Values */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Valores do Imóvel</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valor de mercado</label>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground">R$</span>
                  <input
                    type="number"
                    value={marketValue}
                    onChange={(e) => setMarketValue(Number(e.target.value))}
                    className="w-44 p-2 border border-border rounded text-foreground bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Despesas Mensais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">IPTU Mensal</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground">R$</span>
                    <input
                      type="number"
                      value={monthlyIPTU}
                      onChange={(e) => setMonthlyIPTU(Number(e.target.value))}
                      className="w-32 p-2 border border-border rounded text-foreground bg-background"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor mensal do IPTU deste imóvel
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Condomínio Mensal</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground">R$</span>
                    <input
                      type="number"
                      value={monthlyCondominium}
                      onChange={(e) => setMonthlyCondominium(Number(e.target.value))}
                      className="w-32 p-2 border border-border rounded text-foreground bg-background"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor mensal do condomínio deste imóvel
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Despesas Mensais Adicionais</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground">R$</span>
                    <input
                      type="number"
                      value={additionalExpenses}
                      onChange={(e) => setAdditionalExpenses(Number(e.target.value))}
                      className="w-32 p-2 border border-border rounded text-foreground bg-background"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Outras despesas mensais que deseja considerar no cálculo (ex: manutenção, seguro, etc)
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Valor de arrematação</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground">R$</span>
                    <input
                      type="number"
                      value={auctionValue}
                      onChange={(e) => setAuctionValue(Number(e.target.value))}
                      className="w-32 p-2 border border-border rounded text-foreground bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valorização mensal do imóvel</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={monthlyAppreciation}
                    onChange={(e) => setMonthlyAppreciation(Number(e.target.value))}
                    className="w-24 p-2 border border-border rounded text-foreground bg-background"
                    step="0.1"
                  />
                  <span className="text-foreground">% ao mês</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Valorização mensal estimada: {formatCurrency(marketValue * (monthlyAppreciation / 100))}/mês
                </div>
              </div>
            </div>

            {/* Financing Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Resumo do Financiamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Valor da entrada</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(downPayment)}</div>
                    <div className="text-sm text-muted-foreground">{downPaymentPercent}% do valor de arrematação</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Valor financiado</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(financedAmount)}</div>
                    <div className="text-sm text-muted-foreground">{100 - downPaymentPercent}% do valor de arrematação</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Valor da 1ª parcela</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(firstPayment.installment)}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Valor da última parcela</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(lastPayment.installment)}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total pago até a venda</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPaidUntilSale)}</div>
                    <div className="text-sm text-muted-foreground">Considerando {monthsToSale} meses</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total de juros até a venda</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(paymentTable.slice(0, monthsToSale).reduce((sum, payment) => sum + payment.interest, 0))}</div>
                    <div className="text-sm text-muted-foreground">Considerando {monthsToSale} meses</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Diferença (mercado - arrematação)</div>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(marketValue - auctionValue)}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Lucro total estimado até a venda</div>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency((marketValue - auctionValue) + propertyAppreciation)}</div>
                    <div className="text-sm text-muted-foreground">Inclui diferença de valores e valorização por {monthsToSale} meses</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm font-medium text-muted-foreground">Lucro em caso de venda após {monthsToSale} meses</div>
                <div className="text-2xl font-bold text-green-500">{formatCurrency((marketValue + propertyAppreciation) - totalInvestment - (auctionValue * 0.13))}</div>
                <div className="text-sm text-muted-foreground">Considera o saldo devedor restante e a valorização acumulada do imóvel</div>
              </div>
            </div>

            {/* Investment Comparison */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Comparativo de Investimento ({monthsToSale} meses)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Despesas (ITBI, documentação, etc):</span>
                    <span className="font-medium text-foreground">{formatCurrency(auctionValue * 0.13)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor da entrada:</span>
                    <span className="font-medium text-foreground">{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total pago até a venda:</span>
                    <span className="font-medium text-foreground">{formatCurrency(totalPaidUntilSale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Juros pagos até a venda:</span>
                    <span className="font-medium text-foreground">{formatCurrency(paymentTable.slice(0, monthsToSale).reduce((sum, payment) => sum + payment.interest, 0))}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Investimento total:</span>
                    <span className="font-bold text-foreground">{formatCurrency(totalInvestment + (auctionValue * 0.13))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Lucro estimado (venda em {monthsToSale} meses):</span>
                    <span className="font-bold text-green-500">{formatCurrency((marketValue + propertyAppreciation) - totalInvestment - (auctionValue * 0.13))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">ROI sobre investimento total:</span>
                    <span className="font-bold text-accent">{(((marketValue + propertyAppreciation) - totalInvestment - (auctionValue * 0.13)) / (totalInvestment + (auctionValue * 0.13)) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">ROI mensal médio:</span>
                    <span className="font-bold text-accent">{((((marketValue + propertyAppreciation) - totalInvestment - (auctionValue * 0.13)) / (totalInvestment + (auctionValue * 0.13)) * 100) / monthsToSale).toFixed(3)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Graphics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Visualização Gráfica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/10 rounded-lg border border-border">
                  <h5 className="font-semibold text-foreground mb-2">Evolução do Saldo Devedor</h5>
                  <div className="text-sm text-muted-foreground">
                    Gráfico mostrando como o saldo devedor diminui ao longo do tempo
                  </div>
                </div>
                <div className="p-4 bg-muted/10 rounded-lg border border-border">
                  <h5 className="font-semibold text-foreground mb-2">Comparativo de Amortização e Juros</h5>
                  <div className="text-sm text-muted-foreground">
                    Visualização da proporção entre amortização e juros
                  </div>
                </div>
                <div className="p-4 bg-muted/10 rounded-lg border border-border">
                  <h5 className="font-semibold text-foreground mb-2">Lucro Acumulado ao Longo do Tempo</h5>
                  <div className="text-sm text-muted-foreground">
                    Projeção do lucro acumulado considerando a valorização
                  </div>
                </div>
                <div className="p-4 bg-muted/10 rounded-lg border border-border">
                  <h5 className="font-semibold text-foreground mb-2">Lucro em Caso de Venda Antecipada</h5>
                  <div className="text-sm text-muted-foreground">
                    Este gráfico mostra o lucro estimado caso você venda o imóvel após determinado período, considerando a valorização mensal de {monthlyAppreciation}% e o saldo devedor restante.
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Table */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Tabela de Parcelas</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground">Parcela</th>
                      <th className="text-right py-2 text-muted-foreground">Valor</th>
                      <th className="text-right py-2 text-muted-foreground">Amortização</th>
                      <th className="text-right py-2 text-muted-foreground">Juros</th>
                      <th className="text-right py-2 text-muted-foreground">Saldo Devedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentTable.slice(0, Math.min(12, monthsToSale)).map((payment, i) => (
                      <tr key={i + 1} className="border-b border-border/50">
                        <td className="py-2 text-foreground">{payment.month}</td>
                        <td className="text-right py-2 text-foreground">{formatCurrency(payment.installment)}</td>
                        <td className="text-right py-2 text-foreground">{formatCurrency(payment.amortization)}</td>
                        <td className="text-right py-2 text-foreground">{formatCurrency(payment.interest)}</td>
                        <td className="text-right py-2 text-foreground">{formatCurrency(payment.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-muted/10 rounded-lg">
                <h5 className="font-semibold text-foreground mb-2">Sobre os Sistemas de Amortização</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>SAC (Sistema de Amortização Constante):</strong> A amortização é constante ao longo do tempo, e os juros diminuem com o passar das parcelas. Isso faz com que o valor das parcelas também diminua ao longo do tempo.
                  </p>
                  <p>
                    <strong>PRICE (Sistema Francês de Amortização):</strong> As parcelas são fixas ao longo do financiamento. Os juros no início são mais altos e vão diminuindo ao longo do tempo, enquanto a amortização cresce.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Investor Analysis */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5 text-accent" />
              Análise IA do Investidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-3xl font-bold text-green-500">85%</div>
                <p className="text-muted-foreground">Score de Investimento</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-500">A</div>
                <p className="text-muted-foreground">Classificação</p>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-3xl font-bold text-accent">Alto</div>
                <p className="text-muted-foreground">Potencial</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Pontos Fortes</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Localização privilegiada no centro de SP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Excelente acesso ao transporte público</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Alto potencial de valorização</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Demanda alta para locação</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Pontos de Atenção</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-foreground">Prédio necessita pequenas reformas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-foreground">Condomínio acima da média da região</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Recomendação IA</h4>
                <p className="text-foreground">
                  Este imóvel apresenta excelente oportunidade de investimento. A localização central, 
                  proximidade com transporte público e potencial de valorização superam os pontos de 
                  atenção. Recomendamos negociar o preço considerando as pequenas reformas necessárias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Situation */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-accent" />
              Situação Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Documentação Regular
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Escritura</span>
                    <span className="text-green-500">✓ Regular</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registro de Imóveis</span>
                    <span className="text-green-500">✓ Atualizado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habite-se</span>
                    <span className="text-green-500">✓ Aprovado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPTU</span>
                    <span className="text-green-500">✓ Em dia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condomínio</span>
                    <span className="text-green-500">✓ Em dia</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Informações Adicionais</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Matrícula:</span>
                    <span className="text-foreground ml-2">127.456 - 3º RI SP</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Última Atualização:</span>
                    <span className="text-foreground ml-2">15/01/2024</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Área Registrada:</span>
                    <span className="text-foreground ml-2">95,5 m²</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fração Ideal:</span>
                    <span className="text-foreground ml-2">0,0085</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debts and Processes */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Dívidas e Processos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">Situação Limpa</h4>
              <p className="text-muted-foreground">
                Não foram encontradas dívidas, ônus ou processos relacionados a este imóvel.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Última verificação: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Files */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-accent" />
              Arquivos do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-foreground">Escritura</div>
                    <div className="text-sm text-muted-foreground">PDF • 2.1 MB</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-foreground">Matrícula Atualizada</div>
                    <div className="text-sm text-muted-foreground">PDF • 850 KB</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-semibold text-foreground">Planta do Imóvel</div>
                    <div className="text-sm text-muted-foreground">PDF • 1.5 MB</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="font-semibold text-foreground">Laudo de Avaliação</div>
                    <div className="text-sm text-muted-foreground">PDF • 3.2 MB</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <div className="font-semibold text-foreground">Certidões Negativas</div>
                    <div className="text-sm text-muted-foreground">PDF • 1.1 MB</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg hover:bg-muted/5 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-teal-500" />
                  <div>
                    <div className="font-semibold text-foreground">Memorial Descritivo</div>
                    <div className="text-sm text-muted-foreground">PDF • 900 KB</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-sm text-foreground">
                <strong>Nota:</strong> Todos os documentos foram verificados e validados por nossa equipe jurídica. 
                Para solicitar cópias autenticadas ou esclarecimentos, entre em contato conosco.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Análise Detalhada */}
        <Tabs defaultValue="predictor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictor">Preditor IA</TabsTrigger>
            <TabsTrigger value="analysis">Análise IPL</TabsTrigger>
            <TabsTrigger value="market">Valor de Mercado</TabsTrigger>
            <TabsTrigger value="auction">Praças do Leilão</TabsTrigger>
          </TabsList>

          <TabsContent value="predictor" className="space-y-6">
            <CompetitorPredictor property={propertyData} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Análise IPL Detalhada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Margem de Lucro</h3>
                    <div className="text-2xl font-bold text-accent mb-2">
                      {propertyData.profitMargin}/6
                    </div>
                    <Progress value={(propertyData.profitMargin / 6) * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avalia a diferença entre o preço do leilão e o valor de mercado estimado.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <AlertTriangle className="h-8 w-8 text-warning" />
                    </div>
                    <h3 className="font-semibold mb-2">Risco</h3>
                    <div className="text-2xl font-bold text-warning mb-2">
                      {propertyData.risk}/3
                    </div>
                    <Progress value={(propertyData.risk / 3) * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avaliação de fatores como ocupação, pendências legais e documentação.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Target className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Oportunidade</h3>
                    <div className="text-2xl font-bold text-accent mb-2">
                      {propertyData.opportunity}/1
                    </div>
                    <Progress value={(propertyData.opportunity / 1) * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Analisa a procura por imóveis similares na região e potencial de valorização.
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Recomendação</h4>
                  <p className="text-muted-foreground">
                    Oportunidade moderada. Recomendamos análise mais detalhada antes de participar do leilão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <MarketSources sources={propertyData.sources} propertyValue={propertyData.marketValue} />
          </TabsContent>

          <TabsContent value="auction" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Praças, Valores e Datas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 grid grid-cols-4 gap-4 font-semibold text-sm">
                      <span>Praça</span>
                      <span>Lance Mínimo</span>
                      <span>Data</span>
                      <span>Desconto</span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-4 gap-4 text-sm">
                      <span className="font-medium">1ª Praça</span>
                      <span className="font-bold text-accent">{formatCurrency(propertyData.praca1.minimumBid)}</span>
                      <div>
                        <div>{formatDate(propertyData.praca1.date)}</div>
                        <div className="text-xs text-muted-foreground">(Data de encerramento)</div>
                      </div>
                      <span className="text-accent font-medium">{propertyData.praca1.discount}% da avaliação</span>
                    </div>
                    {propertyData.praca2 && (
                      <div className="px-4 py-3 grid grid-cols-4 gap-4 text-sm border-t">
                        <span className="font-medium">2ª Praça</span>
                        <span className="font-bold text-accent">{formatCurrency(propertyData.praca2.minimumBid)}</span>
                        <div>
                          <div>{formatDate(propertyData.praca2.date)}</div>
                          <div className="text-xs text-muted-foreground">(Se não houver lance)</div>
                        </div>
                        <span className="text-accent font-medium">{propertyData.praca2.discount}% da avaliação</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Avaliação do Leiloeiro</div>
                      <div className="text-xl font-bold">{formatCurrency(propertyData.evaluatorValue)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Valor de Mercado</div>
                      <div className="text-xl font-bold">{formatCurrency(propertyData.marketValue)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Desconto Potencial</div>
                      <div className="text-xl font-bold text-accent">{propertyData.discount}%</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Baseado no lance mínimo da 1ª praça
                  </div>

                  <div className="bg-muted rounded-lg p-4 mt-4">
                    <h4 className="font-semibold mb-2">Sobre as Praças do Leilão</h4>
                    <p className="text-sm text-muted-foreground">
                      Na <strong>1ª Praça</strong>, o lance mínimo geralmente é igual ao valor de avaliação do imóvel.
                      Se não houver lances, o leilão vai para a <strong>2ª Praça</strong>, onde o lance mínimo é reduzido
                      (geralmente para 60% a 70% do valor de avaliação). Em alguns casos, pode haver uma <strong>3ª Praça</strong>
                      com desconto ainda maior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyAnalysis;