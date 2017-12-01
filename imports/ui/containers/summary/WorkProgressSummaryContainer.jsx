// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkProgressItem             from '../../components/summary/WorkProgressItem.jsx';
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';

// Ultrawide Services
import {DisplayContext} from '../../../constants/constants.js';

import ClientDataServices      from '../../../apiClient/apiClientDataServices.js';
import ClientUserSettingsServices   from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {InputGroup, Grid, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Progress Summary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class WorkProgressSummaryList extends Component {

    constructor(props) {
        super(props);

    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    // A list of Feature Aspects in a Feature
    renderProgress(progressData, userRoles) {

        if(progressData) {

            return progressData.map((progressItem) => {
                return(
                    <WorkProgressItem
                        key={progressItem._id}
                        item={progressItem}
                        userRoles={userRoles}
                    />
                )
            });
        } else {
            return(<div>No progress data</div>);
        }
    }

    render() {

        const {dvAllItem, dvItem, dvWorkPackages, dvDesignUpdates, userRoles, userContext} = this.props;

        // Get correct window height
        const editorClass = this.getEditorClass();

        const summaryHeaders =
            <Grid>
                <Row>
                    <Col md={6} className="close-col">
                        <div className="progress-header">
                            Design Item
                        </div>
                    </Col>
                    <Col  md={6} className="close-col">
                        <Grid>
                            <Row>
                                <Col md={3} className="close-col">
                                    <div className="progress-header">
                                        Scenario Count...
                                    </div>
                                </Col>
                                <Col md={3} className="close-col">
                                    <div className="progress-header">
                                        ...in Work Packages
                                    </div>
                                </Col>
                                <Col md={2} className="close-col">
                                    <div className="progress-header">
                                        Tests Passing
                                    </div>
                                </Col>
                                <Col md={2} className="close-col">
                                    <div className="progress-header">
                                        Tests Failing
                                    </div>
                                </Col>
                                <Col md={2} className="close-col">
                                    <div className="progress-header">
                                        Not Tested
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
            </Grid>;

        let dvAllItemSummary = <div></div>;
        if(dvAllItem){
            dvAllItemSummary =
                <WorkProgressItem
                    item={dvAllItem}
                    userRoles={userRoles}
                />
        }

        let dvItemSummary = <div></div>;
        if(dvItem){
            dvItemSummary =
                <WorkProgressItem
                    item={dvItem}
                    userRoles={userRoles}
                />
        }

        let progressItems = <div></div>;
        if(dvWorkPackages.length > 0){
            progressItems =
                <div>
                    {this.renderProgress(dvWorkPackages, userRoles)}
                </div>

        } else {
            if(dvDesignUpdates.length > 0){
                progressItems =
                    <div>
                        {this.renderProgress(dvDesignUpdates, userRoles)}
                    </div>
            }
        }


        if(userContext.designVersionId !== 'NONE') {

            return (
                <div id="progressSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                    />
                    <div className={editorClass}>
                        {summaryHeaders}
                    </div>
                    <div className={editorClass}>
                        {dvAllItemSummary}
                        {dvItemSummary}
                        {progressItems}
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            );

        } else {

            return(
                <div id="noSummary" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                    />
                    <div className={editorClass}>
                        <div className="design-item-note">No Design Version selected</div>
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.PROGRESS_SUMMARY}
                        hasDesignSummary={false}
                    />
                </div>
            )
        }
    }

}

WorkProgressSummaryList.propTypes = {
    dvAllItem:          PropTypes.object,
    dvItem:             PropTypes.object,
    dvWorkPackages:     PropTypes.array.isRequired,
    dvDesignUpdates:    PropTypes.array.isRequired,
    userRoles:          PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default WorkProgressSummaryContainer = createContainer(({params}) => {

   return ClientDataServices.getWorkProgressDvItems(params.userContext);

}, connect(mapStateToProps)(WorkProgressSummaryList));