// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {TextLookups} from '../../../common/lookups.js';
import { DisplayContext, LogLevel } from '../../../constants/constants.js';

// Bootstrap
import {InputGroup, Grid, Row, Col}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';

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
        const {displayContext, totalFeatureCount, featureCount, scenarioCount, testCount, currentBacklogItem} = this.props;

        //console.log('Context: ' + displayContext + ' features: ' + featureCount);

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Backlog Item in context {} with {} features', displayContext, featureCount);

        const backlogTitle = TextLookups.displayContext(displayContext);
        let backlogDetails = '';

        let icon = '';
        let iconClass = 'project-summary-item-icon ';
        let itemClass = 'project-summary-item ';
        let goodClass = 'project-summary-good';
        let badClass = 'project-summary-bad';
        let okClass = 'project-summary-ok';

        if(displayContext === currentBacklogItem){
            itemClass = 'project-summary-item-active '

        } else {
            if(this.state.isSelectable){
                itemClass = 'project-summary-item-selectable '
            }
            goodClass = 'project-summary-good-inactive';
            badClass = 'project-summary-bad-inactive';
            okClass = 'project-summary-ok-inactive';
        }
        let statusClass = '';



        switch(displayContext){

            case DisplayContext.DV_BACKLOG_DESIGN:

                if(featureCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(featureCount === 1){
                        backlogDetails = 'One Feature has no Scenarios defined for it yet.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = featureCount + ' Features have no Scenarios defined for them yet.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case DisplayContext.DV_BACKLOG_NO_EXP:

                if(scenarioCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(scenarioCount === 1){
                        backlogDetails = 'One Scenario has no Test Expectations.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = scenarioCount + ' Scenarios have no Test Expectations.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case DisplayContext.DV_BACKLOG_TEST_MISSING:

                if(scenarioCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(scenarioCount === 1){
                        backlogDetails = 'One Scenario has missing tests.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = scenarioCount + ' Scenarios have missing tests.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;

            case DisplayContext.DV_BACKLOG_TEST_FAIL:

                if(scenarioCount === 0){
                    backlogDetails = 'No backlog';
                    itemClass = itemClass + goodClass;
                } else {
                    if(scenarioCount === 1){
                        backlogDetails = 'One Scenario has failing tests.';
                        itemClass = itemClass + badClass;
                    } else {
                        backlogDetails = scenarioCount + ' Scenarios have failing tests.';
                        itemClass = itemClass + badClass;
                    }
                }
                break;


        }

        const layoutInactive =
            <Grid>
                <Row className = "backlog-title">
                    <Col md={10}>
                        {backlogTitle}
                    </Col>
                    <Col md={2}>

                    </Col>
                </Row>
                <Row className = "backlog-details">
                    <Col md={10}>
                        {backlogDetails}
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
            </Grid>;


        const layoutActive =
            <Grid>
                <Row className = "backlog-title">
                    <Col md={11}>
                        {backlogTitle}
                    </Col>
                    <Col md={1}>
                        <div className="summary-hand"><Glyphicon glyph="hand-right"/></div>
                    </Col>
                </Row>
                <Row className = "backlog-details">
                    <Col md={11}>
                        {backlogDetails}
                    </Col>
                    <Col md={1}>
                    </Col>
                </Row>
            </Grid>;


        let layout = layoutInactive;

        if(displayContext === currentBacklogItem){
            layout = layoutActive;
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
    displayContext: PropTypes.string.isRequired,
    totalFeatureCount: PropTypes.number.isRequired,
    featureCount: PropTypes.number.isRequired,
    scenarioCount: PropTypes.number.isRequired,
    testCount: PropTypes.number.isRequired,
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



