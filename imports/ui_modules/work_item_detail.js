
// Ultrawide Services
import {ClientWorkPackageServices}  from "../apiClient/apiClientWorkPackage";

// Ultrawide Data
import {UserRoleData}               from '../data/users/user_role_db.js';

import {getContextID} from "../common/utils";
import {TextLookups} from '../common/lookups.js';
import {RoleType, WorkPackageStatus} from "../constants/constants";
import {UI} from "../constants/ui_context_ids";

// React
import React from 'react';

// Bootstrap
import {Button, ButtonGroup, Grid, Row, Col, Glyphicon, InputGroup} from 'react-bootstrap';



class WorkItemDetailUIModulesClass{

    // Layout Functions ------------------------------------------------------------------------------------------------

    getWorkPackageButtonsLayout(userRole, userContext, workPackage, uiContextName){

        // Sort out the adoption status
        let adoptionText = '';
        let adoptionClass = '';

        switch(workPackage.workPackageStatus){

            case WorkPackageStatus.WP_ADOPTED:
                const userRole = UserRoleData.getRoleByUserId(userContext.userId);
                adoptionText = TextLookups.workPackageStatus(workPackage.workPackageStatus) + userRole.displayName;
                adoptionClass = 'wp-adopted';
                break;

            case WorkPackageStatus.WP_AVAILABLE:
                adoptionText = TextLookups.workPackageStatus(workPackage.workPackageStatus);
                adoptionClass = 'wp-available';
                break;

            case WorkPackageStatus.WP_NEW:
                adoptionText = TextLookups.workPackageStatus(workPackage.workPackageStatus);
                adoptionClass = 'wp-new';
                break;
        }

        let adoptee = <div className={adoptionClass}>{adoptionText}</div>;

        // And the buttons available
        let buttons = <div></div>;

        const buttonEdit =
            <Button id={getContextID(UI.BUTTON_EDIT, uiContextName)} bsSize="xs"
                    onClick={() => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>;

        const buttonView =
            <Button id={getContextID(UI.BUTTON_VIEW, uiContextName)} bsSize="xs"
                    onClick={() => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>;

        const buttonRemove =
            <Button id={getContextID(UI.BUTTON_REMOVE, uiContextName)} bsSize="xs"
                    onClick={() => this.onDeleteWorkPackage(userRole, userContext, workPackage)}>Remove</Button>;

        const buttonPublish =
            <Button id={getContextID(UI.BUTTON_PUBLISH, uiContextName)} bsSize="xs"
                    onClick={() => this.onPublishWorkPackage(userRole, userContext, workPackage)}>Publish</Button>;

        const buttonWithdraw =
            <Button id={getContextID(UI.BUTTON_WITHDRAW, uiContextName)} bsSize="xs"
                    onClick={() => this.onWithdrawWorkPackage(userRole, userContext, workPackage)}>Withdraw</Button>;

        const buttonAdopt =
            <Button id={getContextID(UI.BUTTON_ADOPT, uiContextName)} bsSize="xs"
                    onClick={() => this.onAdoptWorkPackage(userRole, userContext, workPackage)}>Adopt</Button>;

        const buttonRelease =
            <Button id={getContextID(UI.BUTTON_RELEASE, uiContextName)} bsSize="xs"
                    onClick={() => this.onReleaseWorkPackage(userRole, userContext, workPackage)}>Release</Button>;

        const buttonDevelop =
            <Button id={getContextID(UI.BUTTON_DEVELOP, uiContextName)} bsSize="xs"
                    onClick={() => this.onDevelopWorkPackage(userRole, userContext, workPackage)}>Develop</Button>;

        switch (workPackage.workPackageStatus) {
            case WorkPackageStatus.WP_NEW:
                if (userRole === RoleType.MANAGER) {
                    // Managers can edit, delete or publish a new WP
                    buttons =
                        <ButtonGroup className="button-group-left">
                            {buttonEdit}
                            {buttonView}
                            {buttonRemove}
                            {buttonPublish}
                        </ButtonGroup>;
                } else {
                    // Developers and Designers can't do anything with WPs until published
                    buttons = <div></div>;
                }
                break;
            case WorkPackageStatus.WP_AVAILABLE:
                switch (userRole) {
                    case RoleType.DEVELOPER:

                        // Developers can view or adopt a WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                                {buttonAdopt}
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view, edit or withdraw the WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonEdit}
                                {buttonView}
                                {buttonWithdraw}
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                            </ButtonGroup>;
                        break;
                }
                break;
            case WorkPackageStatus.WP_ADOPTED:
                switch (userRole) {
                    case RoleType.DEVELOPER:

                        // Developers can view or develop / release  a WP if adopted by them
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                                {buttonDevelop}
                                {buttonRelease}
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view or edit or release the WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonEdit}
                                {buttonView}
                                {buttonRelease}
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                            </ButtonGroup>;
                        break;
                }

                break;
        }

        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        {buttons}
                    </Col>
                    <Col md={6}>
                        {adoptee}
                    </Col>
                </Row>
            </Grid>
        );

    }



    // Action Functions ------------------------------------------------------------------------------------------------
    onEditWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.editWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    };

    onViewWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.viewWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    }

    onDeleteWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.removeWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onPublishWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.publishWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onWithdrawWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.withdrawWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onAdoptWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.adoptWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onReleaseWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.releaseWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onDevelopWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.developWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

}

export const WorkItemDetailUIModules = new WorkItemDetailUIModulesClass();