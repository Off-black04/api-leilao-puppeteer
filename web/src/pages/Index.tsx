import { useState } from "react";
import PropertyDashboard from "@/components/PropertyDashboard";
import PropertyAnalysis from "@/components/PropertyAnalysis";

const Index = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "analysis">("dashboard");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const handleViewAnalysis = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setCurrentView("analysis");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedProperty(null);
  };

  if (currentView === "analysis") {
    return <PropertyAnalysis onBack={handleBackToDashboard} propertyId={selectedProperty} />;
  }

  return <PropertyDashboard onViewAnalysis={handleViewAnalysis} />;
};

export default Index;
