// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, ItemType, DesignVersionStatus, DesignUpdateStatus, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDesignVersionServices }      from '../../../apiClient/apiClientDesignVersion.js';
import { ClientDesignUpdateServices }       from '../../../apiClient/apiClientDesignUpdate.js';

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
// Design Item Version Component - Editable version for items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemReference extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            refEditable: false,
            refValue: this.props.currentItemRef,
            highlighted: false,
        };

    }

    // Allow editing of version text (if there is one)
    editItemVersion(){
        event.preventDefault();
        this.setState({refEditable: true});
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

    handleVersionKeyEvents(userRole, event, currentItemType, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveItemRef(userRole, currentItemType, currentItemId);
        }
    }

    handleRefChange(event) {
        this.setState({refValue: event.target.value});
    }

    undoItemRefChange(){
        event.preventDefault();
        this.setState({refValue: this.props.currentItemRef});
        this.setState({refEditable: false});
    }

    render(){
        const {currentItemId, currentItemRef, currentItemStatus, currentItemType, itemStatusClass, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item Ref {}', currentItemRef);

        const refEditorEditing =
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

        const refEditorNotEditing =
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

        const refReadOnly =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id="refLabel">{currentItemRef}</ControlLabel>
                    </div>
                </InputGroup>
            </div>;


        // Return the view wanted
        let titleClass = 'design-item-attribute ' + itemStatusClass;

        switch(userRole){
            case RoleType.GUEST_VIEWER:
                return (<div className={titleClass}>{refReadOnly}</div>);

            case RoleType.DEVELOPER:
            case RoleType.MANAGER:

                // Developers are aware of new stuff but can't access it yet.  They cannot edit names of things.
                if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW){

                    titleClass = 'design-item-attribute greyed-out'
                }

                return (<div className={titleClass}>{refReadOnly}</div>);

            case RoleType.DESIGNER:

                if (this.state.refEditable) {
                    return (<div className={titleClass}>{refEditorEditing}</div>);
                } else {
                    return (<div className={titleClass}>{refEditorNotEditing}</div>);
                }

            case RoleType.ADMIN:
                // Must be in the Designs List as those are the only items Admin can see
                return (<div className={titleClass}>{refReadOnly}</div>);

        }

    }
}


ItemReference.propTypes = {
    currentItemType: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    currentItemRef: PropTypes.string.isRequired,
    currentItemStatus: PropTypes.string.isRequired,
    itemStatusClass: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemReference);



