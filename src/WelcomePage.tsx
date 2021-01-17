import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Button, Jumbotron } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { Advisors } from "./Advisors";
import { useGetLinkToken, usePlaidProvider } from './PlaidContext';
import { PlaidLinkButton } from './PlaidLinkButton';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function WelcomePage() {


  let history = useHistory();  
  const {isAuthenticated, loginWithRedirect} = useAuth0();

  let advisorId = useQuery().get("advisorId");
  var advisor;
  if (advisorId)
    advisor = Advisors.getAdvisor(advisorId);


  let linkToken = useGetLinkToken();
  const { connect } = usePlaidProvider();

  let callback = () => {
    connect(() => {
      history.push("/networth");
    });
  }

  return (
    <Jumbotron>
      <h1>Welcome to Enough Calculator!</h1>
      <p>
        Your financial advisor{advisor ? ", " + advisor.name + " from " + advisor.company : " "} asked us to help collect some data.
          They will use it to prepare for your next meeting.
          We do not use your data for any other purpose.
        </p>
      <p>
        {
          isAuthenticated ? linkToken !== undefined ? <PlaidLinkButton linkToken={linkToken} callback={callback} /> : "Loading..." :
            <Button variant="primary" onClick={() => { loginWithRedirect({
              screen_hint:"signup"
            }) }}>Create an account</Button>
        }
      </p>
    </Jumbotron>
  )

}