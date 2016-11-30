// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {RoleType, ItemType, DesignVersionStatus, DesignUpdateStatus} from '../../../constants/constants.js';
import ClientDesignServices from '../../../apiClient/apiClientDesign.js';
import ClientDesignVersionServices from '../../../apiClient/apiClientDesignVersion.js';
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {FormControl, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Item Header Component - Editable header for design items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignItemHeader extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            nameEditable: false,
            versionEditable: false,
            nameValue: this.props.currentItemName,
            versionValue: this.props.currentItemVersion,
            highlighted: false,
        };

    }

    // TODO - if we want to have an item body
    toggleOpen(){
        this.props.toggleOpen();
        this.setState({open: !this.state.open});
        this.setCurrentComponent();
    }

    // Passes back the click to the parent component to get it selected as the current one
    setCurrentItem(){
        //console.log("SELECT " + this.props.currentItemType);

        if (typeof this.props.onSelectItem === 'function') {
            this.props.onSelectItem();
        }
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
        this.setState({versionEditable: true});
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

    saveItemVersion(userRole, currentItemType, currentItemId){
        event.preventDefault();
        // TODO: Possible validation of versions for these items - no duplicates?

        let newVersion = this.state.versionValue;

        switch(currentItemType){
            case ItemType.DESIGN_VERSION:
                ClientDesignVersionServices.updateDesignVersionNumber(userRole, currentItemId, newVersion);
                break;
            case ItemType.DESIGN_UPDATE:
                ClientDesignUpdateServices.saveDesignUpdateVersion(userRole, currentItemId, newVersion);
                break;
        }

        this.setState({versionEditable: false});
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
            this.saveItemVersion(userRole, currentItemType, currentItemId);
        }
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value});
    }

    handleVersionChange(event) {
        this.setState({versionValue: event.target.value});
    }

    undoItemNameChange(){
        event.preventDefault();
        //console.log("UNDO NAME");
        this.setState({nameValue: this.props.currentItemName});
        this.setState({nameEditable: false});
    }

    undoItemVersionChange(){
        event.preventDefault();
        //console.log("UNDO VERSION");
        this.setState({versionValue: this.props.currentItemVersion});
        this.setState({versionEditable: false});
    }

    render(){
        const {currentItemId, currentItemName, currentItemVersion, currentItemStatus, currentItemType, userRole} = this.props;

        // Show the status of items that have it when not editing
        let nameText = currentItemName;
        if(currentItemStatus != ''){
            nameText = nameText + ' (' + currentItemStatus + ')';
        }

        let versionEditorEditing = <div></div>;
        let versionEditorNotEditing = <div></div>;
        let versionReadOnly = <div></div>;

        // Versions and updates have a version component
        if(currentItemType == ItemType.DESIGN_VERSION || currentItemType === ItemType.DESIGN_UPDATE){
            versionEditorEditing =
                <div>
                    <InputGroup>
                        <div className="editableItem">
                            <FormControl
                                type="text"
                                value={this.state.versionValue}
                                placeholder={currentItemVersion}
                                onChange={(event) => this.handleVersionChange(event)}
                                onKeyPress={(event) => this.handleVersionKeyEvents(userRole, event, currentItemType, currentItemId)}
                            />
                        </div>
                        <InputGroup.Addon onClick={ () => this.saveItemVersion(userRole, currentItemType, currentItemId)}>
                            <div className="green"><Glyphicon glyph="ok"/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon onClick={ () => this.undoItemVersionChange()}>
                            <div className="red"><Glyphicon glyph="arrow-left"/></div>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>;

            versionEditorNotEditing =
                <div onClick={ () => this.setCurrentItem()}>
                    <InputGroup>
                        <div className={"readOnlyItem"}>
                            <ControlLabel>{currentItemVersion}</ControlLabel>
                        </div>
                        <InputGroup.Addon onClick={ () => this.editItemVersion()}>
                            <div className="blue"><Glyphicon glyph="edit"/></div>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>;

            versionReadOnly =
                <div onClick={ () => this.setCurrentItem()}>
                    <InputGroup>
                        <div className={"readOnlyItem"}>
                            <ControlLabel>{currentItemVersion}</ControlLabel>
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
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoItemNameChange()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let nameEditorNotEditing =
            <div onClick={ () => this.setCurrentItem()}>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel>{nameText}</ControlLabel>
                    </div>
                    <InputGroup.Addon onClick={ () => this.editItemName()}>
                        <div className="blue"><Glyphicon glyph="edit"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;


        let nameReadOnly =
            <div onClick={ () => this.setCurrentItem()}>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel>{nameText}</ControlLabel>
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
                return (<div className={titleClass}>{nameReadOnly}{versionReadOnly}</div>);

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
                    return (<div className={titleClass}>{nameReadOnly}{versionReadOnly}</div>);
                }

            case RoleType.DESIGNER:
                // Rest are Designer Views depending on the current state.  Designers do not see Work Packages
                if (this.state.nameEditable && this.state.versionEditable) {
                    return (<div className="design-item-header">{nameEditorEditing}{versionEditorEditing}</div>);
                }

                if (this.state.nameEditable && !this.state.versionEditable) {
                    return (<div className="design-item-header">{nameEditorEditing}{versionEditorNotEditing}</div>);
                }

                if (!this.state.nameEditable && this.state.versionEditable) {
                    return (<div className="design-item-header">{nameEditorNotEditing}{versionEditorEditing}</div>);
                }

                if (!this.state.nameEditable && !this.state.versionEditable) {
                    return (<div className="design-item-header">{nameEditorNotEditing}{versionEditorNotEditing}</div>);
                }
        }

    }
}


DesignItemHeader.propTypes = {
    currentItemId: PropTypes.string.isRequired,
    currentItemName: PropTypes.string.isRequired,
    currentItemVersion: PropTypes.string,
    currentItemStatus: PropTypes.string.isRequired,
    onSelectItem: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignItemHeader = connect(mapStateToProps)(DesignItemHeader);


export default DesignItemHeader;


