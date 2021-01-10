import React, { useCallback, useEffect, useState } from 'react';
import { Button, Jumbotron } from "react-bootstrap";
import { usePlaidLink } from 'react-plaid-link';
import { useLocation } from "react-router-dom";
import { Advisors } from "./Advisors";
import { fpClient } from './FPClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PlaidLinkButton(props: { linkToken: string }) {
  const onSuccess = useCallback((token, metadata) => {
    fpClient.setPublicToken(token); 
    window.location.href="/networth";   
  }, []);

  console.log("Token: " + props.linkToken);

  const config = {
    token: props.linkToken,
    onSuccess: onSuccess
  };

  const { open, ready } = usePlaidLink(config);
  return <Button onClick={() => open()} disabled={!ready} variant="primary">Let's get started</Button>
}

export function WelcomePage() {

  const [linkToken, setToken] = useState<string>();

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
        {linkToken!==undefined?<PlaidLinkButton linkToken={linkToken}/>: "Loading..."}
      </p>
    </Jumbotron>
  )

}