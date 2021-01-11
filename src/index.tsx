import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState } from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { render } from "react-dom";
import { BrowserRouter, Redirect, Route, Switch, Link, reload} from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { KidCostCalculator } from "./KidCostCalculator";
import { LandingPage } from "./LandingPage";
import { LoginPage } from "./LoginPage";
import { NetWorthTable } from "./NetWorthTable";
import { SignupPage } from "./SignupPage";
import { fakeAuth, User, USER_CONTEXT } from "./UserContext";
import { WelcomePage } from "./WelcomePage";


function PrivateRoute({ children, ...rest }) {
  let auth = useContext(USER_CONTEXT);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function App() {
  let [userState, setUserState] = useState<User>();

  function logIn(user: User, cb) {
    fakeAuth.logIn(user, () => {
      setUserState(user);
      cb();
    })
  }
  function logOut(cb) {
    fakeAuth.logOut(() => {
      setUserState(undefined);
      cb();
    })
  }

  return (
    <USER_CONTEXT.Provider value={{ user: userState, logIn: logIn, logOut: logOut }}>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark" sticky="top" expand="md" >
          <Navbar.Brand as={Link} to="/">
            <img src="/favicon.svg"
              alt=""
              width="30"
              height="30"
              className="d-inline-block align-top" /> How much is enough?
            </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/kidcalc">Kid cost calculator</Nav.Link>
            </Nav>

            <Form inline className="ml-auto">
              <AuthButton/>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container className="my-2" id="main-container" >
          <Switch>
            <Route exact path="/">
              <LandingPage/>
            </Route>
            <Route path={"/welcome"}>
              <WelcomePage />
            </Route>
            <Route path="/kidcalc">
              <KidCostCalculator />
            </Route>
            <PrivateRoute path="/networth">
              <NetWorthTable />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/signup">
              <SignupPage />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </USER_CONTEXT.Provider>
  );
}

render(<App />, document.getElementById("root"));
