// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import WorkProgressCount        from '../../components/summary/WorkProgressCount.jsx';
import WorkProgressWpContainer  from '../../containers/summary/WorkProgressWpContainer.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {WorkPackageStatus, RoleType, WorkSummaryType, LogLevel} from '../../../constants/constants.js';

import { ClientDesignVersionServices }      from '../../../apiClient/apiClientDesignVersion.js';
import { ClientWorkPackageServices }        from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {InputGroup, Grid, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


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

    onGotoItemAsRole(roleType, item){
        event.preventDefault();
        ClientDesignVersionServices.gotoWorkProgressSummaryItemAsRole(item, roleType);
    }

    getWorkPackageStatus(wpId){
        return ClientWorkPackageServices.getWorkPackageStatus(wpId);
    }

    render(){
        const {item, userRoles, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Work Progress Item');

        // Work out the details
        let itemClass = '';
        let rowClass = '';
        let itemRowClass = '';
        let roleGlyph = '';
        let wpStatus = 'NONE';
        let itemName = item.name;

        if(item.workPackageId !== 'NONE'){
            wpStatus = this.getWorkPackageStatus(item.workPackageId);
        }

        switch(item.workSummaryType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV_ALL:
                itemClass = 'progress-1';
                rowClass = 'row-progress-1';
                roleGlyph = 'book';
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE:
                itemClass = 'progress-2';
                rowClass = 'row-progress-2';
                itemRowClass = 'row-progress-du';
                if(item.designUpdateId === userContext.designUpdateId){
                    rowClass = 'row-progress-2 progress-highlight-du';
                }
                roleGlyph = 'file';
                break;
            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
                itemClass = 'progress-2';
                rowClass = 'row-progress-2';
                if(item.workPackageId === userContext.workPackageId){
                    rowClass = 'row-progress-2 progress-highlight-wp'
                }
                roleGlyph = 'tasks';
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:
                itemClass = 'progress-3';
                rowClass = 'row-progress-3';
                if(item.designUpdateId === userContext.designUpdateId && item.workPackageId === userContext.workPackageId){
                    rowClass = 'row-progress-3 progress-highlight-wp'
                }
                roleGlyph = 'tasks';
                break;
        }

        // Highlight adopted WPs
        if(wpStatus.status === WorkPackageStatus.WP_ADOPTED){
            itemClass = itemClass + ' adopted-wp';
        } else {
            if(item.workPackageId !== 'NONE'){
                itemClass = itemClass + ' non-adopted-wp';
            }
        }

        let designerIconClass = 'no-icon';
        let developerIconClass = 'no-icon';
        let managerIconClass = 'no-icon';

        let designerGotoText = 'Designer role not assigned to you';
        let developerGotoText = 'Developer role not assigned to you';
        let managerGotoText = 'Manager role not assigned to you';

        if(userRoles.isDesigner){
            designerIconClass = 'designer-icon';
            designerGotoText = 'Go to this item as Designer';
        }

        if(userRoles.isDeveloper){
            developerIconClass = 'developer-icon';
            developerGotoText = 'Go to this item as Developer';
        }

        if(userRoles.isManager){
            managerIconClass = 'manager-icon';
            managerGotoText = 'Go to this item as Manager';
        }

        const tooltipDelay = 1000;

        const iconTooltipDes = (
            <Tooltip id="modal-tooltip">
                {designerGotoText}
            </Tooltip>
        );

        const iconTooltipDev = (
            <Tooltip id="modal-tooltip">
                {developerGotoText}
            </Tooltip>
        );

        const iconTooltipMan = (
            <Tooltip id="modal-tooltip">
                {managerGotoText}
            </Tooltip>
        );

        let adopterTooltipText = 'Not adopted';

        if(wpStatus.status === WorkPackageStatus.WP_ADOPTED){
            adopterTooltipText = 'Adopted by ' + wpStatus.adopter
        }
        const adopterTooltip = (
            <Tooltip id="modal-tooltip">
                {adopterTooltipText}
            </Tooltip>
        );

        let workProgressItem = <div></div>;

        let workProgressName =

            <InputGroup>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipDes}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.DESIGNER, item)}><div className={designerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipDev}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.DEVELOPER, item)}><div className={developerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipMan}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.MANAGER, item)}><div className={managerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <div className={itemClass}>{itemName}</div>
            </InputGroup>;

        let workProgressNameWp =

            <InputGroup>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipDes}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.DESIGNER, item)}><div className={designerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipDev}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.DEVELOPER, item)}><div className={developerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <OverlayTrigger placement="left" delayShow={tooltipDelay} overlay={iconTooltipMan}>
                    <InputGroup.Addon onMouseUp={() => this.onGotoItemAsRole(RoleType.MANAGER, item)}><div className={managerIconClass}><Glyphicon glyph={roleGlyph}/></div></InputGroup.Addon>
                </OverlayTrigger>
                <OverlayTrigger placement="right" delayShow={tooltipDelay} overlay={adopterTooltip}>
                    <div className={itemClass}>{itemName}</div>
                </OverlayTrigger>
            </InputGroup>;



        let scenariosIconClass = 'mash-not-linked';
        if(item.scenariosFailing > 0){
            scenariosIconClass = 'mash-fail';
        } else {
            if(item.scenariosPassing === item.totalScenarios && item.totalScenarios > 0){
                scenariosIconClass = 'mash-pass';
            } else {
                if(item.scenariosPassing > 0){
                    scenariosIconClass = 'mash-some-pass';
                }
            }
        }
        let workProgressScenarios =
            <WorkProgressCount
                countValue={item.totalScenarios}
                glyphicon="th-large"
                valueClass="progress-value"
                iconClass={scenariosIconClass}
                tooltip="Number of Scenarios"
            />;

        let scenariosInWpClass = 'mash-not-linked';
        if(item.scenariosInWp === item.totalScenarios && item.totalScenarios > 0) {
            scenariosInWpClass = 'mash-linked';
        }
        let workProgressInWps =
            <WorkProgressCount
                countValue={item.scenariosInWp}
                glyphicon="tasks"
                valueClass="progress-value"
                iconClass={scenariosInWpClass}
                tooltip="Scenarios in Work Packages"
            />;

        let passValueClass = 'progress-value mash-not-linked';
        let passIconClass = 'mash-not-linked';
        if(item.scenariosPassing > 0){
            passValueClass = 'progress-value mash-pass';
            passIconClass = 'mash-pass';
        }
        let workProgressPasses =
            <WorkProgressCount
                countValue={item.scenariosPassing}
                glyphicon="ok-circle"
                valueClass={passValueClass}
                iconClass={passIconClass}
                tooltip="Passing Scenarios"
            />;

        let failValueClass = 'progress-value mash-not-linked';
        let failIconClass = 'mash-not-linked';
        if(item.scenariosFailing > 0){
            failValueClass = 'progress-value mash-fail';
            failIconClass = 'mash-fail';
        }
        let workProgressFails =
            <WorkProgressCount
                countValue={item.scenariosFailing}
                glyphicon="remove-circle"
                valueClass={failValueClass}
                iconClass={failIconClass}
                tooltip="Failing Scenarios"
            />;

        let noTestValueClass = 'progress-value mash-not-linked';
        let noTestIconClass = 'mash-not-linked';
        if(item.scenariosNoTests > 0){
            noTestValueClass = 'progress-value mash-linked';
            noTestIconClass = 'mash-linked';
        }
        let workProgressNoTests =
            <WorkProgressCount
                countValue={item.scenariosNoTests}
                glyphicon="ban-circle"
                valueClass={noTestValueClass}
                iconClass={noTestIconClass}
                tooltip="Scenarios Not Tested"
            />;

        switch(item.workSummaryType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
                // Show DV and WPs
                workProgressItem =
                    <Grid>
                        <Row>
                            <Col md={6} className="close-col">
                                {workProgressName}
                            </Col>
                            <Col  md={6} className="close-col">
                                <Grid>
                                    <Row>
                                        <Col md={3} className="close-col">
                                            {workProgressScenarios}
                                        </Col>
                                        <Col md={3} className="close-col">
                                            {workProgressInWps}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressPasses}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressFails}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressNoTests}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Grid>;
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE:
                // These have the number of items in WPs
                workProgressItem =
                    <Grid>
                        <Row className={itemRowClass}>
                            <Col md={6} className="close-col">
                                {workProgressName}
                            </Col>
                            <Col  md={6} className="close-col">
                                <Grid>
                                    <Row>
                                        <Col md={3} className="close-col">
                                            {workProgressScenarios}
                                        </Col>
                                        <Col md={3} className="close-col">
                                            {workProgressInWps}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressPasses}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressFails}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressNoTests}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Grid>;
                break;
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV_ALL:
                workProgressItem =
                    <Grid>
                        <Row>
                            <Col md={6} className="close-col">
                                {workProgressName}
                            </Col>
                            <Col  md={6} className="close-col">
                                <Grid>
                                    <Row>
                                        <Col md={3} className="close-col">
                                            {workProgressScenarios}
                                        </Col>
                                        <Col md={3} className="close-col">
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressPasses}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressFails}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressNoTests}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Grid>;
                break;
            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:
                // WP summary
                workProgressItem =
                    <Grid>
                        <Row>
                            <Col md={6} className="close-col">
                                {workProgressNameWp}
                            </Col>
                            <Col  md={6} className="close-col">
                                <Grid>
                                    <Row>
                                        <Col md={3} className="close-col">
                                            {workProgressScenarios}
                                        </Col>
                                        <Col md={3} className="close-col">
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressPasses}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressFails}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            {workProgressNoTests}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Grid>;
                break;
        }

        let workPackageList =
            <WorkProgressWpContainer params={{
                userContext: userContext,
                designUpdateId: item.designUpdateId
            }}/>;

        if(item.workSummaryType === WorkSummaryType.WORK_SUMMARY_UPDATE){
            return(
                <div className={rowClass}>
                    {workProgressItem}
                    {workPackageList}
                </div>
            )
        } else {
            return(
                    <div className={rowClass}>
                        {workProgressItem}
                    </div>
                )

        }


    }
}

WorkProgressItem.propTypes = {
    item:       PropTypes.object.isRequired,
    userRoles:  PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

export default connect(mapStateToProps)(WorkProgressItem);