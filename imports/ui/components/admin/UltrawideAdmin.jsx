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
import {log} from "../../../common/utils";
import { RoleType, LogLevel }               from '../../../constants/constants.js';

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

        const {userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Ultrawide Admin');

        const userContainer = <UserManagementContainer/>;

        const backupContainer = <BackupManagementContainer/>;

        const apiDetails = <ApiManagement/>;

        if(userRole === RoleType.ADMIN){
            return (
                <Tabs className="top-tabs" defaultActiveKey={1} id="admin-view_tabs">
                    <Tab eventKey={1} title="USER MANAGEMENT">{userContainer}</Tab>
                    <Tab eventKey={2} title="BACKUP MANAGEMENT">{backupContainer}</Tab>
                    <Tab eventKey={3} title="API MANAGEMENT">{apiDetails}</Tab>
                </Tabs>
            );
        } else {
            return <div></div>;
        }

    }
}

UltrawideAdmin.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideAdmin);