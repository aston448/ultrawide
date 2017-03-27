// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignVersionComponents } from '../collections/design/design_version_components.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents } from '../collections/work/work_package_components.js';

// Ultrawide Services
import { ViewType, ViewMode, ViewOptionType, ComponentType, RoleType, DisplayContext } from '../constants/constants.js';
import ClientTestIntegrationServices from '../apiClient/apiClientTestIntegration.js';


// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentRole, setCurrentUserName, setCurrentViewMode, setCurrentView, setCurrentUserViewOptions, updateViewOptionsData, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems, updateUserMessage, updateOpenItemsFlag} from '../redux/actions'


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

    setEditorMode(newMode, view, viewOptions){

        // Sets the design editor to Edit or View mode

        // If in Design Update Edit need to make sure Test Summary turned off when going back to edit mode...
        if(view === ViewType.DESIGN_UPDATE_EDIT && newMode === ViewMode.MODE_EDIT){
            viewOptions.updateTestSummaryVisible = false;

            store.dispatch(setCurrentUserViewOptions(viewOptions, true));
        }

        store.dispatch(setCurrentViewMode(newMode));
        return true;
    };

    toggleViewOption(view, userContext, userRole, optionType, currentOptions, currentDataValue, testDataFlag, testIntegrationDataContext){
        // Toggles a particular view option
        let newOptions = currentOptions;

        console.log('toggling option ' + optionType);

        newOptions[optionType] = !currentOptions[optionType];

        store.dispatch(setCurrentUserViewOptions(newOptions, true));
        store.dispatch(updateViewOptionsData(!currentDataValue));

        // Special action require for view options:
        switch(optionType){
            case ViewOptionType.DESIGN_TEST_SUMMARY:
            case ViewOptionType.UPDATE_TEST_SUMMARY:
            case ViewOptionType.DEV_TEST_SUMMARY:
                if(newOptions[optionType]){
                    // Item is being switched on so load up the data
                    ClientTestIntegrationServices.updateTestSummaryData(view, userContext, userRole, newOptions, testDataFlag, testIntegrationDataContext);
                }
                break;
            case ViewOptionType.DEV_ACC_TESTS:
            case ViewOptionType.DEV_INT_TESTS:
            case ViewOptionType.DEV_UNIT_TESTS:
                if(newOptions[optionType]){
                    // Item is being switched on so load up the data
                    ClientTestIntegrationServices.updateWorkPackageTestData(userContext, userRole, newOptions, testDataFlag, testIntegrationDataContext);
                }
                break;
            default:
              // No action
        }

        return {success: true, message: ''};
    }

    setViewLevelFeatures(userContext, displayContext){

        console.log("Setting to Features for user context WP: " + userContext.workPackageId);

        // Open everything down to the Feature level - i.e. all Applications and Design Sections and close everything else
        let componentArray = [];

        if(userContext.workPackageId !== 'NONE'){

            // WP situation - is it a Base Design or Design Update WP?
            if(userContext.designUpdateId === 'NONE'){

                componentArray = this.getDesignVersionFeatures(userContext);

            } else {

                componentArray = this.getDesignUpdateFeatures(userContext);
            }

            store.dispatch(setCurrentUserOpenWorkPackageItems(
                componentArray,
                null,
                null
            ));

            store.dispatch((updateOpenItemsFlag('NONE')));

        } else {

            // Not a WP - do we want to be displaying Update or Base Version components?

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE){

               componentArray = this.getDesignVersionFeatures(userContext);

                store.dispatch(setCurrentUserOpenDesignItems(
                    componentArray,
                    null,
                    null
                ));

                store.dispatch((updateOpenItemsFlag('NONE')));

            } else {

                componentArray = this.getDesignUpdateFeatures(userContext);

                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    componentArray,
                    null,
                    null
                ));

                store.dispatch((updateOpenItemsFlag('NONE')));
            }
        }


    }

    setViewLevelSections(userContext, displayContext){

        // Open everything down to the Section level - i.e. all Applications open and any sections that contain only other sections
        let componentArray = [];

        if(userContext.workPackageId !== 'NONE'){

            // WP situation - is it a Base Design or Design Update WP?
            if(userContext.designUpdateId === 'NONE'){

                componentArray = this.getDesignVersionSections(userContext);

            } else {

                componentArray = this.getDesignUpdateSections(userContext);
            }

            store.dispatch(setCurrentUserOpenWorkPackageItems(
                componentArray,
                null,
                null
            ));

            store.dispatch((updateOpenItemsFlag('NONE')));

        } else {

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE){

                componentArray = this.getDesignVersionSections(userContext);

                store.dispatch(setCurrentUserOpenDesignItems(
                    componentArray,
                    null,
                    null
                ));

                store.dispatch((updateOpenItemsFlag('NONE')));

            } else {

                componentArray = this.getDesignUpdateSections(userContext);

                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    componentArray,
                    null,
                    null
                ));

                store.dispatch((updateOpenItemsFlag('NONE')));

            }
        }
    }

    getDesignVersionFeatures(userContext){

        const componentArray = [];

        const designVersionOpenComponents = DesignVersionComponents.find(
            {
                designVersionId: userContext.designVersionId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );

        designVersionOpenComponents.forEach((component) => {
            componentArray.push(component._id);
        });

        return componentArray;
    }

    getDesignUpdateFeatures(userContext){

        const componentArray = [];

        const designUpdateOpenComponents = DesignUpdateComponents.find(
            {
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );

        designUpdateOpenComponents.forEach((component) => {
            componentArray.push(component._id);
        });

        return componentArray;
    }

    getDesignVersionSections(userContext){

        const componentArray = [];

        const designVersionOpenComponents = DesignVersionComponents.find(
            {
                designVersionId: userContext.designVersionId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}

            },
            {fields: {_id: 1, componentReferenceId: 1}}
        ).fetch();

        designVersionOpenComponents.forEach((component) => {
            if(this.hasNoFeaturesDc(userContext, component)) {
                componentArray.push(component._id);
            }
        });

        return componentArray;
    }

    getDesignUpdateSections(userContext){

        const componentArray = [];

        const designUpdateOpenComponents = DesignUpdateComponents.find(
            {
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1, componentReferenceId: 1}}
        ).fetch();

        // Add only sections that have no Features in Design Update
        designUpdateOpenComponents.forEach((component) => {
            if(this.hasNoFeaturesDu(userContext, component)) {

                componentArray.push(component._id);
            }
        });

        return componentArray;
    }

    hasNoFeaturesDc(userContext, component){

        // Returns true if there are no features that are children of the component
        return DesignVersionComponents.find({
                designVersionId:                userContext.designVersionId,
                componentParentReferenceIdNew:  component.componentReferenceId,
                componentType:                  ComponentType.FEATURE
            }).count() === 0;
    }

    hasNoFeaturesDu(userContext, component){

        // Returns true if there are no features that are children of the component
        return DesignUpdateComponents.find({
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                componentParentReferenceIdNew:  component.componentReferenceId,
                componentType:                  ComponentType.FEATURE
            }).count() === 0;
    }

    setViewDesigns() {
        // Returns to the Design selection screen
        store.dispatch(setCurrentView(ViewType.DESIGNS));
        return true;
    }

    setViewTestOutput() {
        store.dispatch(setCurrentView(ViewType.TEST_OUTPUTS));
        return true;
    }

    setViewConfigure() {
        // Returns to the Config Screen
        store.dispatch(setCurrentView(ViewType.CONFIGURE));
        return true;
    }

    setViewRoles() {
        // Returns to the Change Role Screen
        store.dispatch(setCurrentView(ViewType.HOME));
        return true;
    }

    setViewSelection(){
        // Returns to the Design Version selection screen
        store.dispatch(setCurrentView(ViewType.SELECT));
        return true;
    };

    setViewLogin(userContext){

        // Will be no context for Admin user
        if(userContext) {

            Meteor.call('impex.exportData');

            // Clear User Context
            const emptyContext = {
                userId: userContext.userId,
                designId: 'NONE',
                designVersionId: 'NONE',
                designUpdateId: 'NONE',
                workPackageId: 'NONE',
                designComponentId: 'NONE',
                designComponentType: 'NONE',
                featureReferenceId: 'NONE',
                featureAspectReferenceId: 'NONE',
                scenarioReferenceId: 'NONE',
                scenarioStepId: 'NONE'
            };

            // Update REDUX but DON'T save to DB!
            store.dispatch(setCurrentUserItemContext(emptyContext, false));


            // Clear role and username
            store.dispatch(setCurrentRole(RoleType.NONE));
            store.dispatch(setCurrentUserName(''));
        }

        // Returns to the login screen
        Meteor.logout();

        store.dispatch(setCurrentView(ViewType.AUTHORISE));
        return true
    };



}

export default new ClientAppHeaderServices();
