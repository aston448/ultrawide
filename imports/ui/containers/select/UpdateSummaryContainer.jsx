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


// Work selection screen
class DesignUpdateSummaryList extends Component {

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

        const {functionalAdditions, functionalRemovals, functionalChanges, userContext} = this.props;

        if(userContext.designUpdateId != 'NONE') {

            return (
                <Panel header="Design Update Summary">
                    <Grid>
                        <Row>
                            <Col md={12} className="col">
                                <Panel className="panel-small panel-small-body" header="Functional Additions">
                                    {this.renderChanges(functionalAdditions)}
                                </Panel>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="col">
                                <Panel className="panel-small panel-small-body" header="Functional Removals">
                                    {this.renderChanges(functionalRemovals)}
                                </Panel>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="col">
                                <Panel className="panel-small panel-small-body" header="Functional Changes">
                                    {this.renderChanges(functionalChanges)}
                                </Panel>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="col">
                                <Panel className="panel-small panel-small-body" header="Non-Functional Changes">
                                    {this.renderChanges(functionalChanges)}
                                </Panel>
                            </Col>
                        </Row>
                    </Grid>
                </Panel>

            );
        } else {
            return(
                <Panel header="Design Update Summary">
                    <div className="design-item-note">No update selected</div>
                </Panel>
            )
        }
    }

}

DesignUpdateSummaryList.propTypes = {
    functionalAdditions: PropTypes.array.isRequired,
    functionalRemovals: PropTypes.array.isRequired,
    functionalChanges: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignUpdateSummaryList = connect(mapStateToProps)(DesignUpdateSummaryList);


export default DesignUpdateSummaryContainer = createContainer(({params}) => {

    return ClientDesignUpdateSummary.getDesignUpdateSummary(params.designUpdateId);

}, DesignUpdateSummaryList);