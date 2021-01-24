import { Component } from "react";

import { Household } from "./Household";

import {} from "react-bootstrap";
import { ChildCostInput } from "./ChildInput";
export class HouseholdInput extends Component<
  { household: Household;
    onChange;
    onChildCareStrategyChange;
    onK12StrategyChange;
    onAfterSchoolCareChange;
    onCollegeStrategyChange;    
    onChildSupplyChange; },
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
        onChildCareStrategyChange={this.props.onChildCareStrategyChange}
        onK12StrategyChange={this.props.onK12StrategyChange}
        onAfterSchoolCareChange={this.props.onAfterSchoolCareChange}
        onCollegeStrategyChange={this.props.onCollegeStrategyChange}
	      onChildSupplyChange={this.props.onChildSupplyChange}
        onChange={this.props.onChange}
      />
    );
  }
}
