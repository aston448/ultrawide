// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {MenuType, RoleType, ViewType, ViewMode, DisplayContext, DetailsViewType, HomePageTab, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientAppHeaderServices }      from '../../../apiClient/apiClientAppHeader.js';
import { ClientUserContextServices }    from '../../../apiClient/apiClientUserContext.js';
import { ClientDataServices }      from '../../../apiClient/apiClientDataServices.js';

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

        const currentOption = ClientDataServices.getCurrentOptionForDetailsView(view, userViewOptions, detailsType);

        //console.log("Closing " + currentOption.option);

        // Only close if really open
        if(currentOption.value) {
            //console.log("Really Closing " + currentOption.option);
            ClientAppHeaderServices.toggleViewOption(currentOption.option, userViewOptions, userContext.userId)
        }
    }

    onSetEditViewMode(newMode, view, viewOptions, userId){
        // Set editor as edit or view mode
        ClientAppHeaderServices.setEditorMode(newMode, view, viewOptions, userId);
    }

    onZoomToFeatures(userContext, displayContext){
        ClientAppHeaderServices.setViewLevelFeatures(userContext, displayContext);
    }

    onZoomToSections(userContext, displayContext){
        ClientAppHeaderServices.setViewLevelSections(userContext, displayContext);
    }

    onZoomToLevel(userContext, displayContext, level){
        ClientAppHeaderServices.setViewLevel(userContext, displayContext, level)
    }

    onToggleDomainTerms(userContext, displayContext){
        ClientAppHeaderServices.toggleDomainTerms(userContext, displayContext);
    }

    getNameData(userContext, displayContext){
        return ClientUserContextServices.getContextNameData(userContext, displayContext);
    }


    render() {

        const {displayContext, view, mode, userContext, userRole, userViewOptions, currentViewDataValue, domainTermsVisible, userHomeTab} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Editor Header');

        // Items -------------------------------------------------------------------------------------------------------

        const viewView = (mode === ViewMode.MODE_VIEW) ? 'view-toggle-active' : 'view-toggle-inactive';
        const viewEdit = (mode === ViewMode.MODE_EDIT) ? 'view-toggle-active' : 'view-toggle-inactive';
        const domainClass = domainTermsVisible ? 'view-toggle-active' : 'view-toggle-inactive';

        const viewModeViewOption =
            <div id="optionView" className={viewView}>
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="VIEW" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW, view, userViewOptions, userContext.userId)}/>
            </div>;

        const viewModeEditOption =
            <div id="optionEdit" className={viewEdit}>
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="EDIT" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT, view, userViewOptions, userContext.userId)}/>
            </div>;

        const zoomFeaturesOption =
            <div id="optionZoomFeatures" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="FFF" actionFunction={ () => this.onZoomToFeatures(userContext, displayContext)}/>
            </div>;

        const zoomSectionsOption =
            <div id="optionZoomSections" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="SSS" actionFunction={ () => this.onZoomToSections(userContext, displayContext)}/>
            </div>;

        const zoomLevel1Option =
            <div id="optionZoomLevel1" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="111" actionFunction={ () => this.onZoomToLevel(userContext, displayContext, 1)}/>
            </div>;

        const zoomLevel2Option =
            <div id="optionZoomLevel1" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="222" actionFunction={ () => this.onZoomToLevel(userContext, displayContext, 2)}/>
            </div>;

        const domainTermsOption =
            <div id="optionDomainTerms" className={domainClass}>
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="DDD" actionFunction={ () => this.onToggleDomainTerms(userContext, displayContext)}/>
            </div>;


        const nameData = this.getNameData(userContext, displayContext);

        //console.log('DE Header: View: ' + view + ' Context: ' + displayContext + ' UC DU: ' + userContext.designUpdateId + ' UC WP: ' + userContext.workPackageId);

        let description = '';

        switch(view){
            case ViewType.SELECT:
                switch(displayContext){
                    case DisplayContext.UPDATE_SUMMARY:
                        if(userContext.workPackageId !== 'NONE' && userHomeTab === HomePageTab.TAB_WORK){
                            description = 'WORK PACKAGE SUMMARY';
                            if(nameData.workPackage !== 'NONE'){
                                description += ': ' + nameData.workPackage
                            }
                        } else {
                            description = 'UPDATE SUMMARY';
                            if(nameData.designUpdate !== 'NONE'){
                                description += ': ' + nameData.designUpdateRef + ' - ' + nameData.designUpdate
                            }
                        }
                        break;

                    case DisplayContext.WP_SUMMARY:

                        description = 'WORK PACKAGE SUMMARY';
                        if(nameData.workPackage !== 'NONE'){
                            description += ': ' + nameData.workPackage
                        }

                        break;
                    case DisplayContext.PROGRESS_SUMMARY:
                        description = 'DESIGN VERSION PROGRESS';

                }
                break;

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                description = nameData.designVersion;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext){
                    case DisplayContext.UPDATE_SCOPE:
                        description = nameData.designUpdate + ' - SCOPE';
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
                        description = nameData.workPackage + ' - SCOPE';
                        break;
                    case  DisplayContext.WP_VIEW:
                        description = nameData.workPackage + ' - CONTENT';
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

            case ViewType.DESIGN_NEW:

                options =
                    <div className="details-menu-bar">
                        {zoomLevel1Option}
                        {zoomLevel2Option}
                        {zoomSectionsOption}
                        {zoomFeaturesOption}
                        {viewModeViewOption}
                        {viewModeEditOption}
                        {domainTermsOption}
                    </div>;
                break;

            case ViewType.DESIGN_PUBLISHED:

                if(userRole === RoleType.DESIGNER){

                    options =
                        <div className="details-menu-bar">
                            {zoomLevel1Option}
                            {zoomLevel2Option}
                            {zoomSectionsOption}
                            {zoomFeaturesOption}
                            {viewModeViewOption}
                            {viewModeEditOption}
                            {domainTermsOption}
                        </div>;

                } else {

                    options =
                        <div className="details-menu-bar">
                            {zoomLevel1Option}
                            {zoomLevel2Option}
                            {zoomSectionsOption}
                            {zoomFeaturesOption}
                            {domainTermsOption}
                        </div>;
                }
                break;

            case ViewType.DESIGN_UPDATE_EDIT:

                switch(displayContext) {
                    case DisplayContext.UPDATE_EDIT:
                        options =
                            <div className="details-menu-bar">
                                {zoomLevel1Option}
                                {zoomLevel2Option}
                                {zoomSectionsOption}
                                {zoomFeaturesOption}
                                {viewModeViewOption}
                                {viewModeEditOption}
                                {domainTermsOption}
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
                                {zoomLevel1Option}
                                {zoomLevel2Option}
                                {zoomSectionsOption}
                                {zoomFeaturesOption}
                                {domainTermsOption}
                            </div>;
                        closable = true;
                        detailsType = DetailsViewType.VIEW_VERSION_PROGRESS;
                        break;
                    default:
                        if(mode === ViewMode.MODE_VIEW){
                            options =
                                <div className="details-menu-bar">
                                    {zoomLevel1Option}
                                    {zoomLevel2Option}
                                    {zoomSectionsOption}
                                    {zoomFeaturesOption}
                                    {viewModeViewOption}
                                    {viewModeEditOption}
                                    {domainTermsOption}
                                </div>;
                        } else {
                            options =
                                <div className="details-menu-bar">
                                    {zoomLevel1Option}
                                    {zoomLevel2Option}
                                    {zoomSectionsOption}
                                    {zoomFeaturesOption}
                                    {domainTermsOption}
                                </div>;
                        }
                }
                break;

            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext) {
                    case DisplayContext.UPDATE_VIEW:
                        options =
                            <div className="details-menu-bar">
                                {zoomLevel1Option}
                                {zoomLevel2Option}
                                {zoomSectionsOption}
                                {zoomFeaturesOption}
                                {domainTermsOption}
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
                                {zoomLevel1Option}
                                {zoomLevel2Option}
                                {zoomSectionsOption}
                                {zoomFeaturesOption}
                                {domainTermsOption}
                            </div>;
                        closable = true;
                        detailsType = DetailsViewType.VIEW_VERSION_PROGRESS;
                        break;
                }
                break;

            case ViewType.DESIGN_UPDATABLE:

                options =
                    <div className="details-menu-bar">
                        {zoomLevel1Option}
                        {zoomLevel2Option}
                        {zoomSectionsOption}
                        {zoomFeaturesOption}
                        {domainTermsOption}
                    </div>;
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                options =
                    <div className="details-menu-bar">
                        {zoomLevel1Option}
                        {zoomLevel2Option}
                        {zoomSectionsOption}
                        {zoomFeaturesOption}
                        {viewModeViewOption}
                        {viewModeEditOption}
                        {domainTermsOption}
                    </div>;
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                //if(displayContext === DisplayContext.WP_VIEW){
                    options =
                        <div className="details-menu-bar">
                            {zoomLevel1Option}
                            {zoomLevel2Option}
                            {zoomSectionsOption}
                            {zoomFeaturesOption}
                            {domainTermsOption}
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
        currentViewDataValue:   state.currentViewOptionsDataValue,
        domainTermsVisible:     state.domainTermsVisible,
        userHomeTab:            state.currentUserHomeTab
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignEditorHeader);
