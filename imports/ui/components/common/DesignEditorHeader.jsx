// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {MenuType, RoleType, ViewType, ViewMode} from '../../../constants/constants.js';

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

export default class DesignEditorHeader extends Component {
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

        const {view, mode, userContext, userViewOptions} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        let viewView = (mode === ViewMode.MODE_VIEW ? 'view-toggle-active': 'view-toggle-inactive');
        let viewEdit = (mode === ViewMode.MODE_EDIT ? 'view-toggle-active': 'view-toggle-inactive');

        let viewModeViewOption =
            <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="VIEW" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW, view, userViewOptions)}/>;

        let viewModeEditOption =
            <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="EDIT" actionFunction={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT, view, userViewOptions)}/>;

        let zoomFeaturesOption =
            <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="Features" actionFunction={ () => this.onZoomToFeatures(userContext)}/>;

        let zoomSectionsOption =
            <UltrawideMenuItem menuType={MenuType.MENU_EDITOR} itemName="Sections" actionFunction={ () => this.onZoomToSections(userContext)}/>;

        const nameData = this.getNameData(userContext);

        let description = '';

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                description = nameData.designVersion;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                description = nameData.designVersion + ' - ' + nameData.designUpdate;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                description = nameData.designVersion + ' - ' + nameData.workPackage;
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                description = nameData.designUpdate + ' - ' + nameData.workPackage;
        }

        let options = '';

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                options =
                    <div>
                        {zoomFeaturesOption}
                        {zoomSectionsOption}
                        <div className={viewView}>
                            {viewModeViewOption}
                        </div>
                        <div className={viewEdit}>
                            {viewModeEditOption}
                        </div>
                    </div>;

                break;
            default:
                options =
                    <div>
                        {zoomFeaturesOption}
                        {zoomSectionsOption}
                    </div>;
        }

        return(
            <div className="design-editor-header">
                <Grid>
                    <Row>
                        <Col md={6}>
                            <div className="header-description">{description}</div>
                        </Col>
                        <Col md={6}>
                            <div className="details-menu-bar">{options}</div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

DesignEditorHeader.propTypes = {
    view:               PropTypes.string.isRequired,
    mode:               PropTypes.string.isRequired,
    userContext:        PropTypes.object.isRequired,
    userViewOptions:    PropTypes.object.isRequired
};
