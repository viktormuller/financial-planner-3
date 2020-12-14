import { Child } from "./Child";
import {
  AfterSchoolCareStrategy,
  ChildCareStrategy,
  ChildStrategy,
  CollegeStrategy,
  K12Strategy
} from "./ChildStrategyEnums";
import { MonetaryAmount } from "./MonetaryAmount";

export class Household {
  children: Child[] = [];
  childStrategy: ChildStrategy = {
    childCareStrategy: ChildCareStrategy.DAYCARE,
    k12Strategy: K12Strategy.PRIVATE_REGULAR,
    afterSchoolCare: AfterSchoolCareStrategy.NO,
    annualSupply: new MonetaryAmount(18000),
    collegeStrategy: CollegeStrategy.PRIVATE_TYPICAL,
    collegeSaving: new MonetaryAmount(0)
  };
}
