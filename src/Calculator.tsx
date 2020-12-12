import {
  AFTER_SCHOOL_CARE_COST,
  CHILD_CARE_COST,
  CollegeStrategy,
  COLLEGE_COST,
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
    console.log("College strategy: " + household.childStrategy.collegeStrategy);
    console.log(
      "College cost / year: " +
        COLLEGE_COST[household.childStrategy.collegeStrategy].amount
    );

    var childCost: MonetaryAmount[] = [];
    var maxYear = Math.max(
      ...household.children.map(child => child.yearOfBirth)
    );
    //If there are any kids then calculate, otherwise return empty array.
    if (maxYear) {
      var endYear = maxYear + MAX_CHILD_SUPPORT_AGE;
      for (let year: number = this.startYear; year <= endYear; year++) {
        var index = year - this.startYear;
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
            childCost[index] = childCost[index].add(
              CHILD_CARE_COST[household.childStrategy.childCareStrategy]
            );
          }

          //K12 cost + after school care
          if (
            child.yearOfBirth + MIN_K12_AGE <= year &&
            child.yearOfBirth + MAX_K12_AGE >= year
          ) {
            childCost[index] = childCost[index].add(
              K12_COST[household.childStrategy.k12Strategy]
            );
            if (household.childStrategy.afterSchoolCare)
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
                household.childStrategy.collegeStrategy,
                household.childStrategy.collegeSaving
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
    strat: CollegeStrategy,
    savings: MonetaryAmount
  ) {
    var yearsOfCollege = MAX_COLLEGE_AGE - MIN_COLLEGE_AGE + 1;
    var firstYearCostInflator = Math.pow(
      1 + COLLEGE_INFLATION,
      yearsForSaving - yearsOfCollege + 1
    );

    /* console.log(
      "Years till first year: " + (yearsForSaving - yearsOfCollege + 1)
    );*/

    // console.log("First year cost inflator: " + firstYearCostInflator);

    var firstYearCostOfCollege = COLLEGE_INYEAR_COST[strat].multiply(
      firstYearCostInflator
    );

    // console.log("First year college cost: " + firstYearCostOfCollege.amount);
    var totalCostOfCollege = firstYearCostOfCollege.multiply(
      (1 - Math.pow(COLLEGE_INFLATION + 1, yearsOfCollege)) / -COLLEGE_INFLATION
    );
    console.log("Total college cost: " + totalCostOfCollege.amount);

    var valueOfSavingAlreadyAvailable = savings.multiply(
      Math.pow(1 + EXPECTED_RETURN, yearsForSaving)
    );

    console.log(
      "Value of available savings: " + valueOfSavingAlreadyAvailable.amount
    );

    var remainingCostOfCollege = totalCostOfCollege.subtract(
      valueOfSavingAlreadyAvailable
    );

    console.log("Remaining cost of college: " + remainingCostOfCollege.amount);

    var collegeSavingRate = remainingCostOfCollege.multiply(
      -EXPECTED_RETURN / (1 - Math.pow(1 + EXPECTED_RETURN, yearsForSaving))
    );
    //  console.log("College saving rate: " + collegeSavingRate.amount);

    return collegeSavingRate;
  }
}
