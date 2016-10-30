// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {ViewType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap


// REDUX services


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// App Header Data Container - holds data on the current design version for the application header
//
// ---------------------------------------------------------------------------------------------------------------------


class AppHeaderData extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {currentAppView, currentDesign, currentDesignVersion, currentDesignUpdate, currentWorkPackage} = this.props;

        // What is shown here depends on the current view
        console.log("RENDERING HEADER " + currentAppView + ' ' + currentDesign + ' ' + currentDesignVersion);
        let headerData = '';

        // Ignore renderings of this before we know where we are
        if(currentAppView) {
            switch (currentAppView) {
                case ViewType.AUTHORISE:
                    // Not logged in so no info known
                    headerData = 'Please log in...';
                    break;
                case ViewType.DESIGNS:
                    // Only here if no design is known or want to change to new design
                    if(currentDesign) {
                        headerData =
                            <div>
                                <span className="header-title">DESIGN: </span>
                                <span className="header-data">{currentDesign.designName}</span>
                            </div>;
                    } else {
                        headerData =
                            <div>
                                <span className="header-title">DESIGN: </span>
                                <span className="header-data">No design selected</span>
                            </div>;
                    }
                    break;
                case ViewType.SELECT:
                    // Must know the design if here.
                    headerData =
                        <div>
                            <span className="header-title">DESIGN: </span>
                            <span className="header-data">{currentDesign.designName}</span>
                        </div>;
                    break;
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                    // Show the design and current design version which must be known if here
                    headerData =
                        <div>
                            <span className="header-title">DESIGN: </span>
                            <span className="header-data">{currentDesign.designName}</span>
                            <span className="header-title">VERSION: </span>
                            <span className="header-data">{currentDesignVersion.designVersionName}</span>
                            <span className="header-data">{currentDesignVersion.designVersionNumber}</span>
                        </div>;
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    // Show the update being edited
                    headerData =
                        <div>
                            <span className="header-title">DESIGN: </span>
                            <span className="header-data">{currentDesign.designName}</span>
                            <span className="header-title">VERSION: </span>
                            <span className="header-data">{currentDesignVersion.designVersionName}</span>
                            <span className="header-data">{currentDesignVersion.designVersionNumber}</span>
                            <span className="header-title">UPDATE: </span>
                            <span className="header-data">{currentDesignUpdate.updateName}</span>
                            <span className="header-data">{currentDesignUpdate.updateVersion}</span>
                        </div>;
                    break;
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_WORK:
                    headerData =
                        <div>
                            <span className="header-title">DESIGN: </span>
                            <span className="header-data">{currentDesign.designName}</span>
                            <span className="header-title">VERSION: </span>
                            <span className="header-data">{currentDesignVersion.designVersionName}</span>
                            <span className="header-title">WORK PACKAGE: </span>
                            <span className="header-data">{currentWorkPackage.workPackageName}</span>
                        </div>;
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_WORK:
                    headerData =
                        <div>
                            <span className="header-title">DESIGN: </span>
                            <span className="header-data">{currentDesign.designName}</span>
                            <span className="header-title">VERSION: </span>
                            <span className="header-data">{currentDesignVersion.designVersionName}</span>
                            <span className="header-title">UPDATE: </span>
                            <span className="header-data">{currentDesignUpdate.updateName}</span>
                            <span className="header-title">WORK PACKAGE: </span>
                            <span className="header-data">{currentWorkPackage.workPackageName}</span>
                        </div>;
                    break;


                default:
                    headerData = <div></div>;
            }

            return (
                <div>
                    {headerData}
                </div>
            );

        } else {
            return(
                <div></div>
            )
        }

    }
}


AppHeaderData.propTypes = {
    currentAppView: PropTypes.string,
    currentDesign: PropTypes.object,
    currentDesignVersion: PropTypes.object,
    currentDesignUpdate: PropTypes.object,
    currentWorkPackage: PropTypes.object
};


export default AppHeaderDataContainer = createContainer(({params}) => {

    return ClientContainerServices.getApplicationHeaderData(
        params.currentUserItemContext,
        params.currentAppView
    );


}, AppHeaderData);