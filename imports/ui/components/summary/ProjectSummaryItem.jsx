// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
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
// Project Summary Item
//
// ---------------------------------------------------------------------------------------------------------------------

export class ProjectSummaryItem extends Component{

    constructor(...args){
        super(...args);

        this.state = {

        };

    }

    clickHandler(){
        if (typeof this.props.selectionFunction === 'function') {
            this.props.selectionFunction();
        }
    }

    render(){
        const {displayContext, featureCount, totalFeatureCount, testsCount, currentSummaryItem} = this.props;

        console.log('Context: ' + displayContext + ' features: ' + featureCount);

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Project Summary Item in context {} with {} features', displayContext, featureCount);

        let contextText = '';
        let icon = '';
        let iconClass = 'project-summary-item-icon ';
        let itemClass = 'project-summary-item ';
        let goodClass = 'project-summary-good';
        let badClass = 'project-summary-bad';
        let okClass = 'project-summary-ok';

        if(displayContext === currentSummaryItem){
            itemClass = 'project-summary-item-active '


        } else {
            goodClass = 'project-summary-good-inactive';
            badClass = 'project-summary-bad-inactive';
            okClass = 'project-summary-ok-inactive';
        }
        let statusClass = '';

        switch(displayContext){

            case DisplayContext.PROJECT_SUMMARY_NONE:

                if(featureCount > 0){
                    contextText = featureCount + ' features have scenarios with no test requirements!';
                    statusClass = badClass;
                } else {
                    if(totalFeatureCount === 0){
                        contextText = 'NO FEATURES YET';
                        statusClass = okClass;
                    } else {
                        if (featureCount === totalFeatureCount) {
                            contextText = 'All features have tests required for all scenarios - good start...';
                            statusClass = goodClass;
                        } else {
                            contextText = totalFeatureCount + ' features. NO TEST DATA YET';
                            statusClass = okClass;
                        }
                    }
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="ban-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_MISSING:

                if(featureCount > 0){
                    contextText = featureCount + ' features have scenarios with required tests missing!';
                    statusClass = badClass;
                } else {
                    if(totalFeatureCount === 0){
                        contextText = 'NO FEATURES YET';
                        statusClass = okClass;
                    } else {
                        if (featureCount === totalFeatureCount) {
                            contextText = 'All features have required tests missing - buck up.';
                            statusClass = badClass;
                        } else {
                            contextText = totalFeatureCount + ' features. NO TEST DATA YET';
                            statusClass = okClass;
                        }
                    }
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="exclamation-sign"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_FAIL:

                if(featureCount > 0){
                    contextText = featureCount + ' features have failing tests...';
                    statusClass = badClass;
                } else {
                    if(totalFeatureCount === 0){
                        contextText = 'NO FEATURES YET';
                        statusClass = okClass;
                    } else {
                        if(testsCount === 0){
                            contextText = 'NO TEST DATA YET';
                            statusClass = okClass;
                        } else {
                            contextText = 'No failing tests.  Result!';
                            statusClass = goodClass;
                        }
                    }
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="remove-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_SOME:

                if(totalFeatureCount === 0){
                    contextText = 'NO FEATURES YET';
                    statusClass = okClass;
                } else {
                    if(testsCount === 0){
                        contextText = 'NO TEST DATA YET';
                        statusClass = okClass;
                    } else {
                        contextText = featureCount + ' features have some passing tests';
                        statusClass = okClass;
                    }
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="ok-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_ALL:

                if(featureCount === 0){
                    if(testsCount === 0){
                        contextText = 'NO TEST DATA YET';
                        statusClass = okClass;
                    } else {
                        contextText = featureCount + ' features have all tests passing.  Try harder.';
                        statusClass = okClass;
                    }
                } else {
                    contextText = featureCount + ' features have all tests passing.  Good work.';
                    statusClass = goodClass;
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="ok-circle"/></div>;
                break;
        }

        const layoutInactive =
            <InputGroup>
                <InputGroup.Addon>
                    {icon}
                </InputGroup.Addon>
                <Grid>
                    <Row>
                        <Col md={11}>
                            <div className="project-summary-item-text">{contextText}</div>
                        </Col>
                        <Col md={1}>
                            <div className="summary-hand"><Glyphicon glyph="none"/></div>
                        </Col>
                    </Row>
                </Grid>
            </InputGroup>;

        const layoutActive =
            <InputGroup>
                <InputGroup.Addon>
                    {icon}
                </InputGroup.Addon>
                <Grid>
                    <Row>
                        <Col md={11}>
                            <div className="project-summary-item-text">{contextText}</div>
                        </Col>
                        <Col md={1}>
                            <div className="summary-hand"><Glyphicon glyph="hand-right"/></div>
                        </Col>
                    </Row>
                </Grid>
            </InputGroup>;

        let layout = layoutInactive;

        if(displayContext === currentSummaryItem){
            layout = layoutActive;
        }

        return(
            <div onClick={() => this.clickHandler()} className={itemClass}>{layout}</div>
        );

    }
}


ProjectSummaryItem.propTypes = {
    displayContext: PropTypes.string.isRequired,
    featureCount: PropTypes.number.isRequired,
    totalFeatureCount: PropTypes.number.isRequired,
    testsCount: PropTypes.number.isRequired,
    selectionFunction: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        currentSummaryItem: state.currentUserSummaryItem
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ProjectSummaryItem);



