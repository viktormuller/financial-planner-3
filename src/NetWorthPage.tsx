import * as d3 from "d3-format";
import { BankAccount, BankAccountTaxType, BankAccountType, Holding, SecurityType } from "financial-planner-api";
import React, { useContext, useEffect, useState } from "react";
import { Button, Jumbotron, Spinner, Table } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { useFPClient } from "./FPClient";
import { PLAID_CONTEXT, useGetLinkToken } from "./PlaidContext";
import { PlaidLinkButton } from "./PlaidLinkButton";


function getValue(holdings: Holding[], accountId: string, securityType: SecurityType | SecurityType[]) {
  let secType: SecurityType[] = ([] as SecurityType[]).concat(securityType);

  return holdings.map(holding => {
    if (holding.accountId === accountId && secType.includes(holding.securityType)) {
      return holding.value;
    } else return 0;
  }).reduce((a, b) => a + b);
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
  return (
    <Table>
      <thead>
        <tr>
          <th>Account name</th>
          <th className="text-right">Cash</th>
          <th className="text-right">Fixed income</th>
          <th className="text-right">Equities</th>
          <th className="text-right">Other</th>
          <th className="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) =>
          (account.type && type.includes(account.type) &&
            (taxType && account.taxType ? taxType.includes(account.taxType) : true)) &&
          <tr key={account.accountId}>
            <td key={account.accountId + "_name"}>{account.name}</td>
            <td key={account.accountId + "_cash"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType.cash))}
            </td>
            <td key={account.accountId + "_fixed_income"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType["fixed income"]))}
            </td>
            <td key={account.accountId + "_equities"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(holdings, account.accountId, SecurityType.equity))}
            </td>
            <td key={account.accountId + "_other"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(getValue(
                holdings,
                account.accountId,
                [SecurityType.derivative, SecurityType.etf, SecurityType.loan, SecurityType["mutual fund"], SecurityType.other]))}
            </td>
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
  const fpClient = useFPClient();

  useEffect(() => {
    async function fetchAccounts() {
      let balances = await fpClient.getBankAccounts();
      setAccounts(balances);
    }

    if (accounts === undefined || accounts.length === 0) {
      fetchAccounts().catch((e) => {
        console.log(e);
      })
    }
  }, [accounts]);

  useEffect(() => {
    async function fetchHoldings() {
      let holdings = await fpClient.getHoldings();
      setHoldings(holdings);
    }
    if (holdings === undefined || holdings.length === 0)
      fetchHoldings().catch((e) => {
        console.log(e);
      }
      )
  }, [holdings]);

  if (accounts && accounts.length > 0 && holdings && holdings.length > 0) {
    return (
      <div>
        <div className="d-flex">
          <h2>Net worth summary</h2><Button as={Link} to="/success" className="ml-auto">Send to advisor</Button></div>
        <h3>Cash accounts</h3>
        <AccountTypeTable type={[BankAccountType.depository]} accounts={accounts} holdings={holdings} />
        <h3>Investment accounts</h3>
        <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAXABLE, BankAccountTaxType.OTHER]}
          accounts={accounts}
          holdings={holdings} />
        <h3>Retirement accounts - Tax deferred</h3>
        <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAX_DEFERRED]}
          accounts={accounts}
          holdings={holdings} />
        <h3>Retirement accounts - Tax free</h3>
        <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAX_FREE]}
          accounts={accounts}
          holdings={holdings} />
        <h3>Liabilities</h3>
        <AccountTypeTable
          type={[BankAccountType.credit, BankAccountType.loan]}
          accounts={accounts}
          holdings={holdings} />
      </div>);
  }
  else return <React.Fragment><span>We are loading your accounts, it may take a moment...</span><Spinner className="ml-3" animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner></React.Fragment>;
}

export function NetWorthPage() {
  let { connected, connect } = useContext(PLAID_CONTEXT);
  let history = useHistory();
  let linkToken = useGetLinkToken();
  if (connected) {
    return <NetWorthTable />
  } else {
    return (
      <Jumbotron>
        <h1>Let's connect your accounts!</h1>
          In order for your financial advisor to best help you, they need to take a look at your financials. Particularly any savings, investments and loans or credit cards you have. By logging in to your accounts and authorising Enough Calculator to access your data, we can speed this process up and allow them to provide you with more accurate advice.
        <p className="mt-3">
          {linkToken ?
            <PlaidLinkButton linkToken={linkToken} callback={() => {
              connect(() => {
                history.push("/networth");
              });
            }} /> : "Loading..."}
        </p>
      </Jumbotron>
    )
  }
}
