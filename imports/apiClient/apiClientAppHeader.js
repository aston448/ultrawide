// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignComponents } from '../collections/design/design_components.js';

// Ultrawide Services
import { ViewType, ViewOptionType, ComponentType } from '../constants/constants.js';
import ClientMashDataServices from '../apiClient/apiClientMashData.js';

// REDUX services
import store from '../redux/store'
import {changeApplicationMode, setCurrentView, setCurrentUserViewOptions, updateViewOptionsData, setCurrentUserOpenDesignItems} from '../redux/actions'


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

    setViewLevelFeatures(userContext){

        // Open everything down to the Feature level - i.e. all Applications and Design Sections and close everything else
        let componentArray = [];

        if(userContext.designUpdateId === 'NONE'){

            const designVersionOpenComponents = DesignComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
                },
                {fields: {_id: 1}}
            );

            designVersionOpenComponents.forEach((component) => {
                componentArray.push(component._id);
            });

            store.dispatch(setCurrentUserOpenDesignItems(
                Meteor.userId(),
                componentArray,
                null,
                true
            ));
        }
    }

    setViewLevelSections(userContext){

        // Open everything down to the Section level - i.e. all Applications open
        let componentArray = [];

        if(userContext.designUpdateId === 'NONE'){

            const designVersionOpenComponents = DesignComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: ComponentType.APPLICATION

                },
                {fields: {_id: 1}}
            );

            designVersionOpenComponents.forEach((component) => {
                componentArray.push(component._id);
            });

            store.dispatch(setCurrentUserOpenDesignItems(
                Meteor.userId(),
                componentArray,
                null,
                true
            ));
        }
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
