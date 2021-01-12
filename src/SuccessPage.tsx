import React from "react";
import { Button, Jumbotron } from "react-bootstrap";
import {Link} from "react-router-dom";

export function SuccessPage() {
    return (
        <Jumbotron>
            <h1>Congratulations!</h1>
          You have just sent your financial data to your advisor. They will use it in your first meeting.
            <p>
                Until then check out our free kid cost calculator.
          </p>
            <p className="mt-3">
                <Button className="mr-3" variant="secondary" as={Link} to="/networth">Back to Net worth</Button>
                <Button variant="primary" as={Link} to="/kidcalc">Kid cost calculator</Button>
            </p>
        </Jumbotron>);

}