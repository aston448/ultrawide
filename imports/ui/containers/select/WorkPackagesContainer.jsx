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
        return workPackages.map((workPackage) => {
            return (
                <WorkPackage
                    key={workPackage._id}
                    workPackage={workPackage}
                />
            );
        });
    }

    onAddWorkPackage(designVersionId, designUpdateId, designVersionStatus, wpType){

        if(designUpdateId) {
            // Adding Design Update WP
            ClientWorkPackageServices.addNewWorkPackage(designVersionId, designUpdateId, designVersionStatus, wpType);
        } else {
            // Adding base Design Version WP
            ClientWorkPackageServices.addNewWorkPackage(designVersionId, 'NONE', designVersionStatus, wpType);
        }
    }

    render() {

        const {wpType, workPackages, designVersionStatus, userRole, currentUserItemContext} = this.props;

        let panelContent = <div></div>;
        let developerButtons = <div></div>;

        let panelHeader = 'Work Packages';
        if(wpType === WorkPackageType.WP_UPDATE){
            panelHeader = 'Update Work Packages';
        }

        // When a design version is selected...
        if(currentUserItemContext.designVersionId){
            switch(designVersionStatus){
                case DesignVersionStatus.VERSION_NEW:
                    // No work packages available and none can be added...
                    if(userRole === RoleType.DEVELOPER){
                        panelContent =
                            <div className="design-item-note">No Work Packages Yet</div>;
                    } else {
                        panelContent =
                            <div className="design-item-note">Work Packages may only be added to a Draft design version...</div>;
                    }
                    break;
                case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
                    if(userRole === RoleType.DEVELOPER){
                        // Developers cannot add Work Packages but can develop them
                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(workPackages)}
                            </div>;
                    } else {
                        // Design updates may be added by Manager
                        panelContent =
                            <div>
                                {this.renderWorkPackagesList(workPackages)}
                                <div className="design-item-add">
                                    <DesignComponentAdd
                                        addText="Add Work Package"
                                        onClick={ () => this.onAddWorkPackage(
                                            currentUserItemContext.designVersionId,
                                            currentUserItemContext.designUpdateId,
                                            designVersionStatus,
                                            wpType
                                        )}
                                    />
                                </div>
                            </div>;
                    }
                    break;
                case DesignVersionStatus.VERSION_PUBLISHED_FINAL:
                    // Work Packages may be viewed only
                    panelContent =
                        <div>
                            {this.renderWorkPackagesList()}
                        </div>;
                    break;
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
        currentUserItemContext: state.currentUserItemContext
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