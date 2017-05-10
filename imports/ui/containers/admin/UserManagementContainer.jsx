
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemContainer        from '../../components/common/ItemContainer.jsx';
import UserDetails          from '../../components/admin/UserDetails.jsx';

// Ultrawide Services
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientUserManagementServices         from '../../../apiClient/apiClientUserManagement.js';

// Bootstrap
import {Panel}          from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Management Container.  Add / Remove / Edit Users
//
// ---------------------------------------------------------------------------------------------------------------------

class UserManagementScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewUser() {

        const actionUserId = Meteor.userId();

        ClientUserManagementServices.addUser(actionUserId);
    };

    renderUserList(users){
        return users.map((user) => {
            return (
                <UserDetails
                    key={user._id}
                    user={user}
                />
            );
        });
    };

    noUsers(){
        return (
            <div className="design-item-note">No users currently defined</div>
        );
    }

    render() {

        const {userData} = this.props;

        let bodyDataFunction = null;

        const hasFooterAction = true;
        const footerActionFunction = () => this.addNewUser();

        if(userData && userData.length > 0) {
            bodyDataFunction = () => this.renderUserList(userData)
        } else {
            bodyDataFunction = () => this.noUsers()
        }


        const users =
            <ItemContainer
                headerText={'Ultrawide Users'}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={'Add User'}
                footerActionFunction={footerActionFunction}
            />;

        return (
            <Grid>
                <Row>
                    <Col md={8} className="col">
                        {users}
                    </Col>
                </Row>
            </Grid>
        );
    };
}

UserManagementScreen.propTypes = {
    userData:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UserManagementScreen = connect(mapStateToProps)(UserManagementScreen);



export default UserManagementContainer = createContainer(({params}) => {

    const userData =  ClientContainerServices.getUltrawideUsers();

    return {userData: userData};

}, UserManagementScreen);