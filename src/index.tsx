import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { KidCostCalculator } from "./KidCostCalculator";
import { WelcomePage } from "./WelcomePage";
 
function App() {
  return (
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
          { /* <Form inline className="ml-auto">
              <Button variant="primary">Login</Button>
            </Form> */}

        </Navbar.Collapse>
      </Navbar>
      <Container className="my-2" id="main-container" >
        <Switch>
          <Route exact path={["/", "/home"]}>
            <WelcomePage/>
          </Route>
          <Route path="/kidcalc">
            <KidCostCalculator />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}


render(<App />, document.getElementById("root"));
