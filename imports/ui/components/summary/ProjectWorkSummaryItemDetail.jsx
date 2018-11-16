// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideAction                  from "../../components/common/UltrawideAction.jsx";

// Ultrawide Services
import {ClientWorkItemServices}         from "../../../apiClient/apiClientWorkItem";
import {ClientWorkPackageServices}      from "../../../apiClient/apiClientWorkPackage";
import {WorkItemDetailUIModules}        from '../../../ui_modules/work_item_detail.js'

import {ViewType, ComponentType, ViewMode, DisplayContext, WorkPackageScopeType, LogLevel,
    UpdateMergeStatus, UpdateScopeType, RoleType, WorkItemType, WorkPackageStatus} from '../../../constants/constants.js';

import { UI }                               from "../../../constants/ui_context_ids";
import {getComponentClass, getContextID, replaceAll, log}         from '../../../common/utils.js';
import { TextLookups }                      from '../../../common/lookups.js'

// Bootstrap
import {FormControl, InputGroup, Badge} from 'react-bootstrap';
import {Glyphicon}  from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

import store from '../../../redux/store'
import {
    setCurrentUserSummaryItem
} from '../../../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Summary Item Details
//
// ---------------------------------------------------------------------------------------------------------------------

export class ProjectSummaryWorkItemDetail extends Component{

    constructor(...args){
        super(...args);

        this.state = {
        };

    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if no change to what is seen
        return true
    }


    selectItem(workItemId){

        store.dispatch(setCurrentUserSummaryItem(workItemId));
    }

    render() {
        const {workItemType, summaryData, workItem, currentUserSummaryItem} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Project Work Summary Item Detail {}', summaryData.itemName);

        let itemName = summaryData.itemName;
        let badgeId = workItemType;
        let badgeClass = '';
        let nameClass = '';
        let summaryRowClass = '';
        let selected = (workItem._id === currentUserSummaryItem);

        //const uiContextName = replaceAll(itemName, ' ', '_');

        switch(workItemType){
            case WorkItemType.DESIGN_VERSION:
            case WorkItemType.UNASSIGNED_WP:

                badgeId = 'DV';
                badgeClass = 'badge-design-version';
                nameClass = 'summary-item-name-dv';
                break;

            case WorkItemType.INCREMENT:

                badgeClass = 'badge-increment';
                nameClass = 'summary-item-name-in';
                break;

            case WorkItemType.ITERATION:
                badgeClass = 'badge-iteration';
                nameClass = 'summary-item-name-it';
                break;

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                badgeId = 'WP';
                switch(workItem.workPackageStatus){
                    case WorkPackageStatus.WP_NEW:
                        badgeClass = 'badge-work-package-new';
                        break;
                    case WorkPackageStatus.WP_AVAILABLE:
                        badgeClass = 'badge-work-package-available';
                        break;
                    case WorkPackageStatus.WP_ADOPTED:
                        badgeClass = 'badge-work-package-adopted';
                        break;
                }
                nameClass = 'summary-item-name-wp';
        }

        let resultClassScenarios = '';
        let resultClassExpected = '';
        let resultClassPassing = '';
        let resultClassFailing = '';
        let resultClassMissing = '';
        let resultClassNoExpectation = '';

        if(selected){
            summaryRowClass = 'summary-row-selected';
        }

        // Name Data ---------------------------------------------------------------------------------------------------

        let badge =
            <InputGroup.Addon>
                <Badge className={badgeClass}>{badgeId}</Badge>
            </InputGroup.Addon>;

        let itemText =
            <div className="work-item-name">{itemName}</div>;


        // Summary Data ------------------------------------------------------------------------------------------------

        const tooltipDelay = 1000;

        const tooltipScenarios = (
            <Tooltip id="modal-tooltip">
                {'Total Scenarios'}
            </Tooltip>
        );

        const tooltipExpected = (
            <Tooltip id="modal-tooltip">
                {'Number of tests expected'}
            </Tooltip>
        );

        const tooltipPassing = (
            <Tooltip id="modal-tooltip">
                {'Number of tests passing'}
            </Tooltip>
        );

        const tooltipFailing = (
            <Tooltip id="modal-tooltip">
                {'Number of tests failing'}
            </Tooltip>
        );

        const tooltipMissing = (
            <Tooltip id="modal-tooltip">
                {'Number of tests missing'}
            </Tooltip>
        );

        const tooltipNoExpectation = (
            <Tooltip id="modal-tooltip">
                {'Number of Scenarios with no test expectations'}
            </Tooltip>
        );


        let summary =
            <Grid className="close-grid">
                <Row className={summaryRowClass}>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipScenarios}>
                            <div className={resultClassScenarios}>
                                <span><Glyphicon glyph="th"/></span>
                                <span className="summary-number">{summaryData.scenarioCount}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipExpected}>
                            <div className={resultClassExpected}>
                                <span><Glyphicon glyph="question-sign"/></span>
                                <span className="summary-number">{summaryData.expectedTests}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipPassing}>
                            <div className={resultClassPassing}>
                                <span><Glyphicon glyph="ok-circle"/></span>
                                <span className="summary-number">{summaryData.passingTests}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFailing}>
                            <div className={resultClassFailing}>
                                <span><Glyphicon glyph="remove-circle"/></span>
                                <span className="summary-number">{summaryData.failingTests}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipMissing}>
                            <div className={resultClassMissing}>
                                <span><Glyphicon glyph="ban-circle"/></span>
                                <span className="summary-number">{summaryData.missingTests}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipNoExpectation}>
                            <div className={resultClassNoExpectation}>
                                <span><Glyphicon glyph="exclamation-sign"/></span>
                                <span className="summary-number">{summaryData.noExpectations}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Grid>;

        let selection = <div></div>;

        if(selected){
            selection =
                <div className="summary-item-hand"><Glyphicon glyph="hand-right"/></div>
        }

        // Layout ------------------------------------------------------------------------------------------------------

        const layout =
            <Grid className='close-grid'>
                <Row>
                    <Col md={5} className='close-col'>
                        <div className={nameClass}>
                            <InputGroup>
                                {badge}
                                {itemText}
                            </InputGroup>
                        </div>
                    </Col>
                    <Col md={6} className='close-col'>
                        {summary}
                    </Col>
                    <Col md={1} className='close-col'>
                        {selection}
                    </Col>
                </Row>
            </Grid>;


        return(
            <div onClick={() => this.selectItem(workItem._id)}>
                {layout}
            </div>
        );

    }
}

// Additional properties are added by React DnD collectSource
ProjectSummaryWorkItemDetail.propTypes = {
    workItemType: PropTypes.string.isRequired,
    summaryData: PropTypes.object.isRequired,
    workItem: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserSummaryItem:     state.currentUserSummaryItem
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ProjectSummaryWorkItemDetail);

