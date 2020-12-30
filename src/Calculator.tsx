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
  MIN_K12_AGE,
  MULTI_KID_CHILD_CARE_STRATEGIES
} from "./ChildStrategyEnums";
import { Household } from "./Household";
import { AFTER_SCHOOL_CARE_COST_ACCOUNT_TYPE, CHILD_CARE_COST_ACCOUNT_TYPE, CHILD_COST_ACCOUNT_TYPE, CHILD_SUPPLY_ACCOUNT_TYPE, COLLEGE_COST_ACCOUNT_TYPE, K12_COST_ACCOUNT_TYPE } from "./HouseholdCoA";
import { MonetaryAmount } from "./MonetaryAmount";

export class Calculator {
  startYear: number = new Date().getFullYear() + 1;

  childCost(household: Household) {      
    console.log("Child cost calc invoked");
    household.cashFlowStatement.resetAccountByType(CHILD_COST_ACCOUNT_TYPE);

    var maxYear = Math.max(
      ...household.children.map(child => child.yearOfBirth)
    );
    //If there are any kids then calculate, otherwise return empty array.
    if (maxYear) {
      var endYear = maxYear + MAX_CHILD_SUPPORT_AGE;
      for (let year: number = this.startYear; year <= endYear; year++) {        
        //Variable to check if the non institutional child care cost that doesn't scale 
        //with number of children has already been added. Reset for each year.
        var nonInstitutionalChildCareCostAdded:boolean=false;
              
        for (let child of household.children) {
          //Child supply cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_CHILD_SUPPORT_AGE >= year
          ) {            
            household.cashFlowStatement.addToAccount(
              CHILD_SUPPLY_ACCOUNT_TYPE.id, 
              year,
              household.childStrategy.annualSupply);
          }

          //ChildCare cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_CHILD_CARE_AGE >= year
          ) {
            if (!MULTI_KID_CHILD_CARE_STRATEGIES.includes( household.childStrategy.childCareStrategy ))
              household.cashFlowStatement.addToAccount(
                CHILD_CARE_COST_ACCOUNT_TYPE.id, 
                year,
                CHILD_CARE_COST[household.childStrategy.childCareStrategy]);          
            else if (!nonInstitutionalChildCareCostAdded) {
              nonInstitutionalChildCareCostAdded =true;
              household.cashFlowStatement.addToAccount(
                CHILD_CARE_COST_ACCOUNT_TYPE.id, 
                year,
                CHILD_CARE_COST[household.childStrategy.childCareStrategy]);                        
            }//else non institutional child care strategy and it has already been accounted for.
          }

          //K12 cost + after school care
          if (
            child.yearOfBirth + MIN_K12_AGE <= year &&
            child.yearOfBirth + MAX_K12_AGE >= year
          ) {
            household.cashFlowStatement.addToAccount(
              K12_COST_ACCOUNT_TYPE.id, 
              year,
              K12_COST[household.childStrategy.k12Strategy]);   
            if (household.childStrategy.afterSchoolCare === AfterSchoolCareStrategy.YES) 
              household.cashFlowStatement.addToAccount(
                AFTER_SCHOOL_CARE_COST_ACCOUNT_TYPE.id, 
                year,
                AFTER_SCHOOL_CARE_COST);           
          }
          //College cost
          if (
            child.yearOfBirth <= year &&
            child.yearOfBirth + MAX_COLLEGE_AGE >= year
          ) {
            household.cashFlowStatement.addToAccount(
              COLLEGE_COST_ACCOUNT_TYPE.id, 
              year,
              this.collegeSavingRateCalculator(
                child.yearOfBirth +
                  MAX_COLLEGE_AGE -
                  Math.max(this.startYear, child.yearOfBirth),
                household.childStrategy.collegeStrategy                
              ));         
          }
        }
        //Failsafe to back fill empty values in the beginning. 
        var totalAccount = household.cashFlowStatement.getAccountByType(CHILD_COST_ACCOUNT_TYPE);
        if (totalAccount !== undefined){
          var yearTotalCost = totalAccount.balances[year-this.startYear];
          if (yearTotalCost === null || yearTotalCost === undefined) {            
            totalAccount.balances[year-this.startYear] = new MonetaryAmount(0);
          }
        }
      }
    }
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
