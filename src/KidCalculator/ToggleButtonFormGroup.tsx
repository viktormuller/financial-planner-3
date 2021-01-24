import React from "react";
import {
  Form,
  FormGroup,
  OverlayTrigger,

  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from "react-bootstrap";

import { useMediaQuery } from 'react-responsive';
import { InfoIcon } from "../InfoIcon";

const OverlayToggleButton = ({ label, buttonVariant, type, size, value, name, checked, overlay, onChange, ...rest }) => {
  return (
    <OverlayTrigger placement="bottom" overlay={overlay} {...rest}>
      <ToggleButton className="col-12" value={value} variant={buttonVariant} size={size} type={type} name={name} checked={checked} onChange={onChange}>
        {label}
      </ToggleButton>
    </OverlayTrigger>
  );
};
 
export function ToggleButtonFormGroup(props: { label: string; labelTooltip?:string; buttonLabels: string[]; tooltipLabels?: string[]; value: number; name: string; onChange; }) {
  var vertical: boolean = !useMediaQuery({ query: `(min-width: 992px)` });

  return (
    <FormGroup>
      <Form.Label>{props.label} {props.labelTooltip&&<InfoIcon tooltip={props.labelTooltip}/>}</Form.Label>
      <Form.Row className="mx-0">
        <ToggleButtonGroup
          style={{ width: "100%" }}
          type="radio"
          vertical={vertical}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        >
          {props.buttonLabels.map((label, index) => {

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
                overlay={props.tooltipLabels && <Tooltip id={props.name + index}>{props.tooltipLabels[index]}</Tooltip>} />
            );

          })}
        </ToggleButtonGroup>
      </Form.Row>
    </FormGroup>);
}
