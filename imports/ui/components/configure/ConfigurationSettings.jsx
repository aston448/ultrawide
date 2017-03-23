
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components


// Ultrawide Services
import ClientTestOutputLocationServices from '../../../apiClient/apiClientTestOutputLocations.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';

import { createSelectionList } from '../../../common/utils.js'
import {WindowSize, TestLocationFileTypes, TestRunner, TestRunners} from '../../../constants/constants.js';


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

        ClientUserContextServices.setWindowSize(newSize);
    }

    onSaveSettings(role){

        event.preventDefault();

    }


    render() {
        const {userRole, currentWindowSize} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        const screenSizeSettings =
            <div>
                <FormGroup id="sizeOptions">
                    <Radio id="optionLarge" checked={this.state.currentWindowSize === WindowSize.WINDOW_LARGE}
                           onChange={() => this.onWindowSizeChange(WindowSize.WINDOW_LARGE)}>
                        View Height Large (1200px)
                    </Radio>
                    <Radio id="optionSmall" checked={this.state.currentWindowSize === WindowSize.WINDOW_SMALL}
                           onChange={() => this.onWindowSizeChange(WindowSize.WINDOW_SMALL)}>
                        View Height Small (900px)
                    </Radio>
                </FormGroup>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------
        const settingsGrid = (
            <Grid>
                <Row>
                    <Col md={4}>
                        {screenSizeSettings}
                    </Col>
                    <Col md={4}>

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

