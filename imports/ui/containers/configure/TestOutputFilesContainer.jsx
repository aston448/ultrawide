
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import {AddActionIds} from "../../../constants/ui_context_ids";
import {LogLevel} from "../../../constants/constants";
import {log} from "../../../common/utils";

import TestOutputFile           from '../../components/configure/TestOutputFile.jsx';
import ItemList                 from '../../components/select/ItemList.jsx';

// Ultrawide Services
import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { ClientTestOutputLocationServices }     from '../../../apiClient/apiClientTestOutputLocations.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Output Files Container.  List of test output files for an output location
//
// ---------------------------------------------------------------------------------------------------------------------

class TestOutputFilesScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewLocationFile(role, locationId) {
        ClientTestOutputLocationServices.addLocationFile(role, locationId);
    };

    getLocationName(locationId){
        return ClientTestOutputLocationServices.getLocationName(locationId);
    }

    renderFilesList(files){
        return files.map((file) => {
            return (
                <TestOutputFile
                    key={file._id}
                    locationFile={file}
                />
            );
        });
    };

    noFiles() {
        return (
            <div className="design-item-note">No Files Defined</div>
        )
    }
    selectALocation(){
        return (
            <div className="design-item-note">Select a location...</div>
        )
    }


    render() {

        const {locationFiles, userRole, locationId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Test Output Files');

        let bodyDataFunction = null;
        let hasFooterAction = true;
        let footerActionFunction = null;
        let footerAction = 'Add File';
        let footerActionUiContext = AddActionIds.UI_CONTEXT_ADD_TEST_FILE;

        const locationName = this.getLocationName(locationId);

        let headerText = 'Test Output Files';

        if(locationName !== 'NONE'){
            headerText = 'Test Output Files for ' + locationName;
        }

        if(locationFiles && locationFiles.length > 0) {
            bodyDataFunction = () => this.renderFilesList(locationFiles);
            footerActionFunction = () => this.addNewLocationFile(userRole, locationId);
        } else {
            if(locationId !== 'NONE'){
                bodyDataFunction = () => this.noFiles();
                footerActionFunction = () => this.addNewLocationFile(userRole, locationId);
            } else {
                bodyDataFunction = () => this.selectALocation();
                hasFooterAction = false;
                footerAction = '';
            }
        }

        return(
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
                footerActionUiContext={footerActionUiContext}
                footerActionFunction={footerActionFunction}
            />
        );

    };
}

TestOutputFilesScreen.propTypes = {
    locationFiles:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        locationId:     state.currentUserTestOutputLocationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
TestOutputFilesScreen = connect(mapStateToProps)(TestOutputFilesScreen);



export default TestOutputFilesContainer = createContainer(({params}) => {

    const locationFiles =  ClientDataServices.getTestOutputLocationFiles(params.locationId);
    return {locationFiles: locationFiles};

}, TestOutputFilesScreen);