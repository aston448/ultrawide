// == IMPORTS ==========================================================================================================

// Meteor / React Services


// Ultrawide Services
import { ViewType, ViewOptionType } from '../constants/constants.js';
import ClientMashDataServices from '../apiClient/apiClientMashData.js';

// REDUX services
import store from '../redux/store'
import {changeApplicationMode, setCurrentView, setCurrentUserViewOptions, updateViewOptionsData} from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client App Header Services - Supports client calls for actions originating in the application header option buttons
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientAppHeaderServices{

    setEditorMode(newMode){
        // Sets the design editor to Edit or View mode
        store.dispatch(changeApplicationMode(newMode));
        return true;
    };

    toggleViewOption(userContext, optionType, currentOptions, currentDataValue){
        // Toggles a particular view option
        let newOptions = currentOptions;

        newOptions[optionType] = !currentOptions[optionType];

        store.dispatch(setCurrentUserViewOptions(newOptions, true));
        store.dispatch(updateViewOptionsData(!currentDataValue));

        if(optionType === ViewOptionType.DESIGN_TEST_SUMMARY && newOptions[optionType]){
            // Summary is being switched on
            ClientMashDataServices.updateTestSummaryData(userContext);
        }

        return true;
    }

    setViewDesigns() {
        // Returns to the Design selection screen
        store.dispatch(setCurrentView(ViewType.DESIGNS));
        return true;
    }

    setViewConfigure() {
        // Returns to the Change Role or Config Screen
        store.dispatch(setCurrentView(ViewType.CONFIGURE));
        return true;
    }

    setViewSelection(){
        // Returns to the Design Version selection screen
        store.dispatch(setCurrentView(ViewType.SELECT));
        return true;
    };

    setViewLogin(){
        Meteor.call('impex.exportData');

        // Returns to the login screen
        Meteor.logout();

        store.dispatch(setCurrentView(ViewType.AUTHORISE));
        return true
    }

}

export default new ClientAppHeaderServices();
