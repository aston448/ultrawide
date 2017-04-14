// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UpdateSummaryHeader          from '../../components/summary/UpdateSummaryHeader.jsx';
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';

// Ultrawide Services
import {DisplayContext} from '../../../constants/constants.js';

import ClientDesignUpdateSummary    from '../../../apiClient/apiClientDesignUpdateSummary.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Summary Data Container - gets a list of changes that make up a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class DesignUpdateSummaryList extends Component {

    constructor(props) {
        super(props);

    }

    getEditorClass(){
        return ClientUserContextServices.getWindowSizeClass();
    }

    // A list of Feature Aspects in a Feature
    renderChanges(changeData) {

        if(changeData) {

            return changeData.map((changeHeader) => {
                return(
                    <UpdateSummaryHeader
                        key={changeHeader._id}
                        headerItem={changeHeader}
                    />
                )
            });
        } else {
            return(<div>No summary data</div>);
        }
    }

    render() {

        const {addHeaders, removeHeaders, changeHeaders, moveHeaders, queryHeaders, userContext} = this.props;

        //console.log("Rendering Update Summary with " + addHeaders.length + " additions and " + changeHeaders.length + " changes");

        // Get correct window height
        const editorClass = this.getEditorClass();

        let additions = <div></div>;
        if(addHeaders.length > 0){
            additions =
                <div id="summaryAdditions" className="update-summary-change-container">
                    <div className="update-summary-change-header change-add">Additions</div>
                    <div className="scroll-col">
                        {this.renderChanges(addHeaders)}
                    </div>
                </div>;
        }

        let removals = <div></div>;
        if(removeHeaders.length > 0){
            removals =
                <div id="summaryRemovals" className="update-summary-change-container">
                    <div className="update-summary-change-header change-remove">Removals</div>
                    <div className="scroll-col">
                        {this.renderChanges(removeHeaders)}
                    </div>
                </div>;
        }

        let changes = <div></div>;
        if(changeHeaders.length > 0){
            changes =
                <div id="summaryChanges" className="update-summary-change-container">
                    <div className="update-summary-change-header change-modify">Changes</div>
                    <div className="scroll-col">
                        {this.renderChanges(changeHeaders)}
                    </div>
                </div>;
        }

        let moves = <div></div>;
        if(moveHeaders.length > 0){
            moves =
                <div id="summaryChanges" className="update-summary-change-container">
                    <div className="update-summary-change-header change-modify">Moves</div>
                    <div className="scroll-col">
                        {this.renderChanges(moveHeaders)}
                    </div>
                </div>;
        }

        let queries = <div></div>;
        if(queryHeaders.length > 0){
            queries =
                <div id="summaryChanges" className="update-summary-change-container">
                    <div className="update-summary-change-header change-modify">Test Checks</div>
                    <div className="scroll-col">
                        {this.renderChanges(queryHeaders)}
                    </div>
                </div>;
        }

        if(userContext.designUpdateId !== 'NONE') {

            return (
                <div id="updateSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.UPDATE_SUMMARY}
                    />
                    <div className={editorClass}>
                        {additions}
                        {removals}
                        {changes}
                        {moves}
                        {queries}
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.UPDATE_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            );

        } else {

            return(
                <div id="noSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.UPDATE_SUMMARY}
                    />
                    <div className={editorClass}>
                        <div className="design-item-note">No update selected</div>
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.UPDATE_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            )
        }
    }

}

DesignUpdateSummaryList.propTypes = {
    addHeaders:     PropTypes.array.isRequired,
    removeHeaders:  PropTypes.array.isRequired,
    changeHeaders:  PropTypes.array.isRequired,
    moveHeaders:    PropTypes.array.isRequired,
    queryHeaders:   PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default DesignUpdateSummaryContainer = createContainer(({params}) => {

    return ClientDesignUpdateSummary.getDesignUpdateSummaryHeaders(params.designUpdateId);

}, connect(mapStateToProps)(DesignUpdateSummaryList));