import React, { useContext } from 'react';
import { Button, Jumbotron } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { Advisors } from "./Advisors";
import { useGetLinkToken, usePlaidProvider } from './PlaidContext';
import { PlaidLinkButton } from './PlaidLinkButton';
import { USER_CONTEXT } from './UserContext';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function WelcomePage() {


  let history = useHistory();
  let { user } = useContext(USER_CONTEXT);

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
          user ? linkToken !== undefined ? <PlaidLinkButton linkToken={linkToken} callback={callback} /> : "Loading..." :
            <Button variant="primary" onClick={() => { history.push("/signup") }}>Create an account</Button>
        }
      </p>
    </Jumbotron>
  )

}