import { Auth0Provider, useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserHistory } from "history";
import React from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { render } from "react-dom";
import { Link, Route, Router, Switch } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { CashFlowPage } from "./CashFlowPage";
import { KidCostCalculator } from "./KidCalculator/KidCostCalculator";
import { LandingPage } from "./LandingPage";
import { NetWorthPage } from "./NetWorthPage";
import { PlaidContextProvider } from "./PlaidContext";
import { SuccessPage } from "./SuccessPage";
import { WelcomePage } from "./WelcomePage";

const history = createBrowserHistory(); 

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

function PrivateRoute({ component, ...rest }) {
  return (<Route component={withAuthenticationRequired(component)} {...rest} />)
}

function PrivateLink({to, children, ...rest}) {
  let { isAuthenticated } = useAuth0();
  return (
    <React.Fragment>
      { isAuthenticated && <Nav.Link as={Link} to={to} {...rest}>{children}</Nav.Link>}
    </React.Fragment>);
}


//TODO: hide networth without logged in user. Probably refactor Navbar to its own component
function App() {
  let { protocol, host } = window.location;


  return (
    <Auth0Provider domain="dev-finplanner.us.auth0.com"
      clientId="afDzdMvPA1OWNimkuo6m9TCyr6dtfI4P"
      redirectUri={`${protocol}//${host}/networth`}
      onRedirectCallback={onRedirectCallback}
      audience="https://api.enoughcalc.com"
      scope="crud:all">
      <PlaidContextProvider>
        <Router history={history}>
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
                <PrivateLink to="/networth" >Net worth</PrivateLink>
                <PrivateLink to="/cashflow" >Cash flow</PrivateLink>                          
                <Nav.Link as={Link} to="/kidcalc">Kid cost calculator</Nav.Link>

              </Nav>
              <Form inline className="ml-auto">
                <AuthButton />
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <Container className="my-2" id="main-container" >
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path={"/welcome"}>
                <WelcomePage />
              </Route>
              <Route path="/kidcalc">
                <KidCostCalculator />
              </Route>
              <PrivateRoute path="/networth" component={NetWorthPage} />
              <PrivateRoute path="/cashflow" component={CashFlowPage} />
              <Route path="/success">
                <SuccessPage />
              </Route>
            </Switch>
          </Container>
        </Router>
      </PlaidContextProvider>
    </Auth0Provider >
  );
}

render(<App />, document.getElementById("root"));
