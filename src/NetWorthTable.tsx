import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { fpClient } from "./FPClient";

export function NetWorthTable() {
  const [data, setData] = useState({ accounts: [] });
  useEffect(() => {
    async function fetchData() {
      try {
        let balances = await fpClient.getBalances();
        setData(balances);
      } catch (e) {
        console.log(e);
        setTimeout(() => fetchData(), 300);
      }
    }
    fetchData();
  })
  if (data && data.accounts.length > 0) {
    return (<Table>
      <thead>
        <tr>
          <th>Account name</th><th>Account type</th><th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {data.accounts.map((account) =>
          <tr key={account["accountId"]}>
            <td>{account["name"]}</td>
            <td>{account["subtype"]}</td>
            <td>{account["balances"]["current"]}</td>
          </tr>
        )}
      </tbody>
    </Table>);
  }
  else return <Spinner animation="border" role="status">
    <span className="sr-only">Loading...</span>
  </Spinner>;
}