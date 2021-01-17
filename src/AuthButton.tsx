import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "react-bootstrap";

export function AuthButton() {

  
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();


  if (isAuthenticated)
    return (<Button variant="secondary" onClick={() => logout({ returnTo: "http://localhost:3000/" })}>Logout</Button>)
  else return <Button variant="primary" onClick={() => loginWithRedirect()}>Login</Button>;
}

