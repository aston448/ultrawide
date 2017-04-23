// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {DesignUpdateSummaryType, ComponentType, WorkSummaryType} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js'

// Bootstrap
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Progress Item
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkProgressItem extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {item} = this.props;

        let workProgressItem = <div></div>;

        console.log("Rendering progress item " + item.workSummaryType);

        switch(item.workSummaryType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
                // Base Design Version summary
                workProgressItem =
                    <div>
                        <span>{item.name}</span>
                        <span>{' Scenarios: ' + item.totalScenarios}</span>
                        <span>{' In Wps: ' + item.scenariosInWp}</span>
                        <span>{' P: ' + item.scenariosPassing}</span>
                        <span>{' F: ' + item.scenariosFailing}</span>
                        <span>{' X: ' + item.scenariosNoTests}</span>
                    </div>;
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:
                // Updatable Design Version summary
                workProgressItem =
                    <div>
                        <span>{item.name}</span>
                        <span>{'Scenarios: ' + item.totalScenarios}</span>
                    </div>;
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE:
                // Update - do summary and get WPs

                break;
            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:
                // WP summary
                workProgressItem =
                    <div>
                        <span>{item.name}</span>
                        <span>{'Scenarios: ' + item.totalScenarios}</span>
                    </div>;

        }

        return workProgressItem;

    }
}

WorkProgressItem.propTypes = {
    item: PropTypes.object.isRequired
};

export default WorkProgressItem;