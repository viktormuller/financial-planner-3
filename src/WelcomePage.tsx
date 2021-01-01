import { Component } from "react";
import { Button, Jumbotron } from "react-bootstrap";
import { Advisors } from "./Advisors";
import {useLocation} from "react-router-dom"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function WelcomePage(){

  let advisorId = useQuery().get("advisorId");
  var advisor;
    if (advisorId)
    advisor = Advisors.getAdvisor(advisorId);

  return (
    <Jumbotron>
      <h1>Welcome to Enough Calculator!</h1>
      <p>
        Your financial advisor{advisor ? ", " + advisor.name + " from " + advisor.company : " "} asked us to help collect some data.
          They will use it to prepare for your next meeting.
          We do not use your data for any other purpose.
        </p>
      <p>
        <Button variant="primary">Let's get started</Button>
      </p>
    </Jumbotron>
  )

}