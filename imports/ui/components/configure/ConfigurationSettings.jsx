
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';

// Ultrawide GUI Components

// Ultrawide Services
import ClientUserSettingsServices               from '../../../apiClient/apiClientUserSettings.js';
import ClientTestOutputLocationServices         from '../../../apiClient/apiClientTestOutputLocations.js';

import {UserSettingValue, UserSetting} from '../../../constants/constants.js';

// Bootstrap
import {FormGroup, Radio, Grid, Row, Col} from 'react-bootstrap';

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

    onSaveSettings(role){

        event.preventDefault();

    }

    onUpload(event){
        ClientTestOutputLocationServices.uploadTestFile(event.target.files[0]);
    }

    render() {
        const {userRole, currentWindowSize} = this.props;

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

        const testDir = 'ultrawide_data/tests';

        const uploadLocalTestFiles =
            <div className="file-picker">
                <div className="design-item-note">Upload local test results file to: </div>
                <div className="design-item-note">{testDir}</div>
                <input className="design-item-note" id="files" type="file" onChange={(e) => this.onUpload(e)}/>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------
        const settingsGrid = (
            <Grid>
                <Row>
                    <Col md={4}>
                        {screenSizeSettings}
                    </Col>
                    <Col md={4}>
                        {uploadLocalTestFiles}
                    </Col>
                </Row>
            </Grid>
        );

        return (
            settingsGrid
        )

    }
}

ConfigurationSettings.propTypes = {
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:           state.currentUserRole,
        userContext:        state.currentUserItemContext,
        currentWindowSize:  state.currentWindowSize
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ConfigurationSettings);

