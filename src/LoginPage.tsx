import React, { useContext } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { UserContext, USER_CONTEXT } from "./UserContext";

export function LoginPage() {    
    let { user, logIn} = useContext<UserContext>(USER_CONTEXT);
    return (
        <Form className="mx-auto mt-5" style={{maxWidth: "400px"}}>
            <FormGroup>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" />
            </FormGroup>
            <FormGroup>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </FormGroup>
            <Button block onClick={()=>{logIn({userId:"1", displayName:"Viktor"})}}>Login</Button>
        </Form>);
}