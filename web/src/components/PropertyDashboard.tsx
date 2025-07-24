import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Home, 
  Car, 
  Calendar, 
  TrendingUp,
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  Bed,
  Bath,
  Ruler,
  Building,
  Users,
  Clock,
  Target
} from "lucide-react";
import { Property, SearchFilters } from "@/types/property";
import { mockProperties } from "@/data/mockProperties";

interface PropertyDashboardProps {
  onViewAnalysis: (propertyId: string) => void;
}

const PropertyDashboard = ({ onViewAnalysis }: PropertyDashboardProps) => {
  const [properties] = useState<Property[]>(mockProperties);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "ipl",
    sortOrder: "desc"
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.city) {
      filtered = filtered.filter(p => p.city === filters.city);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.minimumBid >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.minimumBid <= filters.maxPrice!);
    }

    if (filters.minArea) {
      filtered = filtered.filter(p => p.area >= filters.minArea!);
    }

    if (filters.maxArea) {
      filtered = filtered.filter(p => p.area <= filters.maxArea!);
    }

    if (filters.auctionType) {
      filtered = filtered.filter(p => p.auctionType === filters.auctionType);
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.financing !== undefined) {
      filtered = filtered.filter(p => p.financing === filters.financing);
    }

    if (filters.minIpl) {
      filtered = filtered.filter(p => p.iplIndex >= filters.minIpl!);
    }

    if (filters.maxIpl) {
      filtered = filtered.filter(p => p.iplIndex <= filters.maxIpl!);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case "price":
            aValue = a.minimumBid;
            bValue = b.minimumBid;
            break;
          case "date":
            aValue = new Date(a.auctionDate).getTime();
            bValue = new Date(b.auctionDate).getTime();
            break;
          case "ipl":
            aValue = a.iplIndex;
            bValue = b.iplIndex;
            break;
          case "discount":
            aValue = a.discount;
            bValue = b.discount;
            break;
          case "area":
            aValue = a.area;
            bValue = b.area;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === "desc") {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });
    }

    return filtered;
  }, [properties, filters]);

  const stats = useMemo(() => {
    return {
      total: properties.length,
      thisWeek: properties.filter(p => {
        const auctionDate = new Date(p.auctionDate);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return auctionDate >= today && auctionDate <= weekFromNow;
      }).length,
      averageDiscount: Math.round(properties.reduce((sum, p) => sum + p.discount, 0) / properties.length),
      averageIpl: (properties.reduce((sum, p) => sum + p.iplIndex, 0) / properties.length).toFixed(1)
    };
  }, [properties]);

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-primary text-white rounded-xl p-6 shadow-elegant border border-accent/20">
          <h1 className="text-3xl font-bold mb-4">Dashboard de Leilões</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.total}</div>
              <div className="text-sm text-white/80">Total de Imóveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.thisWeek}</div>
              <div className="text-sm text-white/80">Leilões esta Semana</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.averageDiscount}%</div>
              <div className="text-sm text-white/80">Desconto Médio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.averageIpl}</div>
              <div className="text-sm text-white/80">IPL Médio</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-accent" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por cidade, endereço..."
                  value={filters.query || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.type || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === "all" ? undefined : value as Property["type"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.city || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value === "all" ? undefined : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Cidades</SelectItem>
                  <SelectItem value="Campinas">Campinas</SelectItem>
                  <SelectItem value="São Paulo">São Paulo</SelectItem>
                  <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy || "price"} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as SearchFilters["sortBy"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ipl">Índice IPL</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="date">Data do Leilão</SelectItem>
                  <SelectItem value="discount">Desconto</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Preço mín."
                  value={filters.minPrice || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                />
                <Input
                  type="number"
                  placeholder="Preço máx."
                  value={filters.maxPrice || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Área mín."
                  value={filters.minArea || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value ? Number(e.target.value) : undefined }))}
                />
                <Input
                  type="number"
                  placeholder="Área máx."
                  value={filters.maxArea || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="IPL mín."
                  step="0.1"
                  value={filters.minIpl || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, minIpl: e.target.value ? Number(e.target.value) : undefined }))}
                />
                <Input
                  type="number"
                  placeholder="IPL máx."
                  step="0.1"
                  value={filters.maxIpl || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxIpl: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="shadow-card hover:shadow-gold transition-smooth cursor-pointer group">
              <div className="relative">
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-accent text-accent-foreground font-bold">
                    {property.discount}% OFF
                  </Badge>
                  <Badge variant="outline" className="bg-black/70 text-white border-accent">
                    IPL {property.iplIndex}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 ${
                    favorites.has(property.id) ? 'text-accent' : 'text-white'
                  } hover:text-accent`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(property.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-smooth">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{property.address}, {property.city}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Ruler className="h-3 w-3 text-accent" />
                    </div>
                    <div className="text-xs text-muted-foreground">Área</div>
                    <div className="text-sm font-semibold">{property.area}m²</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Bed className="h-3 w-3 text-accent" />
                    </div>
                    <div className="text-xs text-muted-foreground">Quartos</div>
                    <div className="text-sm font-semibold">{property.bedrooms || '-'}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Car className="h-3 w-3 text-accent" />
                    </div>
                    <div className="text-xs text-muted-foreground">Vagas</div>
                    <div className="text-sm font-semibold">{property.parking}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lance Mínimo</span>
                    <span className="font-bold text-accent">{formatCurrency(property.minimumBid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor de Mercado</span>
                    <span className="text-sm line-through">{formatCurrency(property.marketValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Data do Leilão</span>
                    <span className="text-sm font-medium">{formatDate(property.auctionDate)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">
                    {property.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {property.status}
                  </Badge>
                  {property.financing && (
                    <Badge variant="outline" className="text-xs border-accent text-accent">
                      Financiável
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{property.viewCount} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{property.auctioneer}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => onViewAnalysis(property.id)}
                >
                  Ver Análise Completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                Nenhum imóvel encontrado com os filtros aplicados.
              </div>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ sortBy: "ipl", sortOrder: "desc" })}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertyDashboard;