export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  area: number;
  parking: number;
  bedrooms?: number;
  bathrooms?: number;
  type: "Apartamento" | "Casa" | "Terreno" | "Comercial";
  status: "Ocupado" | "Desocupado" | "Irregular";
  financing: boolean;
  builtArea: number;
  auctionType: "Judicial" | "Extrajudicial";
  minimumBid: number;
  marketValue: number;
  evaluatorValue: number;
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
  auctionTime?: string;
  courtDecision?: string;
  maxBidsRecommended?: number;
  expectedProfit?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  praca1: {
    date: string;
    minimumBid: number;
    discount: number;
  };
  praca2?: {
    date: string;
    minimumBid: number;
    discount: number;
  };
  praca3?: {
    date: string;
    minimumBid: number;
    discount: number;
  };
  sources: MarketSource[];
  isFavorited?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketSource {
  id: string;
  name: string;
  logo: string;
  title: string;
  description: string;
  url: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  parking?: number;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  state?: string;
  type?: Property["type"];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  auctionType?: Property["auctionType"];
  status?: Property["status"];
  financing?: boolean;
  minIpl?: number;
  maxIpl?: number;
  sortBy?: "price" | "date" | "ipl" | "discount" | "area";
  sortOrder?: "asc" | "desc";
}

export interface CompetitorPrediction {
  maxRecommendedBids: number;
  expectedCompetitors: number;
  profitMarginAt: {
    bid1: number;
    bid5: number;
    bid10: number;
  };
  riskLevel: "Baixo" | "Médio" | "Alto";
  recommendation: string;
}