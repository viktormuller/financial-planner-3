import React, { Component } from "react";

import { Household } from "./Household";

import {} from "react-bootstrap";
import { ChildCostInput } from "./ChildInput";
export class HouseholdInput extends Component<
  { household: Household; onChange },
  Household
> {
  constructor(props) {
    super(props);
    this.state = props.household;
  }

  render() {
    return (
      <ChildCostInput
        children={this.state.children}
        childStrategy={this.state.childStrategy}
        onChange={this.props.onChange}
      />
    );
  }
}
