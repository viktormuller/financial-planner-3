import React from "react";
import { Button } from "react-bootstrap";
import { USER_CONTEXT } from "./UserContext";
import {useHistory} from "react-router-dom";

export function AuthButton(){

    let history = useHistory();
    return (
    <USER_CONTEXT.Consumer>{({ user, logOut }) => {
        if (user)
          return (<Button variant="primary" onClick={() => logOut(() => {history.push("/")})}>Logout</Button>)
        else return <Button variant="primary" href="/login">Login</Button>;
      }}
    </USER_CONTEXT.Consumer>);
}