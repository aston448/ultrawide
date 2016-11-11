// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {ComponentType} from '../../../constants/constants.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Progress Indicator Component - A generic component to show Design Implementation progress
//
// ---------------------------------------------------------------------------------------------------------------------


export default class ProgressIndicator extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {

        const {indicatorType, componentType, progressData} = this.props;

        let lGlyph = 'stop';
        // let blGlyph = 'stop';
        let rGlyph = 'stop';
        // let brGlyph = 'stop';

        let iClass = 'progress-empty';
        let iCount = 0;

        let lClass = 'progress-pending';
        // let blClass = '';
        let rClass = 'progress-pending';
        // let brClass = 'progress-pending';




        switch(componentType){
            case ComponentType.DESIGN_SECTION:
                switch(indicatorType ){
                    case 'IMPL':
                        // Set Feature progress
                        iCount = progressData.featureCount;
                        if(iCount > 0){
                            iClass = 'progress-full';
                        }
                        break;
                    case 'TEST':
                        // TODO - get summary data later
                        lClass = 'progress-invisible';
                        rClass = 'progress-invisible';

                }
                break;
            case ComponentType.FEATURE:

                switch(indicatorType ){
                    case 'IMPL':
                        // Set Scenario progress
                        iCount = progressData.scenarioCount;
                        if(iCount > 0){
                            iClass = 'progress-full';
                        }
                        break;
                    case 'TEST':
                        // Set tests
                        if(progressData.passingTestsCount > 0){
                            lClass = 'progress-green';
                        }

                        if(progressData.failingTestsCount > 0){
                            rClass = 'progress-red';
                        }
                }



                break;
            default:
                iClass = 'progress-impl-invisible';
                lClass = 'progress-invisible';
                rClass = 'progress-invisible';
        }

        let implSection =
            <Col sm={12} className="close-col">
                <div className={iClass}>{iCount}</div>
            </Col>;

        let testSection =
            <Grid className="close-grid-progress">
                <Row>
                    <Col sm={6} className="close-col">
                        <div className={lClass}> </div>
                    </Col>
                    <Col sm={6} className="close-col">
                        <div className={rClass}> </div>
                    </Col>
                </Row>
            </Grid>;

        if(indicatorType === 'IMPL'){
            return(
                <div>{implSection}</div>
            )
        } else {
            return(
                <div>{testSection}</div>
            )
        }

    }
}

ProgressIndicator.propTypes = {
    indicatorType:  PropTypes.string.isRequired,
    componentType:  PropTypes.string.isRequired,
    progressData:   PropTypes.object.isRequired
};
