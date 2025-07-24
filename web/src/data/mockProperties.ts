import { Property } from "@/types/property";

export const mockProperties: Property[] = [
  {
    id: "179338",
    title: "Apartamento 100 m² - Centro - Campinas - SP",
    address: "Avenida Doutor Moraes Salles, 1169",
    city: "Campinas",
    state: "SP",
    area: 100,
    parking: 1,
    bedrooms: 3,
    bathrooms: 2,
    type: "Apartamento",
    status: "Ocupado",
    financing: true,
    builtArea: 100.37,
    auctionType: "Extrajudicial",
    minimumBid: 254600,
    marketValue: 490000,
    evaluatorValue: 433000,
    discount: 48,
    description: "Este apartamento de 100 m² é uma excelente oportunidade para quem busca um imóvel em uma localização central em Campinas. Com uma área construída de 100,37 m², o apartamento oferece um espaço confortável e bem distribuído.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
    ],
    iplIndex: 4.9,
    iplClassification: "Oportunidade Moderada",
    profitMargin: 2.9,
    risk: 1.0,
    opportunity: 1.0,
    auctioneer: "Mega Leilões",
    auctionDate: "2025-04-08",
    auctionTime: "14:00",
    maxBidsRecommended: 8,
    expectedProfit: 30,
    coordinates: {
      lat: -22.9056,
      lng: -47.0608
    },
    praca1: {
      date: "2025-04-08",
      minimumBid: 254600,
      discount: 41
    },
    praca2: {
      date: "2025-04-15",
      minimumBid: 180000,
      discount: 58
    },
    sources: [
      {
        id: "1",
        name: "Chaves na Mão",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
        title: "Apartamento 3 quartos Centro",
        description: "Apartamento com 3 quartos à venda na região central",
        url: "#",
        price: 490000,
        area: 100,
        bedrooms: 3,
        parking: 1
      },
      {
        id: "2",
        name: "QuintoAndar",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
        title: "Imóveis Centro Campinas",
        description: "Diversos imóveis à venda no centro de Campinas",
        url: "#",
        price: 485000,
        area: 95,
        bedrooms: 3,
        parking: 1
      }
    ],
    isFavorited: false,
    viewCount: 1247,
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-10T15:30:00Z"
  },
  {
    id: "179339",
    title: "Casa 150 m² - Vila Nova - São Paulo - SP",
    address: "Rua das Flores, 456",
    city: "São Paulo",
    state: "SP",
    area: 150,
    parking: 2,
    bedrooms: 4,
    bathrooms: 3,
    type: "Casa",
    status: "Desocupado",
    financing: true,
    builtArea: 150.0,
    auctionType: "Judicial",
    minimumBid: 380000,
    marketValue: 650000,
    evaluatorValue: 590000,
    discount: 42,
    description: "Casa de 150 m² em excelente localização, com 4 quartos e amplo quintal. Ideal para família que busca conforto e tranquilidade.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop"
    ],
    iplIndex: 6.2,
    iplClassification: "Boa Oportunidade",
    profitMargin: 4.1,
    risk: 0.8,
    opportunity: 1.3,
    auctioneer: "Leilões SP",
    auctionDate: "2025-04-12",
    auctionTime: "10:00",
    maxBidsRecommended: 12,
    expectedProfit: 35,
    coordinates: {
      lat: -23.5505,
      lng: -46.6333
    },
    praca1: {
      date: "2025-04-12",
      minimumBid: 380000,
      discount: 42
    },
    praca2: {
      date: "2025-04-19",
      minimumBid: 265000,
      discount: 59
    },
    sources: [
      {
        id: "3",
        name: "Viva Real",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
        title: "Casa 4 quartos Vila Nova",
        description: "Casa ampla com quintal em bairro residencial",
        url: "#",
        price: 650000,
        area: 150,
        bedrooms: 4,
        parking: 2
      }
    ],
    isFavorited: true,
    viewCount: 892,
    createdAt: "2024-12-02T09:15:00Z",
    updatedAt: "2024-12-10T12:45:00Z"
  },
  {
    id: "179340",
    title: "Apartamento 80 m² - Copacabana - Rio de Janeiro - RJ",
    address: "Avenida Atlântica, 2500",
    city: "Rio de Janeiro",
    state: "RJ",
    area: 80,
    parking: 1,
    bedrooms: 2,
    bathrooms: 2,
    type: "Apartamento",
    status: "Ocupado",
    financing: false,
    builtArea: 80.0,
    auctionType: "Extrajudicial",
    minimumBid: 720000,
    marketValue: 1200000,
    evaluatorValue: 1050000,
    discount: 40,
    description: "Apartamento na famosa Avenida Atlântica com vista para o mar. Localização privilegiada em Copacabana, próximo a todos os serviços.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    iplIndex: 7.8,
    iplClassification: "Excelente Oportunidade",
    profitMargin: 5.2,
    risk: 1.2,
    opportunity: 1.4,
    auctioneer: "Rio Leilões",
    auctionDate: "2025-04-20",
    auctionTime: "15:00",
    maxBidsRecommended: 15,
    expectedProfit: 40,
    coordinates: {
      lat: -22.9068,
      lng: -43.1729
    },
    praca1: {
      date: "2025-04-20",
      minimumBid: 720000,
      discount: 40
    },
    praca2: {
      date: "2025-04-27",
      minimumBid: 504000,
      discount: 58
    },
    praca3: {
      date: "2025-05-04",
      minimumBid: 360000,
      discount: 70
    },
    sources: [
      {
        id: "4",
        name: "ZAP Imóveis",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=50&fit=crop",
        title: "Apartamento Vista Mar Copacabana",
        description: "Apartamento com vista deslumbrante para o mar",
        url: "#",
        price: 1200000,
        area: 80,
        bedrooms: 2,
        parking: 1
      }
    ],
    isFavorited: false,
    viewCount: 1856,
    createdAt: "2024-12-03T11:20:00Z",
    updatedAt: "2024-12-10T16:10:00Z"
  }
];