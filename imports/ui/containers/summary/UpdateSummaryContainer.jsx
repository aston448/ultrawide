// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UpdateSummaryHeader          from '../../components/summary/UpdateSummaryHeader.jsx';
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {DisplayContext, LogLevel} from '../../../constants/constants.js';

import ClientDesignUpdateSummary    from '../../../apiClient/apiClientDesignUpdateSummary.js';
import ClientUserSettingsServices   from '../../../apiClient/apiClientUserSettings.js';

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
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
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

        const {addOrgHeaders, addFncHeaders, removeHeaders, changeHeaders, moveHeaders, queryHeaders, displayContext, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Update Summary');

        // Get correct window height
        const editorClass = this.getEditorClass();

        let orgAdditions = <div></div>;
        if(addOrgHeaders.length > 0){
            orgAdditions =
                <div id="orgSummaryAdditions" className="update-summary-change-container">
                    <div className="update-summary-change-header change-add">Organisational Additions</div>
                    <div className="scroll-col">
                        {this.renderChanges(addOrgHeaders)}
                    </div>
                </div>;
        }

        let fncAdditions = <div></div>;
        if(addFncHeaders.length > 0){
            fncAdditions =
                <div id="fncSummaryAdditions" className="update-summary-change-container">
                    <div className="update-summary-change-header change-add">Functional Additions</div>
                    <div className="scroll-col">
                        {this.renderChanges(addFncHeaders)}
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
                <div id="summaryMoves" className="update-summary-change-container">
                    <div className="update-summary-change-header change-modify">Moves</div>
                    <div className="scroll-col">
                        {this.renderChanges(moveHeaders)}
                    </div>
                </div>;
        }

        let queries = <div></div>;
        if(queryHeaders.length > 0){
            queries =
                <div id="summaryQueries" className="update-summary-change-container">
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
                        displayContext={displayContext}
                    />
                    <div className={editorClass}>
                        {orgAdditions}
                        {fncAdditions}
                        {changes}
                        {moves}
                        {queries}
                        {removals}
                    </div>
                    <DesignEditorFooter
                        displayContext={displayContext}
                        hasDesignSummary={false}
                    />
                </div>
            )

        } else {

            return(
                <div id="noSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={displayContext}
                    />
                    <div className={editorClass}>
                        <div className="design-item-note">No update selected</div>
                    </div>
                    <DesignEditorFooter
                        displayContext={displayContext}
                        hasDesignSummary={false}
                    />
                </div>
            )
        }
    }

}

DesignUpdateSummaryList.propTypes = {
    addOrgHeaders:  PropTypes.array.isRequired,
    addFncHeaders:  PropTypes.array.isRequired,
    removeHeaders:  PropTypes.array.isRequired,
    changeHeaders:  PropTypes.array.isRequired,
    moveHeaders:    PropTypes.array.isRequired,
    queryHeaders:   PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default DesignUpdateSummaryContainer = createContainer(({params}) => {

    if(params.displayContext === DisplayContext.WP_SUMMARY){
        // Show summary for current WP only
        return ClientDesignUpdateSummary.getDesignUpdateSummaryHeadersForWp(params.userContext)
    } else {
        // Summary for whole update
        return ClientDesignUpdateSummary.getDesignUpdateSummaryHeaders(params.userContext);
    }

}, connect(mapStateToProps)(DesignUpdateSummaryList));