
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemList             from '../../components/select/ItemList.jsx';
import DesignBackup         from '../../components/admin/DesignBackup.jsx';
import DesignsContainer     from '../../containers/select/DesignsContainer.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import ClientDataServices              from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Backup Management Container.
//
// ---------------------------------------------------------------------------------------------------------------------

class BackupManagementScreen extends Component {
    constructor(props) {
        super(props);

    };

    renderBackupList(backups){

        return backups.map((backup) => {
            return (
                <DesignBackup
                    key={backup._id}
                    backup={backup}
                />
            );
        });
    };

    noBackups(){

        return (
            <div className="design-item-note">No backups have been found in the specified location</div>
        );
    }

    render() {

        const {backupData} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Backup Management');

        let bodyDataFunction = null;

        const hasFooterAction = false;
        const footerActionFunction = null;

        if(backupData && backupData.length > 0) {
            bodyDataFunction = () => this.renderBackupList(backupData)
        } else {
            bodyDataFunction = () => this.noBackups()
        }


        const backups =
            <ItemList
                headerText={'Ultrawide Design Backups'}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={''}
                footerActionFunction={footerActionFunction}
            />;

        const designs =
            <DesignsContainer/>;

        return (
            <Grid>
                <Row>
                    <Col md={6} className="col">
                        {backups}
                    </Col>
                    <Col md={6} className="col">
                        {designs}
                    </Col>
                </Row>
            </Grid>
        );

    };
}

BackupManagementScreen.propTypes = {
    backupData:     PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
BackupManagementScreen = connect(mapStateToProps)(BackupManagementScreen);


export default BackupManagementContainer = createContainer(({params}) => {

    const backupData = ClientDataServices.getDesignBackups();

    return {backupData: backupData};

}, BackupManagementScreen);