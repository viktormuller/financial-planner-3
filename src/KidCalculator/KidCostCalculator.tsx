import * as d3 from "d3-format";
import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import ReactJoyride from "react-joyride";
import { INTRO } from "../Intro";
import { Calculator } from "./Calculator";
import { Child } from "./Child";
import { ChildCostGraph } from "./ChildCostGraph";
import { Household } from "./Household";
import { CHILD_COST_ACCOUNT_TYPE } from "financial-planner-api";
import { HouseholdInput } from "./HouseholdInput";
 
const steps = [{
  content: (
    <React.Fragment>
      <h3>{INTRO[0].title}</h3>
      <div className="mt-2">{INTRO[0].body}</div>
    </React.Fragment>),
  placement: 'center' as 'center',
  target: 'body'
},
{
  content:
    <React.Fragment>
      <h3>{INTRO[1].title}</h3>
      <div>{INTRO[1].body}</div>
    </React.Fragment>,
  target: '#num-of-children',
  placement: 'bottom' as 'bottom'
},
{
  content:
    <React.Fragment>
      <h3>{INTRO[2].title}</h3>
      <div>{INTRO[2].body}</div>
    </React.Fragment>,
  target: '#child-strat',
  placement: 'top' as 'top'
},
{
  content:
    <React.Fragment>
      <h3>{INTRO[3].title}</h3>
      <div>{INTRO[3].body}</div>
    </React.Fragment>,
  target: '#child-output',
  placement: 'top' as 'top'
},
{
  content:
    <React.Fragment>
      <h3>{INTRO[4].title}</h3>
      <div>{INTRO[4].body}</div>
    </React.Fragment>,
  target: '#child-cost-graph',
  placement: 'top' as 'top'
},
{
  content: (
    <React.Fragment>
      <h3>{INTRO[5].title}</h3>
      <div className="mt-2">{INTRO[5].body}</div>
    </React.Fragment>),
  placement: 'center' as 'center',
  target: 'body',
  locale: { last: "Get started" }
}
];

export class KidCostCalculator extends Component<{}, { household: Household }> {
  recalcTimeout: number;
  calculator: Calculator = new Calculator();

  constructor(props) {
    super(props);
    var household = new Household();
    household.children.push(new Child(2020));
    this.state = {
      household: household
    };
    this.calculator.childCost(household);
  }

  render() {
    return (
      <React.Fragment>
        <ReactJoyride
          steps={steps}
          continuous={true}
          showSkipButton={true}
          spotlightPadding={0}
        />
        <Row>
          <Col xs={12} md={6}>
            <HouseholdInput
              household={this.state.household}
              onChange={this.onChange.bind(this)}
              onChildCareStrategyChange={this.onChildCareStrategyChange.bind(this)}
              onK12StrategyChange={this.onK12StrategyChange.bind(this)}
              onAfterSchoolCareChange={this.onAfterSchoolCareChange.bind(this)}
              onCollegeStrategyChange={this.onCollegeStrategyChange.bind(this)}
              onChildSupplyChange={this.onChildSupplyChange.bind(this)}
            />
          </Col>
          <Col xs={12} md={6} className="d-flex flex-column">
            {this.renderOutput()}
          </Col>
        </Row>
      </React.Fragment>);
  }
  renderOutput() {
    var textForFirstYear =
      "Your estimated montly child cost next year is ";
    var textForNoCostFirstYear = "No child cost in first year.";

    var childCost = this.state.household.cashFlowStatement.getAccountByType(CHILD_COST_ACCOUNT_TYPE);

    var firstYearCost = childCost?.balances[0];

    return (
      <div className="py-5 md-sticky bg-white" id="child-output">
        {firstYearCost && firstYearCost.amount > 0 ? (
          <div className="text-center flex-shrink-0">
            {textForFirstYear}
            <span className="text-primary mx-2" style={{ fontSize: "x-large", whiteSpace: "nowrap" }}>
              {firstYearCost.currency +
                " " +
                d3.format(",")(
                  Math.round(firstYearCost.amount / 12 / 100) * 100
                )}
            </span>
          </div>
        ) : (
            <div className="text-center flex-shrink-0">
              {textForNoCostFirstYear}
            </div>
          )}
        <ChildCostGraph
          totalCostByYear={childCost}
          costByType={this.state.household.cashFlowStatement.getChildAccounts(CHILD_COST_ACCOUNT_TYPE)}
          startYear={this.calculator.startYear}
        />
      </div>
    );
  }

  onChildCareStrategyChange(newStrat) {
    var newHH = this.state.household;
    newHH.childStrategy.childCareStrategy = newStrat;
    this.setState({ household: newHH });
    this.resetRecalcTimer();
  }

  onK12StrategyChange(newStrat) {
    var newHH = this.state.household;
    newHH.childStrategy.k12Strategy = newStrat;
    this.setState({ household: newHH });
    this.resetRecalcTimer();
  }

  onAfterSchoolCareChange(newStrat) {
    var newHH = this.state.household;
    newHH.childStrategy.afterSchoolCare = newStrat;
    this.setState({ household: newHH });
    this.resetRecalcTimer();
  }

  onCollegeStrategyChange(newStrat) {
    var newHH = this.state.household;
    newHH.childStrategy.collegeStrategy = newStrat;
    this.setState({ household: newHH });
    this.resetRecalcTimer();
  }

  onChildSupplyChange(value) {
    var newHH = this.state.household;
    newHH.childStrategy.annualSupply = value;
    this.setState({ household: newHH });
    this.resetRecalcTimer();
  }

  resetRecalcTimer() {
    if (this.recalcTimeout) window.clearTimeout(this.recalcTimeout);

    this.recalcTimeout = window.setTimeout(() => {
      this.calculator.childCost(this.state.household)
      this.setState({
        household: this.state.household
      });
    }, 300);
  }

  onChange() {
    if (this.recalcTimeout) window.clearTimeout(this.recalcTimeout);

    this.setState({ household: this.state.household });
    this.recalcTimeout = window.setTimeout(() => {
      this.calculator.childCost(this.state.household)
      this.setState({
        household: this.state.household
      });
    }, 300);
  }
}
