// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ViewType, ViewMode, RoleType, DisplayContext } from '../constants/constants.js';
import ClientDesignUpdateServices   from '../apiClient/apiClientDesignUpdate.js';

// Data Access
import DesignData                       from '../data/design/design_db.js';
import DesignVersionData                from '../data/design/design_version_db.js';
import DesignUpdateData                 from '../data/design_update/design_update_db.js';
import WorkPackageData                  from '../data/work/work_package_db.js';
import WorkPackageComponentData         from '../data/work/work_package_component_db.js';
import DesignComponentData              from '../data/design/design_component_db.js';
import DesignUpdateComponentData        from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentRole, setCurrentUserName, setCurrentViewMode, setCurrentView, setCurrentUserViewOptions,
    updateViewOptionsData, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems,
    updateUserMessage, updateOpenItemsFlag, setDomainTermsOnOff} from '../redux/actions'


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

    getStore(){
        return store.getState();
    }

    getCurrentDesign(userContext){

        if(userContext.designId === 'NONE'){
            return 'No Design';
        } else {
            const design = DesignData.getDesignById(userContext.designId);

            if(design){
                return design.designName;
            } else {
                return 'No Design';
            }
        }
    };

    setEditorMode(newMode, view, viewOptions, userId){

        // Sets the design editor to Edit or View mode

        // If in Design Update Edit need to make sure Test Summary turned off when going back to edit mode...
        if(view === ViewType.DESIGN_UPDATE_EDIT && newMode === ViewMode.MODE_EDIT){
            viewOptions.testSummaryVisible = false;

            store.dispatch(setCurrentUserViewOptions(viewOptions, userId, true));
        }

        store.dispatch(setCurrentViewMode(newMode));
        return true;
    };

    toggleViewOption(optionType, currentOptions, userId){

        // Toggles a particular view option.  The View All As Tabs option does not change the current choice of options.
        // It just switches from viewing all options as tabs or back to viewing just the current choice

        let newOptions = currentOptions;

        newOptions[optionType] = !currentOptions[optionType];

        store.dispatch(setCurrentUserViewOptions(newOptions, userId, true));
        store.dispatch(updateViewOptionsData());

        return {success: true, message: ''};
    }


    setViewLevelFeatures(userContext, displayContext){

        //console.log("Setting to Features for user context WP: " + userContext.workPackageId);

        // Open everything down to the Feature level - i.e. all Applications and Design Sections and close everything else
        let componentArray = [];

        if(userContext.workPackageId !== 'NONE'){

            // WP situation - is it a Base Design or Design Update WP?  And are we looking at the scope or the view?
            if(userContext.designUpdateId === 'NONE'){

                if(displayContext === DisplayContext.WP_SCOPE){
                    componentArray = this.getDesignVersionFeatures(userContext);

                    store.dispatch(setCurrentUserOpenDesignItems(
                        componentArray,
                        null,
                        null
                    ));

                } else {
                    componentArray = this.getWorkPackageFeatures(userContext);

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        componentArray,
                        null,
                        null
                    ));
                }

            } else {
                if(displayContext === DisplayContext.WP_SCOPE) {
                    componentArray = this.getDesignUpdateFeatures(userContext);

                    store.dispatch(setCurrentUserOpenDesignUpdateItems(
                        componentArray,
                        null,
                        null
                    ));

                } else {
                    componentArray = this.getWorkPackageFeatures(userContext);

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        componentArray,
                        null,
                        null
                    ));
                }
            }

            store.dispatch((updateOpenItemsFlag('NONE')));

        } else {

            // Not a WP - do we want to be displaying Update or Base Version components?

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE || displayContext === DisplayContext.WORKING_VIEW){

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

                if(displayContext === DisplayContext.WP_SCOPE){
                    componentArray = this.getDesignVersionSections(userContext);

                    store.dispatch(setCurrentUserOpenDesignItems(
                        componentArray,
                        null,
                        null
                    ));

                } else {
                    componentArray = this.getWorkPackageSections(userContext);

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        componentArray,
                        null,
                        null
                    ));
                }

            } else {
                if(displayContext === DisplayContext.WP_SCOPE) {
                    componentArray = this.getDesignUpdateSections(userContext);

                    store.dispatch(setCurrentUserOpenDesignUpdateItems(
                        componentArray,
                        null,
                        null
                    ));

                } else {
                    componentArray = this.getWorkPackageSections(userContext);

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        componentArray,
                        null,
                        null
                    ));
                }
            }

            store.dispatch((updateOpenItemsFlag('NONE')));

        } else {

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE || displayContext === DisplayContext.WORKING_VIEW){

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

    toggleDomainTerms(userContext, displayContext){

        const currentSetting = store.getState().domainTermsVisible;

        store.dispatch(setDomainTermsOnOff(currentSetting));
    }

    getDesignVersionFeatures(userContext){

        const componentArray = [];

        const designVersionOpenComponents = DesignVersionData.getApplicationAndSectionIds(userContext.designVersionId);

        designVersionOpenComponents.forEach((component) => {
            componentArray.push(component._id);
        });

        return componentArray;
    }

    getDesignUpdateFeatures(userContext){

        const componentArray = [];

        // Only open scoped items
        const designUpdateOpenComponents = DesignUpdateData.getScopedApplicationAndSectionIds(userContext.designVersionId, userContext.designUpdateId);

        designUpdateOpenComponents.forEach((component) => {
            componentArray.push(component._id);
        });

        return componentArray;
    }

    getWorkPackageFeatures(userContext){

        const componentArray = [];

        // Only open scoped items
        const workPackageOpenComponents = WorkPackageData.getApplicationAndSectionIds(userContext.workPackageId);

        workPackageOpenComponents.forEach((component) => {
            componentArray.push(component._id);
        });

        return componentArray;
    }

    getDesignVersionSections(userContext){

        const componentArray = [];

        const designVersionOpenComponents = DesignVersionData.getApplicationAndSectionIdsAndRefs(userContext.designVersionId);

        designVersionOpenComponents.forEach((component) => {
            if(this.hasNoFeaturesDc(userContext, component)) {
                componentArray.push(component._id);
            }
        });

        return componentArray;
    }

    getDesignUpdateSections(userContext){

        const componentArray = [];

        // Only open scoped items
        const designUpdateOpenComponents = DesignUpdateData.getScopedApplicationAndSectionIdsAndRefs(userContext.designVersionId, userContext.designUpdateId);

        // Add only sections that have no Features in Design Update
        designUpdateOpenComponents.forEach((component) => {
            if(this.hasNoFeaturesDu(userContext, component)) {

                componentArray.push(component._id);
            }
        });

        return componentArray;
    }

    getWorkPackageSections(userContext){

        const componentArray = [];

        // Only open scoped items
        const workPackageOpenComponents = WorkPackageData.getApplicationAndSectionIdsAndRefs(userContext.workPackageId);

        // Add only sections that have no Features in Design Update
        workPackageOpenComponents.forEach((component) => {
            if(this.hasNoFeaturesWp(userContext, component)) {

                componentArray.push(component._id);
            }
        });

        return componentArray;
    }

    hasNoFeaturesDc(userContext, component){

        // Returns true if there are no features that are children of the component
        return (DesignComponentData.getChildFeatureCount(userContext.designVersionId, component.componentReferenceId) === 0);

    }

    hasNoFeaturesDu(userContext, component){

        // Returns true if there are no features that are children of the component
        return (DesignUpdateComponentData.getChildFeatureCount(
            userContext.designVersionId,
            userContext.designUpdateId,
            component.componentReferenceId
        ) === 0);
    }

    hasNoFeaturesWp(userContext, component){

        // Returns true if there are no features that are children of the component
        return (WorkPackageComponentData.getChildFeatureCount(userContext.workPackageId, component.componentReferenceId) === 0);
    }

    setViewDesigns() {
        // Returns to the Design selection screen
        store.dispatch(setCurrentView(ViewType.DESIGNS));
        return true;
    }


    setViewConfigure() {
        // Returns to the Config Screen
        store.dispatch(setCurrentView(ViewType.CONFIGURE));
        return true;
    }

    setViewRoles() {
        // Returns to the Change Role Screen
        store.dispatch(setCurrentView(ViewType.ROLES));
        return true;
    }

    setViewSelection(){
        // Returns to the Design Version selection screen
        const userContext = store.getState().currentUserItemContext;

        // Update the DU Statuses
        ClientDesignUpdateServices.updateDesignUpdateStatuses(userContext);

        // Update Work Progress
        //ClientDesignVersionServices.updateWorkProgress(userContext);

        store.dispatch(setCurrentView(ViewType.SELECT));
        return true;
    };

    setViewLogin(userContext){

        // Will be no context for Admin user
        if(userContext) {

            // // TEMP - Backup All Designs
            // const designs = Designs.find({});
            //
            // designs.forEach((design) => {
            //
            //     ClientImpExServices.backupDesign(design._id, RoleType.DESIGNER);
            // });

            //Meteor.call('impex.exportData');

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
            store.dispatch(setCurrentRole(userContext.userId, RoleType.NONE));
            store.dispatch(setCurrentUserName(''));
        }

        // Returns to the login screen
        Meteor.logout();

        store.dispatch(setCurrentView(ViewType.AUTHORISE));
        return true
    };



}

export default new ClientAppHeaderServices();
