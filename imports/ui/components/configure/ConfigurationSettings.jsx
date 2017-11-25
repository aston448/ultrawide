
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestOutputsContainer                     from '../../containers/configure/TestOutputsContainer.jsx';
import UserTestOutputsContainer                 from '../../containers/configure/UserTestOutputsContainer.jsx';

// Ultrawide Services
import ClientUserSettingsServices               from '../../../apiClient/apiClientUserSettings.js';
import ClientUserManagementServices             from '../../../apiClient/apiClientUserManagement.js';
import ClientDocumentServices                   from '../../../apiClient/apiClientDocument.js';

import {UserSettingValue, UserSetting} from '../../../constants/constants.js';

// Data Services
import DesignVersionData                        from '../../../data/design/design_version_db.js';

// Bootstrap
import {Well, ControlLabel, FormControl, Button, InputGroup}     from 'react-bootstrap';
import {FormGroup, Radio, Checkbox, Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Configuration Settings
//
// ---------------------------------------------------------------------------------------------------------------------

export class ConfigurationSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentWindowSize: this.props.currentWindowSize,
            currentIntOutputPath: this.props.intTestOutputDir,
            includeNarratives: this.props.includeNarratives === UserSettingValue.SETTING_INCLUDE,
            oldPassword: '',
            newPassword1: '',
            newPassword2: '',
            includeSectionDetails: (this.props.includeSectionDetails === UserSettingValue.SETTING_INCLUDE),
            includeNarrativeDetails: (this.props.includeNarrativeDetails === UserSettingValue.SETTING_INCLUDE),
            includeFeatureDetails: (this.props.includeFeatureDetails === UserSettingValue.SETTING_INCLUDE),
            includeScenarioDetails: (this.props.includeScenarioDetails === UserSettingValue.SETTING_INCLUDE)
        };

    }

    onWindowSizeChange(newSize){

        this.setState({currentWindowSize: newSize});

        ClientUserSettingsServices.setWindowSize(newSize);

        // And save to DB
        ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_SCREEN_SIZE, newSize);
    }

    onNarrativeOptionsChange(){

        let newValue = UserSettingValue.SETTING_INCLUDE;
        let wasInclude = false;

        // Toggle
        wasInclude = this.state.includeNarratives;
        this.setState({includeNarratives: !this.state.includeNarratives});

        if(wasInclude){
            newValue = UserSettingValue.SETTING_EXCLUDE;
        }

        // Update Redux
        ClientUserSettingsServices.setIncludeNarratives(newValue);

        // Save to DB
        ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_INCLUDE_NARRATIVES, newValue);
    }

    onUpdateIntOutputPath(e){

        // Call this to prevent Submit reloading the page
        e.preventDefault();

        ClientUserSettingsServices.setIntTestOutputDir(this.state.currentIntOutputPath);

        ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_INT_OUTPUT_LOCATION, this.state.currentIntOutputPath);
    }

    updateOldPassword(e){
        this.setState({oldPassword: e.target.value});
    }

    updateNewPassword1(e){
        this.setState({newPassword1: e.target.value});
    }

    updateNewPassword2(e){
        this.setState({newPassword2: e.target.value});
    }

    updateIntOutputDir(e){
        this.setState({currentIntOutputPath: e.target.value});
    }

    onUpdateUserPassword(e){

        // Call this to prevent Submit reloading the page
        e.preventDefault();

        ClientUserManagementServices.changeUserPassword(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2);
    }

    updateDocumentOptions(settingType){

        // Assume new value is include until we find it not to be
        let newValue = UserSettingValue.SETTING_INCLUDE;
        let wasInclude = false;

        switch (settingType){
            case UserSetting.SETTING_DOC_TEXT_SECTION:

                // Toggle
                wasInclude = this.state.includeSectionDetails;
                this.setState({includeSectionDetails: !this.state.includeSectionDetails});

                if(wasInclude){
                    newValue = UserSettingValue.SETTING_EXCLUDE;
                }
                break;

            case UserSetting.SETTING_DOC_TEXT_FEATURE:

                // Toggle
                wasInclude = this.state.includeFeatureDetails;
                this.setState({includeFeatureDetails: !this.state.includeFeatureDetails});

                if(wasInclude){
                    newValue = UserSettingValue.SETTING_EXCLUDE;
                }
                break;

            case UserSetting.SETTING_DOC_TEXT_NARRATIVE:

                // Toggle
                wasInclude = this.state.includeNarrativeDetails;
                this.setState({includeNarrativeDetails: !this.state.includeNarrativeDetails});

                if(wasInclude){
                    newValue = UserSettingValue.SETTING_EXCLUDE;
                }
                break;

            case UserSetting.SETTING_DOC_TEXT_SCENARIO:

                // Toggle
                wasInclude = this.state.includeScenarioDetails;
                this.setState({includeScenarioDetails: !this.state.includeScenarioDetails});

                if(wasInclude){
                    newValue = UserSettingValue.SETTING_EXCLUDE;
                }
                break;
        }

        // Persist settings for user
        ClientUserSettingsServices.saveUserSetting(settingType, newValue);

    }

    getDesignVersionName(userContext){

        const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);
        return dv.designVersionName;

    }

    exportWordDoc(designId, designVersionId){

        let options = {
            includeSectionText: (this.state.includeSectionDetails),
            includeFeatureText: (this.state.includeFeatureDetails),
            includeNarrativeText: (this.state.includeNarrativeDetails),
            includeScenarioText: (this.state.includeScenarioDetails)
        };

        ClientDocumentServices.exportWordDocument(designId, designVersionId, options);
    }

    render() {

        const {userContext} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        const screenSizeSettings =
            <Well className="settings-well">
                <FormGroup id="sizeOptions">
                    <Radio id="optionLarge" checked={this.state.currentWindowSize === UserSettingValue.SCREEN_SIZE_LARGE}
                           onChange={() => this.onWindowSizeChange(UserSettingValue.SCREEN_SIZE_LARGE)}>
                        View Height Large (1100px)
                    </Radio>
                    <Radio id="optionSmall" checked={this.state.currentWindowSize === UserSettingValue.SCREEN_SIZE_SMALL}
                           onChange={() => this.onWindowSizeChange(UserSettingValue.SCREEN_SIZE_SMALL)}>
                        View Height Small (900px)
                    </Radio>
                </FormGroup>
            </Well>;

        const narrativeSetting =
            <Well className="settings-well">
                <FormGroup id="narrativeOptions">
                    <Checkbox id="optionIncludeNarratives" checked={this.state.includeNarratives}
                              onChange={() => this.onNarrativeOptionsChange(UserSetting.SETTING_INCLUDE_NARRATIVES)}>
                        Include Narratives in Features
                    </Checkbox>
                </FormGroup>
            </Well>;

        let pathValue = this.state.currentIntOutputPath;
        if(!pathValue){
            pathValue = 'Not Set';
        }
        const intTestOutputPath =
            <Well className="settings-well">
                <form onSubmit={(e) => this.onUpdateIntOutputPath(e)}>
                    <div className="design-item-header">Set Integration Test Output Path</div>
                    <div className="design-item-note">Set to a directory where you can safely generate integration test template files</div>
                    <FormGroup controlId="intOutputDir">
                        <ControlLabel>Directory:</ControlLabel>
                        <FormControl ref="intOutputDir" type="input" value={pathValue} onChange={(e) => this.updateIntOutputDir(e)}/>
                    </FormGroup>
                    <Button type="submit">
                        Save
                    </Button>
                </form>
            </Well>;

        const changeUserPassword =
            <Well className="settings-well">
                <form onSubmit={(e) => this.onUpdateUserPassword(e)}>
                    <div className="design-item-header">Change My Password</div>
                    <div className="design-item-note">You'll need to remember it so be careful!</div>
                    <FormGroup controlId="configOldPassword">
                        <ControlLabel>Current Password:</ControlLabel>
                        <FormControl id="configOldPassword" ref="configOldPassword" type="password" onChange={(e) => this.updateOldPassword(e)}/>
                    </FormGroup>
                    <FormGroup controlId="configNewPassword1">
                        <ControlLabel>New Password:</ControlLabel>
                        <FormControl id="configNewPassword1" ref="configNewPassword1" type="password" onChange={(e) => this.updateNewPassword1(e)}/>
                    </FormGroup>
                    <FormGroup controlId="configNewPassword2">
                        <ControlLabel>Repeat New Password:</ControlLabel>
                        <FormControl id="configNewPassword2" ref="configNewPassword2" type="password" onChange={(e) => this.updateNewPassword2(e)}/>
                    </FormGroup>
                    <Button id="configChangePassword" type="submit">
                        Change My Password
                    </Button>
                </form>
            </Well>;

        const settingsGrid = (
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className="user-settings-header1">Local User Settings</div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Grid>
                            <Row>
                                <Col md={12}>
                                    {screenSizeSettings}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {narrativeSetting}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    {intTestOutputPath}
                                </Col>
                            </Row>

                        </Grid>
                    </Col>
                    <Col md={6}>
                        {changeUserPassword}
                    </Col>
                </Row>
            </Grid>
        );

        const exportOptions =
            <Well className="settings-well">
                <div className="user-settings-header3">
                    Export Options:
                </div>
                <FormGroup id="exportOptions">
                    <Checkbox id="optionIncludeSectionDetails" checked={this.state.includeSectionDetails}
                            onChange={() => this.updateDocumentOptions(UserSetting.SETTING_DOC_TEXT_SECTION)}>
                        Include Details Text for Sections
                    </Checkbox>
                    <Checkbox id="optionIncludeFeatureDetails" checked={this.state.includeFeatureDetails}
                              onChange={() => this.updateDocumentOptions(UserSetting.SETTING_DOC_TEXT_FEATURE)}>
                        Include Details Text for Features
                    </Checkbox>
                    <Checkbox id="optionIncludeNarrativeDetails" checked={this.state.includeNarrativeDetails}
                              onChange={() => this.updateDocumentOptions(UserSetting.SETTING_DOC_TEXT_NARRATIVE)}>
                        Include Narrative Text for Features
                    </Checkbox>
                    <Checkbox id="optionIncludeScenarioDetails" checked={this.state.includeScenarioDetails}
                              onChange={() => this.updateDocumentOptions(UserSetting.SETTING_DOC_TEXT_SCENARIO)}>
                        Include Details Text for Scenarios
                    </Checkbox>
                </FormGroup>
            </Well>;

        const exportGrid = (
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className="user-settings-header1">Export Current Design Version as Word Document</div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className="user-settings-header2">Current Design Version: {this.getDesignVersionName(userContext)}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Grid>
                            <Row>
                                <Col md={12}>
                                    {exportOptions}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Button id="exportWordDoc" onClick={() => this.exportWordDoc(userContext.designId, userContext.designVersionId)}>
                                        Export
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
            </Grid>
        );

        const testLocationManagement =
            <TestOutputsContainer params={{
                userContext: userContext
            }}/>;

        const userTestLocationsManagement =
            <UserTestOutputsContainer params={{
                userContext: userContext
            }}/>;


        // Layout ------------------------------------------------------------------------------------------------------


        return (
            <Tabs defaultActiveKey={1} id="config-view_tabs">
                <Tab eventKey={1} title="TEST LOCATION MANAGEMENT"><div id="configTabLocations">{testLocationManagement}</div></Tab>
                <Tab eventKey={2} title="MY TEST LOCATIONS"><div id="configTabTestSettings">{userTestLocationsManagement}</div></Tab>
                <Tab eventKey={3} title="ULTRAWIDE SETTINGS"><div id="configTabMySettings">{settingsGrid}</div></Tab>
                <Tab eventKey={4} title="DOCUMENT EXPORT"><div id="configTabDocExport">{exportGrid}</div></Tab>
            </Tabs>

        )

    }
}

ConfigurationSettings.propTypes = {
    userContext:    PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentWindowSize:          state.currentWindowSize,
        includeNarratives:          state.includeNarratives,
        intTestOutputDir:           state.intTestOutputDir,
        includeSectionDetails:      state.docSectionTextOption,
        includeFeatureDetails:      state.docFeatureTextOption,
        includeNarrativeDetails:    state.docNarrativeTextOption,
        includeScenarioDetails:     state.docScenarioTextOption
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ConfigurationSettings);

