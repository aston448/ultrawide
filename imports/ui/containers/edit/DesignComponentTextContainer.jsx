// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DetailsItem          from '../../components/edit/DetailsItem.jsx';
import DetailsViewHeader    from '../../components/common/DetailsViewHeader.jsx';
import DetailsViewFooter    from '../../components/common/DetailsViewFooter.jsx';

// Ultrawide Services
import { ViewType, ComponentType, DetailsViewType, DisplayContext, UpdateMergeStatus, DetailsType, LogLevel } from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import { log } from '../../../common/utils.js'

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Text Editor Container - gets data for the text sections and Scenario Steps for Design Version Edit / View
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignComponentText extends Component {
    constructor(props) {
        super(props);

    }

    render(){

        const {currentDesignComponent, displayContext, view, mode, userContext, userRole, userViewOptions, viewDataValue} = this.props;


        let details = <div></div>;

        let textTitle = '';

        let detailsClosable = true;
        let designItem = currentDesignComponent;

        if(currentDesignComponent){

            textTitle = TextLookups.componentTypeName(designItem.componentType) + ' - ' + 'DETAILS';

            const nameItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_NAME}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const textItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_TEXT}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const newNameItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_NAME_NEW}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const oldNameItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_NAME_OLD}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const newTextItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_TEXT_NEW}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const oldTextItem =
                <DetailsItem
                    itemType={DetailsType.DETAILS_TEXT_OLD}
                    item={designItem}
                    displayContext={displayContext}
                />;

            const divider =
                <div className="new-old-divider"></div>

            switch(view)
            {
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                    details =
                        <div>
                            {nameItem}
                            {divider}
                            {textItem}
                        </div>;
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:
                    if(displayContext === DisplayContext.UPDATE_SCOPE){
                        if(designItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED){
                            details =
                                <div>
                                    {newNameItem}
                                    {oldNameItem}
                                    {divider}
                                    {newTextItem}
                                    {oldTextItem}

                                </div>;
                        } else {
                            if(designItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED){
                                details =
                                    <div>
                                        {nameItem}
                                        {divider}
                                        {newTextItem}
                                        {oldTextItem}
                                    </div>;
                            } else {
                                details =
                                    <div>
                                        {nameItem}
                                        {divider}
                                        {textItem}
                                    </div>;
                            }
                        }
                    } else {
                        if (designItem.isChanged) {
                            if (designItem.isTextChanged) {
                                details =
                                    <div>
                                        {newNameItem}
                                        {oldNameItem}
                                        {divider}
                                        {newTextItem}
                                        {oldTextItem}

                                    </div>;
                            } else {
                                details =
                                    <div>
                                        {newNameItem}
                                        {oldNameItem}
                                        {divider}
                                        {textItem}
                                    </div>;
                            }
                        } else {
                            if (designItem.isTextChanged) {
                                details =
                                    <div>
                                        {nameItem}
                                        {divider}
                                        {newTextItem}
                                        {oldTextItem}
                                    </div>;
                            } else {
                                details =
                                    <div>
                                        {nameItem}
                                        {divider}
                                        {textItem}
                                    </div>;
                            }
                        }
                    }
                    break;
                case ViewType.DESIGN_UPDATABLE_VIEW:

                    if(designItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED){
                            details =
                                <div>
                                    {newNameItem}
                                    {oldNameItem}
                                    {divider}
                                    {newTextItem}
                                    {oldTextItem}

                                </div>;
                    } else {
                        if(designItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED){
                            details =
                                <div>
                                    {nameItem}
                                    {divider}
                                    {newTextItem}
                                    {oldTextItem}
                                </div>;
                        } else {
                            details =
                                <div>
                                    {nameItem}
                                    {divider}
                                    {textItem}
                                </div>;
                        }
                    }
                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Invalid view type: {}", view);

            }

            // In a few cases the Details item is not closable
            if(view === ViewType.WORK_PACKAGE_BASE_VIEW || view === ViewType.WORK_PACKAGE_UPDATE_VIEW){
                detailsClosable = false;
            }

            return (

                <div className="design-editor-container">
                    <DetailsViewHeader
                        detailsType={DetailsViewType.VIEW_DETAILS_NEW}
                        isClosable={detailsClosable}
                        titleText={textTitle}
                    />
                    <div className="details-editor">
                        {details}
                    </div>
                    <DetailsViewFooter
                        detailsType={DetailsViewType.VIEW_DETAILS_NEW}
                        actionsVisible={true}
                    />
                </div>
            )

        } else {

            return (
                <div className="design-editor-container">
                    <DetailsViewHeader
                        detailsType={DetailsViewType.VIEW_DETAILS_NEW}
                        titleText={'No Details'}
                        isClosable={detailsClosable}
                    />
                    <div className="details-editor">
                        <div className="design-item-note">Select a component</div>
                    </div>
                    <DetailsViewFooter
                        detailsType={DetailsViewType.VIEW_DETAILS_NEW}
                        actionsVisible={false}
                    />
                </div>
            )
        }

    }
}

DesignComponentText.propTypes = {
    currentDesignComponent: PropTypes.object,
    //currentUpdateComponent: PropTypes.object,
    displayContext: PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        userViewOptions:        state.currentUserViewOptions,
        viewDataValue:          state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignComponentText = connect(mapStateToProps)(DesignComponentText);


export default DesignComponentTextContainer = createContainer(({params}) => {

    // Get the various bits of text we need for the design component context.  Will include Scenario Steps for Scenarios
    return ClientContainerServices.getTextDataForDesignComponent(params.currentContext, params.view, params.displayContext);


}, DesignComponentText);