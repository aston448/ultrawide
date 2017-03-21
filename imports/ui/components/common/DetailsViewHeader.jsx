// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';

// Ultrawide Services
import {MenuType, ViewOptionType, ViewType, ViewMode, DetailsViewType} from '../../../constants/constants.js';

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
// Details View Header
//
// ---------------------------------------------------------------------------------------------------------------------

export default class DetailsViewHeader extends Component {
    constructor(props) {
        super(props);

    }

    onExportIntTests(){

    }

    onClose(detailsType, view, userContext, userRole, userViewOptions, currentViewDataValue){

        let viewOptionType = '';

        switch(detailsType){
            case DetailsViewType.VIEW_DOM_DICT:
                switch(view){
                    case ViewType.DESIGN_NEW_EDIT:
                    case ViewType.DESIGN_PUBLISHED_VIEW:
                    case ViewType.DESIGN_UPDATABLE_VIEW:
                        viewOptionType = ViewOptionType.DESIGN_DICT;
                        break;
                }
                break;
            case DetailsViewType.VIEW_DETAILS_NEW:
                switch(view){
                    case ViewType.DESIGN_NEW_EDIT:
                    case ViewType.DESIGN_PUBLISHED_VIEW:
                    case ViewType.DESIGN_UPDATABLE_VIEW:
                        viewOptionType = ViewOptionType.DESIGN_DETAILS;
                        break;
                }
                break;
            case DetailsViewType.VIEW_INT_TESTS:
                break;
        }

        ClientAppHeaderServices.toggleViewOption(view, userContext, userRole, viewOptionType, userViewOptions, currentViewDataValue, false, null)
    }

    getNameData(userContext){
        return ClientUserContextServices.getContextNameData(userContext);
    }


    render() {

        const {detailsType, actionsVisible, titleText, view, mode, userContext, userRole, userViewOptions, currentViewDataValue} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        let menuOptions = '';

        const closeOption =
            <UltrawideMenuItem
                menuType={MenuType.MENU_EDITOR}
                itemName="Close"
                actionFunction={() => this.onClose(detailsType, view, userContext, userRole, userViewOptions, currentViewDataValue)}
            />;

        const exportIntOption =
            <UltrawideMenuItem
                menuType={MenuType.MENU_EDITOR}
                itemName="Export"
                actionFunction={ () => this.onExportIntTests()}
            />;


        // Which menu options should be visible
        switch(detailsType){
            case DetailsViewType.VIEW_INT_TESTS:
                if(actionsVisible) {
                    menuOptions =
                        <div>
                            {exportIntOption}
                        </div>;
                }
                break;
            case DetailsViewType.VIEW_DOM_DICT:
            case DetailsViewType.VIEW_DETAILS_NEW:
                menuOptions =
                    <div>
                        {closeOption}
                    </div>;
                    break;
        }

        if(actionsVisible){
            return(
                <div className="design-editor-header">
                    <Grid>
                        <Row>
                            <Col md={8}>
                                <div className="header-description">{titleText}</div>
                            </Col>
                            <Col md={4}>
                                <div className="details-menu-bar">{menuOptions}</div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        } else {
            return(
                <div className="design-editor-header">
                    <Grid>
                        <Row>
                            <Col md={12}>
                                <div className="header-description">{titleText}</div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }

    }
}

DetailsViewHeader.propTypes = {
    detailsType:            PropTypes.string.isRequired,
    actionsVisible:         PropTypes.bool.isRequired,
    titleText:              PropTypes.string.isRequired,
    view:                   PropTypes.string.isRequired,
    mode:                   PropTypes.string.isRequired,
    userContext:            PropTypes.object.isRequired,
    userRole:               PropTypes.string.isRequired,
    userViewOptions:        PropTypes.object,
    currentViewDataValue:   PropTypes.bool

};
