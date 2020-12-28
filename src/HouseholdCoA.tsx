import { AccountSide, AccountType, ChartOfAccounts, StatementType } from "./ChartOfAccounts";


export const CHILD_COST_ACCOUNT_TYPE:AccountType = {
    name: "Children cost",
    id: "bae0cfff-6de3-4120-911f-b54bebb41ea1",
    increaseWith: AccountSide.DEBIT         
}

export const CHILD_CARE_COST_ACCOUNT_TYPE = {
    name: "Childcare cost",
    id: "95af962e-28ae-45ad-a85c-c150aa1d0d3b",
    increaseWith: AccountSide.DEBIT,
    parent: CHILD_COST_ACCOUNT_TYPE
}

export const K12_COST_ACCOUNT_TYPE = {
    name: "K12 cost",
    id: "b31797d7-552b-4795-a07e-54d3f2553e3a",
    increaseWith: AccountSide.DEBIT,
    parent:  CHILD_COST_ACCOUNT_TYPE            
}

export const AFTER_SCHOOL_CARE_COST_ACCOUNT_TYPE = {
    name: "After school care cost",
    id: "1217d4fa-0b81-4f65-865b-0658fe303f4f",
    increaseWith: AccountSide.DEBIT,
    parent:  CHILD_COST_ACCOUNT_TYPE
}

export const COLLEGE_COST_ACCOUNT_TYPE = {
    name: "College cost (spread)",
    id: "e551e300-917a-425e-a0fb-f8a04dcbf566",
    increaseWith: AccountSide.DEBIT,
    parent:  CHILD_COST_ACCOUNT_TYPE
}

export const CHILD_SUPPLY_ACCOUNT_TYPE= {
    name: "Child supply",
    id: "0f1f71d9-ab4d-4a18-9ed2-c0f7684aa762",
    increaseWith: AccountSide.DEBIT,
    parent:  CHILD_COST_ACCOUNT_TYPE
}

export const HOUSEHOLD_CASHFLOW : ChartOfAccounts = {
    type: StatementType.CASH_FLOW,
    accountTypes: [   
        CHILD_COST_ACCOUNT_TYPE,      
        CHILD_CARE_COST_ACCOUNT_TYPE,
        K12_COST_ACCOUNT_TYPE,
        AFTER_SCHOOL_CARE_COST_ACCOUNT_TYPE, 
        COLLEGE_COST_ACCOUNT_TYPE, 
        CHILD_SUPPLY_ACCOUNT_TYPE
    ]    
}
