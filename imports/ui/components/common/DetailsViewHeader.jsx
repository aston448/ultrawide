// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {MenuType, ViewOptionType, ViewType, ViewMode, DetailsViewType} from '../../../constants/constants.js';

import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Details View Header
//
// ---------------------------------------------------------------------------------------------------------------------

export class DetailsViewHeader extends Component {
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
                viewOptionType = ViewOptionType.DEV_INT_TESTS;
                break;

            case DetailsViewType.VIEW_UNIT_TESTS:
                viewOptionType = ViewOptionType.DEV_UNIT_TESTS;
                break;
        }

        console.log("Closing " + viewOptionType);

        if(userViewOptions[viewOptionType]) {
            console.log("Really Closing " + viewOptionType);
            ClientAppHeaderServices.toggleViewOption(view, userContext, userRole, viewOptionType, userViewOptions, currentViewDataValue, false, null)
        }
    }

    getNameData(userContext){
        return ClientUserContextServices.getContextNameData(userContext);
    }


    render() {

        const {detailsType, isClosable, titleText, view, mode, userContext, userRole, userViewOptions, currentViewDataValue} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        if(isClosable){
            return(
                <div className="design-editor-header">
                    <Grid>
                        <Row>
                            <Col md={11} className="close-col">
                                <div className="header-description">{titleText}</div>
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
            return(
                <div className="design-editor-header">
                    <Grid>
                        <Row>
                            <Col md={12} className="close-col">
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
    isClosable:             PropTypes.bool.isRequired,
    titleText:              PropTypes.string.isRequired,
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
export default connect(mapStateToProps)(DetailsViewHeader);

