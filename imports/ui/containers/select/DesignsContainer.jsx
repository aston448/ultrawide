// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import Design               from '../../components/select/Design.jsx';
import ItemContainer        from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {RoleType} from '../../../constants/constants.js';

import ClientDataServices      from '../../../apiClient/apiClientDataServices.js';
import ClientDesignServices         from  '../../../apiClient/apiClientDesign.js';

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
                <Design
                    key={design._id}
                    design={design}
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

        const {designs, userRole, userContext} = this.props;


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

        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        <ItemContainer
                            headerText={'Designs'}
                            bodyDataFunction={bodyDataFunction}
                            hasFooterAction={hasFooterAction}
                            footerAction={'Add Design'}
                            footerActionFunction={footerActionFunction}
                        />
                    </Col>
                </Row>
            </Grid>
        );

    }
}

DesignsList.propTypes = {
    designs: PropTypes.array.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
let DesignsListRedux = connect(mapStateToProps)(DesignsList);


export default DesignsContainer = createContainer(({params}) => {

    // Gets the currently saved user context and a list of known Designs
    return ClientDataServices.getUltrawideDesigns();


}, DesignsListRedux);