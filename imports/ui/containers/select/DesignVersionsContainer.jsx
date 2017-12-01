// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignVersion                from '../../components/select/DesignVersion.jsx';
import DesignUpdatesContainer       from './DesignUpdatesContainer.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus}        from '../../../constants/constants.js';
import ClientDataServices           from '../../../apiClient/apiClientDataServices.js';
import ClientDesignVersionServices  from '../../../apiClient/apiClientDesignVersion.js';

import DesignData                   from '../../../data/design/design_db.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Data Container - selects the Design Versions in the current Design
//
// ---------------------------------------------------------------------------------------------------------------------


export class DesignVersionsList extends Component {

    constructor(props) {
        super(props);

    }

    renderDesignVersionsList(designVersions){
        if (designVersions) {
            return designVersions.map((designVersion) => {
                return (
                    <DesignVersion
                        key={designVersion._id}
                        designVersion={designVersion}
                    />
                );
            });
        }
    }

    getDesignName(userContext){

        const design = DesignData.getDesignById(userContext.designId);

        if(design) {
            return design.designName;
        } else {
            return '(select a Design...)';
        }
    }

    getCurrentVersionStatus(designVersionId){
        return ClientDesignVersionServices.getDesignVersionStatus(designVersionId);
    }

    render() {

        // There is no Add Design Version.  One is created by default for a new Design and when Updates are merged into a new Design Version.

        const {designVersions, userContext} = this.props;

        // Design Versions Container -----------------------------------------------------------------------------------
        const headerText = 'Design Versions for ' + this.getDesignName(userContext);
        const bodyDataFunction = () => this.renderDesignVersionsList(designVersions);
        const hasFooterAction = false;
        const footerAction = '';
        const footerActionFunction = null;

        return(
            <ItemContainer
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
                footerActionFunction={footerActionFunction}
                footerText = ''
            />
        )
    }
}

DesignVersionsList.propTypes = {
    designVersions: PropTypes.array.isRequired
};

//Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props

export default DesignVersionsContainer = createContainer(
    ({params}) => {

        return ClientDataServices.getDesignVersionsForCurrentDesign(params.designId);

    },
    connect(mapStateToProps)(DesignVersionsList)
);