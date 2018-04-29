// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemName         from './ItemName.jsx';

// Ultrawide Services
import { ItemType, RoleType, LogLevel } from '../../../constants/constants.js';
import {log, replaceAll} from "../../../common/utils";

import { ClientDesignServices }     from '../../../apiClient/apiClientDesign.js';
import { ClientImpExServices }     from '../../../apiClient/apiClientImpEx.js';

// Bootstrap
import {Button, ButtonGroup, Modal} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component - Represents one design in a possible list of designs - top level item
//
// ---------------------------------------------------------------------------------------------------------------------

export class Design extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };
    }


    onRemoveDesign(userContext, userRole, designId){
        ClientDesignServices.removeDesign(userContext, userRole, designId);
    }

    onBackupDesign(userRole, designId){
        ClientImpExServices.backupDesign(designId, userRole);
    }

    onArchiveDesign(userContext, designId){
        ClientImpExServices.archiveDesign(designId, userContext.userId)
    }

    onShowModal(){
        this.setState({showModal: true});
    }

    onCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        const {design, statusClass, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design');

        const uiDesignId = replaceAll(design.designName, ' ', '_');


        // Items -------------------------------------------------------------------------------------------------------

        let buttons = '';

        const removeButton =
            <Button id="butRemove" bsSize="xs" onClick={ () => this.onRemoveDesign(userContext, userRole, design._id)}>Remove Design</Button>;

        const backupButton =
            <Button id="butBackup" bsSize="xs" onClick={ () => this.onBackupDesign(userRole, design._id)}>Backup Design</Button>;

        const archiveButton =
            <Button id="butBackup" bsSize="xs" onClick={ () => this.onShowModal()} >Archive Design</Button>;

        const modalOkButton =
            <Button onClick={ () => this.onArchiveDesign(userContext, design._id)}>OK</Button>;

        const modalCancelButton =
            <Button onClick={() => this.onCloseModal()}>Cancel</Button>;

        const name =
            <ItemName
                currentItemStatus={design.designStatus}
                currentItemType={ItemType.DESIGN}
                currentItemId={design._id}
                currentItemName={design.designName}
                statusClass={statusClass}
            />;

        const confirmArchiveModal =
            <Modal show={this.state.showModal} onHide={() => this.onCloseModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Archive Design</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="merge-alert">{'You are about to archive design "' + design.designName + '"'}</p>
                    <p className="merge-normal">This action saves all Design data to a backup file and then removes the Design from Ultrawide.  It is possible to restore the Design from the backup file.</p>
                    <p className="merge-alert">Are you sure you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    {modalOkButton}
                    {modalCancelButton}
                </Modal.Footer>
            </Modal>;

        // Layout ------------------------------------------------------------------------------------------------------

        if(userContext && userRole && userRole !== RoleType.NONE) {

            if(userRole === RoleType.GUEST_VIEWER){

                buttons = '';

            } else {

                if (userRole === RoleType.DESIGNER) {
                    // Designer has various options
                    if (design.isRemovable) {
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {removeButton}
                            </ButtonGroup>
                    } else {

                        buttons =
                            <ButtonGroup className="button-group-left">
                                {backupButton}
                            </ButtonGroup>

                    }
                } else {

                    if (userRole === RoleType.ADMIN) {
                        // Admin can remove, archive or backup a Design
                        if (design.isRemovable) {

                            buttons =
                                <ButtonGroup className="button-group-left">
                                    {removeButton}
                                </ButtonGroup>
                        } else {

                            buttons =
                                <ButtonGroup className="button-group-left">
                                    {backupButton}
                                    {archiveButton}
                                    {confirmArchiveModal}
                                </ButtonGroup>
                        }

                    } else {

                        // Other users can just work on a Design or back it up
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {backupButton}
                            </ButtonGroup>
                    }
                }
            }


            return (
                <div id={uiDesignId}>
                    {name}
                    <div className={statusClass}>
                        {buttons}
                    </div>
                </div>
            );

        } else {
            return(<div></div>);
        }
    }
}

Design.propTypes = {
    design: PropTypes.object.isRequired,
    statusClass: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(Design);



