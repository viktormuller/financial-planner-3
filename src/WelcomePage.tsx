import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { Button, Jumbotron, Spinner } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { Advisors } from "./Advisors";
import { usePlaidContext } from './PlaidContext';
import { PlaidLinkButton } from './PlaidLinkButton';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function WelcomePage() {

  let {protocol, host} = useLocation();
  let history = useHistory();
  let { hasAccessToken, checkAccessToken, checkedAccessToken, isLoadingAccessToken } = usePlaidContext();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!hasAccessToken) checkAccessToken();
  });

  let advisorId = useQuery().get("advisorId");
  var advisor;
  if (advisorId)
    advisor = Advisors.getAdvisor(advisorId);

  let callback = () => {
    history.push("/networth");
  }

  return (

    <Jumbotron>
      <h1>Welcome to Enough Calculator!</h1>
      <p>
        Your financial advisor{advisor ? ", " + advisor.name + " from " + advisor.company : " "} asked us to help collect some data.
          They will use it to prepare for your next meeting.
          We do not use your data for any other purpose.
        </p>
      
        {
          isLoading ? <Spinner animation="border" role="status" /> :
            !isAuthenticated ?
              <Button variant="primary" onClick={() => {
                loginWithRedirect({
                  redirectUri: `${protocol}//${host}/networth`,
                  screen_hint: "signup"
                })
              }}>Create an account</Button> :
              !checkedAccessToken || isLoadingAccessToken ? <Spinner animation="border" role="status" /> :
                !hasAccessToken ?
                  <PlaidLinkButton callback={callback} /> :
                  <Button variant="primary" onClick={callback}>See my net worth</Button>
        }
      
    </Jumbotron>
  )
}