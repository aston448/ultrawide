// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkPackage                  from '../../components/select/WorkPackage.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, WorkPackageType, RoleType, LogLevel} from '../../../constants/constants.js';
import { log } from '../../../common/utils.js';

import ClientContainerServices      from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageServices    from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Data Container - gets data for Work Packages related to a Design Version
//
// ---------------------------------------------------------------------------------------------------------------------


// Basic export for unit tests
export class WorkPackagesList extends Component {
    constructor(props) {
        super(props);

    }

    renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <WorkPackage
                        key={workPackage._id}
                        workPackage={workPackage}
                    />
                );
            });
        }
    }

    renderAllWorkPackageLists(){

        return [
            this.renderWorkPackagesList(this.props.newWorkPackages),
            this.renderWorkPackagesList(this.props.adoptedWorkPackages),
            this.renderWorkPackagesList(this.props.availableWorkPackages)
        ]
    }

    displayNote(noteText){
        return <div className="design-item-note">{noteText}</div>;
    }

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    render() {

        const {wpType, newWorkPackages, availableWorkPackages, adoptedWorkPackages, designVersionStatus, designUpdateStatus, userRole, userContext, openWpItems} = this.props;

        // Header ------------------------------------------------------------------------------------------------------

        let headerText = 'Work Packages';

        if(wpType === WorkPackageType.WP_UPDATE){
            headerText = 'Update Work Packages';
        }

        // Footer ------------------------------------------------------------------------------------------------------

        let footerActionFunction = null;
        let hasFooterAction = false;
        const footerAction = 'Add Work Package';

        // Add WP available to Managers
        if(userRole === RoleType.MANAGER) {


            if(userContext.designUpdateId !== 'NONE'){

                // But for Design Updates only if they are Draft
                if(designUpdateStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT){
                    hasFooterAction = true;

                    footerActionFunction = () => this.onAddWorkPackage(
                        userRole,
                        userContext,
                        wpType,
                        openWpItems
                    );
                }
            } else {

                // And for Design Versions only of they are Draft
                if(designVersionStatus === DesignVersionStatus.VERSION_DRAFT) {
                    hasFooterAction = true;

                    footerActionFunction = () => this.onAddWorkPackage(
                        userRole,
                        userContext,
                        wpType,
                        openWpItems
                    );
                }
            }
        }

        // Body Content ------------------------------------------------------------------------------------------------

        let bodyDataFunction = null;

        const wpsNotAppropriate = 'Work Packages may only be added to a Draft design version...';
        const noWorkPackages = 'No Work Packages';
        const selectDesignUpdate = 'Select a Design Update';

        // When a design version is selected...
        if(userContext.designVersionId){

            switch(designVersionStatus){

                case DesignVersionStatus.VERSION_NEW:

                    // No work packages available and none can be added...

                    if(userRole === RoleType.MANAGER){
                        bodyDataFunction = () => this.displayNote(wpsNotAppropriate);
                    } else {
                        bodyDataFunction = () => this.displayNote(noWorkPackages);
                    }
                    break;

                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){

                        bodyDataFunction = () => this.displayNote(noWorkPackages);

                    } else {

                        bodyDataFunction = () => this.renderAllWorkPackageLists();

                    }
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    // An update must be selected first
                    if(userContext.designUpdateId !== 'NONE') {

                        if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){

                            bodyDataFunction = () => this.displayNote(noWorkPackages);

                        } else {

                            bodyDataFunction = () => this.renderAllWorkPackageLists();
                        }
                    } else {

                        bodyDataFunction = () => this.displayNote(selectDesignUpdate);
                    }
                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        } else {
            bodyDataFunction = () => this.displayNote(noWorkPackages);
        }

        // Display as an item container --------------------------------------------------------------------------------
        return (
            <ItemContainer
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
                footerActionFunction={footerActionFunction}
            />
        );
    }
}

WorkPackagesList.propTypes = {
    wpType: PropTypes.string.isRequired,
    newWorkPackages: PropTypes.array.isRequired,
    availableWorkPackages: PropTypes.array.isRequired,
    adoptedWorkPackages: PropTypes.array.isRequired,
    designVersionStatus: PropTypes.string.isRequired,
    designUpdateStatus: PropTypes.string
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext,
        openWpItems: state.currentUserOpenWorkPackageItems
    }
}

// Default export with Redux
export default WorkPackagesContainer = createContainer(({params}) => {

    switch(params.wpType){
        case WorkPackageType.WP_BASE:
            return ClientContainerServices.getWorkPackagesForCurrentDesignVersion(
                params.designVersionId
            );
        case WorkPackageType.WP_UPDATE:
            return ClientContainerServices.getWorkPackagesForCurrentDesignUpdate(
                params.designVersionId,
                params.designUpdateId
            );
    }


}, connect(mapStateToProps)(WorkPackagesList));