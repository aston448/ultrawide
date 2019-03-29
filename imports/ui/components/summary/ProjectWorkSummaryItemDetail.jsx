// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services

import {WorkItemType, WorkPackageStatus, WorkPackageTestStatus, LogLevel} from '../../../constants/constants.js';

import { UI }                               from "../../../constants/ui_context_ids";
import {getComponentClass, getContextID, replaceAll, log}         from '../../../common/utils.js';
import { TextLookups }                      from '../../../common/lookups.js'

// Bootstrap
import {InputGroup, Badge} from 'react-bootstrap';
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


    selectItem(summaryId){

        store.dispatch(setCurrentUserSummaryItem(summaryId));
    }

    render() {
        const {workItemType, summaryData, workItem, currentUserSummaryItem} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Project Work Summary Item Detail {}', summaryData.workItemName);

        let itemName = '';
        let badgeId = workItemType;
        let badgeClass = workItemType;
        let status = '';
        let statusClass ='';
        let statusTooltip = '';
        let nameClass = '';
        let summaryRowClass = '';

        // Selected if the same item id and (for dv) if assignment matches
        let selected = summaryData._id === currentUserSummaryItem;

        //const uiContextName = replaceAll(itemName, ' ', '_');
        const tooltipDelay = 1000;

        // Default item tooltip
        let badgeTooltip = (
            <Tooltip id="modal-tooltip">
                {TextLookups.workItemType(workItemType)}
            </Tooltip>
        );

        // Specific tooltips...
        const tooltipNoTests = (
            <Tooltip id="modal-tooltip">
                {'WP has no passing tests'}
            </Tooltip>
        );

        const tooltipSomeTests = (
            <Tooltip id="modal-tooltip">
                {'WP has some passing tests'}
            </Tooltip>
        );

        const tooltipFailingTests = (
            <Tooltip id="modal-tooltip">
                {'WP has failing tests'}
            </Tooltip>
        );

        const tooltipComplete = (
            <Tooltip id="modal-tooltip">
                {'WP has all expected tests passing'}
            </Tooltip>
        );

        const tooltipUnavailable = (
            <Tooltip id="modal-tooltip">
                {'Unavailable WP'}
            </Tooltip>
        );

        const tooltipAvailable = (
            <Tooltip id="modal-tooltip">
                {'Available WP'}
            </Tooltip>
        );

        const tooltipAdopted = (
            <Tooltip id="modal-tooltip">
                {'Adopted WP'}
            </Tooltip>
        );

        const tooltipClosed = (
            <Tooltip id="modal-tooltip">
                {'Closed WP'}
            </Tooltip>
        );

        switch(workItemType){
            case WorkItemType.DESIGN_VERSION:

                itemName = summaryData.workItemName;
                badgeId = 'DV';
                badgeClass = 'badge-design-version';
                nameClass = 'summary-item-name-dv';
                break;

            case WorkItemType.DV_ASSIGNED:
            case WorkItemType.DV_UNASSIGNED:

                itemName = summaryData.workItemName;
                badgeId = 'DV';
                badgeClass = 'badge-design-version';
                nameClass = 'summary-item-name-dv';
                break;

            case WorkItemType.INCREMENT:

                itemName = summaryData.workItemName;
                badgeClass = 'badge-increment';
                nameClass = 'summary-item-name-in';
                summaryRowClass = 'summary-row-increment';
                break;

            case WorkItemType.ITERATION:

                itemName = summaryData.workItemName;
                badgeClass = 'badge-iteration';
                nameClass = 'summary-item-name-it';
                summaryRowClass = 'summary-row-iteration';
                break;

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                itemName = summaryData.workItemName;
                badgeId = 'WP';
                switch(workItem.workPackageStatus){
                    case WorkPackageStatus.WP_NEW:
                        badgeClass = 'badge-work-package-new';
                        badgeTooltip = tooltipUnavailable;
                        break;
                    case WorkPackageStatus.WP_AVAILABLE:
                        badgeClass = 'badge-work-package-available';
                        badgeTooltip = tooltipAvailable;
                        break;
                    case WorkPackageStatus.WP_ADOPTED:
                        badgeClass = 'badge-work-package-adopted';
                        badgeTooltip = tooltipAdopted;
                        break;
                    case WorkPackageStatus.WP_CLOSED:
                        badgeClass = 'badge-work-package-closed';
                        badgeTooltip = tooltipClosed;
                        break;
                }

                switch(workItem.workPackageTestStatus){
                    case WorkPackageTestStatus.WP_TESTS_NONE:
                        status=<span><Glyphicon glyph="ban-circle"/></span>;
                        statusClass='badge-work-package-no-tests';
                        statusTooltip = tooltipNoTests;
                        break;
                    case WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE:
                        status=<span><Glyphicon glyph="minus-sign"/></span>;
                        statusClass='badge-work-package-some-tests';
                        statusTooltip = tooltipSomeTests;
                        break;
                    case WorkPackageTestStatus.WP_TESTS_FAILING:
                        status=<span><Glyphicon glyph="remove-sign"/></span>;
                        statusClass='badge-work-package-fail-tests';
                        statusTooltip = tooltipFailingTests;
                        break;
                    case WorkPackageTestStatus.WP_TESTS_COMPLETE:
                        status=<span><Glyphicon glyph="ok-sign"/></span>;
                        statusClass='badge-work-package-complete-tests';
                        statusTooltip = tooltipComplete;
                        break;
                }
                nameClass = 'summary-item-name-wp';
        }

        let resultClassScenarios = '';
        let resultClassExpected = 'feature-highlight-expectations';
        let resultClassPassing = '';
        let resultClassFailing = '';
        let resultClassMissing = '';
        let resultClassNoExpectation = '';

        if(selected){
            summaryRowClass = 'summary-row-selected';
        }

        if(summaryData.totalFailing > 0){
            resultClassFailing = 'feature-highlight-fail';
        } else {
            resultClassFailing = 'feature-no-highlight';
        }

        if(summaryData.totalPassing > 0){
            resultClassPassing = 'feature-highlight-pass';
        } else {
            resultClassPassing = 'feature-no-highlight';
        }

        if(summaryData.totalNoExpectations > 0){
            resultClassNoExpectation = 'feature-highlight-no-expectations';
        } else {
            resultClassNoExpectation = 'feature-no-highlight';
        }

        if(summaryData.totalMissing === 0){
            resultClassMissing = 'feature-no-highlight';
        }

        // Name Data ---------------------------------------------------------------------------------------------------

        let badge =
            <InputGroup.Addon>
                <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={badgeTooltip}>
                    <Badge className={badgeClass}>{badgeId}</Badge>
                </OverlayTrigger>
            </InputGroup.Addon>;

        let statusBadge = <div></div>;

        if(workItemType === WorkItemType.BASE_WORK_PACKAGE || workItemType === WorkItemType.UPDATE_WORK_PACKAGE){
            statusBadge =
                <InputGroup.Addon>
                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={statusTooltip}>
                        <Badge className={statusClass}>{status}</Badge>
                    </OverlayTrigger>
                </InputGroup.Addon>;
        }

        let itemText =
            <div className="work-item-name">{itemName}</div>;


        // Summary Data ------------------------------------------------------------------------------------------------

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
                <Row className="summary-detail-row">
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipScenarios}>
                            <div className={resultClassScenarios}>
                                <span><Glyphicon glyph="th"/></span>
                                <span className="summary-number">{summaryData.totalScenarios}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipExpected}>
                            <div className={resultClassExpected}>
                                <span><Glyphicon glyph="question-sign"/></span>
                                <span className="summary-number">{summaryData.totalExpectations}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipPassing}>
                            <div className={resultClassPassing}>
                                <span><Glyphicon glyph="ok-circle"/></span>
                                <span className="summary-number">{summaryData.totalPassing}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFailing}>
                            <div className={resultClassFailing}>
                                <span><Glyphicon glyph="remove-circle"/></span>
                                <span className="summary-number">{summaryData.totalFailing}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipMissing}>
                            <div className={resultClassMissing}>
                                <span><Glyphicon glyph="ban-circle"/></span>
                                <span className="summary-number">{summaryData.totalMissing}</span>
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipNoExpectation}>
                            <div className={resultClassNoExpectation}>
                                <span><Glyphicon glyph="exclamation-sign"/></span>
                                <span className="summary-number">{summaryData.totalNoExpectations}</span>
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
                <Row className={summaryRowClass}>
                    <Col md={5} className='close-col'>
                        <div className={nameClass}>
                            <InputGroup>
                                {badge}
                                {statusBadge}
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
            <div onClick={() => this.selectItem(summaryData._id)}>
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

