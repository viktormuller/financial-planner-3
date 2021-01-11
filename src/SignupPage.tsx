import React, { useContext } from "react";
import { UserContext, USER_CONTEXT } from "./UserContext";
import {useHistory} from "react-router-dom";
import { Button, Form, FormGroup } from "react-bootstrap";

export function SignupPage() {
    let auth = useContext<UserContext>(USER_CONTEXT);
    let history = useHistory();
    
    let myLogIn = (user) => {
        auth.logIn(user, () => {
            history.replace("/networth");
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
            <FormGroup>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" />
            </FormGroup>
            <Button block onClick={() => { myLogIn({ userId: "1", displayName: "Viktor" }) }}>Create account</Button>
        </Form>);
}