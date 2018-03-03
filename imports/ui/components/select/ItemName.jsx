// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, ItemType, DesignVersionStatus, DesignUpdateStatus, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import ClientDesignServices             from '../../../apiClient/apiClientDesign.js';
import ClientDesignVersionServices      from '../../../apiClient/apiClientDesignVersion.js';
import ClientDesignUpdateServices       from '../../../apiClient/apiClientDesignUpdate.js';
import ClientWorkPackageServices        from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {InputGroup}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';
import {FormControl, ControlLabel}  from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Item Name Component - Editable name for design items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemName extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            nameEditable: false,
            nameValue: this.props.currentItemName,
            highlighted: false,
        };

    }

    // Allow editing of name
    editItemName(){
        event.preventDefault();
        this.setState({nameEditable: true});
    }


    saveItemName(userRole, currentItemType, currentItemId){
        event.preventDefault();
        // TODO: Possible validation of names for these items - no duplicates?

        let newName = this.state.nameValue;

        switch(currentItemType){
            case ItemType.DESIGN:
                ClientDesignServices.updateDesignName(userRole, currentItemId, newName);
                break;
            case ItemType.DESIGN_VERSION:
                ClientDesignVersionServices.updateDesignVersionName(userRole, currentItemId, newName);
                break;
            case ItemType.DESIGN_UPDATE:
                ClientDesignUpdateServices.updateDesignUpdateName(userRole, currentItemId, newName);
                break;
            case ItemType.WORK_PACKAGE:
                ClientWorkPackageServices.updateWorkPackageName(userRole, currentItemId, newName);
                break;
        }

        this.setState({nameEditable: false});
    }

    handleNameKeyEvents(userRole, event, currentItemType, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveItemName(userRole, currentItemType, currentItemId);
        }
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value});
    }

    undoItemNameChange(){
        event.preventDefault();
        this.setState({nameValue: this.props.currentItemName});
        this.setState({nameEditable: false});
    }


    render(){
        const {currentItemId, currentItemName, currentItemStatus, currentItemType, statusClass, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item Name {}', currentItemName);

        const nameEditorEditing =
            <div>
                <InputGroup>
                    <div className="editableItem">
                        <FormControl
                            type="text"
                            value={this.state.nameValue}
                            placeholder={currentItemName}
                            onChange={(event) => this.handleNameChange(event)}
                            onKeyPress={(event) => this.handleNameKeyEvents(userRole, event, currentItemType, currentItemId)}
                        />
                    </div>
                    <InputGroup.Addon onClick={ () => this.saveItemName(userRole, currentItemType, currentItemId)}>
                        <div id="editOk" className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoItemNameChange()}>
                        <div id="editCancel" className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        const nameEditorNotEditing =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id="nameLabel">{currentItemName}</ControlLabel>
                    </div>
                    <InputGroup.Addon onClick={ () => this.editItemName()}>
                        <div id="edit" className="blue"><Glyphicon glyph="edit"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        const nameReadOnly =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id="nameLabel">{currentItemName}</ControlLabel>
                    </div>
                </InputGroup>
            </div>;

        // Return the view wanted
        let titleClass = 'design-item-header ';

        switch(userRole){
            case RoleType.GUEST_VIEWER:
                return (<div className={titleClass}>{nameReadOnly}</div>);

            case RoleType.DEVELOPER:

                // Developers are aware of new stuff but can't access it yet.  They cannot edit names of things.
                if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                    titleClass = 'design-item-header greyed-out'
                }

                return (<div className={titleClass + ' ' + statusClass}>{nameReadOnly}</div>);


            case RoleType.MANAGER:
                // Managers can edit Work Packages
                if(currentItemType === ItemType.WORK_PACKAGE){
                    if (this.state.nameEditable) {
                        return (<div className={titleClass + ' ' + statusClass}>{nameEditorEditing}</div>);
                    } else {
                        return (<div className={titleClass + ' ' + statusClass}>{nameEditorNotEditing}</div>);
                    }

                } else {
                    // Rest is same as for Developers
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                        titleClass = 'design-item-header greyed-out'
                    }
                    return (<div className={titleClass + ' ' + statusClass}>{nameReadOnly}</div>);
                }

            case RoleType.DESIGNER:
                if(currentItemType === ItemType.WORK_PACKAGE){
                    // Designers can see WPs read only and new stuff is greyed out
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                        titleClass = 'design-item-header greyed-out'
                    }

                    return (<div className={titleClass + ' ' + statusClass}>{nameReadOnly}</div>);

                } else {
                    if (this.state.nameEditable) {
                        return (<div className={titleClass + ' ' + statusClass}>{nameEditorEditing}</div>);
                    } else {
                        return (<div className={titleClass + ' ' + statusClass}>{nameEditorNotEditing}</div>);
                    }

                }

            case RoleType.ADMIN:
                // Must be in the Designs List as those are the only items Admin can see
                return (<div className={titleClass + ' ' + statusClass}>{nameReadOnly}</div>);

        }

    }
}


ItemName.propTypes = {
    currentItemType: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    currentItemName: PropTypes.string.isRequired,
    currentItemStatus: PropTypes.string.isRequired,
    statusClass: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemName);



