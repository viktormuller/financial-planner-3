import { AccountSide, BankAccountType, FinancialAccount } from "financial-planner-api";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { AccountDataZeroState } from "./AccountDataZeroState";
import { useFPClient } from "./FPClient";
import { usePlaidContext } from "./PlaidContext";
import * as d3 from "d3-format";

export function CashFlowPage() {

    const { hasAccessToken, isLoadingAccessToken, checkedAccessToken, checkAccessToken } = usePlaidContext();
    useEffect(() => {
        if (!hasAccessToken) checkAccessToken();
    }, [hasAccessToken, checkAccessToken]);

    if (hasAccessToken) {
        return <CashFlowTable />;
    } else {
        if (isLoadingAccessToken || !checkedAccessToken) {
            return <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        }
        else return <AccountDataZeroState />
    }


}

export function CashFlowTable() {
    const { client, isReady } = useFPClient();
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);

    useEffect(() => {
        if (isReady && accounts.length === 0)
            client.getCashFlowAccounts().then((accounts) => { setAccounts(accounts) });
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th></th>
                    <th className="text-right">Monthly average</th>
                    <th className="text-right">Annual</th>
                </tr>
            </thead>
            <tbody>
                {
                    accounts.map((acc) => {
                        const invert = (acc.accountType.increaseWith === AccountSide.DEBIT);
                        const annual = acc.balances[0].amount * (invert ? -1 : 1);
                        const monthly = annual / 12;


                        return (
                            <tr key={acc.accountType.id}>
                                <td key={acc.accountType.id + "name"}>{acc.accountType.name}</td>
                                <td key={acc.accountType.id + "monthly"} className="text-right">{d3.format(",.0f")(monthly)}</td>
                                <td key={acc.accountType.id + "annual"} className="text-right">{d3.format(",.0f")(annual)}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>);
}