// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ProjectSummaryItem           from '../../components/summary/ProjectSummaryItem.jsx';
import FeatureSummaryContainer      from '../../containers/select/FeatureSummaryContainer.jsx';

// Ultrawide Services
import {DisplayContext, HomePageTab} from '../../../constants/constants.js';

import ClientDataServices      from '../../../apiClient/apiClientDataServices.js';
import ClientUserSettingsServices   from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {InputGroup, Grid, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'
import {
    setCurrentUserSummaryItem
} from '../../../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Project Summary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class ProjectSummary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayContext: DisplayContext.PROJECT_SUMMARY_ALL
        };
    }

    onSummaryItemSelect(displayContext){

        //console.log('Setting display context to ' + displayContext);

        this.setState({displayContext: displayContext});

        store.dispatch(setCurrentUserSummaryItem(displayContext));
    }


    render() {

        const {designVersionName, totalFeatureCount, noTestRequirementsCount, failingTestsCount, someTestsCount, allTestsCount, testsCount, userContext} = this.props;

        const layout =
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className="project-summary-header">{designVersionName}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <ProjectSummaryItem
                            displayContext={DisplayContext.PROJECT_SUMMARY_NONE}
                            totalFeatureCount={totalFeatureCount}
                            featureCount={noTestRequirementsCount}
                            testsCount={testsCount}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.PROJECT_SUMMARY_NONE)}
                        />
                        <ProjectSummaryItem
                            displayContext={DisplayContext.PROJECT_SUMMARY_FAIL}
                            totalFeatureCount={totalFeatureCount}
                            featureCount={failingTestsCount}
                            testsCount={testsCount}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.PROJECT_SUMMARY_FAIL)}
                        />
                        <ProjectSummaryItem
                            displayContext={DisplayContext.PROJECT_SUMMARY_SOME}
                            totalFeatureCount={totalFeatureCount}
                            featureCount={someTestsCount}
                            testsCount={testsCount}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.PROJECT_SUMMARY_SOME)}
                        />
                        <ProjectSummaryItem
                            displayContext={DisplayContext.PROJECT_SUMMARY_ALL}
                            totalFeatureCount={totalFeatureCount}
                            featureCount={allTestsCount}
                            testsCount={testsCount}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.PROJECT_SUMMARY_ALL)}
                        />
                    </Col>
                    <Col md={8} >
                        <FeatureSummaryContainer params={{
                            userContext: userContext,
                            homePageTab: HomePageTab.TAB_SUMMARY,
                            displayContext: this.state.displayContext
                        }}/>
                    </Col>
                </Row>
            </Grid>;


        return(
            <div>{layout}</div>
        )
    }

}

ProjectSummary.propTypes = {
    designVersionName: PropTypes.string.isRequired,
    totalFeatureCount: PropTypes.number.isRequired,
    noTestRequirementsCount: PropTypes.number.isRequired,
    failingTestsCount: PropTypes.number.isRequired,
    someTestsCount: PropTypes.number.isRequired,
    allTestsCount: PropTypes.number.isRequired,
    testsCount: PropTypes.number.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default ProjectSummaryContainer = createContainer(({params}) => {

    return ClientDataServices.getProjectSummaryData(params.userContext);

}, connect(mapStateToProps)(ProjectSummary));