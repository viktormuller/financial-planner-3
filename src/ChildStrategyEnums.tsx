import { MonetaryAmount } from "./MonetaryAmount";

export class ChildStrategy {
  childCareStrategy: ChildCareStrategy;
  k12Strategy: K12Strategy;
  afterSchoolCare: boolean;
  annualSupply: MonetaryAmount;
  collegeStrategy: CollegeStrategy;
  collegeSaving: MonetaryAmount;
}

export enum ChildCareStrategy {
  FAMILY,
  IN_HOME,
  DAYCARE,
  AU_PAIR,
  NANNY,
  NANNY_BIG_CITY
}

export const CHILD_CARE_TEXT = [
  "Family",
  "In-home daycare",
  "Daycare",
  "Au-pair",
  "Nanny",
  "Nanny in major city"
];

export const CHILD_CARE_COST = [
  new MonetaryAmount(0),
  new MonetaryAmount(7000),
  new MonetaryAmount(10000),
  new MonetaryAmount(14000),
  new MonetaryAmount(25000),
  new MonetaryAmount(40000)
];

export enum K12Strategy {
  PUBLIC,
  PRIVATE_REGULAR,
  PRIVATE_EXPENSIVE
}

export const K12_TEXT = ["Public", "Typical private", "High-end private"];

export const K12_COST = [
  new MonetaryAmount(0),
  new MonetaryAmount(12000),
  new MonetaryAmount(30000)
];

export const AFTER_SCHOOL_CARE_COST = new MonetaryAmount(10000);

export const MONTHLY_CHILD_SUPPLY_MIN = new MonetaryAmount(12000 / 12);
export const MONTHLY_CHILD_SUPPLY_MAX = new MonetaryAmount(24000 / 12);

export enum CollegeStrategy {
  PUBLIC_IN_STATE,
  PUBLIC_OUT_OF_STATE,
  PRIVATE_TYPICAL,
  PRIVATE_EXPENSIVE,
  IVY_LEAGUE
}

export const COLLEGE_TEXT = [
  "In state public",
  "Out of state public",
  "Typical private",
  "Expensive private",
  "Ivy league"
];

export const COLLEGE_COST = [
  new MonetaryAmount(6000),
  new MonetaryAmount(10500),
  new MonetaryAmount(14000),
  new MonetaryAmount(16500),
  new MonetaryAmount(21000)
];
//Net of general CPI inflation
export const COLLEGE_INFLATION = 0.03;
export const COLLEGE_INYEAR_COST = [
  new MonetaryAmount(25000),
  new MonetaryAmount(40000),
  new MonetaryAmount(50000),
  new MonetaryAmount(61000),
  new MonetaryAmount(76000)
];

//Net of general CPI inflation
export const EXPECTED_RETURN = 0.04;

export const MAX_COLLEGE_AGE = 22;
export const MIN_COLLEGE_AGE = 19;

export const ANNUAL_CHILD_SUPPLY = new MonetaryAmount(12000);
export const MAX_CHILD_SUPPORT_AGE = 22;
export const MAX_CHILD_CARE_AGE = 5;
export const MIN_K12_AGE: number = 6;
export const MAX_K12_AGE: number = 18;
