// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from '../select/DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import {DesignUpdateSummaryType, ComponentType, DesignUpdateSummaryItem} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js'

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Summary Action Component - Graphically represents one Design Update Action
//
// ---------------------------------------------------------------------------------------------------------------------

class UpdateSummaryAction extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {actionItem} = this.props;

        const itemHeader = TextLookups.componentTypeHeader(actionItem.itemType);

        let item = '';
        let testStatus = 'summary-icon invisible';

        if(actionItem.itemType === ComponentType.SCENARIO){
            testStatus = 'summary-icon ' + actionItem.scenarioTestStatus;
        }

        if(actionItem.summaryType === DesignUpdateSummaryType.SUMMARY_CHANGE){
            if(actionItem.itemType === ComponentType.SCENARIO) {
                item =
                    <div className="summary-action">
                        <InputGroup>
                            <InputGroup.Addon>
                                <div className="summary-icon invisible"><Glyphicon glyph="th-large"/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon>
                                <div className="summary-item-type item-old">FROM:</div>
                            </InputGroup.Addon>
                            <div className="summary-item">{actionItem.itemNameOld}</div>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Addon>
                                <div className={testStatus}><Glyphicon glyph="th-large"/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon>
                                <div className="summary-item-type item-new">TO:</div>
                            </InputGroup.Addon>
                            <div className="summary-item">{actionItem.itemName}</div>
                        </InputGroup>
                    </div>
            } else {
                item =
                    <div className="summary-action">
                        <InputGroup>
                            <span className="summary-item-type item-old">FROM:</span>
                            <span className="summary-item">{actionItem.itemNameOld}</span>
                        </InputGroup>
                        <InputGroup>
                            <span className="summary-item-type item-new">TO:</span>
                            <span className="summary-item">{actionItem.itemName}</span>
                        </InputGroup>
                    </div>
            }
        } else {
            if(actionItem.itemType === ComponentType.SCENARIO) {
                item =
                    <div className="summary-action">
                        <InputGroup>
                            <InputGroup.Addon>
                                <div className={testStatus}><Glyphicon glyph="th-large"/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon>
                                <div className="summary-item-type">{itemHeader}</div>
                            </InputGroup.Addon>
                            <div className="summary-item">{actionItem.itemName}</div>
                        </InputGroup>
                    </div>;
            } else {
                item =
                    <div className="summary-action">
                        <InputGroup>
                            <span className="summary-item-type">{itemHeader}</span>
                            <span className="summary-item">{actionItem.itemName}</span>
                        </InputGroup>
                    </div>;
            }

        }

        return item;

    }
}

UpdateSummaryAction.propTypes = {
    actionItem: PropTypes.object.isRequired
};

export default UpdateSummaryAction;