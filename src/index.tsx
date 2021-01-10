import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { KidCostCalculator } from "./KidCostCalculator";
import { NetWorthTable } from "./NetWorthTable";
import { WelcomePage } from "./WelcomePage";

import { User, UserContext, USER_CONTEXT } from "./UserContext";
import { LoginPage } from "./LoginPage";

function App() {
  let [userState, setUserState] = useState<User>();
  function logIn(user: User) { 
    console.log("User: " + user.displayName);
    setUserState(user); window.location.href = "/home" }
  function logOutImpl() {
    setUserState(undefined);
    window.location.href = "/home"
  }

  return (
    <USER_CONTEXT.Provider value={{ user: userState, logIn: logIn, logOut: logOutImpl }}>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark" sticky="top" expand="md" >
          <Navbar.Brand>
            <img src="/favicon.svg"
              alt=""
              width="30"
              height="30"
              className="d-inline-block align-top" /> How much is enough?
            </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/kidcalc">Kid cost calculator</Nav.Link>
            </Nav>

            <Form inline className="ml-auto">
              <USER_CONTEXT.Consumer>{({ user, logOut }) => {
                if (user)
                  return (<Button variant="primary" onClick={logOut}>Logout</Button>)
                else return <Button variant="primary" href="/login">Login</Button>;
              }}
              </USER_CONTEXT.Consumer>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container className="my-2" id="main-container" >
          <Switch>
            <Route exact path={["/", "/home"]}>
              <WelcomePage />
            </Route>
            <Route path="/kidcalc">
              <KidCostCalculator />
            </Route>
            <Route path="/networth">
              <NetWorthTable />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </USER_CONTEXT.Provider>
  );
}

render(<App />, document.getElementById("root"));
