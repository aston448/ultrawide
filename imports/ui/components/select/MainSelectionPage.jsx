// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignsContainer                     from '../../containers/select/DesignsContainer.jsx';
import DesignVersionsContainer              from '../../containers/select/DesignVersionsContainer.jsx';
import DesignUpdatesContainer               from '../../containers/select/DesignUpdatesContainer.jsx';
import WorkPackagesContainer                from '../../containers/select/WorkPackagesContainer.jsx';
import WorkProgressSummaryContainer         from '../../containers/summary/WorkProgressSummaryContainer.jsx';


// Ultrawide Services
import {DesignVersionStatus, WorkPackageType, HomePageTab}        from '../../../constants/constants.js';
import ClientDataServices      from '../../../apiClient/apiClientDataServices.js';
import ClientDesignVersionServices  from '../../../apiClient/apiClientDesignVersion.js';
import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';

// Bootstrap
import {Tabs, Tab, Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

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
        console.log('Selecting tab ' + eventKey);
        ClientAppHeaderServices.setHomeTab(eventKey);
    }

    render(){

        const {userContext, userHomeTab, userRole} = this.props;

        console.log('Rendering Home with tab ' + userHomeTab);

        // Items -------------------------------------------------------------------------------------------------------

        const designTabLayout =
            <Grid>
                <Row>
                    <Col md={6}>
                        <DesignsContainer/>
                    </Col>
                    <Col md={6}>
                        <DesignVersionsContainer params={{
                            designId: userContext.designId
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
                <WorkPackagesContainer params={{
                    wpType: wpType,
                    designVersionId: userContext.designVersionId,
                    userRole: userRole,
                    userId: userContext.userId
                }}/>
        }


        const progressTabLayout =
            <WorkProgressSummaryContainer params={{
                userContext: userContext
            }}/>;


        // Layout ------------------------------------------------------------------------------------------------------

        let layout = <div className="design-item-note">No data</div>;

        if(userContext.designVersionId === 'NONE'
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_NEW
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_DRAFT
                || this.getCurrentDesignVersionStatus(userContext) === DesignVersionStatus.VERSION_DRAFT_COMPLETE
        ){

            layout =
                <Tabs animation={true} unmountOnExit={true} activeKey={userHomeTab} id="main_tabs" onSelect={(tab) => this.onSelectTab(tab)}>
                    <Tab eventKey={HomePageTab.TAB_DESIGNS} title="DESIGNS">{designTabLayout}</Tab>
                    <Tab eventKey={HomePageTab.TAB_WORK} title="WORK">{workTabLayout}</Tab>
                    <Tab eventKey={HomePageTab.TAB_PROGRESS} title="PROGRESS">{progressTabLayout}</Tab>
                </Tabs>
        } else {

            layout =
                <Tabs animation={true} unmountOnExit={true} activeKey={userHomeTab} id="main_tabs" onSelect={(tab) => this.onSelectTab(tab)}>
                    <Tab eventKey={HomePageTab.TAB_DESIGNS} title="DESIGNS">{designTabLayout}</Tab>
                    <Tab eventKey={HomePageTab.TAB_UPDATES} title="UPDATES">{updatesTabLayout}</Tab>
                    <Tab eventKey={HomePageTab.TAB_WORK} title="WORK">{workTabLayout}</Tab>
                    <Tab eventKey={HomePageTab.TAB_PROGRESS} title="PROGRESS">{progressTabLayout}</Tab>
                </Tabs>
        }


        return(
            <div>
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
