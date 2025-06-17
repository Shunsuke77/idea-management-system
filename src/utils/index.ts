import { Solution } from '../types';

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ja-JP');
};

export const sortSolutions = (solutions: Solution[], sortBy: 'newest' | 'oldest'): Solution[] => {
  return [...solutions].sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
  });
};

export const filterSolutions = (
  solutions: Solution[],
  filters: {
    challenge?: string;
    groupName?: string;
    searchText?: string;
  }
): Solution[] => {
  return solutions.filter(solution => {
    if (filters.challenge && solution.challenge !== filters.challenge) {
      return false;
    }
    if (filters.groupName && solution.groupName !== filters.groupName) {
      return false;
    }
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      return (
        solution.what.toLowerCase().includes(searchLower) ||
        solution.why.toLowerCase().includes(searchLower) ||
        solution.how.toLowerCase().includes(searchLower) ||
        solution.studentName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

export const exportToCSV = (solutions: Solution[]): string => {
  const headers = ['課題', 'グループ名', '学生名', '何を', 'なぜ', 'どのように', '提出日時'];
  const rows = solutions.map(solution => [
    solution.challenge,
    solution.groupName,
    solution.studentName,
    solution.what,
    solution.why,
    solution.how,
    formatDate(solution.timestamp)
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');
};
