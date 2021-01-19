import * as d3 from "d3-format";
import { BankAccount, BankAccountTaxType, BankAccountType, Holding, SecurityType } from "financial-planner-api";
import React, { useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AccountDataZeroState } from "./AccountDataZeroState";
import { useFPClient } from "./FPClient";
import { usePlaidContext } from "./PlaidContext";


function getValue(holdings: Holding[], accountId: string, securityType: SecurityType | SecurityType[]) {
  let secType: SecurityType[] = ([] as SecurityType[]).concat(securityType);

  return holdings.map(holding => {
    if (holding.accountId === accountId && secType.includes(holding.securityType)) {
      return holding.value;
    } else return 0;
  }).reduce((a, b) => a + b);
}

function getAccountTypeCategories(accounts: BankAccount[]) {
  let ret = {
    hasCash: false, 
    hasInvestment: false, 
    hasDeferredRetirement: false, 
    hasFreeRetirement: false, 
    hasLiability: false
  }
  
  accounts.forEach((account)=>{
    let {type, taxType} = account;
    if (type === BankAccountType.depository) ret.hasCash = true;
    if (type === BankAccountType.investment) {
      if (taxType === BankAccountTaxType.TAXABLE || taxType === BankAccountTaxType.OTHER) ret.hasInvestment=true;
      if (taxType === BankAccountTaxType.TAX_DEFERRED ) ret.hasDeferredRetirement = true;
      if (taxType === BankAccountTaxType.TAX_FREE) ret.hasFreeRetirement = true;
    } 
    if (type === BankAccountType.loan || type === BankAccountType.credit) ret.hasLiability=true;
  });

  return ret;
}

function AccountTypeTable(props: {
  accounts: BankAccount[],
  type: BankAccountType[],
  taxType?: BankAccountTaxType[],
  holdings: Holding[]
}) {
  const {
    accounts, type, taxType, holdings
  } = props;

  const hasInvestment = type.includes(BankAccountType.investment);  

  return (
    <Table>
      <thead>
        <tr>
          <th>Account name</th>

          {hasInvestment && <th className="text-right">Cash</th>}
          {hasInvestment && <th className="text-right">Fixed income</th>}
          {hasInvestment && <th className="text-right">Equities</th>}
          {hasInvestment && <th className="text-right">Other</th>}
          <th className="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) =>
          (account.type && type.includes(account.type) &&
            (taxType && account.taxType ? taxType.includes(account.taxType) : true)) &&
          <tr key={account.accountId}>
            <td key={account.accountId + "_name"}>{account.name}</td>
            {hasInvestment && <td key={account.accountId + "_cash"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType.cash))}
            </td>}
            {hasInvestment && <td key={account.accountId + "_fixed_income"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType["fixed income"]))}
            </td>}
            {hasInvestment && <td key={account.accountId + "_equities"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType.equity))}
            </td>}
            {hasInvestment && <td key={account.accountId + "_other"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(
                holdings,
                account.accountId,
                [SecurityType.derivative, SecurityType.etf, SecurityType.loan, SecurityType["mutual fund"], SecurityType.other]))}
            </td>}
            <td key={account.accountId + "_balance"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(account.balance)}</td>
          </tr>
        )}
      </tbody>
    </Table>);
}

export function NetWorthTable() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const { client, isReady } = useFPClient();

  useEffect(() => {
    async function fetchAccounts() {
      let balances = await client.getBankAccounts();
      setAccounts(balances);
    }

    if (isReady && (accounts === undefined || accounts.length === 0)) {
      fetchAccounts().catch((e) => {
        console.log(e);
      })
    }
  }, [accounts, client, isReady]);

  useEffect(() => {
    async function fetchHoldings() {
      let holdings = await client.getHoldings();
      setHoldings(holdings);
    }
    if (isReady && (holdings === undefined || holdings.length === 0))
      fetchHoldings().catch((e) => {
        console.log(e);
      }
      )
  }, [holdings, client, isReady]);

  let {hasCash, hasDeferredRetirement, hasFreeRetirement, hasInvestment, hasLiability} = getAccountTypeCategories(accounts);

  if (accounts && accounts.length > 0 && holdings && holdings.length > 0) {
    return (
      <div>
        <div className="d-flex">
          <h2>Net worth summary</h2><Button as={Link} to="/success" className="ml-auto">Send to advisor</Button></div>
        {hasCash && <h3 className="mt-3">Cash accounts</h3>}
        {hasCash && <AccountTypeTable type={[BankAccountType.depository]} accounts={accounts} holdings={holdings} />}
        {hasInvestment && <h3 className="mt-3">Investment accounts</h3>}
        {hasInvestment && <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAXABLE, BankAccountTaxType.OTHER]}
          accounts={accounts}
          holdings={holdings} />}
        {hasDeferredRetirement && <h3 className="mt-3">Retirement accounts - Tax deferred</h3>}
        {hasDeferredRetirement && <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAX_DEFERRED]}
          accounts={accounts}
          holdings={holdings} />}
        {hasFreeRetirement && <h3 className="mt-3">Retirement accounts - Tax free</h3>}
        {hasFreeRetirement && <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAX_FREE]}
          accounts={accounts}
          holdings={holdings} />}
        {hasLiability && <h3 className="mt-3">Liabilities</h3>}
        {hasLiability && <AccountTypeTable
          type={[BankAccountType.credit, BankAccountType.loan]}
          accounts={accounts}
          holdings={holdings} />}
      </div>);
  }
  else return <React.Fragment><span>We are loading your accounts, it may take a moment...</span><Spinner className="ml-3" animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner></React.Fragment>;
}

export function NetWorthPage() {
  const { hasAccessToken, isLoadingAccessToken, checkAccessToken, checkedAccessToken } = usePlaidContext();
  useEffect(() => {
    if (!hasAccessToken) checkAccessToken();
  }, [hasAccessToken, checkAccessToken]);


  if (hasAccessToken) {
    return <NetWorthTable />
  } else {
    if (isLoadingAccessToken || !checkedAccessToken) {
      return <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    }
    else return <AccountDataZeroState />
  }
}
