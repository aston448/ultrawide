// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import BacklogFeature           from '../../components/item/BacklogFeature.jsx';
import ItemList                 from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {ItemListType, LogLevel} from "../../../constants/constants";
import {log} from "../../../common/utils";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Backlog Feature Container - A List of Features relevant to a DV Backlog
//
// ---------------------------------------------------------------------------------------------------------------------

export class BacklogFeatureList extends Component {
    constructor(props) {
        super(props);

    }


    renderFeatureList(backlogFeatures){

        return backlogFeatures.map((featureSummary) => {

            return (
                <BacklogFeature
                    key={featureSummary.id}
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

        const {backlogFeatures, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Backlog Features');

        let hasFooterAction = false;
        let footerActionFunction = null;
        let bodyDataFunction = null;
        let headerText = '';


        if(backlogFeatures && backlogFeatures.length > 0) {
            bodyDataFunction = () => this.renderFeatureList(backlogFeatures);
        } else {
            if(userContext.designVersionId === 'NONE'){
                bodyDataFunction = () => this.noDesignVersion();
            } else{
                bodyDataFunction = () => this.noFeatures();
            }
        }

        let itemListType = ItemListType.BACKLOG_ITEM;

        return(
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={''}
                footerActionUiContext={''}
                footerActionFunction={footerActionFunction}
                footerText={''}
                listType={itemListType}
            />
        )

    }
}

BacklogFeatureList.propTypes = {
    backlogFeatures:             PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default BacklogFeatureContainer = createContainer(({params}) => {

    if(params.backlogFeatures && params.backlogFeatures.size > 0) {
        return {backlogFeatures: Array.from(params.backlogFeatures.values())};
    } else {
        return [];
    }

}, connect(mapStateToProps)(BacklogFeatureList));