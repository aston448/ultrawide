// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import UpdateSummaryItem from '../../components/select/UpdateSummaryItem.jsx';

// Ultrawide Services
import {DesignVersionStatus} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDesignUpdateSummary from '../../../apiClient/apiClientDesignUpdateSummary.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

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

    // A list of Feature Aspects in a Feature
    renderChanges(changeData) {


        if(changeData) {
            //console.log("Rendering functional Additions");
            return changeData.map((changeItem) => {
                return(
                    <UpdateSummaryItem
                        key={changeItem._id}
                        updateSummaryData={changeItem}
                    />
                )
            });
        } else {
            return(<div></div>);
        }
    }

    render() {

        const {functionalAdditions, functionalRemovals, functionalChanges, designUpdateName, userContext} = this.props;

        let additions = <div></div>;
        if(functionalAdditions.length > 0){
            additions =
                <div id="summaryAdditions" className="update-summary-change-container">
                    <div className="update-summary-change-header change-add">Functional Additions</div>
                    <div className="scroll-col">
                        {this.renderChanges(functionalAdditions)}
                    </div>
                </div>;
        }

        let removals = <div></div>;
        if(functionalRemovals.length > 0){
            removals =
                <div id="summaryRemovals" className="update-summary-change-container">
                    <div className="update-summary-change-header change-remove">Functional Removals</div>
                    <div className="scroll-col">
                        {this.renderChanges(functionalRemovals)}
                    </div>
                </div>;
        }

        let changes = <div></div>;
        if(functionalChanges.length > 0){
            changes =
                <div id="summaryChanges" className="update-summary-change-container">
                    <div className="update-summary-change-header change-modify">Functional Changes</div>
                    <div className="scroll-col">
                        {this.renderChanges(functionalChanges)}
                    </div>
                </div>;
        }


        if(userContext.designUpdateId != 'NONE') {

            return (
                <div id="updateSummary" className="update-summary-container">
                    <div className="update-summary-header">{'Design Update Summary for ' + designUpdateName}</div>
                    <div className="scroll-col">
                        {additions}
                        {removals}
                        {changes}
                    </div>
                </div>
            );

        } else {

            return(
                <div id="noSummary" className="update-summary-container">
                    <div className="update-summary-header">Design Update Summary</div>
                    <div className="scroll-col">
                        <div className="design-item-note">No update selected</div>
                    </div>
                </div>
            )
        }
    }

}

DesignUpdateSummaryList.propTypes = {
    functionalAdditions: PropTypes.array.isRequired,
    functionalRemovals: PropTypes.array.isRequired,
    functionalChanges: PropTypes.array.isRequired,
    designUpdateName: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default DesignUpdateSummaryContainer = createContainer(({params}) => {

    return ClientDesignUpdateSummary.getDesignUpdateSummaryData(params.designUpdateId);

}, connect(mapStateToProps)(DesignUpdateSummaryList));