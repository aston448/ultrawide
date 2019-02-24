// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignsContainer                     from '../../containers/item/DesignsContainer.jsx';
import DesignVersionsContainer              from '../../containers/item/DesignVersionsContainer.jsx';
import DesignUpdatesContainer               from '../../containers/item/DesignUpdatesContainer.jsx';
import WorkTabPage                          from '../work/WorkTabPage.jsx';
import FeatureSummaryContainer              from '../../containers/item/FeatureSummaryContainer.jsx';
import ProjectSummaryContainer              from '../../containers/summary/ProjectSummaryContainer.jsx';


// Ultrawide Services
import {DesignVersionStatus, WorkPackageType, HomePageTab, LogLevel, RoleType, DisplayContext}        from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDesignVersionServices }  from '../../../apiClient/apiClientDesignVersion.js';
import { ClientAppHeaderServices }      from '../../../apiClient/apiClientAppHeader.js';

// Bootstrap
import {Tabs, Tab, Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Data Container - selects the Design Versions in the current Design
//
// ---------------------------------------------------------------------------------------------------------------------


export class MainSelectionPage extends Component {
    constructor(props) {
        super(props);

    }

    getCurrentDesignVersionStatus(userContext){
        return ClientDesignVersionServices.getDesignVersionStatus(userContext.designVersionId);
    }

    onSelectTab(eventKey){
        //console.log('Selecting tab ' + eventKey);
        ClientAppHeaderServices.setHomeTab(eventKey);
    }

    render(){

        const {userContext, userHomeTab, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Main Selection Page');

        // Items -------------------------------------------------------------------------------------------------------

        const designTabLayout =
            <Grid className="close-grid">
                <Row>
                    <Col className="close-col" md={3}>
                        <DesignsContainer/>
                    </Col>
                    <Col className="close-col"  md={3}>
                        <DesignVersionsContainer params={{
                            designId: userContext.designId
                        }}/>
                    </Col>
                    <Col className="close-col"  md={6}>
                        <FeatureSummaryContainer params={{
                            userContext: userContext,
                            homePageTab: userHomeTab,
                            displayContext: DisplayContext.DV_FEATURES
                        }}/>
                    </Col>
                </Row>
            </Grid>;

        const updatesTabLayout =
            <DesignUpdatesContainer params={{
                designVersionId: userContext.designVersionId
            }}/>;


        let workTabLayout = <div className="design-item-note">No Design Version Selected</div>;

        let wpType = WorkPackageType.WP_BASE;

        if(userContext.designVersionId !== 'NONE'){

            switch(this.getCurrentDesignVersionStatus(userContext)) {

                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    wpType = WorkPackageType.WP_UPDATE;

                    break;
            }

            workTabLayout =
                <WorkTabPage
                    wpType={wpType}
                />
        }

        const projectSummaryTabLayout =
            <ProjectSummaryContainer params={{
                userContext: userContext
            }}/>;

        // Layout ------------------------------------------------------------------------------------------------------

        let layout = <div className="design-item-note">No data</div>;

        if(userRole === RoleType.GUEST_VIEWER){

            layout =
                <div className="home-page">
                    {designTabLayout}
                </div>;

        } else {

            if (userContext.designVersionId === 'NONE'
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_NEW
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_DRAFT
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_DRAFT_COMPLETE
            ) {

                layout =
                    <div className="home-page">
                        <Tab.Container id="main-page" activeKey={userHomeTab} onSelect={(tab) => this.onSelectTab(tab)}>
                            <Row>
                                <Col md={1}>
                                    <Nav bsStyle="pills" className="side-menu" stacked>
                                        <NavItem eventKey={HomePageTab.TAB_SUMMARY}>
                                            SUMMARY
                                        </NavItem>
                                        <NavItem eventKey={HomePageTab.TAB_DESIGNS}>
                                            DESIGNS
                                        </NavItem>
                                        <NavItem eventKey={HomePageTab.TAB_WORK}>
                                            WORK
                                        </NavItem>
                                    </Nav>
                                </Col>
                                <Col className="main-panel" md={11}>
                                    <Tab.Content animation>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_SUMMARY}>
                                            {projectSummaryTabLayout}
                                        </Tab.Pane>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_DESIGNS}>
                                            {designTabLayout}
                                        </Tab.Pane>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_WORK}>
                                            {workTabLayout}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </div>;

            } else {

                layout =
                    <div className="home-page">
                        <Tab.Container id="main-page" activeKey={userHomeTab} onSelect={(tab) => this.onSelectTab(tab)}>
                            <Row>
                                <Col md={1}>
                                    <Nav bsStyle="pills" className="side-menu" stacked>
                                        <NavItem eventKey={HomePageTab.TAB_SUMMARY}>
                                            SUMMARY
                                        </NavItem>
                                        <NavItem eventKey={HomePageTab.TAB_DESIGNS}>
                                            DESIGNS
                                        </NavItem>
                                        <NavItem eventKey={HomePageTab.TAB_UPDATES}>
                                            UPDATES
                                        </NavItem>
                                        <NavItem eventKey={HomePageTab.TAB_WORK}>
                                            WORK
                                        </NavItem>
                                    </Nav>
                                </Col>
                                <Col className="main-panel" md={11}>
                                    <Tab.Content animation>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_SUMMARY}>
                                            {projectSummaryTabLayout}
                                        </Tab.Pane>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_DESIGNS}>
                                            {designTabLayout}
                                        </Tab.Pane>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_UPDATES}>
                                            {updatesTabLayout}
                                        </Tab.Pane>
                                        <Tab.Pane unmountOnExit={true} eventKey={HomePageTab.TAB_WORK}>
                                            {workTabLayout}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </div>;

            }
        }


        return(
            <div id="home-page">
                {layout}
            </div>
        );

    }

}

MainSelectionPage.propTypes = {

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
export default connect(mapStateToProps)(MainSelectionPage);
