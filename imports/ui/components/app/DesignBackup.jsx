
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components


// Ultrawide Services
import ClientImpExServices          from '../../../apiClient/apiClientImpEx.js';

// Bootstrap
import {Button, Grid, Row, Col, Modal} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Details Component - Graphically represents one Ultrawide User
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignBackup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };

    }

    onRestore(backup, userContext){
        ClientImpExServices.restoreDesign(backup.backupFileName, userContext.userId);
        this.setState({ showModal: false });
    }

    onShowModal(){
        this.setState({showModal: true});
    }

    onCloseModal() {
        this.setState({ showModal: false });
    }

    render() {

        const {backup, userContext} = this.props;

        const modalOkButton =
            <Button onClick={() => this.onRestore(backup, userContext)}>OK</Button>;

        const modalCancelButton =
            <Button onClick={() => this.onCloseModal()}>Cancel</Button>;

        const viewInstance = (
            <div onClick={() => this.setCurrentUser(user)}>
                <Grid>
                    <Row>
                        <Col sm={4}>
                            {backup.backupDesignName}
                        </Col>
                        <Col sm={4}>
                            {backup.backupName}
                        </Col>
                        <Col sm={4}>
                            {'Data Version: ' + backup.backupDataVersion}
                        </Col>
                    </Row>
                </Grid>
                <div className="user-buttons">
                    <Button id="butRestore" bsSize="xs" onClick={ () => this.onShowModal()}>Restore</Button>
                </div>
            </div>
        );

        const confirmRestoreModal =
            <Modal show={this.state.showModal} onHide={() => this.onCloseModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Restore Design</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="merge-alert">{'You are about to restore design "' + backup.backupDesignName + '" to backup "' + backup.backupName + '"'}</p>
                    <p className="merge-normal">If the design exists at present it will be replaced with the backup.  Otherwise it will be restored as that backup</p>
                    <p className="merge-alert">This action cannot be undone.  Are you sure you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    {modalOkButton}
                    {modalCancelButton}
                </Modal.Footer>
            </Modal>;

        return (
            <div className={'user-view'}>
                {viewInstance}
                {confirmRestoreModal}
            </div>
        );
    }
}

DesignBackup.propTypes = {
    backup: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignBackup);

