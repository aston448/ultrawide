// == IMPORTS ==========================================================================================================
import fs from 'fs';

// Ultrawide Collections
import { TestOutputLocations }              from '../collections/configure/test_output_locations.js';

// Ultrawide Services
import { ViewType, MessageType }            from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { TestOutputLocationMessages }       from '../constants/message_texts.js'

import ServerTestOutputLocationApi          from '../apiServer/apiTestOutputLocations';
import TestOutputLocationValidationApi      from '../apiValidation/apiTestOutputLocationValidation.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserTestOutputLocation, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for Test Output Locations
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientTestOutputLocationServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new Location ----------------------------------------------------------------------------------------
    addLocation(userRole, userContext){

        // Client validation
        let result = TestOutputLocationValidationApi.validateAddLocation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.addLocation(userRole, userContext.userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves Location details -------------------------------------------------------------------------------------
    saveLocation(userRole, location){

        // Client validation
        let result = TestOutputLocationValidationApi.validateSaveLocation(userRole, location);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.saveLocation(userRole, location, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User removes a Location -----------------------------------------------------------------------------------------
    removeLocation(userRole, locationId){

        // Client validation
        let result = TestOutputLocationValidationApi.validateRemoveLocation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.removeLocation(userRole, locationId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User adds a new Location File -----------------------------------------------------------------------------------
    addLocationFile(userRole, locationId){

        // Client validation
        let result = TestOutputLocationValidationApi.validateAddLocationFile(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.addLocationFile(userRole, locationId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_FILE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User saves Location File details --------------------------------------------------------------------------------
    saveLocationFile(userRole, locationFile){

        // Client validation
        let result = TestOutputLocationValidationApi.validateSaveLocationFile(userRole, locationFile);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.saveLocationFile(userRole, locationFile, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_FILE_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User removes a Location File ------------------------------------------------------------------------------------
    removeLocationFile(userRole, locationFileId){

        // Client validation
        let result = TestOutputLocationValidationApi.validateRemoveLocationFile(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.removeLocationFile(userRole, locationFileId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_FILE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    uploadTestFile(locationFile, locationName){

        let fileReader = new FileReader();
        let encoding = "binary";
        let name = locationFile.name;

        fileReader.onload = () => {

            if(fileReader.readAsBinaryString) {

                ServerTestOutputLocationApi.uploadTestResultsFile(fileReader.result, name, locationName, encoding, (err, result) => {

                    if (err) {
                        // Unexpected error as all expected errors already handled - show alert.
                        // Can't update screen here because of error
                        alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                    } else {

                        // Show action success on screen
                        store.dispatch(updateUserMessage({
                            messageType: MessageType.INFO,
                            messageText: 'File ' + name + " uploaded"
                        }));
                    }
                });

            } else {

                let binary = "";
                let bytes = new Uint8Array(fileReader.result);
                let length = bytes.byteLength;
                for(let i=0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }

                ServerTestOutputLocationApi.uploadTestResultsFile(binary, name, locationName, encoding, (err, result) => {

                    if (err) {
                        // Unexpected error as all expected errors already handled - show alert.
                        // Can't update screen here because of error
                        alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                    } else {

                        // Show action success on screen
                        store.dispatch(updateUserMessage({
                            messageType: MessageType.INFO,
                            messageText: 'File ' + name + " uploaded"
                        }));
                    }
                });
            }
        };

        fileReader.onloadend = (e) => {
            console.log(e);
        };
        fileReader.onloadstart = (e) => {
            console.log(e);
        };
        fileReader.onprogress = (e) => {
            console.log(e);
        };
        fileReader.onabort = (e) => {
            console.log(e);
        };
        fileReader.onerror = (e) => {
            console.log(e);
        };

        if(fileReader.readAsBinaryString) {
            fileReader.readAsBinaryString(locationFile);
        } else {
            fileReader.readAsArrayBuffer(locationFile);
        }
    }

    // User changes local configuration --------------------------------------------------------------------------------
    saveUserConfiguration(userConfiguration){

        // Client validation
        let result = TestOutputLocationValidationApi.validateSaveUserConfiguration();

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.saveUserConfiguration(userConfiguration, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_USER_CONFIGURATION_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // Update of user location configuration ---------------------------------------------------------------------------
    updateUserConfiguration(userId){

        // Real action call - server actions
        ServerTestOutputLocationApi.updateUserConfiguration(userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };



    // LOCAL CLIENT ACTIONS ============================================================================================

    // Keep track of the currently selected location
    selectLocation(locationId){

        store.dispatch(setCurrentUserTestOutputLocation(locationId));

    };

    getLocationName(locationId){

        const location =  TestOutputLocations.findOne({_id: locationId});

        if(location){
            return location.locationName;
        } else {
            return 'NONE';
        }
    };
}

export default new ClientTestOutputLocationServices();

