
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd       from '../../components/common/DesignComponentAdd.jsx';
import TestOutputFile           from '../../components/configure/TestOutputFile.jsx';
import ItemContainer            from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {ViewType}                           from '../../../constants/constants.js'
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientTestOutputLocationServices     from '../../../apiClient/apiClientTestOutputLocations.js'

// Bootstrap
import {Panel} from 'react-bootstrap';

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

        let bodyDataFunction = null;
        let hasFooterAction = true;
        let footerActionFunction = null;
        let footerAction = 'Add File';

        const locationName = this.getLocationName(locationId);

        let headerText = 'Test Output Files';

        if(locationName != 'NONE'){
            headerText = 'Test Output Files for ' + locationName;
        }

        if(locationFiles && locationFiles.length > 0) {
            bodyDataFunction = () => this.renderFilesList(locationFiles);
            footerActionFunction = () => this.addNewLocationFile(userRole, locationId);
        } else {
            if(locationId != 'NONE'){
                bodyDataFunction = () => this.noFiles();
                footerActionFunction = () => this.addNewLocationFile(userRole, locationId);
            } else {
                bodyDataFunction = () => this.selectALocation();
                hasFooterAction = false;
                footerAction = '';
            }
        }

        return(
            <ItemContainer
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
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

    const locationFiles =  ClientContainerServices.getTestOutputLocationFiles(params.locationId);
    return {locationFiles: locationFiles};

}, TestOutputFilesScreen);