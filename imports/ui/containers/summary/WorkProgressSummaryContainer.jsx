// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkProgressItem             from '../../components/summary/WorkProgressItem.jsx';
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';

// Ultrawide Services
import {DisplayContext} from '../../../constants/constants.js';

import ClientDesignUpdateSummary    from '../../../apiClient/apiClientDesignUpdateSummary.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';
import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Progress Summary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class WorkProgressSummaryList extends Component {

    constructor(props) {
        super(props);

    }

    getEditorClass(){
        return ClientUserContextServices.getWindowSizeClass();
    }

    // A list of Feature Aspects in a Feature
    renderProgress(progressData, userRoles) {

        if(progressData) {

            return progressData.map((progressItem) => {
                return(
                    <WorkProgressItem
                        key={progressItem._id}
                        item={progressItem}
                        userRoles={userRoles}
                    />
                )
            });
        } else {
            return(<div>No progress data</div>);
        }
    }

    render() {

        const {dvItem, dvWorkPackages, dvDesignUpdates, userRoles, userContext} = this.props;

        // Get correct window height
        const editorClass = this.getEditorClass();

        let dvItemSummary = <div></div>;
        if(dvItem){
            dvItemSummary =
                <WorkProgressItem
                    item={dvItem}
                    userRoles={userRoles}
                />
        }

        let progressItems = <div></div>;
        if(dvWorkPackages.length > 0){
            progressItems =
                <div>
                    {this.renderProgress(dvWorkPackages, userRoles)}
                </div>

        } else {
            if(dvDesignUpdates.length > 0){
                progressItems =
                    <div>
                        {this.renderProgress(dvDesignUpdates, userRoles)}
                    </div>
            }
        }


        if(userContext.designVersion !== 'NONE') {

            return (
                <div id="progressSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                    />
                    <div className={editorClass}>
                        {dvItemSummary}
                        {progressItems}
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            );

        } else {

            return(
                <div id="noSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                    />
                    <div className={editorClass}>
                        <div className="design-item-note">No Design Version selected</div>
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            )
        }
    }

}

WorkProgressSummaryList.propTypes = {
    dvItem:             PropTypes.object,
    dvWorkPackages:     PropTypes.array.isRequired,
    dvDesignUpdates:    PropTypes.array.isRequired,
    userRoles:          PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default WorkProgressSummaryContainer = createContainer(({params}) => {

   return ClientContainerServices.getWorkProgressDvItems(params.userContext);

}, connect(mapStateToProps)(WorkProgressSummaryList));