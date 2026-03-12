import { api } from './api';

export interface Region {
  code: string;
  name: string;
  parentCode: string;
  level: number;
}

export const getRegions = (codes?: string[]) => {
  return api.get<Region[]>('/regions', {
    params: { codes },
  });
};

export const getRegionsByParent = (parentCode: string) => {
  return api.get<Region[]>(`/regions/${parentCode}`);
};
