// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import {DesignUpdateSummaryType, DesignUpdateSummaryItem} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Summary Item Component - Graphically represents one Design Update Action
//
// ---------------------------------------------------------------------------------------------------------------------

class UpdateSummaryItem extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {updateSummaryData} = this.props;

        let itemHeader = <div></div>;
        let item = <div></div>;
        let itemNew = <div></div>;
        let hasNew = false;
        let iconClassName = 'summary-icon';

        switch(updateSummaryData.summaryType){
            case DesignUpdateSummaryType.SUMMARY_ADD:
                itemHeader =
                    <div>
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-item">{updateSummaryData.itemParentName}</span>
                        <span className="summary-add">ADD FEATURE</span>
                    </div>;
                item =
                    <div className="summary-item">
                        {updateSummaryData.itemName}
                    </div>;

                    iconClassName += ' item-new';
                break;
            case DesignUpdateSummaryType.SUMMARY_ADD_TO:
                itemHeader =
                    <div>
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-item">{updateSummaryData.itemFeatureName + ' - ' + updateSummaryData.itemParentName}</span>
                        <span className="summary-add">ADD SCENARIO</span>
                    </div>;
                item =
                    <div className="summary-item">
                        {updateSummaryData.itemName}
                    </div>;

                iconClassName += ' item-new';
                break;
            case DesignUpdateSummaryType.SUMMARY_REMOVE:
                itemHeader =
                    <div>
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-item">{updateSummaryData.itemParentName}</span>
                        <span className="summary-remove">REMOVE FEATURE</span>

                    </div>;
                item =
                    <div className="summary-item">
                        {updateSummaryData.itemName}
                    </div>;

                iconClassName += ' item-old';
                break;
            case DesignUpdateSummaryType.SUMMARY_REMOVE_FROM:
                itemHeader =
                    <div>
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-item">{updateSummaryData.itemFeatureName + ' - ' + updateSummaryData.itemParentName}</span>
                        <span className="summary-remove">REMOVE SCENARIO</span>
                    </div>;
                item =
                    <div className="summary-item">
                        {updateSummaryData.itemName}
                    </div>;

                iconClassName += ' item-old';
                break;
            case DesignUpdateSummaryType.SUMMARY_CHANGE:
                if(updateSummaryData.itemNameOld != updateSummaryData.itemName){
                    itemHeader =
                        <div>
                            <span className="summary-modify">MODIFY:</span>
                            <span className="summary-item">{updateSummaryData.itemParentName}</span>
                            <span className="summary-modify">CHANGE FEATURE</span>
                        </div>;
                    item =
                        <div className="summary-item">
                            {'WAS: ' + updateSummaryData.itemNameOld}
                        </div>;
                    itemNew =
                        <div className="summary-item">
                            {'NOW: ' + updateSummaryData.itemName}
                        </div>;
                    hasNew = true;
                }
                break;
            case DesignUpdateSummaryType.SUMMARY_CHANGE_IN:
                if(updateSummaryData.itemNameOld != updateSummaryData.itemName){
                    itemHeader =
                        <div>
                            <span className="summary-modify">MODIFY:</span>
                            <span className="summary-item">{updateSummaryData.itemFeatureName + ' - ' + updateSummaryData.itemParentName}</span>
                            <span className="summary-modify">CHANGE SCENARIO</span>
                        </div>;
                    item =
                        <div className="summary-item">
                            {'WAS: ' + updateSummaryData.itemNameOld}
                        </div>;
                    itemNew =
                        <div className="summary-item">
                            {'NOW: ' + updateSummaryData.itemName}
                        </div>;
                    hasNew = true;
                }
                break;
        }

        if(hasNew){
            return(
                <div className="summary-header">
                    {itemHeader}
                    <InputGroup>
                        <InputGroup.Addon><div className="summary-icon item-old"><Glyphicon glyph="th"/></div></InputGroup.Addon>
                        {item}
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Addon><div className="summary-icon item-new"><Glyphicon glyph="th"/></div></InputGroup.Addon>
                        {itemNew}
                    </InputGroup>
                </div>
            )
        } else {
            return(
                <div className="summary-header">
                    {itemHeader}
                    <InputGroup>
                        <InputGroup.Addon><div className={iconClassName}><Glyphicon glyph="th"/></div></InputGroup.Addon>
                        {item}
                    </InputGroup>
                </div>
            )
        }

    }
}

UpdateSummaryItem.propTypes = {
    updateSummaryData: PropTypes.object.isRequired
};

export default UpdateSummaryItem;