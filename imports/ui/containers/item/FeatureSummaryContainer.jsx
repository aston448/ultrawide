// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import FeatureSummary           from '../../components/item/FeatureSummary.jsx';
import ItemList                 from '../../components/item/ItemList.jsx';

// Ultrawide Services
import { ClientDataServices }       from '../../../apiClient/apiClientDataServices.js';

import {DisplayContext, HomePageTab, ItemListType, LogLevel} from "../../../constants/constants";
import {log} from "../../../common/utils";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Summary Container - A List of Features in the curently selected Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

export class FeatureSummaryList extends Component {
    constructor(props) {
        super(props);

    }


    renderFeatureList(featureSummaries, displayContext){
        return featureSummaries.map((featureSummary) => {
            return (
                <FeatureSummary
                    key={featureSummary._id}
                    featureSummary={featureSummary}
                    displayContext={displayContext}
                />
            );
        });
    }

    noFeatures(){
        return (
            <div className="design-item-note">No Features</div>
        );
    }

    noDesignVersion(){
        return (
            <div className="design-item-note">Select a Design Version</div>
        );
    }

    render() {

        const {featureSummaries, designVersionName, workPackageName, homePageTab, displayContext, userRole, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Feature Summary');

        let hasFooterAction = false;
        let footerActionFunction = null;
        let bodyDataFunction = null;
        let headerText = '';

        let locationText = designVersionName;
        if(homePageTab === HomePageTab.TAB_WORK){
            locationText = workPackageName;
        }

        if(featureSummaries && featureSummaries.length > 0) {
            bodyDataFunction = () => this.renderFeatureList(featureSummaries, displayContext);
        } else {
            if(userContext.designVersionId === 'NONE'){
                bodyDataFunction = () => this.noDesignVersion();
            } else{
                bodyDataFunction = () => this.noFeatures();
            }
        }

        let itemListType = ItemListType.BACKLOG_ITEM;

        switch(displayContext){

            case DisplayContext.DV_BACKLOG_WORK:

                headerText = 'Features with scenarios not assigned to Work Packages...';
                break;

            case DisplayContext.DV_BACKLOG_NO_EXP:

                headerText = 'Features with scenarios without test expectations...';
                break;

            case DisplayContext.DV_BACKLOG_TEST_MISSING:

                headerText = 'Features with scenarios with missing tests...';
                break;

            case DisplayContext.DV_BACKLOG_TEST_FAIL:

                headerText = 'Features with scenarios with failing tests...';
                break;

            default:

                itemListType = ItemListType.ULTRAWIDE_ITEM;

                if(featureSummaries && featureSummaries.length > 0) {
                    headerText = 'Features in ' + locationText;
                } else {
                    if(userContext.designVersionId === 'NONE'){
                        headerText = 'Features';

                    } else{
                        headerText = 'Features in ' + locationText;
                    }
                }
        }


        return(
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={''}
                footerActionUiContext={''}
                footerActionFunction={footerActionFunction}
                listType={itemListType}
            />
        )

    }
}

FeatureSummaryList.propTypes = {
    featureSummaries:       PropTypes.array.isRequired,
    designVersionName:      PropTypes.string.isRequired,
    workPackageName:        PropTypes.string.isRequired,
    homePageTab:            PropTypes.string.isRequired,
    displayContext:         PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default FeatureSummaryContainer = createContainer(({params}) => {

    //console.log('Feature Summary Container with context ' + params.displayContext);

    // Gets the currently saved user context and a list of known Designs
    const featureSummaries = ClientDataServices.getDesignVersionFeatureSummaries(params.userContext, params.homePageTab, params.displayContext);

    //TODO - link this to new feature summary data
    return {
        featureSummaries: featureSummaries.summaryData,
        designVersionName: featureSummaries.designVersionName,
        workPackageName: featureSummaries.workPackageName,
        homePageTab: featureSummaries.homePageTab,
        displayContext: params.displayContext
    };

}, connect(mapStateToProps)(FeatureSummaryList));