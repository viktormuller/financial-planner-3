import React, { Component } from "react";
import { MonetaryAmount } from "./MonetaryAmount";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Label as RCLabel,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from "recharts";

import * as d3 from "d3-format";
import { Button, Tabs, Tab } from "react-bootstrap";
import { FinancialAccount } from "./FinancialStatement";

const colors =
  ["hsl(208, 7%, 46%)",
    "hsl(208, 7%, 50%)",
    "hsl(208, 7%, 60%)",
    "hsl(208, 7%, 70%)",
    "hsl(208, 7%, 80%)"
  ]

export class ChildCostGraphProps {
  startYear: number;
  totalCostByYear?: FinancialAccount;
  costByType: FinancialAccount[];
}

export class ChildCostGraph extends Component<
  ChildCostGraphProps,
  { show: boolean }
  > {

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  renderCostOverTime() {
    var balances = this.props.totalCostByYear?.balances;
    
    console.log("Annual data");
    console.log(balances);

    if (balances && balances.length > 0) {

      var monthlyData = balances.map((annualData, index) => {
        return {
          amount: Math.round(annualData.amount / 12 / 100) * 100,
          year: this.props.startYear + index
        };
      });

      var firstNotNull = balances.find((value) => value===null);      
      var currency;
      if (firstNotNull !== undefined) currency = firstNotNull.currency ;
      else currency = new MonetaryAmount().currency;

      console.log("Monthly data");
      console.log(monthlyData);

      return (<ResponsiveContainer width="100%" height={300} >
        <BarChart data={monthlyData}>
          <XAxis dataKey="year" />
          <YAxis domain={[0, dataMax => Math.max(10000, dataMax)]}
            width={85}
            label={<RCLabel value='Avg. monthly cost (USD)' angle={-90}
              position='left' style={{ textAnchor: "middle" }} offset={-10} />}
            tickFormatter={d3.format(",.0f")}
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
            unit={currency}
          />
        </BarChart>
      </ResponsiveContainer>);
    } else return "No cost calculated for any year. Try adding a child."
  }

  renderCostByType() {
    var totalCostByType = this.props.costByType.map((acc) => {
      return {
        balance: acc.balances.reduce((prev, cur) => prev.add(cur), new MonetaryAmount(0)).amount,
        name: acc.accountType.name
      }
    }).filter(data => data.balance > 0)
      .sort((a, b) => {
        if (a.balance > b.balance) return -1;
        else if (a.balance < b.balance) return 1;
        else return 0;
      });

    return <ResponsiveContainer width="100%" height={300} >
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie label={(data) => "$" + d3.format(",.3s")(data.value)}
          animationBegin={100}
          animationDuration={800}
          data={totalCostByType}
          dataKey="balance">
          {totalCostByType.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>;
  }

  componentDidUpdate() {
    var doSpan = document.querySelector('nav[role="tablist"] > span') === null;
    if (doSpan) {
      var nav = document.querySelector('[role="tablist"]');
      var span = document.createElement('span');
      span.classList.add("close");
      span.classList.add("position-absolute");
      span.style.right = "0px";
      span.style.cursor = "pointer";
      span.innerHTML = "&times;";
      span.onclick = () => this.setState({ show: false });
      nav?.appendChild(span);
    }
  }

  render() {
    var peak;
    var totalCostByYearBalances = this.props.totalCostByYear?.balances;
    if (totalCostByYearBalances === undefined) totalCostByYearBalances = [];
    if (totalCostByYearBalances.length !== 0) {
      peak = totalCostByYearBalances
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
      <Tabs defaultActiveKey="costOverTime" className="shy-link mt-4 flex-shrink-1">
        <Tab eventKey="costOverTime" title="Over time" className="pt-2">
          {this.renderCostOverTime()}
        </Tab>
        <Tab eventKey="costByType" title="By type" className="pt-2">
          {this.renderCostByType()}
        </Tab>
      </Tabs>
    ) : (
        <div className="text-center">
          {totalCostByYearBalances.length !== 0 && (
            <div className="text-center mb-3">
              {"Your estimated peak monthly cost of raising kids is "}
              <span
                className="text-secondary mx-2"
                style={{ fontSize: "x-large", whiteSpace: "nowrap" }}
              >
                {peak.cost.currency +
                  " " +
                  d3.format(",")(Math.round(peak.cost.amount / 12 / 100) * 100)}
              </span>
              {""}
              {"in year " + peak.year}
            </div>
          )}
          <Button id="child-cost-graph"
            size="sm"
            variant="outline-secondary"
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            Show details
        </Button>
        </div>
      );
  }
}
