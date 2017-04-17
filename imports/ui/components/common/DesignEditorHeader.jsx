// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {MenuType, RoleType, ViewType, ViewMode, DisplayContext, DetailsViewType} from '../../../constants/constants.js';

import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';
import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Editor Header
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignEditorHeader extends Component {
    constructor(props) {
        super(props);

    }

    onClose(detailsType, view, userContext, userRole, userViewOptions, currentViewDataValue){

        let viewOptionType = '';

        const currentOption = ClientContainerServices.getCurrentOptionForDetailsView(view, userViewOptions, detailsType);

        console.log("Closing " + currentOption.option);

        // Only close if really open
        if(currentOption.value) {
            console.log("Really Closing " + currentOption.option);
            ClientAppHeaderServices.toggleViewOption(view, userContext, userRole, currentOption.option, userViewOptions, currentViewDataValue, false, null)
        }
    }

    onSetEditViewMode(newMode, view, viewOptions){
        // Set editor as edit or view mode
        ClientAppHeaderServices.setEditorMode(newMode, view, viewOptions);
    }

    onZoomToFeatures(userContext, displayContext){
        ClientAppHeaderServices.setViewLevelFeatures(userContext, displayContext);
    }

    onZoomToSections(userContext, displayContext){
        ClientAppHeaderServices.setViewLevelSections(userContext, displayContext);
    }

    getNameData(userContext, displayContext){
        return ClientUserContextServices.getContextNameData(userContext, displayContext);
    }


    render() {

        const {displayContext, view, mode, userContext, userRole, userViewOptions, currentViewDataValue} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        const viewView = (mode === ViewMode.MODE_VIEW) ? 'view-toggle-active' : 'view-toggle-inactive';
        const viewEdit = (mode === ViewMode.MODE_EDIT) ? 'view-toggle-active' : 'view-toggle-inactive';

        const viewModeViewOption =
            <div id="optionView" className={viewView}>
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="VIEW" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW, view, userViewOptions)}/>
            </div>;

        const viewModeEditOption =
            <div id="optionEdit" className={viewEdit}>
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="EDIT" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT, view, userViewOptions)}/>
            </div>;

        const zoomFeaturesOption =
            <div id="optionZoomFeatures" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="FFF" actionFunction={ () => this.onZoomToFeatures(userContext, displayContext)}/>
            </div>;

        const zoomSectionsOption =
            <div id="optionZoomSections" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="SSS" actionFunction={ () => this.onZoomToSections(userContext, displayContext)}/>
            </div>;

        const nameData = this.getNameData(userContext, displayContext);

        let description = '';

        switch(view){
            case ViewType.SELECT:
                if(displayContext === DisplayContext.UPDATE_SUMMARY){
                    if(userContext.workPackageId !== 'NONE'){
                        description = 'WORK PACKAGE SUMMARY';
                        if(nameData.workPackage !== 'NONE'){
                            description += ': ' + nameData.workPackage
                        }
                    } else {
                        description = 'UPDATE SUMMARY';
                        if(nameData.designUpdate !== 'NONE'){
                            description += ': ' + nameData.designUpdate
                        }
                    }
                }
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:

                description = nameData.designVersion;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext){
                    case DisplayContext.UPDATE_SCOPE:
                        description = nameData.designUpdate + ' - BASELINE';
                        break;
                    case DisplayContext.UPDATE_EDIT:
                        description = nameData.designUpdate + ' - CHANGES';
                        break;
                    case DisplayContext.UPDATE_SUMMARY:
                        description = 'UPDATE SUMMARY';
                        if(nameData.designUpdate !== 'NONE'){
                            description += ': ' + nameData.designUpdate
                        }
                        break;
                    case DisplayContext.WORKING_VIEW:
                        description = 'Working Design Version (Merged Updates)';
                        break;
                    default:
                        description = nameData.designUpdate;
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                switch(displayContext){
                    case DisplayContext.WP_SCOPE:
                        description = nameData.workPackage + ' (SCOPE)';
                        break;
                    case  DisplayContext.WP_VIEW:
                        description = nameData.workPackage + ' (CONTENT)';
                        break;
                    default:
                        description = nameData.workPackage;
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                description = nameData.workPackage;
                break;
        }

        let options = '';
        let closable = false;
        let detailsType = '';

        switch(view){
            case ViewType.SELECT:

                options = '';
                break;

            case ViewType.DESIGN_NEW_EDIT:

                options =
                    <div className="details-menu-bar">
                        {zoomFeaturesOption}
                        {zoomSectionsOption}
                        {viewModeViewOption}
                        {viewModeEditOption}
                    </div>;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:

                switch(displayContext) {
                    case DisplayContext.UPDATE_EDIT:
                        options =
                            <div className="details-menu-bar">
                                {zoomFeaturesOption}
                                {zoomSectionsOption}
                                {viewModeViewOption}
                                {viewModeEditOption}
                            </div>;
                        break;

                    case DisplayContext.UPDATE_SUMMARY:
                        closable = true;
                        detailsType = DetailsViewType.VIEW_UPD_SUMM;
                        options = '';
                        break;

                    case DisplayContext.WORKING_VIEW:
                        options =
                            <div className="details-menu-bar">
                                {zoomFeaturesOption}
                                {zoomSectionsOption}
                            </div>;
                        closable = true;
                        detailsType = DetailsViewType.VIEW_VERSION_PROGRESS;
                        break;
                    default:
                        if(mode === ViewMode.MODE_VIEW){
                            options =
                                <div className="details-menu-bar">
                                    {zoomFeaturesOption}
                                    {zoomSectionsOption}
                                    {viewModeViewOption}
                                    {viewModeEditOption}
                                </div>;
                        } else {
                            options =
                                <div className="details-menu-bar">
                                    {zoomFeaturesOption}
                                    {zoomSectionsOption}
                                </div>;
                        }
                }
                break;

            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext) {
                    case DisplayContext.UPDATE_VIEW:
                        options =
                            <div className="details-menu-bar">
                                {zoomFeaturesOption}
                                {zoomSectionsOption}
                            </div>;
                        break;

                    case DisplayContext.UPDATE_SUMMARY:
                        closable = true;
                        detailsType = DetailsViewType.VIEW_UPD_SUMM;
                        options = '';
                        break;

                    case DisplayContext.WORKING_VIEW:
                        options =
                            <div className="details-menu-bar">
                                {zoomFeaturesOption}
                                {zoomSectionsOption}
                            </div>;
                        closable = true;
                        detailsType = DetailsViewType.VIEW_VERSION_PROGRESS;
                        break;
                }
                break;

            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:

                options =
                    <div className="details-menu-bar">
                        {zoomFeaturesOption}
                        {zoomSectionsOption}
                    </div>;
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                options =
                    <div className="details-menu-bar">
                        {zoomFeaturesOption}
                        {zoomSectionsOption}
                        {viewModeViewOption}
                        {viewModeEditOption}
                    </div>;
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                //if(displayContext === DisplayContext.WP_VIEW){
                    options =
                        <div className="details-menu-bar">
                            {zoomFeaturesOption}
                            {zoomSectionsOption}
                        </div>;
                //}
                break;
            default:
                options = '';
        }

        if(options === ''){
            if(closable){
                return (
                    <div className="design-editor-header">
                        <Grid>
                            <Row>
                                <Col md={11}>
                                    <div className="header-description">{description}</div>
                                </Col>
                                <Col md={1} className="close-col">
                                    <div className="details-close" onClick={() => this.onClose(detailsType, view, userContext, userRole, userViewOptions, currentViewDataValue)}>
                                        <Glyphicon glyph="remove"/>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            } else {
                return (
                    <div className="design-editor-header">
                        <Grid>
                            <Row>
                                <Col md={12}>
                                    <div className="header-description">{description}</div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            }
        } else {
            if(closable){
                return (
                    <div className="design-editor-header">
                        <Grid>
                            <Row>
                                <Col md={7}>
                                    <div className="header-description">{description}</div>
                                </Col>
                                <Col md={4}>
                                    {options}
                                </Col>
                                <Col md={1} className="close-col">
                                    <div className="details-close" onClick={() => this.onClose(detailsType, view, userContext, userRole, userViewOptions, currentViewDataValue)}>
                                        <Glyphicon glyph="remove"/>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            } else {
                return (
                    <div className="design-editor-header">
                        <Grid>
                            <Row>
                                <Col md={7}>
                                    <div className="header-description">{description}</div>
                                </Col>
                                <Col md={5}>
                                    {options}
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                );
            }
        }
    }
}

DesignEditorHeader.propTypes = {
    displayContext:     PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        userViewOptions:        state.currentUserViewOptions,
        currentViewDataValue:   state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignEditorHeader);
