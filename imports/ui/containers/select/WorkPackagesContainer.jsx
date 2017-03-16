// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import WorkPackage from '../../components/select/WorkPackage.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, WorkPackageType, RoleType, LogLevel} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';
import { log } from '../../../common/utils.js';

// Bootstrap
import {Panel} from 'react-bootstrap';

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

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    render() {

        const {wpType, newWorkPackages, availableWorkPackages, adoptedWorkPackages, designVersionStatus, designUpdateStatus, userRole, userContext, openWpItems} = this.props;

        let panelContent = <div className="design-item-note">No Work Packages</div>;
        let developerButtons = <div></div>;

        let panelHeader = 'Work Packages';
        if(wpType === WorkPackageType.WP_UPDATE){
            panelHeader = 'Update Work Packages';
        }

        let addWorkPackage =
            <div id="addWorkPackage" className="design-item-add">
                <DesignComponentAdd
                    addText="Add Work Package"
                    onClick={ () => this.onAddWorkPackage(
                        userRole,
                        userContext,
                        wpType,
                        openWpItems
                    )}
                />
            </div>;

        // When a design version is selected...
        if(userContext.designVersionId){

            switch(designVersionStatus){
                case DesignVersionStatus.VERSION_NEW:
                    // No work packages available and none can be added...
                    if(userRole != RoleType.MANAGER){
                        panelContent =
                            <div className="design-item-note">No Work Packages</div>;
                    } else {
                        panelContent =
                            <div className="design-item-note">Work Packages may only be added to a Draft design version...</div>;
                    }
                    break;
                case DesignVersionStatus.VERSION_DRAFT:

                    if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){
                        if (userRole === RoleType.MANAGER) {
                            panelContent =
                                <div>
                                    <div className="design-item-note">No Work Packages</div>
                                    {addWorkPackage}
                                </div>;
                        } else {
                            panelContent =
                                <div className="design-item-note">No Work Packages</div>;
                        }
                    } else {
                        if (userRole === RoleType.MANAGER) {
                            // Work Packages may be added by Manager
                            panelContent =
                                <div>
                                    {this.renderWorkPackagesList(newWorkPackages)}
                                    {this.renderWorkPackagesList(adoptedWorkPackages)}
                                    {this.renderWorkPackagesList(availableWorkPackages)}
                                    {addWorkPackage}
                                </div>;
                        } else {
                            // Just show the list
                            panelContent =
                                <div>
                                    {this.renderWorkPackagesList(newWorkPackages)}
                                    {this.renderWorkPackagesList(adoptedWorkPackages)}
                                    {this.renderWorkPackagesList(availableWorkPackages)}
                                </div>;
                        }
                    }
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:

                    // An update must be selected first
                    if(userContext.designUpdateId != 'NONE') {

                        if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){
                            if (userRole === RoleType.MANAGER && designUpdateStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT) {
                                panelContent =
                                    <div>
                                        <div className="design-item-note">No Work Packages</div>
                                        {addWorkPackage}
                                    </div>;
                            } else {
                                panelContent =
                                    <div className="design-item-note">No Work Packages</div>;
                            }
                        } else {
                            if (userRole != RoleType.MANAGER) {
                                // Just show the list
                                panelContent =
                                    <div>
                                        {this.renderWorkPackagesList(newWorkPackages)}
                                        {this.renderWorkPackagesList(adoptedWorkPackages)}
                                        {this.renderWorkPackagesList(availableWorkPackages)}
                                    </div>;
                            } else {
                                // Work Packages may be added by Manager if update is published
                                if (designUpdateStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT) {
                                    panelContent =
                                        <div>
                                            {this.renderWorkPackagesList(newWorkPackages)}
                                            {this.renderWorkPackagesList(adoptedWorkPackages)}
                                            {this.renderWorkPackagesList(availableWorkPackages)}
                                            {addWorkPackage}
                                        </div>;
                                } else {
                                    panelContent =
                                        <div>
                                            {this.renderWorkPackagesList(newWorkPackages)}
                                            {this.renderWorkPackagesList(adoptedWorkPackages)}
                                            {this.renderWorkPackagesList(availableWorkPackages)}
                                        </div>;
                                }
                            }
                        }
                    } else {
                        panelContent =
                            <div className="design-item-note">Select a Design Update</div>;
                    }
                    break;

                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                    // Work Packages may be viewed only
                    if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){

                        panelContent =
                            <div className="design-item-note">No Work Packages</div>;

                    } else {

                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(newWorkPackages)}
                                {this.renderWorkPackagesList(adoptedWorkPackages)}
                                {this.renderWorkPackagesList(availableWorkPackages)}
                            </div>;
                    }
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                    // Work Packages may be viewed only
                    // An update must be selected first
                    if(userContext.designUpdateId != 'NONE') {
                        if(newWorkPackages.length === 0 && availableWorkPackages.length === 0 && adoptedWorkPackages.length === 0){

                            panelContent =
                                <div className="design-item-note">No Work Packages</div>;

                        } else {

                            panelContent =
                                <div>
                                    {this.renderWorkPackagesList(newWorkPackages)}
                                    {this.renderWorkPackagesList(adoptedWorkPackages)}
                                    {this.renderWorkPackagesList(availableWorkPackages)}
                                </div>;
                        }
                    } else {
                        panelContent =
                            <div className="design-item-note">Select a Design Update</div>;
                    }
                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        }

        return (
            <Panel header={panelHeader}>
                {panelContent}
            </Panel>
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