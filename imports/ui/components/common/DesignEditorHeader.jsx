// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, ViewType, ViewMode} from '../../../constants/constants.js';

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

        let bsStyleEdit = (mode === ViewMode.MODE_EDIT ? 'success': 'default');
        let bsStyleView = (mode === ViewMode.MODE_VIEW ? 'success': 'default');

        let viewModeEditButton =
            <Button id="butEdit" bsSize="xs" bsStyle={bsStyleEdit} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT, view, userViewOptions)}>EDIT</Button>;
        let viewModeViewButton =
            <Button id="butView" bsSize="xs" bsStyle={bsStyleView} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW, view, userViewOptions)}>VIEW</Button>;

        let viewFeatureLevelButton =
            <Button id="butZoomFeatures" bsSize="xs" bsStyle="info" onClick={ () => this.onZoomToFeatures(userContext)}>Features</Button>;
        let viewSectionLevelButton =
            <Button id="butZoomSections" bsSize="xs" bsStyle="info" onClick={ () => this.onZoomToSections(userContext)}>Sections</Button>;


        let description = '';
        let action = '';
        const nameData = this.getNameData(userContext);

        if(mode === ViewMode.MODE_VIEW){
            action = 'VIEW';
        } else {
            action = 'EDIT';
        }

        description = nameData.design + ' - ';

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                action += ' DESIGN VERSION:';
                description += ' ' + nameData.designVersion;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                action += ' DESIGN UPDATE:';
                description += ' ' + nameData.designVersion + ' - ' + nameData.designUpdate;

                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                action += ' WORK PACKAGE:';
                description += ' ' + nameData.designVersion + ' - ' + nameData.workPackage;
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                action += ' UPDATE WORK PACKAGE:';
                description += ' ' + nameData.designVersion + ' - ' + nameData.designUpdate + ' - ' + nameData.workPackage;

        }

        let buttons = '';

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                buttons =
                    <div>
                        <ButtonGroup>
                            {viewModeEditButton}
                            {viewModeViewButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {viewFeatureLevelButton}
                            {viewSectionLevelButton}
                        </ButtonGroup>
                    </div>;
                break;
            default:
                buttons =
                    <ButtonGroup>
                        {viewFeatureLevelButton}
                        {viewSectionLevelButton}
                    </ButtonGroup>;
        }

        return(
            <div className="design-editor-header">
                <Grid>
                    <Row>
                        <Col md={8}>
                            <span className="header-action">{action}</span>
                            <span className="header-description">{description}</span>
                        </Col>
                        <Col md={4}>
                            {buttons}
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
