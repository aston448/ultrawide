 // == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppHeaderDataContainer from '../../containers/app/AppHeaderDataContainer.jsx';
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';
import UltrawideMenuDropdown from '../common/UltrawideMenuDropdown.jsx';


// Ultrawide Services
import {MenuType, ViewType, ViewMode, ViewOptionType, RoleType, MessageType, LogLevel} from '../../../constants/constants.js'

import ClientAppHeaderServices          from '../../../apiClient/apiClientAppHeader.js';
import ClientTestIntegrationServices    from '../../../apiClient/apiClientTestIntegration.js';
import ClientIdentityServices           from '../../../apiClient/apiIdentity';
import TextLookups                      from '../../../common/lookups.js';
 import { log } from '../../../common/utils.js'
// Bootstrap
import {Alert} from 'react-bootstrap';
import {ButtonGroup, ButtonToolbar, Button, } from 'react-bootstrap';
import {Dropdown, MenuItem} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Application Header Component - Main title, context information, messages and view options
//
// ---------------------------------------------------------------------------------------------------------------------

// App Header component - represents the title bar
export class AppHeader extends Component {
    constructor(props) {
        super(props);
    }

    handleSelect(eventKey){
        event.preventDefault();

        switch(eventKey){
            case 'KEY_LOGOUT':
                ClientAppHeaderServices.setViewLogin(this.props.userContext);
                break;
        }
    }

    onSetEditViewMode(newMode, view, viewOptions){
        // Set editor as edit or view mode
        ClientAppHeaderServices.setEditorMode(newMode, view, viewOptions);
    }

    onToggleViewOption(view, userContext, userRole, viewOptionType, currentOptions, currentViewDataValue, testDataFlag){
        // Show / hide Various view Options
        ClientAppHeaderServices.toggleViewOption(view, userContext, userRole, viewOptionType, currentOptions, currentViewDataValue, testDataFlag, this.getTestIntegrationDataContext());
    }

    onZoomToFeatures(userContext){
        ClientAppHeaderServices.setViewLevelFeatures(userContext);
    }

    onZoomToSections(userContext){
        ClientAppHeaderServices.setViewLevelSections(userContext);
    }

    onGoToDesigns(){
        // Back to Designs view
        ClientAppHeaderServices.setViewDesigns();
    }

    onGoToTestOutput(){
        // Go to Test Output configuration Screen
        ClientAppHeaderServices.setViewTestOutput();
    }

    onGoToConfigure(){
        // Back to Selection view
        ClientAppHeaderServices.setViewConfigure();
    }

    onGoToHome(){
        // Back to Roles Screen
        ClientAppHeaderServices.setViewRoles();
    }

    onGoToSelection(){
        // Back to Selection view
        ClientAppHeaderServices.setViewSelection();
    }

    onLogOut(userContext){
        // Back to authorisation view (i.e. log the user out)
        ClientAppHeaderServices.setViewLogin(userContext);
    }

    onRefreshTestData(view, userContext, userRole,  userViewOptions){
        ClientTestIntegrationServices.refreshTestData(view, userContext, userRole, userViewOptions, this.props.testDataFlag, this.getTestIntegrationDataContext())
    }

    onRefreshDesignData(view, userContext, userRole,  userViewOptions){
        ClientTestIntegrationServices.refreshDesignMashData(view, userContext, userRole, userViewOptions, this.props.testDataFlag, this.getTestIntegrationDataContext())
    }

    onExportFeatureUpdates(userContext){
        ClientMashDataServices.exportFeatureUpdates(userContext);
    }

    setUserMessage(message){
        //ClientAppHeaderServices.setUserMessage(message);
    }

    getOptionButtonStyle(viewOption, currentOptions){

        if(currentOptions) {
            return (currentOptions[viewOption] ? 'success' : 'default');

        } else {
            return 'default';
        }

    }

    getTestIntegrationDataContext(){

        console.log("APP HEADER: data loaded = " + this.props.testDataLoaded);

        return {
            designVersionDataLoaded:        this.props.dvDataLoaded,
            testIntegrationDataLoaded:      this.props.testDataLoaded,
            testSummaryDataLoaded:          this.props.summaryDataLoaded,
            mashDataStale:                  this.props.mashDataStale,
            testDataStale:                  this.props.testDataStale
        };
    }


    render() {

        const {mode, view, userRole, userName, userContext, userViewOptions, message, testDataFlag, currentViewDataValue} = this.props;

        let logo = ClientIdentityServices.getApplicationName();

        let detailsOption= '';
        let detailsValue = false;
        let testSummaryOption = '';
        let testSummaryValue = false;
        let accTestOption = '';
        let accTestValue = false;
        let accFilesOption = '';
        let accFilesValue = false;
        let intTestOption = '';
        let intTestValue = false;
        let unitTestOption = '';
        let unitTestValue = false;
        let dictOption = '';
        let dictValue = false;

        // Get the correct user view options for the view context
        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.DESIGN_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.designTestSummaryVisible;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                detailsOption = ViewOptionType.UPDATE_DETAILS;
                detailsValue = userViewOptions.updateDetailsVisible;
                dictOption = ViewOptionType.UPDATE_DICT;
                dictValue = userViewOptions.updateDomainDictVisible;
                testSummaryOption = ViewOptionType.UPDATE_TEST_SUMMARY;
                testSummaryValue = userViewOptions.updateTestSummaryVisible;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                detailsOption = ViewOptionType.WP_DETAILS;
                detailsValue = userViewOptions.wpDetailsVisible;
                dictOption = ViewOptionType.WP_DICT;
                dictValue = userViewOptions.wpDomainDictVisible;
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                detailsOption = ViewOptionType.WP_DETAILS;
                detailsValue = userViewOptions.wpDetailsVisible;
                dictOption = ViewOptionType.WP_DICT;
                dictValue = userViewOptions.wpDomainDictVisible;
                testSummaryOption = ViewOptionType.DEV_TEST_SUMMARY;
                testSummaryValue = userViewOptions.devTestSummaryVisible;
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                detailsOption = ViewOptionType.DEV_DETAILS;
                detailsValue = userViewOptions.devDetailsVisible;
                accTestOption = ViewOptionType.DEV_ACC_TESTS;
                accTestValue = userViewOptions.devAccTestsVisible;
                accFilesOption = ViewOptionType.DEV_FILES;
                accFilesValue = userViewOptions.devFeatureFilesVisible;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                intTestValue = userViewOptions.devIntTestsVisible;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                unitTestValue = userViewOptions.devUnitTestsVisible;
                dictOption = ViewOptionType.DEV_DICT;
                dictValue = userViewOptions.devDomainDictVisible;
                testSummaryOption = ViewOptionType.DEV_TEST_SUMMARY;
                testSummaryValue = userViewOptions.devTestSummaryVisible;
                break;
        }

        let appHeaderMenuContent = <div>Loading</div>;


        // Menu Items

        const homeItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="HOME" actionFunction={() => this.onGoToHome()}/>;
        const logoutItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="Logout" actionFunction={() => this.onLogOut(userContext)}/>;

        let gotoDropdownItems = [];
        let viewDropdownItems = [];
        let refreshDropdownItems = [];

        // Dropdown Items - Goto
        const gotoDesigns = {key: 'DES', itemName: 'Designs', actionFunction: () => this.onGoToDesigns(), hasCheckbox: false, checkboxValue: false};
        const gotoConfig = {key: 'CFG', itemName: 'Configuration', actionFunction: () => this.onGoToConfigure(), hasCheckbox: false, checkboxValue: false};
        const gotoSelection = {key: 'SEL', itemName: 'Item Selection', actionFunction: () => this.onGoToSelection(), hasCheckbox: false, checkboxValue: false};
        const gotoTestConfig = {key: 'TOC', itemName: 'Test Output Config', actionFunction: () => this.onGoToTestOutput(), hasCheckbox: false, checkboxValue: false};

        // Dropdown Items - View
        const viewDetails = {
            key: 'DET',
            itemName: 'Details',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, detailsOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: detailsValue
        };

        const viewTestSummary = {
            key: 'TSM',
            itemName: 'Test Summary',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, testSummaryOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: testSummaryValue
        };

        const viewAccTests = {
            key: 'ACC',
            itemName: 'Acceptance Tests',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, accTestOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: accTestValue
        };

        const viewIntTests = {
            key: 'INT',
            itemName: 'Integration Tests',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, intTestOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: intTestValue
        };

        const viewUnitTests = {
            key: 'UNT',
            itemName: 'Unit Tests',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, unitTestOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: unitTestValue
        };

        const viewAccFiles = {
            key: 'ACF',
            itemName: 'Feature Files',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, ViewOptionType.DEV_FILES, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: accFilesValue
        };

        const viewDomainDict = {
            key: 'DOM',
            itemName: 'Domain Dictionary',
            actionFunction: () => this.onToggleViewOption(view, userContext, userRole, dictOption, userViewOptions, currentViewDataValue, testDataFlag),
            hasCheckbox: true,
            checkboxValue: dictValue
        };

        // Dropdown Items - Refresh
        const refreshTestData = {
            key: 'RTD',
            itemName: 'Test Data',
            actionFunction: () => this.onRefreshTestData(view, userContext, userRole, userViewOptions),
            hasCheckbox: false
        };

        const refreshDesignData = {
            key: 'RDD',
            itemName: 'Design and Test Data',
            actionFunction: () => this.onRefreshDesignData(view, userContext, userRole, userViewOptions),
            hasCheckbox: false
        };

        // The message display depends on the type of message being displayed
        let headerInfoStyle = message.messageType;

        let headerMessage =
            <div>
                {message.messageText}
            </div>;

        let roleClass = '';
        let roleStatusClass = '';
        let viewText = TextLookups.viewText(view);

        // Get current status
        let status = '';
        switch(userRole){
            case RoleType.DESIGNER:
                roleClass = 'designer';
                roleStatusClass = 'status-designer';
                status = 'DESIGNER - ' + viewText;
                break;
            case RoleType.DEVELOPER:
                roleClass = 'developer';
                roleStatusClass = 'status-developer';
                status = 'DEVELOPER - ' + viewText;
                break;
            case RoleType.MANAGER:
                roleClass = 'manager';
                roleStatusClass = 'status-manager';
                status = 'MANAGER - ' + viewText;
                break;
            default:
                roleClass = 'no-role';
        }

        // Display the required header for the view
        switch(view){
            case ViewType.AUTHORISE:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                    </div>;
                break;

            case ViewType.ADMIN:

                gotoDropdownItems = [
                    gotoDesigns
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.HOME:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {logoutItem}
                    </div>;
                break;

            case ViewType.CONFIGURE:

                gotoDropdownItems = [
                    gotoTestConfig,
                    gotoDesigns
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.TEST_OUTPUTS:

                gotoDropdownItems = [
                    gotoConfig,
                    gotoDesigns
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGNS:

                gotoDropdownItems = [
                    gotoConfig
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.SELECT:

                gotoDropdownItems = [
                    gotoConfig,
                    gotoDesigns
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_VIEW:

                gotoDropdownItems = [
                    gotoSelection,
                    gotoConfig,
                    gotoDesigns
                ];

                viewDropdownItems = [
                    viewDetails,
                    viewDomainDict,
                    viewTestSummary
                ];

                refreshDropdownItems = [
                    refreshTestData,
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        <UltrawideMenuDropdown itemName="View" itemsList={viewDropdownItems}/>
                        <UltrawideMenuDropdown itemName="Refresh" itemsList={refreshDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:

                gotoDropdownItems = [
                    gotoSelection,
                    gotoConfig,
                    gotoDesigns
                ];

                if(mode === ViewMode.MODE_VIEW){
                    viewDropdownItems = [
                        viewDetails,
                        viewDomainDict,
                        viewTestSummary
                    ];

                    refreshDropdownItems = [
                        refreshTestData,
                    ];

                    appHeaderMenuContent =
                        <div className="top-menu-bar">
                            {homeItem}
                            <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                            <UltrawideMenuDropdown itemName="View" itemsList={viewDropdownItems}/>
                            <UltrawideMenuDropdown itemName="Refresh" itemsList={refreshDropdownItems}/>
                            {logoutItem}
                        </div>;

                } else {
                    viewDropdownItems = [
                        viewDetails,
                        viewDomainDict
                    ];

                    appHeaderMenuContent =
                        <div className="top-menu-bar">
                            {homeItem}
                            <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                            <UltrawideMenuDropdown itemName="View" itemsList={viewDropdownItems}/>
                            {logoutItem}
                        </div>;
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                gotoDropdownItems = [
                    gotoSelection,
                    gotoConfig,
                    gotoDesigns
                ];

                viewDropdownItems = [
                    viewDetails,
                    viewDomainDict
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        <UltrawideMenuDropdown itemName="View" itemsList={viewDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:


                gotoDropdownItems = [
                    gotoSelection,
                    gotoConfig,
                    gotoDesigns
                ];

                viewDropdownItems = [
                    viewDetails,
                    viewDomainDict,
                    viewAccTests,
                    viewAccFiles,
                    viewIntTests,
                    viewUnitTests,
                    viewTestSummary
                ];

                refreshDropdownItems = [
                    refreshTestData,
                    refreshDesignData
                ];

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" itemsList={gotoDropdownItems}/>
                        <UltrawideMenuDropdown itemName="View" itemsList={viewDropdownItems}/>
                        <UltrawideMenuDropdown itemName="Refresh" itemsList={refreshDropdownItems}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.WAIT:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {logoutItem}
                    </div>;
                break;

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "Invalid view type: {}", view);
        }

        if (view) {

            {appHeaderMenuContent}

            return (
                <div className={'ultrawide-header ' + roleClass}>
                    <div className="ultrawide-logo">{logo}</div>
                    <div className={'ultrawide-status ' + roleStatusClass}>{status}</div>
                    <div className={'header-message ' + headerInfoStyle}>
                        {headerMessage}
                    </div>
                    {appHeaderMenuContent}
                </div>
            );
        } else {
            return(
                <div>No Data</div>
            )
        }

    }
}

AppHeader.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        mode:                       state.currentViewMode,
        view:                       state.currentAppView,
        userRole:                   state.currentUserRole,
        userName:                   state.currentUserName,
        userContext:                state.currentUserItemContext,
        userViewOptions:            state.currentUserViewOptions,
        message:                    state.currentUserMessage,
        testDataFlag:               state.testDataFlag,
        currentViewDataValue:       state.currentViewOptionsDataValue,
        dvDataLoaded:               state.designVersionDataLoaded,
        testDataLoaded:             state.testIntegrationDataLoaded,
        summaryDataLoaded:          state.testSummaryDataLoaded,
        mashDataStale:              state.mashDataStale,
        testDataStale:              state.testDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(AppHeader);



