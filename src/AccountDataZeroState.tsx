import React from "react";
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { PlaidLinkButton } from "./PlaidLinkButton";

export function AccountDataZeroState() {
    let history = useHistory();

    return (
        <Jumbotron>
            <h1>Let's connect your accounts!</h1>
          In order for your financial advisor to best help you, they need to take a look at your financials. Particularly any savings, investments and loans or credit cards you have. By logging in to your accounts and authorising Enough Calculator to access your data, we can speed this process up and allow them to provide you with more accurate advice.
            <p className="mt-3">
                <PlaidLinkButton callback={
                    () => {
                        history.push("/networth");
                    }
                } />
            </p>
        </Jumbotron>);
}