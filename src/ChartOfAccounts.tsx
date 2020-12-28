export interface ChartOfAccounts {
    type: StatementType, 
    accountTypes: AccountType[]
}

export interface AccountType {
    name: string, 
    id: string, 
    increaseWith: AccountSide, 
    parent?: AccountType 
}

export enum AccountSide {
    DEBIT,
    CREDIT
}

export enum StatementType {
    BALANCE_SHEET,
    CASH_FLOW
}