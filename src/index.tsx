import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserHistory } from "history";
import React from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { render } from "react-dom";
import { Link, Route, Router, Switch } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { KidCostCalculator } from "./KidCostCalculator";
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


//TODO: hide networth without logged in user. Probably refactor Navbar to its own component
function App() {

  

  return (
    <Auth0Provider domain="dev-finplanner.us.auth0.com"
      clientId="afDzdMvPA1OWNimkuo6m9TCyr6dtfI4P"
      redirectUri="http://localhost:3000/networth"
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
                {<Nav.Link as={Link} to="/networth">Net worth</Nav.Link>}
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
              <PrivateRoute path="/networth" component={NetWorthPage}/>
              <Route path="/success">
                <SuccessPage />
              </Route>              
            </Switch>
          </Container>
        </Router>
        </PlaidContextProvider>      
    </Auth0Provider>
  );
}

render(<App />, document.getElementById("root"));
