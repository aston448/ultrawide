// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import WorkItemListContainer                from '../../containers/work/WorkItemContainer.jsx';
import UnassignedWpListTarget               from '../../components/work/UnassignedWpListTarget.jsx';
import FeatureSummaryContainer              from '../../containers/item/FeatureSummaryContainer.jsx';

// Ultrawide Services
import {DisplayContext, WorkItemType, HomePageTab, LogLevel, RoleType}        from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDesignVersionServices }  from '../../../apiClient/apiClientDesignVersion.js';
import { ClientAppHeaderServices }      from '../../../apiClient/apiClientAppHeader.js';

// Bootstrap
import {Tabs, Tab, Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'
import {} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Tab Page - hierarchy of Iterations with Updates and Work Packages
//
// ---------------------------------------------------------------------------------------------------------------------


export class WorkTabPage extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(props, nextProps){

        // Only if Work Tab is selected
        //return nextProps.userHomeTab === HomePageTab.TAB_WORK;
        return true;
    }

    render(){

        const {userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Work Tab Page');

        // Items -------------------------------------------------------------------------------------------------------

        let wpSummary = '';


        if(userContext.workPackageId !== 'NONE') {
            wpSummary =
                <div>
                    <FeatureSummaryContainer params={{
                        userContext: userContext,
                        homePageTab: HomePageTab.TAB_WORK
                    }}/>
                </div>
        } else {
            wpSummary =
                <div className="design-item-note">
                    Select a Work Package to see Features
                </div>
        }

        const layout =
            <Grid className="close-grid">
                <Row>
                    <Col className="close-col" md={4}>
                        <WorkItemListContainer params={{
                            workItemsParentRef: 'NONE',
                            workItemType: WorkItemType.INCREMENT,
                            userContext: userContext
                        }}/>
                    </Col>
                    <Col className="close-col"  md={4}>
                        <UnassignedWpListTarget
                            userContext={userContext}
                        />
                    </Col>
                    <Col className="close-col"  md={4}>
                        {wpSummary}
                    </Col>
                </Row>
            </Grid>;


        return(
            <div id="home-page">
                {layout}
            </div>
        );

    }

}

WorkTabPage.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userContext:            state.currentUserItemContext,
        userHomeTab:            state.currentUserHomeTab,
        userRole:               state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(WorkTabPage);
