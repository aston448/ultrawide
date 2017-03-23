// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {MenuType, RoleType, ViewType, ViewMode, DisplayContext} from '../../../constants/constants.js';

import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Button, ButtonGroup} from 'react-bootstrap';

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

    onSetEditViewMode(newMode, view, viewOptions){
        // Set editor as edit or view mode
        ClientAppHeaderServices.setEditorMode(newMode, view, viewOptions);
    }

    onZoomToFeatures(userContext){
        ClientAppHeaderServices.setViewLevelFeatures(userContext);
    }

    onZoomToSections(userContext){
        ClientAppHeaderServices.setViewLevelSections(userContext);
    }

    getNameData(userContext){
        return ClientUserContextServices.getContextNameData(userContext);
    }


    render() {

        const {displayContext, view, mode, userContext, userViewOptions} = this.props;

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
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="Features" actionFunction={ () => this.onZoomToFeatures(userContext)}/>
            </div>;

        const zoomSectionsOption =
            <div id="optionZoomSections" className="editor-menu-item-holder">
                <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="Sections" actionFunction={ () => this.onZoomToSections(userContext)}/>
            </div>;

        const nameData = this.getNameData(userContext);

        let description = '';

        switch(view){
            case ViewType.SELECT:
                if(displayContext === DisplayContext.UPDATE_SUMMARY){
                    description = 'Design Update Summary';
                    if(nameData.designUpdate !== 'NONE'){
                        description += ' for ' + nameData.designUpdate
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
                        description = nameData.designUpdate + ' (SCOPE)';
                        break;
                    case DisplayContext.UPDATE_EDIT:
                        description = nameData.designUpdate + ' (CONTENT)';
                        break;
                    case DisplayContext.UPDATE_SUMMARY:
                        description = 'Design Update Summary';
                        if(nameData.designUpdate !== 'NONE'){
                            description += ' for ' + nameData.designUpdate
                        }
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
                                {viewModeViewOption}
                                {viewModeEditOption}
                            </div>;
                        break;

                    case DisplayContext.UPDATE_SUMMARY:
                        options = '';
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

            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.DESIGN_UPDATE_VIEW:

                if(displayContext !== DisplayContext.UPDATE_SUMMARY) {
                    options =
                        <div className="details-menu-bar">
                            {zoomFeaturesOption}
                            {zoomSectionsOption}
                        </div>;
                }
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

                if(displayContext === DisplayContext.WP_VIEW){
                    options =
                        <div className="details-menu-bar">
                            {zoomFeaturesOption}
                            {zoomSectionsOption}
                        </div>;
                }
                break;
            default:
                options = '';
        }

        if(options === ''){
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
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignEditorHeader);
