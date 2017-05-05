
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd       from '../../components/common/DesignComponentAdd.jsx';
import UserDetails              from '../../components/app/UserDetails.jsx';
import DesignBackup             from '../../components/app/DesignBackup.jsx';

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

    renderBackupList(backups){
        if(backups.length > 0) {
            return backups.map((backup) => {
                return (
                    <DesignBackup
                        key={backup._id}
                        backup={backup}
                    />
                );
            });
        } else {
            return (
                <div className="design-item-note">No backups found</div>
            );
        }
    };

    render() {

        const {userData, backupData} = this.props;

        const addUser =
            <div className="design-item-add">
                <DesignComponentAdd
                    addText="Add User"
                    onClick={ () => this.addNewUser()}
                />
            </div>;


        if(userData && userData.length > 0) {
            return (
                <Grid>
                    <Row>
                        <Col md={6} className="col">
                            <Panel header="Ultrawide Users">
                                {this.renderUserList(userData)}
                                {addUser}
                            </Panel>
                        </Col>
                        <Col md={6} className="col">
                            <Panel header="Design Backups">
                                {this.renderBackupList(backupData)}
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            return(
                <Grid>
                    <Row>
                        <Col md={6} className="col">
                            <Panel header="Ultrawide Users">
                                {addUser}
                            </Panel>
                            <Col md={6} className="col">
                                <Panel header="Design Backups">
                                    {this.renderBackupList(backupData)}
                                </Panel>
                            </Col>
                        </Col>
                    </Row>
                </Grid>
            )
        }

    };
}

UserManagementScreen.propTypes = {
    userData:       PropTypes.array.isRequired,
    backupData:     PropTypes.array.isRequired
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
    const backupData = ClientContainerServices.getDesignBackups();

    return {userData: userData, backupData: backupData};

}, UserManagementScreen);