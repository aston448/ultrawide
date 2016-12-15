// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import WorkPackage from '../../components/select/WorkPackage.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';

// Ultrawide Services
import {DesignVersionStatus, WorkPackageType, RoleType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';

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


// Work selection screen
class WorkPackagesList extends Component {
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
        } else {
            return(<div className="design-item-note">No Work Packages</div>);
        }
    }

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    render() {

        const {wpType, workPackages, designVersionStatus, userRole, userContext, openWpItems} = this.props;

        let panelContent = <div className="design-item-note">No Work Packages</div>;
        let developerButtons = <div></div>;

        let panelHeader = 'Work Packages';
        if(wpType === WorkPackageType.WP_UPDATE){
            panelHeader = 'Update Work Packages';
        }

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

                    if (userRole != RoleType.MANAGER) {
                        // Just show the list
                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(workPackages)}
                            </div>;
                    } else {
                        // Work Packages may be added by Manager
                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(workPackages)}
                                <div className="design-item-add">
                                    <DesignComponentAdd
                                        addText="Add Work Package"
                                        onClick={ () => this.onAddWorkPackage(
                                            userRole,
                                            userContext,
                                            wpType,
                                            openWpItems
                                        )}
                                    />
                                </div>
                            </div>;
                    }
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:

                    // An update must be selected first
                    if(userContext.designUpdateId != 'NONE') {
                        if (userRole != RoleType.MANAGER) {
                            // Just show the list
                            panelContent =
                                <div>
                                    {this.renderWorkPackagesList(workPackages)}
                                </div>;
                        } else {
                            // Work Packages may be added by Manager
                            panelContent =
                                <div>
                                    {this.renderWorkPackagesList(workPackages)}
                                    <div className="design-item-add">
                                        <DesignComponentAdd
                                            addText="Add Work Package"
                                            onClick={ () => this.onAddWorkPackage(
                                                userRole,
                                                userContext,
                                                wpType,
                                                openWpItems
                                            )}
                                        />
                                    </div>
                                </div>;
                        }
                    } else {

                        panelContent =
                            <div className="design-item-note">Select a Design Update</div>;
                    }
                    break;

                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                    // Work Packages may be viewed only
                    panelContent =
                        <div>
                            {this.renderWorkPackagesList(workPackages)}
                        </div>;
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                    // Work Packages may be viewed only
                    // An update must be selected first
                    if(userContext.designUpdateId != 'NONE') {
                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(workPackages)}
                            </div>;
                    } else {
                        panelContent =
                            <div className="design-item-note">Select a Design Update</div>;
                    }
                    break;

                default:
                    console.log("Unknown Design Version Status: " + designVersionStatus);
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
    workPackages: PropTypes.array.isRequired,
    designVersionStatus: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext,
        openWpItems: state.currentUserOpenWorkPackageItems
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackagesList = connect(mapStateToProps)(WorkPackagesList);


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


}, WorkPackagesList);