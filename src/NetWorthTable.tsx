import { BankAccount, BankAccountTaxType, BankAccountType } from "financial-planner-api";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { fpClient } from "./FPClient";
import * as d3 from "d3-format";


function AccountTypeTable(props: { accounts: BankAccount[], type: BankAccountType[], taxType?: BankAccountTaxType[] }) {
  const {
    accounts, type, taxType
  } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>Account name</th><th className="text-right">Balance</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) =>
          (type.includes(account.type) && (taxType ? taxType.includes(account.taxType) : true)) &&
          <tr key={account.accountId}>
            <td key={account.accountId + "_name"}>{account.name}</td>
            <td key={account.accountId + "_balance"} className="text-right" >
              {account.currency + " " + d3.format(",.0f")(account.balance)}</td>
          </tr>
        )}
      </tbody>
    </Table>);
}

export function NetWorthTable() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    async function fetchData() {
      let balances = await fpClient.getBankAccounts("");
      setAccounts(balances);
    }

    fetchData().catch((e) => {
      console.log(e);
    }
    )
  }, []);

  if (accounts && accounts.length > 0) {
    return (
      <div style={{maxWidth: "400px"}}>
        <h2>Net worth summary</h2>
        <h3>Cash accounts</h3>
        <AccountTypeTable type={[BankAccountType.depository]} accounts={accounts} />
        <h3>Investment accounts</h3>
        <AccountTypeTable
          type={[BankAccountType.investment]}
          taxType={[BankAccountTaxType.TAXABLE, BankAccountTaxType.OTHER]}
          accounts={accounts} />
        <h3>Retirement accounts - Tax deferred</h3>
        <AccountTypeTable type={[BankAccountType.investment]} taxType={[BankAccountTaxType.TAX_DEFERRED]} accounts={accounts} />
        <h3>Retirement accounts - Tax free</h3>
        <AccountTypeTable type={[BankAccountType.investment]} taxType={[BankAccountTaxType.TAX_FREE]} accounts={accounts} />
        <h3>Liabilities</h3>
        <AccountTypeTable type={[BankAccountType.credit, BankAccountType.loan]} accounts={accounts} />
      </div>);
  }
  else return <Spinner animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner>;
}
