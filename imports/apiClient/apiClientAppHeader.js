// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignComponents } from '../collections/design/design_components.js';
import { WorkPackageComponents } from '../collections/work/work_package_components.js';

// Ultrawide Services
import { ViewType, ViewOptionType, ComponentType, RoleType, MessageType } from '../constants/constants.js';
import ClientTestIntegrationServices from '../apiClient/apiClientTestIntegration.js';


// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentRole, setCurrentUserName, setCurrentViewMode, setCurrentView, setCurrentUserViewOptions, updateViewOptionsData, setCurrentUserOpenDesignItems, setCurrentUserOpenWorkPackageItems, updateUserMessage} from '../redux/actions'


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
        store.dispatch(setCurrentViewMode(newMode));
        return true;
    };

    toggleViewOption(view, userContext, userRole, optionType, currentOptions, currentDataValue, testDataFlag, testIntegrationDataContext){
        // Toggles a particular view option
        let newOptions = currentOptions;

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
                    ClientTestIntegrationServices.updateTestSummaryData(userContext, userRole, newOptions, testDataFlag, testIntegrationDataContext);
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

    setViewLevelFeatures(userContext){

        // Open everything down to the Feature level - i.e. all Applications and Design Sections and close everything else
        let componentArray = [];

        if(userContext.workPackageId != 'NONE'){

            const wpOpenComponents = WorkPackageComponents.find(
                {
                    workPackageId: userContext.workPackageId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}

                },
                {fields: {_id: 1}}
            );

            wpOpenComponents.forEach((component) => {
                componentArray.push(component._id);
            });

            store.dispatch(setCurrentUserOpenWorkPackageItems(
                Meteor.userId(),
                componentArray,
                null,
                true
            ));
        }

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

        // Open everything down to the Section level - i.e. all Applications open and any sections that contain only other sections
        let componentArray = [];

        if(userContext.workPackageId != 'NONE'){

            const wpOpenComponents = WorkPackageComponents.find(
                {
                    workPackageId: userContext.workPackageId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}

                }
            ).fetch();

            wpOpenComponents.forEach((component) => {
                if(this.hasNoFeaturesWp(component)) {
                    componentArray.push(component._id);
                }
            });

            store.dispatch(setCurrentUserOpenWorkPackageItems(
                Meteor.userId(),
                componentArray,
                null,
                true
            ));

            return;
        }

        if(userContext.designUpdateId === 'NONE'){

            const designVersionOpenComponents = DesignComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}

                }
            ).fetch();

            designVersionOpenComponents.forEach((component) => {
                if(this.hasNoFeaturesDc(component)) {
                    componentArray.push(component._id);
                }
            });

            store.dispatch(setCurrentUserOpenDesignItems(
                Meteor.userId(),
                componentArray,
                null,
                true
            ));

            return;
        }
    }

    hasNoFeaturesDc(component){

        // Returns true if there are no features that are children of the component
        return count =  DesignComponents.find({
                componentParentReferenceId: component.componentReferenceId,
                componentType: ComponentType.FEATURE
            }).count() === 0;

    }

    hasNoFeaturesWp(component){

        // Returns true if there are no features that are children of the component
        return WorkPackageComponents.find({
            componentParentReferenceId: component.componentReferenceId,
            componentType: ComponentType.FEATURE
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
