import { AccountSide, AccountType, ChartOfAccounts } from "./ChartOfAccounts";
import { MonetaryAmount } from "./MonetaryAmount";

export class FinancialStatement {
    chartOfAccounts: ChartOfAccounts;
    startYear: number;    
    accounts: FinancialAccount[] = [];

    constructor(coa: ChartOfAccounts, startYear: number = (new Date().getFullYear()+1)){
        coa.accountTypes.forEach((accType) => {
            this.accounts.push(new FinancialAccount(accType, startYear));
        })
    }

    getChildAccounts(parentAccountType: AccountType): FinancialAccount[] {
        return this.accounts.filter((acc) => acc.accountType.parent === parentAccountType);
    }

    getAccountById(accId: string):FinancialAccount{
        return this.accounts.find((value:FinancialAccount) => value.accountType.id === accId) as FinancialAccount;
    }

    getAccountByType(accType: AccountType):FinancialAccount{
        return this.accounts.find((value) => value.accountType.id === accType.id) as FinancialAccount;
    }
    
    addToAccount(accId: string, year:number, amount: MonetaryAmount){        
        var acc = this.getAccountById(accId);        
        if (acc){            
            acc.add(amount, year);            
            //If it has a parent account then recursively add to that as well.
            if (acc.accountType.parent !== undefined) {
                var parentAcc = this.getAccountByType(acc.accountType.parent);
                if (parentAcc !== undefined ) {                    
                    this.addToAccount(parentAcc.accountType.id, year, amount);                    
                }
            } 
        } 
    }

    deductFromAccount(accId: string, year:number, amount: MonetaryAmount){
        var acc = this.getAccountById(accId)
        if (acc){
            acc.deduct(amount, year);
            //If it has a parent account then recursively add to that as well.
            if (acc.accountType.parent !== undefined) {
                var parentAcc = this.getAccountByType(acc.accountType.parent);
                if (parentAcc !== undefined )
                    this.deductFromAccount(parentAcc.accountType.id, year, amount);
            }
        } 
    }

    resetAccount(acc:FinancialAccount, recursive:boolean=true){
        var children = this.getChildAccounts(acc.accountType);        
        acc.balances = [];        
        children.forEach((childAcc) => this.resetAccount(childAcc, recursive));
    }

    resetAccountByType(accType: AccountType, recursive:boolean =true){
        var acc = this.getAccountByType(accType);
        if (acc){
            this.resetAccount(acc,recursive);
        }
    }

}

export class FinancialAccount {
    accountType: AccountType;  
    startYear: number;
    balances: MonetaryAmount[];

    constructor(accType: AccountType, startYear: number){
        this.accountType = accType;
        this.startYear = startYear;
        this.balances = [];
    }

    add(amount: MonetaryAmount, year:number){
        var balance = this.balances[year-this.startYear]
        if (balance === undefined) {
            balance = new MonetaryAmount(0);            
        }
        balance = balance.add(amount);
        this.balances[year-this.startYear] = balance;
    }

    deduct(amount: MonetaryAmount, year:number){
        var balance = this.balances[year-this.startYear]
        if (balance === undefined) {
            balance = new MonetaryAmount(0);            
        }
        balance = balance.subtract(amount);
        this.balances[year-this.startYear] = balance;
    }

    credit(amount: MonetaryAmount, year:number){
        if (this.accountType.increaseWith === AccountSide.CREDIT){
            this.add(amount, year);
        } else {
            this.deduct(amount, year);
        }
    }

    debit(amount:MonetaryAmount, year:number){
        if (this.accountType.increaseWith === AccountSide.DEBIT){
            this.add(amount, year);
        } else {
            this.deduct(amount, year);
        }
    }
}