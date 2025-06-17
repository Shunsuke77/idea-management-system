import { useCallback } from 'react';
import { Workshop, Solution } from '../types';

export const useWorkshopStats = (workshop: Workshop | null) => {
  const getChallengeStats = useCallback(() => {
    if (!workshop) return [];
    
    const stats: Record<string, number> = {};
    workshop.solutions.forEach((sol) => {
      stats[sol.challenge] = (stats[sol.challenge] || 0) + 1;
    });

    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1]);
  }, [workshop]);

  const getGroupStats = useCallback(() => {
    if (!workshop) return [];

    const stats: Record<string, number> = {};
    workshop.solutions.forEach((sol) => {
      stats[sol.groupName] = (stats[sol.groupName] || 0) + 1;
    });

    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1]);
  }, [workshop]);

  const getUniqueGroups = useCallback(() => {
    if (!workshop) return [];
    return [...new Set(workshop.solutions.map(s => s.groupName))];
  }, [workshop]);

  const getUniqueChallenges = useCallback(() => {
    if (!workshop) return [];
    return [...new Set(workshop.solutions.map(s => s.challenge))];
  }, [workshop]);

  return {
    getChallengeStats,
    getGroupStats,
    getUniqueGroups,
    getUniqueChallenges,
  };
};
