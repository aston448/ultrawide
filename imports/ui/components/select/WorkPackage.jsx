// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import UltrawideItemEditableField   from "../common/UltrawideItemEditableField";


// Ultrawide Services
import { ClientWorkPackageServices }    from '../../../apiClient/apiClientWorkPackage.js';

import { getContextID, log } from "../../../common/utils";
import { UI } from '../../../constants/ui_context_ids';
import {ItemType, WorkPackageStatus, RoleType, FieldType, LogLevel} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Component - Graphically represents one Work Package that belongs to one Design Version or Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export default class WorkPackage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
        };
    }

    componentDidMount(){
        //this.setState({adopted: this.getUpdateAdoptionStatus(this.props.currentUserDevContext, this.props.designUpdate)});
    }

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



    render() {

        const {workPackage, statusClass, userRole, userContext, uiName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Work Package {}', workPackage.workPackageName);

        // Items -------------------------------------------------------------------------------------------------------

        // Active if this work package is the current context work package
        let active = workPackage._id === userContext.workPackageId;
        let activeUpdate = (workPackage.designUpdateId !== 'NONE' && workPackage.designUpdateId === userContext.designUpdateId);

        let itemStyle = (active ? 'design-item di-active' : 'design-item');

        if(activeUpdate){
            itemStyle += ' di-highlight';
        }

        let buttons = '';

        const name =
            <UltrawideItemEditableField
                fieldType={FieldType.NAME}
                currentItemType={ItemType.WORK_PACKAGE}
                currentItemId={workPackage._id}
                currentItemStatus={workPackage.workPackageStatus}
                currentFieldValue={workPackage.workPackageName}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        const body =
            <UltrawideItemEditableField
                fieldType={FieldType.LINK}
                currentItemType={ItemType.WORK_PACKAGE}
                currentItemId={workPackage._id}
                currentItemStatus={workPackage.workPackageStatus}
                currentFieldValue={workPackage.workPackageName}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        const buttonEdit =
            <Button id={getContextID(UI.BUTTON_EDIT, uiName)} bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>;

        const buttonView =
            <Button id={getContextID(UI.BUTTON_VIEW, uiName)} bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>;

        const buttonRemove =
            <Button id={getContextID(UI.BUTTON_REMOVE, uiName)} bsSize="xs" onClick={ () => this.onDeleteWorkPackage(userRole, userContext, workPackage)}>Remove</Button>;

        const buttonPublish =
            <Button id={getContextID(UI.BUTTON_PUBLISH, uiName)} bsSize="xs" onClick={ () => this.onPublishWorkPackage(userRole, userContext, workPackage)}>Publish</Button>;

        const buttonWithdraw =
            <Button id={getContextID(UI.BUTTON_WITHDRAW, uiName)} bsSize="xs" onClick={ () => this.onWithdrawWorkPackage(userRole, userContext, workPackage)}>Withdraw</Button>;

        const buttonAdopt =
            <Button id={getContextID(UI.BUTTON_ADOPT, uiName)} bsSize="xs" onClick={ () => this.onAdoptWorkPackage(userRole, userContext, workPackage)}>Adopt</Button>;

        const buttonRelease =
            <Button id={getContextID(UI.BUTTON_RELEASE, uiName)} bsSize="xs" onClick={ () => this.onReleaseWorkPackage(userRole, userContext, workPackage)}>Release</Button>;

        const buttonDevelop =
            <Button id={getContextID(UI.BUTTON_DEVELOP, uiName)} bsSize="xs" onClick={ () => this.onDevelopWorkPackage(userRole, userContext, workPackage)}>Develop</Button>;


        // Layout ------------------------------------------------------------------------------------------------------

        switch(workPackage.workPackageStatus){
            case WorkPackageStatus.WP_NEW:
                if(userRole === RoleType.MANAGER){
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
                switch(userRole) {
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
                switch(userRole) {
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
            <div id={getContextID(UI.ITEM_WORK_PACKAGE, uiName)}>
                {name}
                {body}
                <div className={statusClass}>
                    {buttons}
                </div>
            </div>
        );

    }
}

WorkPackage.propTypes = {
    workPackage: PropTypes.object.isRequired,
    statusClass: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    uiName: PropTypes.string.isRequired
};

