// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import RoleActionsContainer     from '../../containers/app/RoleActionsContainer.jsx';

// Ultrawide Services
import {RoleType, LocationType, ViewType, UltrawideAction} from '../../../constants/constants.js';

import TextLookups                  from '../../../common/lookups.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';
import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';

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
        ClientUserContextServices.setUserRole(userContext.userId, roleType);

        userRole = roleType;

        const testIntegrationDataContext = {
            designVersionDataLoaded:        this.props.dvDataLoaded,
            testIntegrationDataLoaded:      this.props.testDataLoaded,
            testSummaryDataLoaded:          this.props.summaryDataLoaded,
            mashDataStale:                  this.props.mashDataStale,
            testDataStale:                  this.props.testDataStale
        };

        //console.log("TEST SUMMARY DATA LOADED: " + this.props.summaryDataLoaded);

        // Now go where the user wanted...
        switch(roleAction) {
            case UltrawideAction.ACTION_HOME:
                if (userContext.designId !== 'NONE') {
                    ClientAppHeaderServices.setViewSelection();
                    ClientUserContextServices.setOpenDesignVersionItems(userContext);
                } else {
                    ClientAppHeaderServices.setViewDesigns();
                }
                break;
            case UltrawideAction.ACTION_LAST_DESIGNER:
            case UltrawideAction.ACTION_LAST_DEVELOPER:
            case UltrawideAction.ACTION_LAST_MANAGER:

                if (userContext.designId !== 'NONE') {
                    let newContext = userContext;

                    if (userContext.workPackageId === 'NONE') {

                        // Not going to a WP so open any Design Version or Design Update items that need it...
                        if (store.getState().designVersionDataLoaded) {

                            newContext = ClientUserContextServices.setOpenDesignVersionItems(userContext);

                            if (newContext.designUpdateId !== 'NONE') {

                                newContext = ClientUserContextServices.setOpenDesignUpdateItems(newContext);
                            }
                        }

                    } else {

                        // If the data is there, open the WP items that need it
                        if (store.getState().designVersionDataLoaded) {

                            // If update WP then open the scope items too...db
                            if (newContext.designUpdateId !== 'NONE') {

                                newContext = ClientUserContextServices.setOpenDesignUpdateItems(newContext);
                            }

                            newContext = ClientUserContextServices.setOpenWorkPackageItems(newContext);
                        }
                    }

                    // And now go to the correct view
                    ClientUserContextServices.setViewFromUserContext(newContext, userRole, testIntegrationDataContext, this.props.testDataFlag);

                } else {
                    ClientAppHeaderServices.setViewDesigns();
                }

                break;
            case UltrawideAction.ACTION_CONFIGURE:
                ClientAppHeaderServices.setViewConfigure();
                break;
            case UltrawideAction.ACTION_DESIGNS:
                ClientAppHeaderServices.setViewDesigns();
                break;
        }
    }



    render() {
        const {roleAction, roleType,  userContext, userRole, view} = this.props;

        let roleClass = '';
        let activeClass = '';
        let iconClass = '';
        switch(roleType){
            case RoleType.DESIGNER:
                roleClass = ' action-designer';
                activeClass = ' active-designer';
                iconClass = ' icon-designer';
                break;
            case RoleType.DEVELOPER:
                roleClass = ' action-developer';
                activeClass = ' active-developer';
                iconClass = ' icon-developer';
                break;
            case RoleType.MANAGER:
                roleClass = ' action-manager';
                activeClass = ' active-manager';
                iconClass = ' icon-manager';
        }

        return(
            <Grid>
                <Row>
                    <Col md={12}>
                        <div id={roleType + '_' + roleAction} className={this.state.highlighted ? 'role-action' + activeClass : 'role-action' + roleClass}
                             onClick={() => this.onActionSelect(roleAction, roleType, userContext, userRole, view)}
                             onMouseEnter={ () => this.setActionHighlighted()} onMouseLeave={ () => this.setActionNormal()}>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'role-action-icon' + iconClass}>
                                        <Glyphicon glyph='th-large'/>
                                    </div>
                                </InputGroup.Addon>
                                <div>
                                    {TextLookups.ultrawideAction(roleAction)}
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
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole,
        view:               state.currentAppView,
        dvDataLoaded:       state.designVersionDataLoaded,
        testDataLoaded:     state.testIntegrationDataLoaded,
        summaryDataLoaded:  state.testSummaryDataLoaded,
        mashDataStale:      state.mashDataStale,
        testDataStale:      state.testDataStale,
        testDataFlag:       state.testDataFlag

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
RoleAction = connect(mapStateToProps)(RoleAction);

export default RoleAction;