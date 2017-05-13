
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestOutputsContainer                     from '../../containers/configure/TestOutputsContainer.jsx';
import LocalSettingsContainer                   from '../../containers/configure/LocalSettingsContainer.jsx';

// Ultrawide Services
import ClientUserSettingsServices               from '../../../apiClient/apiClientUserSettings.js';

import {UserSettingValue, UserSetting} from '../../../constants/constants.js';

// Bootstrap
import {FormGroup, Radio, Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

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
            currentWindowSize: this.props.currentWindowSize
        };

    }

    onWindowSizeChange(newSize){

        this.setState({currentWindowSize: newSize});

        ClientUserSettingsServices.setWindowSize(newSize);

        // And save to DB
        ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_SCREEN_SIZE, newSize);
    }


    render() {

        const {userContext} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        const screenSizeSettings =
            <div>
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
            </div>;

        const settingsGrid = (
            <Grid>
                <Row>
                    <Col md={4}>
                        {screenSizeSettings}
                    </Col>

                </Row>
            </Grid>
        );

        const testLocationManagement =
            <TestOutputsContainer params={{
                userContext: userContext
            }}/>;

        const userTestLocationsManagement =
            <LocalSettingsContainer params={{
                userContext: userContext
            }}/>;


        // Layout ------------------------------------------------------------------------------------------------------


        return (
            <Tabs defaultActiveKey={2} id="config-view_tabs">
                <Tab eventKey={1} title="TEST LOCATION MANAGEMENT">{testLocationManagement}</Tab>
                <Tab eventKey={2} title="MY TEST LOCATIONS">{userTestLocationsManagement}</Tab>
                <Tab eventKey={3} title="ULTRAWIDE SETTINGS">{settingsGrid}</Tab>
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
        currentWindowSize:  state.currentWindowSize
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ConfigurationSettings);

