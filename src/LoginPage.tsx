import React, { useContext } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext, USER_CONTEXT } from "./UserContext";

export function LoginPage() {
    let auth = useContext<UserContext>(USER_CONTEXT);
    let history = useHistory();
    let location = useLocation();


    let { from } = location.state || { from: { pathname: "/" } };
    let myLogIn = (user) => {
        auth.logIn(user, () => {
            history.replace(from);
        });
    };

    return (
        <Form className="mx-auto mt-5" style={{ maxWidth: "400px" }}>
            <FormGroup>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" />
            </FormGroup>
            <FormGroup>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </FormGroup>
            <Button block onClick={() => { myLogIn({ userId: "1", displayName: "Viktor" }) }}>Login</Button>
        </Form>);
}