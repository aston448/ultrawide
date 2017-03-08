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
                <Panel id="summaryAdditions" className="panel-small panel-small-body" header="Functional Additions">
                    {this.renderChanges(functionalAdditions)}
                </Panel>;
        }

        let removals = <div></div>;
        if(functionalRemovals.length > 0){
            removals =
                <Panel id="summaryRemovals" className="panel-small panel-small-body" header="Functional Removals">
                    {this.renderChanges(functionalRemovals)}
                </Panel>;
        }

        let changes = <div></div>;
        if(functionalChanges.length > 0){
            changes =
                <Panel id="summaryChanges" className="panel-small panel-small-body" header="Functional Changes">
                    {this.renderChanges(functionalChanges)}
                </Panel>;
        }


        if(userContext.designUpdateId != 'NONE') {

            return (
                <Panel id="updateSummary" header={'Design Update Summary for ' + designUpdateName}>
                    <Grid>
                        <Row>
                            <Col md={12} className="scroll-col">
                                <Grid className="close-grid">
                                    <Row>
                                        <Col md={12} className="col">
                                            {additions}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="col">
                                            {removals}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="col">
                                            {changes}
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Grid>
                </Panel>
            );
        } else {
            return(
                <Panel id="noSummary" header="Design Update Summary">
                    <div className="design-item-note">No update selected</div>
                </Panel>
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