// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import { ItemType, RoleType, DesignStatus } from '../../../constants/constants.js';
import ClientDesignServices from '../../../apiClient/apiClientDesign.js';
import ClientBackupServices from '../../../apiClient/apiClientBackup.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component - Represents one design in a possible list of designs - top level item
//
// ---------------------------------------------------------------------------------------------------------------------

export class Design extends Component {
    constructor(props) {
        super(props);
    }

    onSelectDesign(userContext, newDesignId){
        ClientDesignServices.setDesign(userContext, newDesignId);
    };

    onWorkDesign(userContext, userRole, newDesignId){
        ClientDesignServices.workDesign(userContext, userRole, newDesignId);
    }

    onRemoveDesign(userContext, userRole, designId){
        ClientDesignServices.removeDesign(userContext, userRole, designId);
    }

    onBackupDesign(userRole, designId){
        ClientBackupServices.backupDesign(designId, userRole);
    }

    onForceRemoveDesign(userRole, designId){
        ClientBackupServices.forceRemoveDesign(designId);
    }

    render() {
        const {design, userContext, userRole} = this.props;

        // Active if this design is the current context design
        let active = design._id === userContext.designId;

        // Items -------------------------------------------------------------------------------------------------------

        let buttons = '';

        const workButton =
            <Button id="butWork" bsSize="xs" onClick={ () => this.onWorkDesign(userContext, userRole, design._id)}>Work on this Design</Button>;

        const removeButton =
            <Button id="butRemove" bsSize="xs" onClick={ () => this.onRemoveDesign(userContext, userRole, design._id)}>Remove Design</Button>;

        // TODO - Remove this
        const forceRemoveButton =
            <Button id="butBackup" bsSize="xs" onClick={ () => this.onForceRemoveDesign(userRole, design._id)}>Force Remove Design</Button>

        const backupButton =
            <Button id="butBackup" bsSize="xs" onClick={ () => this.onBackupDesign(userRole, design._id)}>Backup Design</Button>;


        let statusClass = 'design-item-status';


        switch(design.designStatus){
            case DesignStatus.DESIGN_LIVE:
                statusClass = 'design-item-status item-status-available';
                break;
            case DesignStatus.DESIGN_ARCHIVED:
                statusClass = 'design-item-status item-status-complete';
                break;
        }

        const summary =
            <div id="designSummary" className={statusClass}>
                {design.designName}
            </div>;

        const status =
            <div id="designStatus" className={statusClass}>{design.designStatus}</div>;

        const header =
            <DesignItemHeader
                currentItemType={ItemType.DESIGN}
                currentItemId={design._id}
                currentItemName={design.designName}
                currentItemStatus=''
                //onSelectItem={ () => this.onSelectDesign(userContext, design._id)}
            />;

        // Layout ------------------------------------------------------------------------------------------------------

        if(userContext && userRole) {


            let itemStyle = (active ? 'design-item di-active' : 'design-item');

            if(userRole === RoleType.DESIGNER) {
                // Designer has various options
                if (design.isRemovable) {
                    buttons =
                        <ButtonGroup className="button-group-left">
                            {workButton}
                            {removeButton}
                        </ButtonGroup>
                } else {
                    if(design.designName !== 'Ultrawide Project'){
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {workButton}
                                {forceRemoveButton}
                            </ButtonGroup>
                    } else {
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {workButton}
                                {backupButton}
                            </ButtonGroup>
                    }
                }
            } else {
                // Other users can just work on a Design
                buttons =
                    <ButtonGroup className="button-group-left">
                        {workButton}
                    </ButtonGroup>
            }

            if(active) {
                return (
                    <div className={itemStyle} onClick={() => this.onSelectDesign(userContext, design._id)}>
                        {status}
                        {header}
                        {buttons}
                    </div>
                );
            } else {
                return (
                    <div className={itemStyle} onClick={() => this.onSelectDesign(userContext, design._id)}>
                        {summary}
                    </div>
                );
            }
        } else {
            return(<div></div>);
        }
    }
}

Design.propTypes = {
    design: PropTypes.object.isRequired
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



