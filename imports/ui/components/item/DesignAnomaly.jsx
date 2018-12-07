// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideAction                  from "../../components/common/UltrawideAction.jsx";
import RichTextEditor                   from "../common/RichTextEditor";

// Ultrawide Services
import {ClientDesignAnomalyServices}    from "../../../apiClient/apiClientDesignAnomaly";


import {DisplayContext, DesignAnomalyStatus, LogLevel, RoleType, } from '../../../constants/constants.js';

import { UI }                               from "../../../constants/ui_context_ids";
import {getContextID, replaceAll, log}         from '../../../common/utils.js';
import { TextLookups }                      from '../../../common/lookups.js'

// Bootstrap
import {FormControl, InputGroup, Badge} from 'react-bootstrap';
import {Glyphicon, Button, ButtonGroup}  from 'react-bootstrap';

// REDUX services
import {connect} from "react-redux";
import store from '../../../redux/store'
import {
    setCurrentUserDesignAnomaly
} from '../../../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Anomaly
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignAnomaly extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            editing: false,
            daName: this.props.designAnomaly.designAnomalyName,
            daLink: this.props.designAnomaly.designAnomalyLink
        };

    }

    componentDidMount(){

        this.setState({daName: this.props.designAnomaly.designAnomalyName, daLink: this.props.designAnomaly.designAnomalyLink});

    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if no change to what is seen
        return true

    }

    handleNameChange(e){
        this.setState({daName: e.target.value});
    }

    handleLinkChange(e){
        this.setState({daLink: e.target.value});
    }

    handleKeyEvents(e){
        if(e.charCode === 13){
            // Enter Key
            this.onSaveDesignAnomaly();
        }
    }

    editDesignAnomaly(){
        this.setState({editing: true});
    }

    cancelEdit(){
        this.setState({editing: false});
    }

    onRemoveDesignAnomaly(userRole, designAnomaly){

        ClientDesignAnomalyServices.removeDesignAnomaly(userRole, designAnomaly._id, designAnomaly.designAnomalyStatus);

    }

    onSaveDesignAnomaly(){

        // Local save of name and link from here
        ClientDesignAnomalyServices.updateDesignAnomalyDetails(
            this.props.userRole,
            this.props.designAnomaly._id,
            this.state.daName,
            this.state.daLink,
            this.props.designAnomaly.designAnomalyRawText
        );

        this.setState({editing: false});
    }

    onSaveDesignAnomalyText(rawText){

        // Save of rich text from rich text editor
        ClientDesignAnomalyServices.updateDesignAnomalyDetails(
            this.props.userRole,
            this.props.designAnomaly._id,
            this.props.designAnomaly.designAnomalyName,
            this.props.designAnomaly.designAnomalyLink,
            rawText
        );

        this.setState({editing: false});
    }

    onCloseReopenDesignAnomaly(designAnomaly){

        if(designAnomaly.designAnomalyStatus === DesignAnomalyStatus.ANOMALY_CLOSED){

            // Anomaly can be re-opened
            ClientDesignAnomalyServices.updateDesignAnomalyStatus(
                this.props.userRole,
                designAnomaly._id,
                designAnomaly.designAnomalyStatus,
                DesignAnomalyStatus.ANOMALY_OPEN
            );

        } else {

            // Anomaly can be closed
            ClientDesignAnomalyServices.updateDesignAnomalyStatus(
                this.props.userRole,
                designAnomaly._id,
                designAnomaly.designAnomalyStatus,
                DesignAnomalyStatus.ANOMALY_CLOSED
            );
        }
    }

    onSetAnomalyOngoing(){

        ClientDesignAnomalyServices.updateDesignAnomalyStatus(
            this.props.userRole,
            this.props.designAnomaly._id,
            this.props.designAnomaly.designAnomalyStatus,
            DesignAnomalyStatus.ANOMALY_ONGOING
        );
    }

    onSelectDesignAnomaly(designAnomalyId){

        store.dispatch(setCurrentUserDesignAnomaly(designAnomalyId));

    }

    render() {
        const {designAnomaly, userRole, userContext, userDesignAnomaly} = this.props;

        let daName = designAnomaly.designAnomalyName;
        let badgeId = designAnomaly.designAnomalyStatus;
        let badgeClass = '';
        let selectedItem = (userDesignAnomaly === designAnomaly._id);
        let itemClass = 'design-anomaly';
        let daClass = '';

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Anomaly {}', daName);

        const uiContextName = replaceAll(daName, ' ', '_');

        switch(designAnomaly.designAnomalyStatus){
            case DesignAnomalyStatus.ANOMALY_NEW:
                badgeClass = 'badge-da-new';
                break;
            case DesignAnomalyStatus.ANOMALY_OPEN:
                badgeClass = 'badge-da-open';
                break;
            case DesignAnomalyStatus.ANOMALY_ONGOING:
                badgeClass = 'badge-da-ongoing';
                break;
            case DesignAnomalyStatus.ANOMALY_CLOSED:
                badgeClass = 'badge-da-closed';
                break;
        }

        // Selected if DA Id === Redux Current DA Id

        let layout = <div></div>;
        let buttons = <div></div>;

        let editAction =
            <InputGroup.Addon onClick={() => this.onSelectDesignAnomaly(designAnomaly._id)}>
                <UltrawideAction
                    actionType={UI.OPTION_EDIT}
                    uiContextName={uiContextName}
                    actionFunction={() => this.editDesignAnomaly()}
                />
            </InputGroup.Addon>;

        let deleteAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_REMOVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.onRemoveDesignAnomaly(userRole, designAnomaly)}
                    isDeleted={false}
                />
            </InputGroup.Addon>;

        let saveAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_SAVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.onSaveDesignAnomaly()}
                />
            </InputGroup.Addon>;

        let undoAction =
            <InputGroup.Addon id="actionUndo">
                <UltrawideAction
                    actionType={UI.OPTION_UNDO}
                    uiContextName={uiContextName}
                    actionFunction={() => this.cancelEdit()}
                />
            </InputGroup.Addon>;

        let badge =
            <InputGroup.Addon onClick={() => this.onSelectDesignAnomaly(designAnomaly._id)}>
                <Badge className={badgeClass}>{badgeId}</Badge>
            </InputGroup.Addon>;

        let daLink =
            <InputGroup.Addon onClick={() => this.onSelectDesignAnomaly(designAnomaly._id)}>
                <div className="work-item-link"><a href={this.state.daLink} target="_blank"><Glyphicon glyph='link'/></a></div>
            </InputGroup.Addon>;

        let daText =
            <div className="work-item-name" onClick={() => this.onSelectDesignAnomaly(designAnomaly._id)}>{daName}</div>;


        if(userRole !== RoleType.GUEST_VIEWER) {

            let buttonText = 'Close';

            if (designAnomaly.designAnomalyStatus === DesignAnomalyStatus.ANOMALY_CLOSED) {
                buttonText = 'Re-Open';
            }

            const buttonClose =
                <Button id={getContextID(UI.BUTTON_CLOSE_REOPEN, uiContextName)} bsSize="xs"
                        onClick={() => this.onCloseReopenDesignAnomaly(designAnomaly)}>{buttonText}</Button>;

            const buttonOngoing =
                <Button id={getContextID(UI.BUTTON_ONGOING, uiContextName)} bsSize="xs"
                        onClick={() => this.onSetAnomalyOngoing()}>Set as Ongoing
                    Issue</Button>;

            switch (designAnomaly.designAnomalyStatus) {
                case DesignAnomalyStatus.ANOMALY_OPEN:

                    buttons =
                        <ButtonGroup className="button-group-left">
                            {buttonClose}
                            {buttonOngoing}
                        </ButtonGroup>;

                    break;

                case DesignAnomalyStatus.ANOMALY_CLOSED:
                case DesignAnomalyStatus.ANOMALY_ONGOING:

                    // This will either be a reopen or close button depending on the context
                    buttons =
                        <ButtonGroup className="button-group-left">
                            {buttonClose}
                        </ButtonGroup>;

                    break;

            }

        }

        let itemNotEditable =
            <div>
                <div className={daClass}>
                    <InputGroup>
                        {badge}
                        {daLink}
                        {daText}
                    </InputGroup>
                </div>
            </div>;

        let itemNotEditableSelected =
            <div className={daClass}>
                <InputGroup>
                    {badge}
                    {daLink}
                    {daText}
                </InputGroup>
                {buttons}
                <div>
                    <RichTextEditor
                        rawText={designAnomaly.designAnomalyRawText}
                        displayContext={DisplayContext.ANOMALY_TEXT_READ_ONLY}
                    />
                </div>
            </div>;

        let itemNotEditing =
            <div className={daClass}>
                <InputGroup>
                    {badge}
                    {daLink}
                    {daText}
                    {editAction}
                    {deleteAction}
                </InputGroup>
            </div>;

        let itemNotEditingSelected =
            <div className={daClass}>
                <InputGroup>
                    {badge}
                    {daLink}
                    {daText}
                    {editAction}
                    {deleteAction}
                </InputGroup>
                {buttons}
                <div>
                    <RichTextEditor
                        rawText={designAnomaly.designAnomalyRawText}
                        saveFunction={(rawText) => this.onSaveDesignAnomalyText(rawText)}
                        displayContext={DisplayContext.ANOMALY_TEXT_EDITABLE}/>
                </div>
            </div>;

        let itemEditing =
            <div className={daClass}>
                <InputGroup>
                    {badge}
                    {daLink}
                    {daText}
                    {saveAction}
                    {undoAction}
                </InputGroup>
                <div className="editableItem">
                    <FormControl
                        type="text"
                        value={this.state.daName}
                        placeholder={this.state.daName}
                        onChange={(event) => this.handleNameChange(event)}
                        onKeyPress={(event) => this.handleKeyEvents(event)}
                    />
                </div>
                <div className="editableItem">
                    <FormControl
                        type="text"
                        value={this.state.daLink}
                        placeholder={this.state.daLink}
                        onChange={(event) => this.handleLinkChange(event)}
                        onKeyPress={(event) => this.handleKeyEvents(event)}
                    />
                </div>
                <div>
                    <RichTextEditor
                        rawText={designAnomaly.designAnomalyRawText}
                        saveFunction={(rawText) => this.onSaveDesignAnomalyText(rawText)}
                        displayContext={DisplayContext.ANOMALY_TEXT_EDITABLE}/>
                </div>
            </div>;



        switch(userRole){

            case RoleType.GUEST_VIEWER:

                if(selectedItem){
                    layout = itemNotEditableSelected
                } else {
                    layout = itemNotEditable
                }
                break;

            default:

                if(selectedItem){
                    if(this.state.editing){
                        layout = itemEditing;
                    } else {
                        layout = itemNotEditingSelected;
                    }
                } else {
                    layout = itemNotEditing;
                }

        }

        if(selectedItem){
            itemClass = 'design-anomaly-selected';
        }


        return(
            <div className={itemClass}>
                {layout}
            </div>
        );

    }
}

DesignAnomaly.propTypes = {
    designAnomaly: PropTypes.object.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:                state.currentUserItemContext,
        userRole:                   state.currentUserRole,
        userDesignAnomaly:          state.currentUserDesignAnomaly
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignAnomaly);




