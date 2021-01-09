import { BankAccount } from "financial-planner-api";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { fpClient } from "./FPClient";

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
  },[]);

  if (accounts  && accounts.length > 0) {
    return (<Table>
      <thead>
        <tr>
          <th>Account name</th><th>Account type</th><th>Tax type</th><th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) =>
          <tr key={account.accountId}>
            <td key={account.accountId + "_name"}>{account.name}</td>
            <td key={account.accountId + "_subType"}>{account.subType}</td>
            <td key={account.accountId + "_taxType"}>{account.taxType}</td>
            <td key={account.accountId + "_balance"}>{account.balance}</td>
          </tr>
        )}
      </tbody>
    </Table>);
  }
  else return <Spinner animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner>;
}