// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import BacklogFeatureContainer      from '../../containers/item/BacklogFeatureContainer';

// Ultrawide Services
import {log} from "../../../common/utils";
import {TextLookups} from '../../../common/lookups.js';
import { DisplayContext, BacklogType, WorkItemType, LogLevel } from '../../../constants/constants.js';

// Bootstrap
import {Badge, Grid, Row, Col}                 from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Project Backlog Item
//
// ---------------------------------------------------------------------------------------------------------------------

export class ProjectBacklogItem extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            isSelectable: false,
        };

    }

    clickHandler(){
        if (typeof this.props.selectionFunction === 'function') {
            this.props.selectionFunction();
        }
    }

    setSelectable(){
        this.setState({isSelectable: true});
    }

    setUnselectable(){
        this.setState({isSelectable: false});
    }

    render(){
        const {backlogType, workItemType, backlogFeatures, scenarioCount, backlogItemTotal, currentBacklogItem} = this.props;

        //console.log('Context: ' + displayContext + ' features: ' + featureCount);
        const featureCount = backlogFeatures.size;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Backlog Item in context {} with {} features', backlogType, featureCount);

        let backlogTitle = TextLookups.backlogType(backlogType);

        let backlogDetails = '';

        let itemClass = 'project-summary-item ';
        let goodClass = 'project-summary-good';
        let badClass = 'project-summary-bad';
        let okClass = 'project-summary-ok';

        if(backlogType === currentBacklogItem){
            itemClass = 'project-summary-item-active '

        } else {
            if(this.state.isSelectable){
                itemClass = 'project-summary-item-selectable '
            }
            goodClass = 'project-summary-good-inactive';
            badClass = 'project-summary-bad-inactive';
            okClass = 'project-summary-ok-inactive';
        }


        switch(backlogType){

            case BacklogType.BACKLOG_DESIGN:

                if(workItemType === WorkItemType.DESIGN_VERSION) {

                    if (featureCount === 0) {
                        backlogDetails = 'No backlog';
                        itemClass = itemClass + goodClass;
                    } else {
                        if (featureCount === 1) {
                            backlogDetails = 'One Feature has no Scenarios defined for it yet.';
                            itemClass = itemClass + badClass;
                        } else {
                            backlogDetails = featureCount + ' Features have no Scenarios defined for them yet.';
                            itemClass = itemClass + badClass;
                        }
                    }
                } else {

                    backlogDetails = 'This backlog is only displayed for the whole Design Version';
                    itemClass = itemClass + okClass;
                }
                break;

            case BacklogType.BACKLOG_SCENARIO_ANOMALY:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has Scenario Design Anomalies.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = 'There are ' + featureCount + ' Features with Scenario Design Anomalies.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case BacklogType.BACKLOG_FEATURE_ANOMALY:

                if(workItemType === WorkItemType.DESIGN_VERSION) {
                    if(featureCount === 0){
                        backlogDetails = 'No backlog';
                        itemClass = itemClass + goodClass;
                    } else {
                        if(featureCount === 1){
                            backlogDetails = 'One Feature has Design Anomalies in the Design Version.';
                            itemClass = itemClass + badClass;
                        } else {
                            backlogDetails = featureCount + ' Features have Feature Design Anomalies.';
                            itemClass = itemClass + badClass;
                        }
                    }
                } else {

                    backlogDetails = 'This backlog is only displayed for the whole Design Version';
                    itemClass = itemClass + okClass;
                }
                break;

            case BacklogType.BACKLOG_WP_ASSIGN:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has Scenarios not assigned to a Work Package.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = featureCount + ' Features have Scenarios not assigned to a Work Package.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case BacklogType.BACKLOG_TEST_EXP:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has Scenarios with no Test Expectations.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = featureCount + ' Features have Scenarios with no Test Expectations.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case BacklogType.BACKLOG_TEST_MISSING:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has Scenarios with missing tests.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = featureCount + ' Features have Scenarios with missing tests.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case BacklogType.BACKLOG_TEST_FAIL:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has Scenarios with failing tests.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = featureCount + ' Features have Scenarios with failing tests.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;


        }

        const backlogTotal =
            <div>
                <Badge>{backlogItemTotal}</Badge>
            </div>;

        const backlogHeader =
            <Row className = "backlog-title">
                <Col md={1} className="close-col">
                    {backlogTotal}
                </Col>
                <Col md={6} className="close-col">
                    {backlogTitle}
                </Col>
                <Col md={5} className="close-col backlog-details">
                    {backlogDetails}
                </Col>
            </Row>;

        const backlogBody =
            <Row>
                <BacklogFeatureContainer params={
                    {
                        backlogFeatures: backlogFeatures
                    }
                }/>
            </Row>;

        const layoutNotSelected =
            <Grid>
                {backlogHeader}
            </Grid>;

        const layoutSelected =
            <Grid>
                {backlogHeader}
                {backlogBody}
            </Grid>;

        let layout = layoutNotSelected;

        if(backlogType === currentBacklogItem){
            layout = layoutSelected;
        }

        return(
            <div
                onMouseEnter={ () => this.setSelectable()}
                onMouseLeave={ () => this.setUnselectable()}
                onClick={() => this.clickHandler()}
                className={itemClass}
            >
                {layout}
            </div>
        );

    }
}


ProjectBacklogItem.propTypes = {
    backlogType: PropTypes.string.isRequired,
    workItemType: PropTypes.string.isRequired,
    backlogFeatures: PropTypes.object.isRequired,
    backlogItemTotal: PropTypes.number.isRequired,
    selectionFunction: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        currentBacklogItem: state.currentUserBacklogItem
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ProjectBacklogItem);



