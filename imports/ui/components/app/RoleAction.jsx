// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import RoleActionsContainer     from '../../containers/app/RoleActionsContainer.jsx';

// Ultrawide Services
import {RoleType, LocationType, ViewType, UltrawideAction} from '../../../constants/constants.js';
import ClientUserContextServices from '../../../apiClient/apiClientUserContext.js';
import ClientAppHeaderServices   from '../../../apiClient/apiClientAppHeader.js';

// Bootstrap
import {InputGroup, Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Role Action Component - A button to switch to another role
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
class RoleAction extends Component {

    constructor(props) {
        super(props);
    }

    onActionSelect(roleAction, roleType, userContext, userRole, view){

        if(userRole === RoleType.NONE){
            // User not yet chosen a role so load data as well
            ClientUserContextServices.setUserRole(roleType);
            ClientUserContextServices.loadMainData(userContext, roleType, view);
        } else {
            ClientUserContextServices.setUserRole(roleType);
        }

        // Now go where the user wanted...
        switch(roleAction){
            case UltrawideAction.ACTION_LAST_DESIGNER:
            case UltrawideAction.ACTION_LAST_DEVELOPER:
            case UltrawideAction.ACTION_LAST_MANAGER:
                ClientUserContextServices.setViewFromUserContext(roleType, userContext);
                break;
            case UltrawideAction.ACTION_TEST_CONFIGURE:
                ClientAppHeaderServices.setViewConfigure();
                break;
            case UltrawideAction.ACTION_DESIGNS:
                ClientAppHeaderServices.setViewDesigns();
                break;
        }
    }



    render() {
        const {roleAction, roleType,  userContext, userRole, view} = this.props;


        return(
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className="role-action" onClick={() => this.onActionSelect(roleAction, roleType, userContext, userRole, view)}>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <Glyphicon glyph='th-large'/>
                                </InputGroup.Addon>
                                <div>
                                    {roleAction}
                                </div>
                            </InputGroup>
                        </div>
                    </Col>
                </Row>
            </Grid>

        )

    }
}

RoleAction.propTypes = {
    roleAction:     PropTypes.string.isRequired,
    roleType:       PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
        userRole:       state.currentUserRole,
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
RoleAction = connect(mapStateToProps)(RoleAction);

export default RoleAction;