// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import ItemWrapper                  from '../../components/select/ItemWrapper.jsx';
import ItemContainer                from '../../components/select/ItemList.jsx';

// Ultrawide Services
import ClientDataServices           from '../../../apiClient/apiClientDataServices.js';
import ClientDesignVersionServices  from '../../../apiClient/apiClientDesignVersion.js';

import DesignData                   from '../../../data/design/design_db.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {ItemType} from "../../../constants/constants";

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
                    <ItemWrapper
                        key={designVersion._id}
                        itemType={ItemType.DESIGN_VERSION}
                        item={designVersion}
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
                footerActionUiContext={''}
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