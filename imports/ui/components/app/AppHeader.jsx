 // == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppHeaderDataContainer from '../../containers/app/AppHeaderDataContainer.jsx';

// Ultrawide Services
import {ViewType, ViewMode, ViewOptionType, RoleType} from '../../../constants/constants.js'

import ClientAppHeaderServices      from '../../../apiClient/apiClientAppHeader.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';
import ClientIdentityServices       from '../../../apiClient/apiIdentity';
import TextLookups                  from '../../../common/lookups.js';

// Bootstrap
import {Alert} from 'react-bootstrap';
import {ButtonGroup, ButtonToolbar, Button, } from 'react-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';

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
class AppHeader extends Component {
    constructor(props) {
        super(props);
    }

    onSetEditViewMode(newMode){
        // Set editor as edit or view mode
        ClientAppHeaderServices.setEditorMode(newMode);
    }

    onToggleViewOption(userContext, viewOptionType, currentOptions, currentViewDataValue){
        // Show / hide Domain Dictionary
        ClientAppHeaderServices.toggleViewOption(userContext, viewOptionType, currentOptions, currentViewDataValue);
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

    onGoToConfigure(){
        // Back to Selection view
        ClientAppHeaderServices.setViewConfigure();
    }

    onGoToSelection(){
        // Back to Selection view
        ClientAppHeaderServices.setViewSelection();
    }

    onLogOut(){
        // Back to authorisation view (i.e. log the user out)
        ClientAppHeaderServices.setViewLogin();
    }

    onRefreshTestData(userContext, userViewOptions){
        ClientMashDataServices.updateTestData(userContext, userViewOptions, this.props.currentProgressDataValue)
    }

    onExportFeatureUpdates(userContext){
        ClientMashDataServices.exportFeatureUpdates(userContext);
    }

    getOptionButtonStyle(viewOption, currentOptions){

        if(currentOptions) {
            return (currentOptions[viewOption] ? 'success' : 'default');

        } else {
            return 'default';
        }

    }


    render() {

        const {mode, view, userRole, userName, userContext, userViewOptions, message, domainDictionaryVisible, currentProgressDataValue, currentViewDataValue} = this.props;

        let appName = ClientIdentityServices.getApplicationName();

        // The header display depends on the current application View
        let headerTopActions = '';
        let headerBottomActionsOne = '';
        let headerBottomActionsTwo = '';
        let headerUserInfo = '';

        let detailsOption= '';
        let testSummaryOption = '';
        let accTestOption = '';
        let intTestOption = '';
        let unitTestOption = '';
        let dictOption = '';

        // Get the correct user view options for the view context
        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                dictOption = ViewOptionType.DESIGN_DICT;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                detailsOption = ViewOptionType.UPDATE_DETAILS;
                dictOption = ViewOptionType.UPDATE_DICT;
                testSummaryOption = ViewOptionType.UPDATE_TEST_SUMMARY;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                detailsOption = ViewOptionType.WP_DETAILS;
                dictOption = ViewOptionType.WP_DICT;
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                detailsOption = ViewOptionType.DEV_DETAILS;
                accTestOption = ViewOptionType.DEV_ACC_TESTS;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                dictOption = ViewOptionType.DEV_DICT;
                testSummaryOption = ViewOptionType.DEV_TEST_SUMMARY;
                break;
        }

        let bsStyleEdit = (mode === ViewMode.MODE_EDIT ? 'success': 'default');
        let bsStyleView = (mode === ViewMode.MODE_VIEW ? 'success': 'default');

        let logoutButton =
            <Button bsSize="xs" bsStyle="warning" onClick={ () => this.onLogOut()}>Log Out</Button>;

        let designsButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onGoToDesigns()}>Designs Menu</Button>;

        // View Mode and Zoom buttons
        let viewModeEditButton =
            <Button bsSize="xs" bsStyle={bsStyleEdit} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT)}>EDIT</Button>;
        let viewModeViewButton =
            <Button bsSize="xs" bsStyle={bsStyleView} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW)}>VIEW</Button>;

        let viewFeatureLevelButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onZoomToFeatures(userContext)}>Go to Features</Button>;
        let viewSectionLevelButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onZoomToSections(userContext)}>Go to Sections</Button>;

        // View Options Buttons
        let scopeFixedButton =
            <Button bsSize="xs" bsStyle={'info'}>Scope</Button>;
        let designFixedButton =
            <Button bsSize="xs" bsStyle={'info'}>Design</Button>;
        let detailsFixedButton =
            <Button bsSize="xs" bsStyle={'info'}>Details</Button>;
        let detailsButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(detailsOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, detailsOption, userViewOptions, currentViewDataValue)}>Details</Button>;
        let testSummaryButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(testSummaryOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, testSummaryOption, userViewOptions, currentViewDataValue)}>Test Summary</Button>;
        let accTestsButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(accTestOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, accTestOption, userViewOptions, currentViewDataValue)}>Acceptance Tests</Button>;
        let intTestsButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(intTestOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, intTestOption, userViewOptions, currentViewDataValue)}>Integration Tests</Button>;
        let unitTestsButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(unitTestOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, unitTestOption, userViewOptions, currentViewDataValue)}>Unit Tests</Button>;
        let accFilesButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(ViewOptionType.DEV_FILES, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, ViewOptionType.DEV_FILES, userViewOptions, currentViewDataValue)}>Feature Files</Button>;
        let domainDictionaryButton =
            <Button bsSize="xs" bsStyle={this.getOptionButtonStyle(dictOption, userViewOptions)} onClick={ () => this.onToggleViewOption(userContext, dictOption, userViewOptions, currentViewDataValue)}>Domain Dict</Button>;


        let configureScreenButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onGoToConfigure()}>Change Role</Button>;

        let selectionScreenButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onGoToSelection()}>Selection Menu</Button>;

        let refreshTestDataButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onRefreshTestData(userContext, userViewOptions)}>Refresh Test Data</Button>;

        let exportToDevButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onExportFeatureUpdates(userContext)}>Export Feature Updates</Button>;

        // The message display depends on the type of message being displayed
        let headerInfoStyle = message.messageType;

        let domStyle = (domainDictionaryVisible ? 'success' : 'default');

        let userData =
            <div>
                <span className="header-data">{userName}</span>
                <span className="header-title">({userRole})</span>
            </div>;

        let headerMessage =
            <Alert bsStyle={headerInfoStyle}>
                {message.messageText}
            </Alert>;

        let roleClass = '';
        let viewText = TextLookups.viewText(view);

        switch(userRole){
            case RoleType.DESIGNER:
                roleClass = 'designer';
                appName = appName + ' - DESIGNER - ' + viewText;
                break;
            case RoleType.DEVELOPER:
                roleClass = 'developer';
                appName = appName + '  - DEVELOPER - ' + viewText;
                break;
            case RoleType.MANAGER:
                roleClass = 'manager';
                appName = appName + '  - MANAGER - ' + viewText;
                break;
            default:
                roleClass = 'no-role';
        }

        // Display the required buttons for the current view
        switch(view){
            case ViewType.AUTHORISE:
                break;
            case ViewType.CONFIGURE:
                headerUserInfo = userData;
                break;
            case ViewType.DESIGNS:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{configureScreenButton}</ButtonToolbar>;
                break;
            case ViewType.SELECT:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{configureScreenButton}{designsButton}</ButtonToolbar>;
                break;
            case ViewType.DESIGN_NEW_EDIT:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                        {refreshTestDataButton}
                    </ButtonToolbar>;
                headerBottomActionsOne =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {viewModeEditButton}
                            {viewModeViewButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {viewFeatureLevelButton}
                            {viewSectionLevelButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {designFixedButton}
                            {detailsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {testSummaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.DESIGN_PUBLISHED_VIEW:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                        {refreshTestDataButton}
                    </ButtonToolbar>;
                headerBottomActionsOne =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {viewFeatureLevelButton}
                            {viewSectionLevelButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {designFixedButton}
                            {detailsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {testSummaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                        {refreshTestDataButton}
                    </ButtonToolbar>;
                headerBottomActionsOne =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {viewModeEditButton}
                            {viewModeViewButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {scopeFixedButton}
                            {designFixedButton}
                            {detailsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {testSummaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.DESIGN_UPDATE_VIEW:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                        {refreshTestDataButton}
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {scopeFixedButton}
                            {designFixedButton}
                            {detailsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {testSummaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {scopeFixedButton}
                            {designFixedButton}
                            {detailsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {designFixedButton}
                            {detailsFixedButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                headerUserInfo = userData;
                headerTopActions =
                    <ButtonToolbar>
                        {designsButton}
                        {configureScreenButton}
                        {selectionScreenButton}
                        {refreshTestDataButton}
                    </ButtonToolbar>;
                headerBottomActionsTwo =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {designFixedButton}
                            {detailsButton}
                            {accTestsButton}
                            {accFilesButton}
                            {intTestsButton}
                            {unitTestsButton}
                            {domainDictionaryButton}
                        </ButtonGroup>
                        <ButtonGroup>
                            {testSummaryButton}
                        </ButtonGroup>
                    </ButtonToolbar>;
                break;
            default:
                console.log("Invalid view type");
        }

        if (view) {
            // Only show data once context is established
            let appData = <div></div>;

            if(userContext){
                appData = <AppHeaderDataContainer params={{
                    view: view,
                    userContext: userContext
                }}/>;
            }

            return (

                <Grid>
                    <Row className={roleClass}>
                        <Col md={11}>
                            <div className="ultrawide-logo">{appName}</div>
                        </Col>
                        <Col md={1}>
                            <ButtonToolbar className="top-header-buttons">
                                 {logoutButton}
                            </ButtonToolbar>
                        </Col>
                    </Row>
                    <Row className="header-row-top">
                        <Col md={3}>
                            {headerUserInfo}
                        </Col>
                        <Col md={5}>
                            {headerMessage}
                        </Col>
                        <Col md={4}>
                            {headerTopActions}
                        </Col>
                    </Row>
                    <Row className="header-row-bottom">
                        <Col md={6}>
                            {appData}
                        </Col>
                        <Col md={2}>
                            {headerBottomActionsOne}
                        </Col>
                        <Col md={4}>
                            {headerBottomActionsTwo}
                        </Col>
                    </Row>
                </Grid>

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
        currentProgressDataValue:   state.currentProgressDataValue,
        currentViewDataValue:       state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AppHeader = connect(mapStateToProps)(AppHeader);

export default AppHeader;


