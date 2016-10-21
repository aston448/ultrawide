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

        let item = <div></div>;

        switch(updateSummaryData.summaryType){
            case DesignUpdateSummaryType.SUMMARY_ADD:
                item =
                    <div>
                        {'MODIFY: ' + updateSummaryData.itemParentName + ' ADD: ' + updateSummaryData.itemName}
                    </div>;
                break;
            case DesignUpdateSummaryType.SUMMARY_ADD_TO:
                item =
                    <div>
                        {'MODIFY: ' + updateSummaryData.itemParentName + ' ADD: ' + updateSummaryData.itemName + ' to ' + updateSummaryData.itemSectionName}
                    </div>;
                break;
            case DesignUpdateSummaryType.SUMMARY_REMOVE:
                item =
                    <div>
                        {'MODIFY: ' + updateSummaryData.itemParentName + ' REMOVE: ' + updateSummaryData.itemName}
                    </div>;
                break;
            case DesignUpdateSummaryType.SUMMARY_REMOVE_FROM:
                item =
                    <div>
                        {'MODIFY: ' + updateSummaryData.itemParentName + ' REMOVE: ' + updateSummaryData.itemName + ' from ' + updateSummaryData.itemSectionName}
                    </div>;
                break;
            case DesignUpdateSummaryType.SUMMARY_CHANGE:
                switch(updateSummaryData.summaryComponentType){
                    case DesignUpdateSummaryItem.SUMMARY_FEATURE:
                        if(updateSummaryData.itemOldName != updateSummaryData.itemName){
                            item =
                                <div>
                                    {'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE: ' + updateSummaryData.itemOldName + ' to ' + updateSummaryData.itemName}
                                </div>;
                        } else {
                            item =
                                <div>
                                    {'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE Details of ' + updateSummaryData.itemName}
                                </div>;
                        }
                        break;
                    case DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_FEATURE:
                        if(updateSummaryData.itemOldName != updateSummaryData.itemName){
                            item =
                                <div>
                                    <span>{'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE: '}</span><span className="change-item-old">{updateSummaryData.itemOldName}</span> <span> to </span><span className="change-item-new">{updateSummaryData.itemName}</span>
                                </div>;
                        } else {
                            item =
                                <div>
                                    {'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE Details of ' + updateSummaryData.itemName}
                                </div>;
                        }
                        break;
                    case DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT:
                        if(updateSummaryData.itemOldName != updateSummaryData.itemName){
                            item =
                                <div>
                                    {'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE: ' + updateSummaryData.itemOldName + ' in ' + updateSummaryData.itemSectionName + ' to ' + updateSummaryData.itemName}
                                </div>;
                        } else {
                            item =
                                <div>
                                    {'MODIFY: '+ updateSummaryData.itemParentName + ' CHANGE Details of ' + updateSummaryData.itemName + ' in ' + updateSummaryData.itemSectionName}
                                </div>;
                        }
                        break;
                }
                break;

        }

        return(
            <InputGroup>
                {item}
                <InputGroup.Addon><Glyphicon glyph="edit"/></InputGroup.Addon>
            </InputGroup>
        )
    }
}

UpdateSummaryItem.propTypes = {
    updateSummaryData: PropTypes.object.isRequired
};

export default UpdateSummaryItem;