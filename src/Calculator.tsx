import {
  AfterSchoolCareStrategy,
  AFTER_SCHOOL_CARE_COST,
  ChildCareStrategy,
  CHILD_CARE_COST,
  CollegeStrategy,
  COLLEGE_INFLATION,
  COLLEGE_INYEAR_COST,
  EXPECTED_RETURN,
  K12_COST,
  MAX_CHILD_CARE_AGE,
  MAX_CHILD_SUPPORT_AGE,
  MAX_COLLEGE_AGE,
  MAX_K12_AGE,
  MIN_COLLEGE_AGE,
  MIN_K12_AGE
} from "./ChildStrategyEnums";
import { Household } from "./Household";
import { MonetaryAmount } from "./MonetaryAmount";

export class Calculator {
  startYear: number = new Date().getFullYear() + 1;

  childCost(household: Household) {
    console.log("childCost calculation invoked");    

    var childCost: MonetaryAmount[] = [];
    var maxYear = Math.max(
      ...household.children.map(child => child.yearOfBirth)
    );
    //If there are any kids then calculate, otherwise return empty array.
    if (maxYear) {
      var endYear = maxYear + MAX_CHILD_SUPPORT_AGE;
      for (let year: number = this.startYear; year <= endYear; year++) {
        var index = year - this.startYear;
        //Variable to check if the non institutional child care cost that doesn't scale 
        //with number of children has already been added. Reset for each year.
        var nonInstitutionalChildCareCostAdded:boolean=false;
        if (!childCost[index]) {
          childCost[index] = new MonetaryAmount();
        }
        
        for (let child of household.children) {
          //Child supply cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_CHILD_SUPPORT_AGE >= year
          ) {
            childCost[index] = childCost[index].add(
              household.childStrategy.annualSupply
            );
          }

          //ChildCare cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_CHILD_CARE_AGE >= year
          ) {
            if (ChildCareStrategy.DAYCARE === household.childStrategy.childCareStrategy ||
              ChildCareStrategy.IN_HOME === household.childStrategy.childCareStrategy)
            childCost[index] = childCost[index].add(
              CHILD_CARE_COST[household.childStrategy.childCareStrategy]
            );
            else if (!nonInstitutionalChildCareCostAdded) {
              nonInstitutionalChildCareCostAdded =true;
              childCost[index] = childCost[index].add(
                CHILD_CARE_COST[household.childStrategy.childCareStrategy]
              );
            }
          }

          //K12 cost + after school care
          if (
            child.yearOfBirth + MIN_K12_AGE <= year &&
            child.yearOfBirth + MAX_K12_AGE >= year
          ) {
            childCost[index] = childCost[index].add(
              K12_COST[household.childStrategy.k12Strategy]
            );
            if (household.childStrategy.afterSchoolCare === AfterSchoolCareStrategy.YES) 
              childCost[index] = childCost[index].add(AFTER_SCHOOL_CARE_COST);
          }
          //College cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_COLLEGE_AGE >= year
          ) {
            childCost[index] = childCost[index].add(
              this.collegeSavingRateCalculator(
                child.yearOfBirth +
                  MAX_COLLEGE_AGE -
                  Math.max(this.startYear, child.yearOfBirth),
                household.childStrategy.collegeStrategy                
              )
            );
          }
        }
      }
    }
    return childCost;
  }

  // Assumes all rates net of general CPI inflation
  collegeSavingRateCalculator(
    yearsForSaving: number,
    strat: CollegeStrategy
  ) {
    var yearsOfCollege = MAX_COLLEGE_AGE - MIN_COLLEGE_AGE + 1;
    var firstYearCostInflator = Math.pow(
      1 + COLLEGE_INFLATION,
      yearsForSaving - yearsOfCollege + 1
    );

    var firstYearCostOfCollege = COLLEGE_INYEAR_COST[strat].multiply(
      firstYearCostInflator
    );

    var totalCostOfCollege = firstYearCostOfCollege.multiply(
      (1 - Math.pow(COLLEGE_INFLATION + 1, yearsOfCollege)) / -COLLEGE_INFLATION
    );

    var collegeSavingRate = totalCostOfCollege.multiply(
      -EXPECTED_RETURN / (1 - Math.pow(1 + EXPECTED_RETURN, yearsForSaving))
    );

    return collegeSavingRate;
  }
}
