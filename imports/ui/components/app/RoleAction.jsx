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

        this.state = {
            highlighted: false,
        };
    }

    // Highlight the item and the parent component it will add stuff to when mouse over
    setActionHighlighted(){
        this.setState({highlighted: true});
    }

    // Switch off highlighting when mouse not over
    setActionNormal(){
        this.setState({highlighted: false});

    }

    onActionSelect(roleAction, roleType, userContext, userRole, view){

        // Set the role as desired...
        ClientUserContextServices.setUserRole(roleType);
        userRole = roleType;

        // Now go where the user wanted...
        switch(roleAction){
            case UltrawideAction.ACTION_LAST_DESIGNER:
            case UltrawideAction.ACTION_LAST_DEVELOPER:
            case UltrawideAction.ACTION_LAST_MANAGER:
                ClientUserContextServices.setOpenItems(userContext, userRole);
                ClientUserContextServices.setViewFromUserContext(userContext, userRole);
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

        let activeClass = '';
        switch(roleType){
            case RoleType.DESIGNER:
                activeClass = ' active-designer';
                break;
            case RoleType.DEVELOPER:
                activeClass = ' active-developer';
                break;
            case RoleType.MANAGER:
                activeClass = ' active-manager';
        }

        return(
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className={this.state.highlighted ? 'role-action' + activeClass : 'role-action'}
                             onClick={() => this.onActionSelect(roleAction, roleType, userContext, userRole, view)}
                             onMouseEnter={ () => this.setActionHighlighted()} onMouseLeave={ () => this.setActionNormal()}>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'role-action-icon' + activeClass}>
                                        <Glyphicon glyph='th-large'/>
                                    </div>
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