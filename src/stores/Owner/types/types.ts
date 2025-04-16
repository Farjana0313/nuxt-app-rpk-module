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

export interface GridUtilsConfig {
  title?: string;
  filename?: string;
  excludeColumns?: string[];
  tableStyles?: {
    headerBackground?: string;
    headerColor?: string;
    bodyColor?: string;
    fontFamily?: string;
  };
}
