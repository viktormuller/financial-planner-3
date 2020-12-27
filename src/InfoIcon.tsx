import React from "react";
import { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

export class InfoIcon extends Component<{tooltip:string},{}>{

    render(){
        return (
        <OverlayTrigger overlay={<Tooltip id={this.props.tooltip}>{this.props.tooltip}</Tooltip>}>
            <BsQuestionCircle style={{cursor:"pointer", marginBottom:"3px"}}/>
        </OverlayTrigger>)
    }
}