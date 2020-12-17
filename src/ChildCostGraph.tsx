import React, { Component } from "react";
import { MonetaryAmount } from "./MonetaryAmount";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Label as RCLabel, 
  Bar
} from "recharts";

import * as d3 from "d3-format";
import { Button } from "react-bootstrap";

export class ChildCostGraphProps {
  data: MonetaryAmount[];
  startYear: number;
}

export class ChildCostGraph extends Component<
  ChildCostGraphProps,
  { show: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  render() {
    var monthlyData = this.props.data.map((annualData, index) => {
      return {
        amount: Math.round(annualData.amount / 12 / 100) * 100,
        year: this.props.startYear + index
      };
    });
    var peak;
    if (this.props.data.length !== 0) {
      peak = this.props.data
        .map((annualCost, index) => {
          return { year: this.props.startYear + index, cost: annualCost };
        })
        .reduce((accumulated, current) => {
          return accumulated.cost.amount < current.cost.amount
            ? current
            : accumulated;
        });
    }

    return this.state.show ? (
      <React.Fragment>
        <div className="mb-n1 flex-shrink-0">
          <input type="text" style={{ display: "none" }} autoFocus />
          <Button
            className="close"
            variant="secondary"
            aria-label="Close"
            onClick={() => this.setState({ show: false })}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </div>
        <div className="mt-5 flex-shrink-1 mh-100" style={{ minHeight: "0px" }}>
          <ResponsiveContainer width="100%" height={300} >
            <BarChart data={monthlyData}>
              <XAxis dataKey="year" />
              <YAxis domain={[0, dataMax=>Math.max(10000, dataMax)]} width={85}
              label={<RCLabel  value='Avg. monthly cost (USD)'  angle="-90" 
              position= 'left'  style={{textAnchor:"middle"}} offset={-10} />}
              />
              <Tooltip
                formatter={value => [
                  d3.format(",.0f")(Number(value)),
                  "Monthly cost: "
                ]}
              />              
              <Bar
                dataKey="amount"
                name="Monthly cost"
                fill="#6c757d"
                unit={this.props.data[0].currency}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    ) : (
      <div className="text-center">
        {" "}
        {this.props.data.length !== 0 && (
          <div className="text-center mb-3">
            {"Your estimated peak monthly cost of raising kids is "}
            <span
              className="text-secondary mx-2"
              style={{ fontSize: "x-large", whiteSpace:"nowrap" }}
            >
              {peak.cost.currency +
                " " +
                d3.format(",")(Math.round(peak.cost.amount / 12 / 100) * 100)}
            </span>
            {""}
            {"in year " + peak.year}
          </div>
        )}
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => {
            this.setState({ show: true });
          }}
        >
          Show cost over time
        </Button>
      </div>
    );
  }
}
