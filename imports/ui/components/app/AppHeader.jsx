// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppHeaderDataContainer from '../../containers/app/AppHeaderDataContainer.jsx';

// Ultrawide Services
import {ViewType, ViewMode} from '../../../constants/constants.js'
import ClientAppHeaderServices from '../../../apiClient/apiClientAppHeader.js';
import ClientMashDataServices from '../../../apiClient/apiClientMashData.js';
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

    onToggleDomainDictionary(domainDictionaryVisible){
        // Show / hide Domain Dictionary
        ClientAppHeaderServices.toggleDomainDictionary(domainDictionaryVisible);
    }

    onGoToDesigns(){
        // Back to Designs view
        ClientAppHeaderServices.setViewDesigns();
    }

    onGoToSelection(){
        // Back to Selection view
        ClientAppHeaderServices.setViewSelection();
    }

    onLogOut(){
        // Back to authorisation view (i.e. log the user out)
        ClientAppHeaderServices.setViewLogin();
    }

    onRefreshTestData(userContext){
        ClientMashDataServices.updateTestData(userContext)
    }


    render() {

        const {mode, view, userRole, userName, userContext, message, domainDictionaryVisible} = this.props;

        // The header display depends on the current application View
        let headerTopActions = '';
        let headerBottomActions = '';
        let headerUserInfo = '';

        let bsStyleEdit = (mode === ViewMode.MODE_EDIT ? 'success': 'default');
        let bsStyleView = (mode === ViewMode.MODE_VIEW ? 'success': 'default');

        let logoutButton =
                <Button bsSize="xs" bsStyle="warning" onClick={ () => this.onLogOut()}>Log Out</Button>;

        let designsButton =
                <Button bsSize="xs" bsStyle="warning" onClick={ () => this.onGoToDesigns()}>Designs</Button>;

        let viewModeEditButton =
            <Button bsSize="xs" bsStyle={bsStyleEdit} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_EDIT)}>EDIT</Button>;

        let viewModeViewButton =
            <Button bsSize="xs" bsStyle={bsStyleView} onClick={ () => this.onSetEditViewMode(ViewMode.MODE_VIEW)}>VIEW</Button>;

        let domainDictionaryButton =
            <Button bsSize="xs" bsStyle={domStyle} onClick={ () => this.onToggleDomainDictionary(domainDictionaryVisible)}>Domain</Button>;

        let selectionScreenButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onGoToSelection()}>Home</Button>;

        let refreshTestsButton =
            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onRefreshTestData(userContext)}>Get Test Results</Button>;


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
            </Alert>

        switch(view){
            case ViewType.AUTHORISE:
                break;
            case ViewType.DESIGNS:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                break;
            case ViewType.SELECT:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions = <ButtonToolbar>{designsButton}</ButtonToolbar>;
                break;
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_UPDATE_EDIT:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {viewModeEditButton}
                            {viewModeViewButton}
                        </ButtonGroup>
                        {domainDictionaryButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                break;
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATE_VIEW:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions =
                    <ButtonToolbar>
                        {domainDictionaryButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions =
                    <ButtonToolbar>
                        <ButtonGroup>
                            {viewModeEditButton}
                            {viewModeViewButton}
                        </ButtonGroup>
                        {domainDictionaryButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions =
                    <ButtonToolbar>
                        {domainDictionaryButton}
                        {selectionScreenButton}
                    </ButtonToolbar>;
                break;
            case ViewType.WORK_PACKAGE_WORK:
                headerUserInfo = userData;
                headerTopActions = <ButtonToolbar>{logoutButton}</ButtonToolbar>;
                headerBottomActions =
                    <ButtonToolbar>
                        {domainDictionaryButton}
                        {selectionScreenButton}
                        {refreshTestsButton}
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
                    currentAppView: view,
                    currentUserItemContext: userContext
                }}/>;
            }

            return (

                <Grid>
                    <Row className="header-row-top">
                        <Col md={2}>
                            <div className="ultrawide-logo">ULTRAWIDE R</div>
                        </Col>
                        <Col md={3}>
                            {headerUserInfo}
                        </Col>
                        <Col md={5}>
                            {headerMessage}
                        </Col>
                        <Col md={1}>
                            {headerTopActions}
                        </Col>
                    </Row>
                    <Row className="header-row-bottom">
                        <Col md={8}>
                            {appData}
                        </Col>
                        <Col md={4}>
                            {headerBottomActions}
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
        mode: state.currentViewMode,
        view: state.currentAppView,
        userRole: state.currentUserRole,
        userName: state.currentUserName,
        userContext: state.currentUserItemContext,
        message: state.currentUserMessage,
        domainDictionaryVisible: state.domainDictionaryVisible
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AppHeader = connect(mapStateToProps)(AppHeader);

export default AppHeader;


