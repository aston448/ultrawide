// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemList                         from '../../components/select/ItemList.jsx';
import DesignUpdateSummaryContainer     from '../../containers/summary/UpdateSummaryContainer.jsx';
import FeatureSummaryContainer          from '../../containers/select/FeatureSummaryContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, DisplayContext, WorkPackageType, RoleType, HomePageTab, LogLevel} from '../../../constants/constants.js';
import { log } from '../../../common/utils.js';

import { ClientDataServices }               from '../../../apiClient/apiClientDataServices.js';
import { WorkPackageContainerUiModules }    from '../../../ui_modules/work_packages_container.js';

// Data Access
import { DesignVersionData }                from '../../../data/design/design_version_db.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {WorkPackageTab} from "../../../constants/constants";
import { ClientAppHeaderServices } from "../../../apiClient/apiClientAppHeader";



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Data Container - gets data for Work Packages related to a Design Version
//
// ---------------------------------------------------------------------------------------------------------------------


// Basic export for unit tests
export class WorkPackagesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: this.props.defaultTab
        }

    }

    componentWillReceiveProps(newProps){

        if(newProps.defaultTab !== this.props.defaultTab){
            this.setState({currentTab: newProps.defaultTab});
        }
    }

    getDesignVersionName(userContext){

        const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        if(dv) {
            return dv.designVersionName;
        } else {
            return 'No Design Version';
        }

    }

    onSelectTab(eventKey){
        this.setState({currentTab: eventKey});
    }

    render() {

        const {wpType, newWorkPackages, availableWorkPackages, adoptedWorkPackages, completedWorkPackages, designVersionStatus, defaultTab, userRole, userContext, openWpItems} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Work Packages with default tab {}', defaultTab);

        // Footer ------------------------------------------------------------------------------------------------------

        const footerData = WorkPackageContainerUiModules.getFooterDetails(
            this.getDesignVersionName(userContext),
            designVersionStatus,
            userRole,
            userContext,
            wpType,
            openWpItems
        );

        const footerActionFunction = footerData.footerActionFunction;
        const hasFooterAction = footerData.hasFooterAction;
        const footerAction = footerData.footerAction;
        const footerActionUiContextId = footerData.footerActionUiContextId;
        const footerText = footerData.footerText;


        // Body Content ------------------------------------------------------------------------------------------------

        const bodyData = WorkPackageContainerUiModules.getBodyDetails(
            userContext,
            userRole,
            designVersionStatus,
            newWorkPackages,
            availableWorkPackages,
            adoptedWorkPackages,
            completedWorkPackages
        );

        const bodyDataFunction1 = bodyData.bodyDataFunction1;
        const bodyDataFunction2 = bodyData.bodyDataFunction2;
        const bodyDataFunction3 = bodyData.bodyDataFunction3;

        const headerText1 = bodyData.headerText1;
        const headerText2 = bodyData.headerText2;
        const headerText3 = bodyData.headerText3;

        const tabText1 = bodyData.tabText1;
        const tabText2 = bodyData.tabText2;
        const tabText3 = bodyData.tabText3;

        let wpSummary = <div></div>;

        if((designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE || designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE)){

            // Updatable Version WPs
            if(userContext.workPackageId !== 'NONE') {
                wpSummary =
                    <DesignUpdateSummaryContainer params={{
                        userContext: userContext,
                        displayContext: DisplayContext.WP_SUMMARY
                    }}/>;
            } else {
                wpSummary =
                    <div className="design-item-note">
                        Select a Work Package to see Summary
                    </div>
            }
        } else {

            if(userContext.workPackageId !== 'NONE') {
                wpSummary =
                    <div className="design-item-note">
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
        }

        // Display as an item container --------------------------------------------------------------------------------

        let layout =
            <Grid>
                <Row>
                    <Col md={6}>
                        <Tabs className="top-tabs" animation={true} unmountOnExit={true} activeKey={this.state.currentTab} id="main_tabs" onSelect={(tab) => this.onSelectTab(tab)}>
                            <Tab eventKey={WorkPackageTab.TAB_AVAILABLE} title={tabText1}>
                                <ItemList
                                    headerText={headerText1}
                                    bodyDataFunction={bodyDataFunction1}
                                    hasFooterAction={hasFooterAction}
                                    footerAction={footerAction}
                                    footerActionUiContext={footerActionUiContextId}
                                    footerActionFunction={footerActionFunction}
                                />
                            </Tab>
                            <Tab eventKey={WorkPackageTab.TAB_ADOPTED} title={tabText2}>
                                <ItemList
                                    headerText={headerText2}
                                    bodyDataFunction={bodyDataFunction2}
                                    hasFooterAction={false}
                                    footerAction={''}
                                    footerActionUiContext={''}
                                    footerActionFunction={null}
                                />
                            </Tab>
                            <Tab eventKey={WorkPackageTab.TAB_COMPLETE} title={tabText3}>
                                <ItemList
                                    headerText={headerText3}
                                    bodyDataFunction={bodyDataFunction3}
                                    hasFooterAction={false}
                                    footerAction={''}
                                    footerActionUiContext={''}
                                    footerActionFunction={null}
                                />
                            </Tab>
                        </Tabs>
                    </Col>
                    <Col md={6}>
                        {wpSummary}
                    </Col>
                </Row>
            </Grid>;

        return (
            <div>
                {layout}
            </div>
        );
    }
}

WorkPackagesList.propTypes = {
    wpType: PropTypes.string.isRequired,
    newWorkPackages: PropTypes.array.isRequired,
    availableWorkPackages: PropTypes.array.isRequired,
    adoptedWorkPackages: PropTypes.array.isRequired,
    completedWorkPackages: PropTypes.array.isRequired,
    designVersionStatus: PropTypes.string.isRequired,
    defaultTab: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext,
        openWpItems: state.currentUserOpenWorkPackageItems
    }
}

// Default export with Redux
export default WorkPackagesContainer = createContainer(({params}) => {

    switch(params.wpType){
        case WorkPackageType.WP_BASE:
            return ClientDataServices.getWorkPackagesForCurrentDesignVersion(
                params.designVersionId,
                params.userRole,
                params.userContext,
                WorkPackageType.WP_BASE,
            );
        case WorkPackageType.WP_UPDATE:
            return ClientDataServices.getWorkPackagesForCurrentDesignVersion(
                params.designVersionId,
                params.userRole,
                params.userContext,
                WorkPackageType.WP_UPDATE
            );
    }


}, connect(mapStateToProps)(WorkPackagesList));