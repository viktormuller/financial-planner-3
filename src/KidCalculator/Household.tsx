import { Child } from "./Child";
import {
  AfterSchoolCareStrategy,
  ChildCareStrategy,
  ChildStrategy,
  CollegeStrategy,
  K12Strategy
} from "./ChildStrategyEnums";
import { FinancialStatement, MonetaryAmount } from "financial-planner-api/"; 
import { HOUSEHOLD_CASHFLOW } from "financial-planner-api";

export class Household {
  children: Child[] = [];
  childStrategy: ChildStrategy = {
    childCareStrategy: ChildCareStrategy.DAYCARE,
    k12Strategy: K12Strategy.PRIVATE_REGULAR,
    afterSchoolCare: AfterSchoolCareStrategy.NO,
    annualSupply: new MonetaryAmount(18000),
    collegeStrategy: CollegeStrategy.PRIVATE_TYPICAL
  };
  cashFlowStatement: FinancialStatement = new FinancialStatement (HOUSEHOLD_CASHFLOW);
}
 