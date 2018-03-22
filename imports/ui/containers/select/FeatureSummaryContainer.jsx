// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import FeatureSummary           from '../../components/select/FeatureSummary.jsx';
import ItemList                 from '../../components/select/ItemList.jsx';

// Ultrawide Services
import ClientDataServices       from '../../../apiClient/apiClientDataServices.js';

import {DisplayContext, HomePageTab, LogLevel} from "../../../constants/constants";
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

export class FeaturesList extends Component {
    constructor(props) {
        super(props);

    }


    renderFeatureList(featureSummaries){
        return featureSummaries.map((featureSummary) => {
            return (
                <FeatureSummary
                    key={featureSummary._id}
                    featureSummary={featureSummary}
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
            bodyDataFunction = () => this.renderFeatureList(featureSummaries);
        } else {
            if(userContext.designVersionId === 'NONE'){
                bodyDataFunction = () => this.noDesignVersion();
            } else{
                bodyDataFunction = () => this.noFeatures();
            }
        }

        switch(displayContext){

            case DisplayContext.PROJECT_SUMMARY_NONE:

                headerText = 'Features with no test requirements...';
                break;

            case DisplayContext.PROJECT_SUMMARY_MISSING:

                headerText = 'Features with scenarios without test requirements...';
                break;

            case DisplayContext.PROJECT_SUMMARY_FAIL:

                headerText = 'Features with failing tests...';
                break;

            case DisplayContext.PROJECT_SUMMARY_SOME:

                headerText = 'Features with some tests passing...';
                break;

            case DisplayContext.PROJECT_SUMMARY_ALL:

                headerText = 'Features with all required tests passing...';
                break;

            default:

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
            />
        )

    }
}

FeaturesList.propTypes = {
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
    return ClientDataServices.getDesignVersionFeatureSummaries(params.userContext, params.homePageTab, params.displayContext);

}, connect(mapStateToProps)(FeaturesList));