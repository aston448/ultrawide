// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemWrapper          from '../../components/select/ItemWrapper.jsx';
import ItemList             from '../../components/select/ItemList.jsx';

// Ultrawide Services
import {ItemType, RoleType}           from '../../../constants/constants.js';
import {AddActionIds}       from "../../../constants/ui_context_ids.js";

import ClientDataServices   from '../../../apiClient/apiClientDataServices.js';
import ClientDesignServices from  '../../../apiClient/apiClientDesign.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Designs Container - Contains data for Designs available in the application
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignsList extends Component {
    constructor(props) {
        super(props);

    }

    addNewDesign(role) {
        ClientDesignServices.addNewDesign(role);
    }

    renderDesignList(designs){
        return designs.map((design) => {
            return (
                <ItemWrapper
                    key={design._id}
                    itemType={ItemType.DESIGN}
                    item={design}
                />
            );
        });
    }

    noDesign(){
        return (
            <div className="design-item-note">No Designs</div>
        );
    }

    render() {

        const {designs, userRole} = this.props;


        let hasFooterAction = false;
        let footerActionFunction = null;
        let bodyDataFunction = null;

        // Designs only addable by a Designer
        if(userRole === RoleType.DESIGNER){
            hasFooterAction = true;
            footerActionFunction = () => this.addNewDesign(userRole)
        }

        if(designs && designs.length > 0) {
            bodyDataFunction = () => this.renderDesignList(designs)
        } else {
            bodyDataFunction = () => this.noDesign()
        }

        return(
            <ItemList
                headerText={'Designs'}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={'Add Design'}
                footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_DESIGN}
                footerActionFunction={footerActionFunction}
            />
        )

    }
}

DesignsList.propTypes = {
    designs: PropTypes.array.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userRole: state.currentUserRole,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DesignsContainer = createContainer(({params}) => {

    // Gets the currently saved user context and a list of known Designs
    return ClientDataServices.getUltrawideDesigns();

}, connect(mapStateToProps)(DesignsList));