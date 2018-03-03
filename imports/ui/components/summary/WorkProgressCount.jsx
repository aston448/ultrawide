// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

// Bootstrap
import {InputGroup, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';


// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Progress Count
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkProgressCount extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {countValue, glyphicon, valueClass, iconClass, tooltip} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Work Progress Count');

        const tooltipDelay = 1000;

        const iconTooltip = (
            <Tooltip id="modal-tooltip">
                {tooltip}
            </Tooltip>
        );

        if(countValue) {

            return (
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltip}>
                    <InputGroup>
                        <InputGroup.Addon>
                            <div className={iconClass}><Glyphicon glyph={glyphicon}/></div>
                        </InputGroup.Addon>
                        <div className={valueClass}>{countValue}</div>
                    </InputGroup>
                </OverlayTrigger>
            );

        } else {

            return (
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltip}>
                    <InputGroup>
                        <InputGroup.Addon>
                            <div className={iconClass}><Glyphicon glyph={glyphicon}/></div>
                        </InputGroup.Addon>
                        <div className={valueClass}>0</div>
                    </InputGroup>
                </OverlayTrigger>
            );
        }
    }
}

WorkProgressCount.propTypes = {
    countValue:     PropTypes.number,
    glyphicon:      PropTypes.string.isRequired,
    valueClass:     PropTypes.string.isRequired,
    iconClass:      PropTypes.string.isRequired,
    tooltip:        PropTypes.string.isRequired
};

export default WorkProgressCount;