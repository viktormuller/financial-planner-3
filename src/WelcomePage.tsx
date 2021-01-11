import React, { useContext, useEffect, useState } from 'react';
import { Button, Jumbotron } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { Advisors } from "./Advisors";
import { fpClient } from './FPClient';
import { PlaidLinkButton } from './PlaidLinkButton';
import { USER_CONTEXT } from './UserContext';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function WelcomePage() {

  const [linkToken, setToken] = useState<string>();
  let history = useHistory();
  let { user } = useContext(USER_CONTEXT);

  let advisorId = useQuery().get("advisorId");
  var advisor;
  if (advisorId)
    advisor = Advisors.getAdvisor(advisorId);

  useEffect(() => {
    async function getLinkToken() {
      if (!linkToken) {
        let token = await fpClient.getLinkToken();
        setToken(token);
      }
    }
    getLinkToken();
  })


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
          user ? linkToken !== undefined ? <PlaidLinkButton linkToken={linkToken} /> : "Loading..." :
            <Button variant="primary" onClick={() => { history.push("/signup") }}>Let's get started</Button>
        }
      </p>
    </Jumbotron>
  )

}