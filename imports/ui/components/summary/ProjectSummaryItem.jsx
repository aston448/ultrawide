// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import { DisplayContext, RoleType, ItemType, DesignVersionStatus, DesignUpdateStatus} from '../../../constants/constants.js';

import ClientDesignServices             from '../../../apiClient/apiClientDesign.js';
import ClientDesignVersionServices      from '../../../apiClient/apiClientDesignVersion.js';
import ClientDesignUpdateServices       from '../../../apiClient/apiClientDesignUpdate.js';
import ClientWorkPackageServices        from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {InputGroup, Grid, Row, Col}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';
import {FormControl, ControlLabel}  from 'react-bootstrap';

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
        const {displayContext, featureCount, currentSummaryItem} = this.props;

        let contextText = '';
        let icon = '';
        let iconClass = 'project-summary-item-icon ';
        let itemClass = 'project-summary-item ';
        if(displayContext === currentSummaryItem){
            itemClass = 'project-summary-item-active '
        }
        let statusClass = '';

        switch(displayContext){

            case DisplayContext.PROJECT_SUMMARY_NONE:

                if(featureCount > 0){
                    contextText = featureCount + ' features have no tests required at all!';
                    statusClass = 'project-summary-bad';
                } else {
                    contextText = 'All features have tests required of them - good start...';
                    statusClass = 'project-summary-good';
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="ban-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_FAIL:

                if(featureCount > 0){
                    contextText = featureCount + ' features have failing tests...';
                    statusClass = 'project-summary-bad';
                } else {
                    contextText = 'No failing tests.  Result!';
                    statusClass = 'project-summary-good';
                }

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="remove-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_SOME:

                contextText = featureCount + ' features have some passing tests';
                statusClass = 'project-summary-ok';

                iconClass += statusClass;
                itemClass += statusClass;
                icon = <div className={iconClass}><Glyphicon glyph="ok-circle"/></div>;
                break;

            case DisplayContext.PROJECT_SUMMARY_ALL:

                if(featureCount === 0){
                    contextText = featureCount + ' features have all tests passing.  Try harder.';
                    statusClass = 'project-summary-ok';
                } else {
                    contextText = featureCount + ' features have all tests passing.  Good work.';
                    statusClass = 'project-summary-good';
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



