import React, { Component } from "react";
import { Navbar, Row, Container, Col } from "react-bootstrap";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { Household } from "./Household";
import { Child } from "./Child";
import { HouseholdInput } from "./HouseholdInput";
import { Calculator } from "./Calculator";
import { MonetaryAmount } from "./MonetaryAmount";
import * as d3 from "d3-format";
import { ChildCostGraph } from "./ChildCostGraph";

interface AppProps {}
interface AppState {
  household: Household;
  financials: { childCost: MonetaryAmount[] };
}

class App extends Component<AppProps, AppState> {
  recalcTimeout: number;
  calculator: Calculator = new Calculator();

  constructor(props) {
    super(props);
    var household = new Household();
    household.children.push(new Child(2020));
    this.state = {
      household: household,
      financials: { childCost: this.calculator.childCost(household) }
    };
  }

  renderOutput() {
    var firstYearCost = this.state.financials.childCost[0];

    var textForFirstYear =
      "Monthly child cost in " + this.calculator.startYear + " is";
    var textForNoCostFirstYear = "No child cost in first year.";

    return (
      <React.Fragment>
        {firstYearCost && firstYearCost.amount > 0 ? (
          <div className="text-center flex-shrink-0">
            {textForFirstYear}
            <span className="text-primary mx-2" style={{ fontSize: "x-large" }}>
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
          data={this.state.financials.childCost}
          startYear={this.calculator.startYear}
        />
      </React.Fragment>
    );
  }

  onChange() {
    if (this.recalcTimeout) window.clearTimeout(this.recalcTimeout);

    this.setState({ household: this.state.household });
    this.recalcTimeout = window.setTimeout(() => {
      this.setState({
        financials: {
          childCost: this.calculator.childCost(this.state.household)
        }
      });
    }, 300);
  }

  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>How much does it cost to raise a child?</Navbar.Brand>
        </Navbar>
        <Container
          className="my-2"
          style={{
            height: "calc(100% - 72px)",
            maxHeight: "calc(100% - 72px)"
          }}
        >
          <Row className="h-100">
            <Col xs={6} className="h-100">
              <HouseholdInput
                household={this.state.household}
                onChange={this.onChange.bind(this)}
              />
            </Col>
            <Col xs={6} className="pt-5 d-flex flex-column h-100">
              {this.renderOutput()}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

render(<App />, document.getElementById("root"));
