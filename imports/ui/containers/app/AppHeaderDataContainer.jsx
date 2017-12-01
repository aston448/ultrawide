// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType} from '../../../constants/constants.js';
import ClientDataServices from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

// REDUX services

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

        const {view, currentDesign, currentDesignVersion, currentDesignUpdate, currentWorkPackage} = this.props;

        // What is shown here depends on the current view
        let headerData = '';

        // Ignore renderings of this before we know where we are
        if(view) {
            switch (view) {
                case ViewType.AUTHORISE:
                    // Not logged in so no info known
                    headerData = '';
                    break;
                case ViewType.CONFIGURE:
                    break;
                // case ViewType.DESIGNS:
                //     // Only here if no design is known or want to change to new design
                //     if(currentDesign) {
                //         headerData =
                //             <div>
                //                 <span className="header-title">DESIGN: </span>
                //                 <span className="header-data">{currentDesign.designName}</span>
                //             </div>;
                //     } else {
                //         headerData =
                //             <div>
                //                 <span className="header-title">DESIGN: </span>
                //                 <span className="header-data">No design selected</span>
                //             </div>;
                //     }
                //     break;
                case ViewType.SELECT:
                    if(!currentDesign){
                        headerData =
                            <div>
                                <span className="header-title">DESIGN: </span>
                                <span className="header-data">{'No Design Selected'}</span>
                            </div>;
                    } else {
                        // Must know the design if here.
                        headerData =
                            <div>
                                <span className="header-title">DESIGN: </span>
                                <span className="header-data">{currentDesign.designName}</span>
                            </div>;
                    }
                    break;
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.DESIGN_UPDATABLE:
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
                            <span className="header-data">{currentDesignUpdate.updateReference}</span>
                        </div>;
                    break;
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.DEVELOP_BASE_WP:
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
                case ViewType.DEVELOP_UPDATE_WP:
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
    view: PropTypes.string,
    currentDesign: PropTypes.object,
    currentDesignVersion: PropTypes.object,
    currentDesignUpdate: PropTypes.object,
    currentWorkPackage: PropTypes.object
};


export default AppHeaderDataContainer = createContainer(({params}) => {

    return ClientDataServices.getApplicationHeaderData(
        params.userContext,
        params.view
    );


}, AppHeaderData);