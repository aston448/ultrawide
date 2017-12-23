// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkPackage                  from '../../components/select/WorkPackage.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';
import DesignUpdateSummaryContainer from '../../containers/summary/UpdateSummaryContainer.jsx';
import FeatureSummaryContainer      from '../../containers/select/FeatureSummaryContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, WorkPackageType, RoleType, HomePageTab, LogLevel} from '../../../constants/constants.js';
import { log } from '../../../common/utils.js';

import ClientDataServices           from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageServices    from '../../../apiClient/apiClientWorkPackage.js';

import DesignVersionData             from '../../../data/design/design_version_db.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {DisplayContext} from "../../../constants/constants";
import {AddActionIds} from "../../../constants/ui_context_ids";

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

    }

    renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <WorkPackage
                        key={workPackage._id}
                        workPackage={workPackage}
                    />
                );
            });
        }
    }

    renderNewWorkPackageLists(){

        return [
            this.renderWorkPackagesList(this.props.newWorkPackages),
            this.renderWorkPackagesList(this.props.availableWorkPackages)
        ]
    }

    renderUpdateWorkPackagesLists(){

        return [
            this.renderWorkPackagesList(this.props.availableWorkPackages),
            this.renderWorkPackagesList(this.props.adoptedWorkPackages),
            this.renderWorkPackagesList(this.props.completedWorkPackages)
        ]
    }

    displayNote(noteText){
        return <div className="design-item-note">{noteText}</div>;
    }

    displayNothing(){
        return <div></div>;
    }

    getDesignVersionName(userContext){

        const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        if(dv) {
            return dv.designVersionName;
        } else {
            return 'No Design Version';
        }

    }

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    render() {

        const {wpType, newWorkPackages, availableWorkPackages, adoptedWorkPackages, completedWorkPackages, designVersionStatus, designUpdateStatus, userRole, userContext, openWpItems} = this.props;


        // Footer ------------------------------------------------------------------------------------------------------

        let footerActionFunction = null;
        let hasFooterAction = false;
        const footerAction = 'Add Work Package to Design Version: ' + this.getDesignVersionName(userContext);
        const footerActionUiContextId = AddActionIds.UI_CONTEXT_ADD_WORK_PACKAGE;
        const footerText = 'for Design Version: ' + this.getDesignVersionName(userContext);

        // Add WP available to Managers for Base DVs
        if(userRole === RoleType.MANAGER  && wpType === WorkPackageType.WP_BASE) {

            // And for Design Versions only of they are Draft
            if(designVersionStatus === DesignVersionStatus.VERSION_DRAFT) {
                hasFooterAction = true;

                footerActionFunction = () => this.onAddWorkPackage(
                    userRole,
                    userContext,
                    wpType,
                    openWpItems
                );
            }
        }

        // Body Content ------------------------------------------------------------------------------------------------

        let bodyDataFunction1 = () => this.displayNothing();
        let bodyDataFunction2 = () => this.displayNothing();
        let bodyDataFunction3 = () => this.displayNothing();

        let headerText1 = '';
        let headerText2 = '';
        let headerText3 = '';

        let tabText1 = '';
        let tabText2 = '';
        let tabText3 = '';

        const wpsNotAppropriate = 'Work Packages may only be added to a Draft design version...';
        const NO_WORK_PACKAGES = 'No Work Packages';
        const selectDesignUpdate = 'Select a Design Update';

        // When a design version is selected...
        if(userContext.designVersionId){

            switch(designVersionStatus){

                case DesignVersionStatus.VERSION_NEW:

                    // No work packages available and none can be added...

                    tabText1 = 'AVAILABLE';
                    headerText1 = 'Available Work Packages';
                    if(userRole === RoleType.MANAGER){
                        bodyDataFunction1 = () => this.displayNote(wpsNotAppropriate);
                    } else {
                        bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);
                    }

                    tabText2 = 'ADOPTED';
                    headerText2 = 'Adopted Work Packages';
                    bodyDataFunction2 = () => this.displayNote(NO_WORK_PACKAGES);

                    tabText3 = 'COMPLETED';
                    headerText3 = 'Completed Work Packages';
                    bodyDataFunction3 = () => this.displayNote(NO_WORK_PACKAGES);

                    break;

                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    tabText1 = 'AVAILABLE';
                    headerText1 = 'Available Work Packages';
                    if(newWorkPackages.length === 0 && availableWorkPackages.length === 0){

                        bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);

                    } else {

                        bodyDataFunction1 = () => this.renderNewWorkPackageLists();

                    }

                    tabText2 = 'ADOPTED';
                    headerText2 = 'Adopted Work Packages';
                    if(userRole === RoleType.DEVELOPER){
                        headerText2 = 'My Adopted Work Packages';
                    }
                    if(adoptedWorkPackages.length === 0){

                        bodyDataFunction2 = () => this.displayNote(NO_WORK_PACKAGES);
                    } else {

                        bodyDataFunction2 = () => this.renderWorkPackagesList(adoptedWorkPackages);
                    }

                    tabText3 = 'COMPLETED';
                    headerText3 = 'Completed Work Packages';
                    if(userRole === RoleType.DEVELOPER){
                        headerText3 = 'My Completed Work Packages';
                    }
                    if(completedWorkPackages.length === 0){

                        bodyDataFunction3 = () => this.displayNote(NO_WORK_PACKAGES);
                    } else {

                        bodyDataFunction3 = () => this.renderWorkPackagesList(completedWorkPackages);
                    }

                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        } else {
            bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);
        }

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
                        <Tabs className="top-tabs" animation={true} unmountOnExit={true} defaultActiveKey={2} id="main_tabs">
                            <Tab eventKey={1} title={tabText1}>
                                <ItemContainer
                                    headerText={headerText1}
                                    bodyDataFunction={bodyDataFunction1}
                                    hasFooterAction={hasFooterAction}
                                    footerAction={footerAction}
                                    footerActionUiContext={footerActionUiContextId}
                                    footerActionFunction={footerActionFunction}
                                />
                            </Tab>
                            <Tab eventKey={2} title={tabText2}>
                                <ItemContainer
                                    headerText={headerText2}
                                    bodyDataFunction={bodyDataFunction2}
                                    hasFooterAction={false}
                                    footerAction={''}
                                    footerActionUiContext={''}
                                    footerActionFunction={null}
                                />
                            </Tab>
                            <Tab eventKey={3} title={tabText3}>
                                <ItemContainer
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
    designVersionStatus: PropTypes.string.isRequired
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
                params.userId,
                WorkPackageType.WP_BASE
            );
        case WorkPackageType.WP_UPDATE:
            return ClientDataServices.getWorkPackagesForCurrentDesignVersion(
                params.designVersionId,
                params.userRole,
                params.userId,
                WorkPackageType.WP_UPDATE
            );
    }


}, connect(mapStateToProps)(WorkPackagesList));