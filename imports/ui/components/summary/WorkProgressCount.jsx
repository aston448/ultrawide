// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {DesignUpdateSummaryType, ComponentType, WorkSummaryType} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js'

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


        const iconTooltip = (
            <Tooltip id="modal-tooltip">
                {tooltip}
            </Tooltip>
        );

        return(
            <OverlayTrigger placement="left" overlay={iconTooltip}>
                <InputGroup>
                    <InputGroup.Addon>
                        <div className={iconClass}><Glyphicon glyph={glyphicon}/></div>
                    </InputGroup.Addon>
                    <div className={valueClass}>{countValue}</div>
                </InputGroup>
            </OverlayTrigger>
        )
    }
}

WorkProgressCount.propTypes = {
    countValue:     PropTypes.number.isRequired,
    glyphicon:      PropTypes.string.isRequired,
    valueClass:     PropTypes.string.isRequired,
    iconClass:      PropTypes.string.isRequired,
    tooltip:        PropTypes.string.isRequired
};

export default WorkProgressCount;