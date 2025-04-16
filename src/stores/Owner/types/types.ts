export interface CompetencyOwner {
  was: number;
  agencyDivision: string;
  number: string;
  noWhenIntroduction: string;
  position: number;
  grade: string;
  identityCardNo?: string;
  getToWork: string;
  outOfOffice: string;
  reEnterOffice: string;
  backToWork: string;
  officerName1: string;
  officerName2: string;
  status?: string;
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
