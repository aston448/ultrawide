// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UserManagementContainer              from '../../containers/admin/UserManagementContainer.jsx';
import BackupManagementContainer            from '../../containers/admin/BackupManagementContainer.jsx';
import ApiManagement                        from '../../components/admin/ApiManagement.jsx';

// Ultrawide Services

// Bootstrap
import {Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Main Admin screen for Ultrawide
//
// ---------------------------------------------------------------------------------------------------------------------

 export class UltrawideAdmin extends Component {
    constructor(props) {
        super(props);

    }

    render(){

        const userContainer = <UserManagementContainer/>;

        const backupContainer = <BackupManagementContainer/>;

        const apiDetails = <ApiManagement/>;

        return (
            <Tabs defaultActiveKey={1} id="admin-view_tabs">
                <Tab eventKey={1} title="USER MANAGEMENT">{userContainer}</Tab>
                <Tab eventKey={2} title="BACKUP MANAGEMENT">{backupContainer}</Tab>
                <Tab eventKey={3} title="API MANAGEMENT">{apiDetails}</Tab>
            </Tabs>
        );
    }
}

UltrawideAdmin.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideAdmin);