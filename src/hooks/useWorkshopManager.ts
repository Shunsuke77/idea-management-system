import { useState, useCallback, useEffect } from 'react';

export interface Workshop {
  id: string;
  name: string;
  createdAt: string;
  solutions: any[];
  activeChallenges: string[];
  customChallenges: string[];
}

export interface WorkshopState {
  workshops: Record<string, Workshop>;
  currentWorkshopId: string | null;
  solutions: any[];
  activeChallenges: string[];
  customChallenges: string[];
}

export const useWorkshopManager = () => {
  const [workshops, setWorkshops] = useState<Record<string, Workshop>>({});
  const [currentWorkshopId, setCurrentWorkshopId] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [customChallenges, setCustomChallenges] = useState<string[]>([]);

  const createWorkshop = useCallback((name: string) => {
    const id = `ws_${Date.now()}`;
    const newWorkshop: Workshop = {
      id,
      name,
      createdAt: new Date().toISOString(),
      solutions: [],
      activeChallenges: [],
      customChallenges: []
    };
    
    setWorkshops(prev => ({ ...prev, [id]: newWorkshop }));
    setCurrentWorkshopId(id);
    setSolutions([]);
    setActiveChallenges([]);
    setCustomChallenges([]);
    
    return id;
  }, []);

  const switchWorkshop = useCallback((workshopId: string) => {
    const workshop = workshops[workshopId];
    if (workshop) {
      setCurrentWorkshopId(workshopId);
      setSolutions(workshop.solutions || []);
      setActiveChallenges(workshop.activeChallenges || []);
      setCustomChallenges(workshop.customChallenges || []);
    }
  }, [workshops]);

  useEffect(() => {
    if (currentWorkshopId && workshops[currentWorkshopId]) {
      setWorkshops(prev => ({
        ...prev,
        [currentWorkshopId]: {
          ...prev[currentWorkshopId],
          solutions,
          activeChallenges,
          customChallenges
        }
      }));
    }
  }, [solutions, activeChallenges, customChallenges, currentWorkshopId]);

  return {
    workshops,
    setWorkshops,
    currentWorkshopId,
    solutions,
    setSolutions,
    activeChallenges,
    setActiveChallenges,
    customChallenges,
    setCustomChallenges,
    createWorkshop,
    switchWorkshop
  };
};
