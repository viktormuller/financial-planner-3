import React, { Component, FunctionComponent } from "react";
import * as d3 from "d3-format";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from "react-bootstrap";
import { Child } from "./Child";
import { BsTrash } from "react-icons/bs";
import {
  AFTER_SCHOOL_CARE_COST,
  AFTER_SCHOOL_CARE_TEXT,
  ChildStrategy,
  CHILD_CARE_COST,
  CHILD_CARE_TEXT,
  CollegeStrategy,
  COLLEGE_INYEAR_COST,
  COLLEGE_TEXT,
  K12_COST,
  K12_TEXT,
  MAX_CHILD_CARE_AGE, 
  MAX_CHILD_SUPPORT_AGE,
  MAX_COLLEGE_AGE,
  MAX_K12_AGE,
  MONTHLY_CHILD_SUPPLY_MAX,
  MONTHLY_CHILD_SUPPLY_MIN
} from "./ChildStrategyEnums";
import { MonetaryAmount } from "./MonetaryAmount";
import RangeSlider from "react-bootstrap-range-slider";
import NumberFormat from "react-number-format";
import { useMediaQuery } from 'react-responsive';

function annualCostToMonthlyText(amount: MonetaryAmount){
  return amount.currency + " " + d3.format(",.0f")(amount.amount/12) + " / month";
}

function annualCostToText(amount: MonetaryAmount){
  return amount.currency + " " + d3.format(",.0f")(amount.amount) + " / year";
}

export class ChildCostInput extends Component<
  { children: Child[];
    childStrategy: ChildStrategy;
    onChange;
    onChildCareStrategyChange;
    onK12StrategyChange;
    onAfterSchoolCareChange;
    onCollegeStrategyChange;
    onCollegeSavingChange;
    onChildSupplyChange },
  { children: Child[];  }
> {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children    };
  }

  addChild(event) {
    var maxYear = Math.max(
      ...this.state.children.map(child => child.yearOfBirth)
    );
    maxYear = maxYear ? maxYear : new Date().getFullYear();
    this.state.children.push(new Child(maxYear + 2));

    this.setState({ children: this.state.children });

    this.props.onChange();
  }

  removeChild(index: number) {
    console.log("Before");
    console.log(this.state.children);
    this.state.children.splice(index, 1);
    console.log("After");
    console.log(this.state.children);
    this.setState({ children: this.state.children });

    this.props.onChange();
  }

  renderYearsOfBirthInput(eventKey: string) {
    return (
      <Card className="flex-shrink-0">
        <Accordion.Toggle as={Card.Header} eventKey={eventKey} style={{cursor:"pointer"}}>
          How many children do you plan to have?
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={eventKey}>
          <Card.Body>
            <Form>
              {this.state.children.map((child, index) => (
                <ChildInput
                  key={child.id}
                  child={child}
                  index={index}
                  removeChild={this.removeChild.bind(this)}
                  onChange={this.props.onChange}
                />
              ))}
            </Form>
            <Button
              block
              variant="secondary"
              onClick={this.addChild.bind(this)}
            >
              Add a child
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  renderChildStartegyInput(eventKey: string) {
    var eldestChildYoB = Math.max(
      ...this.state.children.map(child => child.yearOfBirth)
    );
    var nextYear = new Date().getFullYear() + 1;

    return (
      <Card className="flex-shrink-1">
        <Accordion.Toggle
          as={Card.Header}
          eventKey={eventKey}
          className="flex-shrink-0"
          style={{cursor:"pointer"}}
        >
          How would you like to raise them?
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey={eventKey}
          className="flex-shrink-1"
          style={{ minHeight: "0px" }}
        >
          <Card.Body className="h-100">
            <Form>
              {eldestChildYoB + MAX_CHILD_CARE_AGE >= nextYear && (
                <ToggleButtonFormGroup
                  label="What do you have planned for childcare?"
                  buttonLabels={CHILD_CARE_TEXT}
                  tooltipLabels={CHILD_CARE_COST.map(annualCostToMonthlyText)}
                  name="child_care"
                  value={this.props.childStrategy.childCareStrategy}
                  onChange={this.props.onChildCareStrategyChange}
                />
              )}
              {eldestChildYoB + MAX_K12_AGE >= nextYear && (
                <React.Fragment>
                  <ToggleButtonFormGroup
                    label="What do you have planned for where your child goes to school?"
                    buttonLabels={K12_TEXT}
                    tooltipLabels={K12_COST.map(annualCostToMonthlyText)}
                    name="k12"
                    value={this.props.childStrategy.k12Strategy}
                    onChange={this.props.onK12StrategyChange}
                  />
                  <ToggleButtonFormGroup
                    name="after_school_care"
                    label="Will you be signing up for after-school care for your child?"
                    tooltipLabels={[annualCostToMonthlyText(new MonetaryAmount(0)),annualCostToMonthlyText(AFTER_SCHOOL_CARE_COST)]}
                    buttonLabels={AFTER_SCHOOL_CARE_TEXT}
                    value={this.props.childStrategy.afterSchoolCare}
                    onChange={this.props.onAfterSchoolCareChange}
                  />
                </React.Fragment>
              )}
              {eldestChildYoB + MAX_COLLEGE_AGE >= nextYear && (
                <CollegeStrategyInput
                  strategy={this.props.childStrategy.collegeStrategy}
      collegeSaving={this.props.childStrategy.collegeSaving}
                  
                  onCollegeStrategyChange={this.props.onCollegeStrategyChange}
		  onCollegeSavingChange={this.props.onCollegeSavingChange}
                />
              )}
              {eldestChildYoB + MAX_CHILD_SUPPORT_AGE >= nextYear && (
                <ChildSupplyInput
                  annualSupply={this.props.childStrategy.annualSupply}
                  onChange={this.props.onChildSupplyChange}
                />
              )}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  render() {
    return (
      <Accordion
        defaultActiveKey="yearsOfBirth"
        className="pb-2 d-flex flex-column"
      >
        {this.renderYearsOfBirthInput("yearsOfBirth")}
        {this.renderChildStartegyInput("childStrategy")}
      </Accordion>
    );
  }
}

export interface ChildProps {
  child: Child;
  index: number;
  removeChild;
  onChange;
}

export class ChildInput extends Component<ChildProps, { child: Child }> {
  constructor(props: ChildProps) {
    super(props);
    this.state = { child: props.child };
  }

  onYearOfBirthChange(event) {
    var child = this.state.child;
    child.yearOfBirth = Number(event.target.value);
    this.setState({ child:child });
    this.props.onChange();
  }

  render() {
    return (
      <FormGroup>
        <Row>
          <Col xs={8}>
            <Form.Label>
              Child {this.props.index + 1} Birth Year
              <Button
                variant="light"
                className="py-0 mt-n2"
                style={{ backgroundColor: "white", borderColor: "white" }}
                onClick={() => this.props.removeChild(this.props.index)}
              >
                <BsTrash />
              </Button>
            </Form.Label>
          </Col>
          <Col xs={4}>
            <Form.Control
              className="text-right"
              name="endYear"
              type="number"
              value={this.state.child.yearOfBirth}
              onChange={this.onYearOfBirthChange.bind(this)}
            />
          </Col>
        </Row>
      </FormGroup>
    );
  }
}

const OverlayToggleButton = ({label, buttonVariant, type, size, value, name, checked, overlay, onChange, ...rest}) => {
  return (
    <OverlayTrigger placement="bottom" overlay={overlay} {...rest}>
      <ToggleButton className="col-12" value={value} variant={buttonVariant} size={size} type={type} name={name} checked={checked} onChange={onChange}>
        {label}
      </ToggleButton>
    </OverlayTrigger>
  );
}

export function ToggleButtonFormGroup(props: {label:string, buttonLabels:string[], tooltipLabels?:string[], value:number, name: string, onChange}){
  var vertical:boolean = !useMediaQuery({ query: `(min-width: 992px)` });
  
  return (
  <FormGroup> 
  <Form.Label>{props.label}</Form.Label>
  <Form.Row className="mx-0">
  <ToggleButtonGroup 
            style={{ width: "100%"}}            
            type="radio"
            vertical={vertical}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
          >
            {props.buttonLabels.map((label,index) => {
              
                return (     
                  <OverlayToggleButton       
                    label={label}             
                    buttonVariant="outline-secondary"
                    size="sm"
                    value={index}
                    key={label} 
                    type="radio"  
                    name={props.name}
                    onChange={(e) => props.onChange(e.target.value)}
                    checked={props.value === index}                    
                    overlay={props.tooltipLabels && <Tooltip id={props.name + index}>{props.tooltipLabels[index]}</Tooltip>}
                  />
                )
              
            })}
          </ToggleButtonGroup>
          </Form.Row>
      </FormGroup>);
}


export class ChildSupplyInput extends Component<
  { annualSupply: MonetaryAmount; onChange }
> {

  onChange(event){
    var value = (new MonetaryAmount(Number(event.target.value) * 12));
    console.log("Annual supply updated to: " + value.amount);
    this.props.onChange(value);
  }

  render() {
    return (
      <FormGroup>
        <Form.Label>How much are you anticipating spending on monthly supplies (e.g. food, housing, transport, clothing, healthcare, extra-curriculars, summer camp, etc.)
        </Form.Label>
        <div className="mx-4">
          <RangeSlider
            variant="secondary"
            min={MONTHLY_CHILD_SUPPLY_MIN.amount}
            max={MONTHLY_CHILD_SUPPLY_MAX.amount}
            step={100}
            value={this.props.annualSupply.amount / 12}
            onChange={this.onChange.bind(this)}
            tooltip="on"
            tooltipLabel={value =>
              this.props.annualSupply.currency + " " + d3.format(",")(value)
            }
          />
        </div>
      </FormGroup>
    );
  }
}

export class CollegeStrategyInput extends Component<
  { strategy: CollegeStrategy;
    collegeSaving:MonetaryAmount; 
    onCollegeStrategyChange;
    onCollegeSavingChange }
> {


  render() {
    return (
      <React.Fragment>
        <ToggleButtonFormGroup 
        label="Select what type of college you would like to fund"
        tooltipLabels={COLLEGE_INYEAR_COST.map(annualCostToText)}
        name="college"
        buttonLabels={COLLEGE_TEXT}
        value={this.props.strategy}
        onChange={this.props.onCollegeStrategyChange}
        />        
        <FormGroup>
          <Form.Row>
            <Col xs={8}>
              <Form.Label>
                Savings already available for college expenses:
              </Form.Label>
            </Col>
            <Col xs={4}>
              <NumberFormat
                thousandSeparator=","
                prefix="$"
                className="text-right"
                value={this.props.collegeSaving.amount}
                customInput={Form.Control}
                onValueChange={this.props.onCollegeSavingChange}
              />
            </Col>
          </Form.Row>
        </FormGroup>
      </React.Fragment>
    );
  }
}
