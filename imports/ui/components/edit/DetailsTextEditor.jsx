// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import RichTextEditor                       from "../common/RichTextEditor";

// Ultrawide Services
import {ViewMode, ViewType, UpdateScopeType, DetailsType, DisplayContext, LogLevel} from '../../../constants/constants.js';

import { ClientTextEditorServices }         from '../../../apiClient/apiClientTextEditor.js';
import { log }                              from '../../../common/utils.js'

// Bootstrap
import {Glyphicon} from 'react-bootstrap';
import {Button, ButtonGroup} from 'react-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// Draft JS



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Details Text Editor Component - For displaying / editing long text related to design components
//
// ---------------------------------------------------------------------------------------------------------------------

export class DetailsTextEditor extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(){
        return true;
    }

    // Set the text editor content - this has to change when the design component item changes
    // Passing in props as they could be the current or the new props...
    getRawText(designComponent, detailsType){

        switch(detailsType) {
            case DetailsType.DETAILS_NAME:
            case DetailsType.DETAILS_NAME_NEW:
                return designComponent.componentNameRawNew;
            case DetailsType.DETAILS_NAME_OLD:
                return designComponent.componentNameRawOld;
            case DetailsType.DETAILS_TEXT:
            case DetailsType.DETAILS_TEXT_NEW:
                return designComponent.componentTextRawNew;
            case DetailsType.DETAILS_TEXT_OLD:
                return designComponent.componentTextRawOld;
            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "Invalid details type: {}", detailsType);
                return {}
        }
    }

    // Saves editor text to design component as RAW
    onSave(rawText){

        switch(this.props.view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                ClientTextEditorServices.saveDesignComponentText(this.props.userRole, this.props.designComponent._id, rawText);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                ClientTextEditorServices.saveDesignUpdateComponentText(this.props.userRole, this.props.designComponent._id, rawText);
        }
    }


    render() {

        const {designComponent, detailsType, mode, view} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Details Text Editor {}', designComponent.componentNameNew);

        let editorHtml = '';
        let editorClass = 'editor-panel-large';
        let nameItem = false;
        let displayContext = DisplayContext.DETAILS_TEXT_READ_ONLY;

        // Show small editor window for item names
        switch (detailsType) {
            case DetailsType.DETAILS_NAME:
            case DetailsType.DETAILS_NAME_OLD:
            case DetailsType.DETAILS_NAME_NEW:
                editorClass = 'editor-panel-small';
                nameItem = true;
                displayContext = DisplayContext.DETAILS_NAME_READ_ONLY;
                break;
        }

        // See if editing of the details is allowed
        let detailsEditable = false;

        // Cases where it is editable - never names...
        if (!nameItem) {
            switch (view) {
                case ViewType.DESIGN_UPDATE_EDIT:
                    // Editable if in scope
                    if (designComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {
                        detailsEditable = true;
                    }
                    break;
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:
                    if(mode === ViewMode.MODE_EDIT) {
                        detailsEditable = true;
                    }
                    break;
            }
        }

        const rawText = this.getRawText(designComponent, detailsType);

        // Additionally, Can't edit old-text items ever or if in View mode
        if (!detailsEditable || mode === ViewMode.MODE_VIEW || detailsType === DetailsType.DETAILS_TEXT_OLD){

            // Not Editable

            editorHtml =
                <div className={editorClass}>
                    <RichTextEditor
                        rawText={rawText}
                        saveFunction={(rawText) => this.onSave(rawText)}
                        displayContext={displayContext}
                    />
                </div>;

        } else {

            // Editable
            if(nameItem){
                displayContext = DisplayContext.DETAILS_NAME_EDITABLE;
            } else {
                displayContext = DisplayContext.DETAILS_TEXT_EDITABLE;
            }

            editorHtml =
                <div className={editorClass}>
                    <RichTextEditor
                        rawText={rawText}
                        saveFunction={(rawText) => this.onSave(rawText)}
                        displayContext={displayContext}
                    />
                </div>;
        }

        return (editorHtml);
    }
}

//  This is a redux updated property that changes when we change the focus on design components
DetailsTextEditor.propTypes = {
    designComponent: PropTypes.object.isRequired,
    detailsType: PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        domainTermsVisible:     state.domainTermsVisible
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DetailsTextEditor = connect(mapStateToProps)(DetailsTextEditor);

