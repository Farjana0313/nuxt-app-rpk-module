export interface CompetencyOwner {
  was: number;
  agencyDivision: string;
  number: string;
  noWhenIntroduction: string;
  position: number;
  grade: string;
  action?: string;
}

export interface CompetencyOwnerFilter {
  number?: string;
  identityCardNo?: string;
}
