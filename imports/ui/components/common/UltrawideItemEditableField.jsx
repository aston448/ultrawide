// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import { UI } from '../../../constants/ui_context_ids';


import { UltrawideItemEditableFieldUiModules} from "../../../ui_modules/ultrawide_item_editable_field";

// Bootstrap
import {InputGroup}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';
import {FormControl, ControlLabel}  from 'react-bootstrap';
import {FieldType} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Item Field Component - Editable field for Design, Design Version, Design Update, Work Package
//
// ---------------------------------------------------------------------------------------------------------------------

export default class UltrawideItemEditableField extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            fieldEditable: false,
            fieldValue: this.props.currentFieldValue,
            highlighted: false,
        };

    }

    // Allow editing of name
    editFieldName(){
        event.preventDefault();
        this.setState({fieldEditable: true});
    }


    saveFieldValue(userRole, currentItemType, fieldType, currentItemId){

        event.preventDefault();

        const newValue = this.state.fieldValue;

        UltrawideItemEditableFieldUiModules.saveFieldValue(userRole, currentItemType, fieldType, currentItemId, newValue);

        this.setState({fieldEditable: false});
    }

    handleKeyEvents(userRole, event, currentItemType, fieldType, currentItemId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveFieldValue(userRole, currentItemType, fieldType, currentItemId);
        }
    }

    handleFieldChange(event) {
        this.setState({fieldValue: event.target.value});
    }

    undoFieldChange(){
        event.preventDefault();
        this.setState({fieldValue: this.props.currentFieldValue});
        this.setState({fieldEditable: false});
    }


    render(){
        const {fieldType, currentItemId, currentFieldValue, currentItemStatus, currentItemType, statusClass, userRole, uiName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item Field {}', currentFieldValue);

        let readOnlyValue = currentFieldValue;

        // Create a link for link items
        if(fieldType === FieldType.LINK){

            readOnlyValue =
                <a id={getContextID(UI.LINK_ITEM_LINK_LABEL, uiName)} href={currentFieldValue} target="_blank">Open Link</a>;

            if(currentFieldValue === 'NONE'){
                readOnlyValue = <div id={getContextID(UI.LINK_ITEM_LINK_LABEL, uiName)} className="greyed-out">Link Not Set</div>
            }
        }

        const fieldEditorEditing =
            <div id={getContextID(UI.EDITABLE_FIELD_EDITING, uiName) + '-' + fieldType}>
                <InputGroup>
                    <div className="editableItem">
                        <FormControl
                            type="text"
                            value={this.state.fieldValue}
                            placeholder={currentFieldValue}
                            onChange={(event) => this.handleFieldChange(event)}
                            onKeyPress={(event) => this.handleKeyEvents(userRole, event, currentItemType, fieldType, currentItemId)}
                        />
                    </div>
                    <InputGroup.Addon onClick={ () => this.saveFieldValue(userRole, currentItemType, fieldType, currentItemId)}>
                        <div id={getContextID(UI.OPTION_SAVE, uiName) + '-' + fieldType} className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoFieldChange()}>
                        <div id={getContextID(UI.OPTION_UNDO, uiName) + '-' + fieldType} className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        const fieldEditorNotEditing =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id={getContextID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType}>{readOnlyValue}</ControlLabel>
                    </div>
                    <InputGroup.Addon onClick={ () => this.editFieldName()}>
                        <div id={getContextID(UI.OPTION_EDIT, uiName) + '-' + fieldType} className="blue"><Glyphicon glyph="edit"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        const fieldReadOnly =
            <div>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel id={getContextID(UI.READ_ONLY_FIELD, uiName) + '-' + fieldType}>{readOnlyValue}</ControlLabel>
                    </div>
                </InputGroup>
            </div>;

        // Return the view wanted
        const layout = UltrawideItemEditableFieldUiModules.getComponentLayout(userRole, fieldType, currentItemType, statusClass, currentItemStatus, fieldEditorEditing, fieldEditorNotEditing, fieldReadOnly, this.state.fieldEditable);

        return(
            <div>
                {layout}
            </div>
        );

    }
}


UltrawideItemEditableField.propTypes = {
    fieldType: PropTypes.string.isRequired,
    currentItemType: PropTypes.string.isRequired,
    currentItemId: PropTypes.string.isRequired,
    currentFieldValue: PropTypes.string.isRequired,
    currentItemStatus: PropTypes.string.isRequired,
    statusClass: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    uiName: PropTypes.string.isRequired
};



