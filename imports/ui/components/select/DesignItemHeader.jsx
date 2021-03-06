// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, ItemType, DesignVersionStatus, DesignUpdateStatus} from '../../../constants/constants.js';

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
// Design Item Header Component - Editable header for design items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignItemHeader extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            nameEditable: false,
            refEditable: false,
            nameValue: this.props.currentItemName,
            refValue: this.props.currentItemRef,
            highlighted: false,
        };

    }

    // Allow editing of name
    editItemName(){
        event.preventDefault();
        this.setState({nameEditable: true});
        //console.log("EDIT");
    }

    // Allow editing of version text (if there is one)
    editItemVersion(){
        event.preventDefault();
        this.setState({refEditable: true});
        //console.log("EDIT");
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

    saveItemRef(userRole, currentItemType, currentItemId){
        event.preventDefault();
        // TODO: Possible validation of versions for these items - no duplicates?

        let newRef = this.state.refValue;

        switch(currentItemType){
            case ItemType.DESIGN_VERSION:
                ClientDesignVersionServices.updateDesignVersionNumber(userRole, currentItemId, newRef);
                break;
            case ItemType.DESIGN_UPDATE:
                ClientDesignUpdateServices.updateDesignUpdateReference(userRole, currentItemId, newRef);
                break;
        }

        this.setState({refEditable: false});
    }

    handleNameKeyEvents(userRole, event, currentItemType, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveItemName(userRole, currentItemType, currentItemId);
        }
    }

    handleVersionKeyEvents(userRole, event, currentItemType, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveItemRef(userRole, currentItemType, currentItemId);
        }
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value});
    }

    handleRefChange(event) {
        this.setState({refValue: event.target.value});
    }

    undoItemNameChange(){
        event.preventDefault();
        //console.log("UNDO NAME");
        this.setState({nameValue: this.props.currentItemName});
        this.setState({nameEditable: false});
    }

    undoItemRefChange(){
        event.preventDefault();
        //console.log("UNDO VERSION");
        this.setState({refValue: this.props.currentItemRef});
        this.setState({refEditable: false});
    }

    render(){
        const {currentItemId, currentItemName, currentItemRef, currentItemStatus, currentItemType, userRole} = this.props;

        let refEditorEditing = <div></div>;
        let refEditorNotEditing = <div></div>;
        let refReadOnly = <div></div>;

        // Versions and updates have a version component
        if(currentItemType === ItemType.DESIGN_VERSION || currentItemType === ItemType.DESIGN_UPDATE){
            refEditorEditing =
                <div>
                    <InputGroup>
                        <div className="editableItem">
                            <FormControl
                                type="text"
                                value={this.state.refValue}
                                placeholder={currentItemRef}
                                onChange={(event) => this.handleRefChange(event)}
                                onKeyPress={(event) => this.handleVersionKeyEvents(userRole, event, currentItemType, currentItemId)}
                            />
                        </div>
                        <InputGroup.Addon onClick={ () => this.saveItemRef(userRole, currentItemType, currentItemId)}>
                            <div id="editRefOk" className="green"><Glyphicon glyph="ok"/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon onClick={ () => this.undoItemRefChange()}>
                            <div id="editRefCancel" className="red"><Glyphicon glyph="arrow-left"/></div>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>;

            refEditorNotEditing =
                <div>
                    <InputGroup>
                        <div className={"readOnlyItem"}>
                            <ControlLabel id="refLabel">{currentItemRef}</ControlLabel>
                        </div>
                        <InputGroup.Addon onClick={ () => this.editItemVersion()}>
                            <div id="editRef" className="blue"><Glyphicon glyph="edit"/></div>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>;

            refReadOnly =
                <div>
                    <InputGroup>
                        <div className={"readOnlyItem"}>
                            <ControlLabel id="refLabel">{currentItemRef}</ControlLabel>
                        </div>
                    </InputGroup>
                </div>;
        }

        let nameEditorEditing =
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

        let nameEditorNotEditing =
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


        let nameReadOnly =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id="nameLabel">{currentItemName}</ControlLabel>
                    </div>
                </InputGroup>
            </div>;


        // Return the view wanted
        let titleClass = 'design-item-header';

        switch(userRole){
            case RoleType.DEVELOPER:

                // Developers are aware of new stuff but can't access it yet.  They cannot edit names of things.
                if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                    titleClass = 'design-item-header greyed-out'
                }
                return (<div className={titleClass}>{nameReadOnly}{refReadOnly}</div>);
                break;
            case RoleType.MANAGER:
                // Managers can edit Work Packages
                if(currentItemType === ItemType.WORK_PACKAGE){
                    if (this.state.nameEditable) {
                        return (<div className="design-item-header">{nameEditorEditing}</div>);
                    } else {
                        return (<div className="design-item-header">{nameEditorNotEditing}</div>);
                    }
                } else {
                    // Rest is same as for Developers
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                        titleClass = 'design-item-header greyed-out'
                    }
                    return (<div className={titleClass}>{nameReadOnly}{refReadOnly}</div>);
                }
                break;
            case RoleType.DESIGNER:
                if(currentItemType === ItemType.WORK_PACKAGE){
                    // Designers can see WPs read only and new stuff is greyed out
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                        titleClass = 'design-item-header greyed-out'
                    }
                    return (<div className={titleClass}>{nameReadOnly}{refReadOnly}</div>);
                } else {
                    if (this.state.nameEditable && this.state.refEditable) {
                        return (<div className="design-item-header">{nameEditorEditing}{refEditorEditing}</div>);
                    }

                    if (this.state.nameEditable && !this.state.refEditable) {
                        return (<div className="design-item-header">{nameEditorEditing}{refEditorNotEditing}</div>);
                    }

                    if (!this.state.nameEditable && this.state.refEditable) {
                        return (<div className="design-item-header">{nameEditorNotEditing}{refEditorEditing}</div>);
                    }

                    if (!this.state.nameEditable && !this.state.refEditable) {
                        return (<div className="design-item-header">{nameEditorNotEditing}{refEditorNotEditing}</div>);
                    }
                }
                break;
            case RoleType.ADMIN:
                // Must be in the Designs List as those are the only items Admin can see
                return (<div className={titleClass}>{nameReadOnly}{refReadOnly}</div>);

        }

    }
}


DesignItemHeader.propTypes = {
    currentItemType: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    currentItemName: PropTypes.string.isRequired,
    currentItemRef: PropTypes.string,
    currentItemStatus: PropTypes.string.isRequired,
    //onSelectItem: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignItemHeader);



