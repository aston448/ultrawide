
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }   from '../collections/design/feature_background_steps.js';
import { ScenarioSteps }            from '../collections/design/scenario_steps.js';
import { DomainDictionary }         from '../collections/design/domain_dictionary.js';

// Ultrawide GUI Components


// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext, StepContext, WorkPackageType, LogLevel } from '../constants/constants.js';
import ClientDesignServices from '../apiClient/apiClientDesign.js';

import { log } from '../common/utils.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Container Services - Functions to return the data required for various GUI components
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientContainerServices{

    getApplicationData(){

        // Subscribing to these here makes them available to the whole app...
        const urHandle = Meteor.subscribe('userRoles');
        const ucHandle = Meteor.subscribe('userCurrentEditContext');
        const udHandle = Meteor.subscribe('userCurrentDevContext');
        const uuHandle = Meteor.subscribe('userCurrentDevUpdates');
        const dHandle = Meteor.subscribe('designs');
        const dvHandle = Meteor.subscribe('designVersions');
        const duHandle = Meteor.subscribe('designUpdates');
        const dcHandle = Meteor.subscribe('designComponents');
        const ducHandle = Meteor.subscribe('designUpdateComponents');
        const fbHandle = Meteor.subscribe('featureBackgroundSteps');
        const ssHandle = Meteor.subscribe('scenarioSteps');
        const ddHandle = Meteor.subscribe('domainDictionary');
        const wpHandle = Meteor.subscribe('workPackages');
        const wcHandle = Meteor.subscribe('workPackageComponents');

        const loading = (
            !urHandle.ready()   ||
            !ucHandle.ready()   ||
            !udHandle.ready()   ||
            !uuHandle.ready()   ||
            !dHandle.ready()    ||
            !dvHandle.ready()   ||
            !duHandle.ready()   ||
            !dcHandle.ready()   ||
            !ducHandle.ready()  ||
            !fbHandle.ready()   ||
            !ssHandle.ready()   ||
            !ddHandle.ready()   ||
            !wpHandle.ready()   ||
            !wcHandle.ready()
        );

        return {isLoading: loading};

    }

    getDevData(){

        // Subscribe to dev data when user enters dev work view
        const dfHandle = Meteor.subscribe('userDevFeatures');
        const dbHandle = Meteor.subscribe('userDevFeatureBackgroundSteps');
        const fsHandle = Meteor.subscribe('userDevFeatureScenarios');
        const ssHandle = Meteor.subscribe('userDevFeatureScenarioSteps');
        const fmHandle = Meteor.subscribe('designDevFeatureMash');
        const bmHandle = Meteor.subscribe('designDevFeatureBackgroundStepMash');
        const smHandle = Meteor.subscribe('designDevScenarioMash');
        const tmHandle = Meteor.subscribe('designDevScenarioStepMash');

        const loading = (
            !dfHandle.ready()   ||
            !dbHandle.ready()   ||
            !fsHandle.ready()   ||
            !ssHandle.ready()   ||
            !fmHandle.ready()   ||
            !bmHandle.ready()   ||
            !smHandle.ready()   ||
            !tmHandle.ready()
        );

        return loading;

    }

    getApplicationHeaderData(userContext, view){

        console.log("Getting header data for view: " + view + " and context design " + userContext.designId);

        // The data required depends on the view
        if(userContext && view) {
            let currentDesign = null;
            let currentDesignVersion = null;
            let currentDesignUpdate = null;
            let currentWorkPackage = null;

            switch (view) {
                case ViewType.DESIGNS:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    break;
                case ViewType.SELECT:
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                    // Get the current design version which should be set for these views
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    // Get the current design version + update which should be set for these views
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentDesignUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});
                    break;
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_WORK:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentWorkPackage = WorkPackages.findOne({_id: userContext.workPackageId});
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentDesignUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});
                    currentWorkPackage = WorkPackages.findOne({_id: userContext.workPackageId});
                default:
                    // No data required
            }

            return {
                currentAppView: view,
                currentDesign: currentDesign,
                currentDesignVersion: currentDesignVersion,
                currentDesignUpdate: currentDesignUpdate,
                currentWorkPackage: currentWorkPackage
            };

        } else {
            return {
                currentAppView: null,
                currentDesign: null,
                currentDesignVersion: null,
                currentDesignUpdate: null,
                currentWorkPackage: null
            };
        }
    }

    // Get a list of known Designs
    getUltrawideDesigns(){

        // Get all the designs available
        const currentDesigns = Designs.find({});

        console.log("Designs found: " + currentDesigns.count());

        return {
            designs: currentDesigns.fetch(),
        };

    }

    // Get a list of known Design Versions for the current Design
    getDesignVersionsForCurrentDesign(currentDesignId){

        // No action if design not yet set
        if (currentDesignId != 'NONE') {
            // Get all the designs versions available
            const currentDesignVersions = DesignVersions.find({designId: currentDesignId});

            console.log("Design Versions found: " + currentDesignVersions.count());

            return {
                designVersions: currentDesignVersions.fetch(),
            };

        } else {
            return {designVersions: []};
        }
    };

    // Get a list of Work Packages for a base Design Version
    getWorkPackagesForCurrentDesignVersion(currentDesignVersionId){

        // No action if design version not yet set
        if (currentDesignVersionId != 'NONE') {
            // Get all the design updates available for the selected version
            const currentWorkPackages = WorkPackages.find(
                {
                    designVersionId: currentDesignVersionId,
                    workPackageType: WorkPackageType.WP_BASE
                }
            );

            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            console.log("Base WPs found found: " + currentWorkPackages.count());

            return {
                wpType: WorkPackageType.WP_BASE,
                workPackages: currentWorkPackages.fetch(),
                designVersionStatus: designVersionStatus
            };

        } else {
            return {
                wpType: WorkPackageType.WP_BASE,
                workPackages: [],
                designVersionStatus: ''
            };
        }
    };

    // Get a list of Work Packages for a Design Update
    getWorkPackagesForCurrentDesignUpdate(currentDesignVersionId, currentDesignUpdateId){

        console.log("Looking for Update WPs for DV: " + currentDesignVersionId + " and DU: " + currentDesignUpdateId);

        // No action if design version / update not yet set
        if (currentDesignVersionId != 'NONE'  && currentDesignUpdateId != 'NONE') {
            // Get all the design updates available for the selected version
            const currentWorkPackages = WorkPackages.find(
                {
                    designVersionId: currentDesignVersionId,
                    designUpdateId: currentDesignUpdateId,
                    workPackageType: WorkPackageType.WP_UPDATE
                }
            );

            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            console.log("Update WPs found: " + currentWorkPackages.count());

            return {
                wpType: WorkPackageType.WP_UPDATE,
                workPackages: currentWorkPackages.fetch(),
                designVersionStatus: designVersionStatus
            };

        } else {
            return {
                wpType: WorkPackageType.WP_UPDATE,
                workPackages: [],
                designVersionStatus: ''
            };
        }
    };

    // Get a list of known Design Updates for the current Design Version
    getDesignUpdatesForCurrentDesignVersion(currentDesignVersionId){

        // No action if design version not yet set
        if (currentDesignVersionId != 'NONE') {
            // Get all the design updates available for the selected version
            const currentDesignUpdates = DesignUpdates.find({designVersionId: currentDesignVersionId});

            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            console.log("Design Updates found: " + currentDesignUpdates.count());

            return {
                designUpdates: currentDesignUpdates.fetch(),
                designVersionStatus: designVersionStatus
            };

        } else {
            return {
                designUpdates: [],
                designVersionStatus: ''
            };
        }
    };

    // Get top level editor data (i.e Applications)
    getEditorApplicationData(view, designVersionId, designUpdateId, workPackageId){

        console.log("Getting Application data for " + view + " and DV: " + designVersionId + " DU: " + designUpdateId + " WP: " + workPackageId);


        const baseApplications = DesignComponents.find(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.APPLICATION
            },
            {sort: {componentIndex: 1}}
        );

        let baseApplicationsArr = baseApplications.fetch();
        console.log("Found " + baseApplicationsArr.length + " base applications.");


        // Get Update Apps if update Id provided
        let updateApplicationsArr = [];

        if(designUpdateId){

            const updateApplications = DesignUpdateComponents.find(
                {
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    componentType: ComponentType.APPLICATION
                },
                {sort: {componentIndexNew: 1}}
            );

            updateApplicationsArr = updateApplications.fetch();
        }

        // Get In WP Data if WP Id provided
        let wpApplicationsArr = [];
        let wpApplicationsInScopeArr = [];

        if(workPackageId){

            // Which applications are in the WP?
            const wpApps = WorkPackageComponents.find(
                {
                    workPackageId: workPackageId,
                    componentType: ComponentType.APPLICATION,
                },
                {sort: {componentIndex: 1}}
            );


            wpApplicationsArr = wpApps.fetch();
            console.log("Found " + wpApplicationsArr.length + " WP applications.");

            // Which applications are in the WP scope?
            const inScopeWpApps = WorkPackageComponents.find(
                {
                    workPackageId: workPackageId,
                    componentType: ComponentType.APPLICATION,
                    $or: [{componentParent: true}, {componentActive: true}]
                },
                {sort: {componentIndex: 1}}
            );

            wpApplicationsInScopeArr = inScopeWpApps.fetch();
            console.log("Found " + wpApplicationsInScopeArr.length + " WP in scope applications.");

        }

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                // Just need base design version applications
                return{
                    baseApplications:       baseApplicationsArr
                };
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // Need base design version apps and design update apps
                return{
                    baseApplications:       baseApplicationsArr,
                    updateApplications:     updateApplicationsArr
                };
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                // Need base design version apps and WP in scope apps
                return{
                    wpScopeApplications:    wpApplicationsArr,
                    wpViewApplications:     wpApplicationsInScopeArr
                };
            case ViewType.WORK_PACKAGE_WORK:
                // Need just WP apps TODO: get feature files
                return {
                    wpApplications: wpApplicationsArr,
                    featureFiles: []
                };
        }
    }

    // Get data for all nested design components inside the specified parent
    getComponentDataForParentComponent(componentType, view, designVersionId, updateId, workPackageId, parentId, displayContext){
        let currentComponents = null;

        console.log("Looking for " + componentType + " data for view " + view + " and context " + displayContext);

        switch(view)
        {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                // DESIGN:  Just provide data for Design Version

                currentComponents = DesignComponents.find(
                    {
                        designVersionId: designVersionId,
                        componentType: componentType,
                        componentParentId: parentId
                    },
                    {sort:{componentIndex: 1}}
                );

                console.log("Components found: " + currentComponents.count());

                return {
                    components: currentComponents.fetch(),
                    displayContext: displayContext
                };

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // DESIGN UPDATE:  Need to provide data in the context of SCOPE, EDIT, VIEW and BASE Design Version

                console.log("Looking for components for version in context: " + displayContext + " for DV " + designVersionId + " update " + updateId + " with parent " + parentId);

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                        // Display all components that should be in scope
                        switch(componentType){
                            case ComponentType.DESIGN_SECTION:
                                // Always in scope so stuff can be added in the update
                                currentComponents = DesignUpdateComponents.find(
                                    {
                                        designVersionId: designVersionId,
                                        designUpdateId: updateId,
                                        componentType: componentType,
                                        componentParentIdNew: parentId
                                    },
                                    {sort:{componentIndexNew: 1}}
                                );
                                break;
                            case ComponentType.FEATURE:
                            case ComponentType.FEATURE_ASPECT:
                            case ComponentType.SCENARIO:
                                // Only get in scope items
                                currentComponents = DesignUpdateComponents.find(
                                    {
                                        designVersionId: designVersionId,
                                        designUpdateId: updateId,
                                        componentType: componentType,
                                        componentParentIdNew: parentId,
                                        $or:[{isInScope: true}, {isParentScope: true}]
                                    },
                                    {sort:{componentIndexNew: 1}}
                                );
                                break;
                        }
                        break;

                    case DisplayContext.UPDATE_SCOPE:
                        // Display all design update components so scope can be chosen
                        currentComponents = DesignUpdateComponents.find(
                            {
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                componentType: componentType,
                                componentParentIdNew: parentId
                            },
                            {sort:{componentIndexNew: 1}}
                        );
                        break;

                    case DisplayContext.BASE_VIEW:
                        // Display all base design version components
                        currentComponents = DesignComponents.find(
                            {
                                designVersionId: designVersionId,
                                componentType: componentType,
                                componentParentId: parentId
                            },
                            {sort:{componentIndex: 1}}
                        );

                        break;

                }

                console.log("Design update components found: " + currentComponents.count());

                return {
                    components: currentComponents.fetch(),
                    displayContext: displayContext
                };
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_WORK:
                // WORK PACKAGE: The minimal data that defines the SCOPE and the CONTENT (view) of the Work Package.
                // This is not the actual design data which is retrieved separately where needed.
                console.log("Looking for components for WP in context: " + displayContext + " for DV " + designVersionId + " WP " + workPackageId + " with parent " + parentId);

                switch(displayContext){
                    case DisplayContext.WP_SCOPE:
                        // For scope context we want all possible components to choose from
                        currentComponents = WorkPackageComponents.find(
                            {
                                workPackageId: workPackageId,
                                componentType: componentType,
                                componentParentReferenceId: parentId
                            },
                            {sort:{componentIndex: 1}}
                        );
                        break;

                    case DisplayContext.WP_VIEW:
                    case DisplayContext.DEV_DESIGN:
                        // For the WP View or during Dev, only include items that have been scoped
                        currentComponents = WorkPackageComponents.find(
                            {
                                workPackageId: workPackageId,
                                componentType: componentType,
                                componentParentReferenceId: parentId,
                                $or: [{componentParent: true}, {componentActive: true}]
                            },
                            {sort:{componentIndex: 1}}
                        );

                        break;
                }

                console.log("WP components found: " + currentComponents.count());

                return {
                    components: currentComponents.fetch(),
                    displayContext: displayContext
                };
                break;

        }
    }

    getBackgroundStepsInFeature(view, displayContext, stepContext, designId, designVersionId, updateId, featureReferenceId){
        let backgroundSteps = null;

        log((msg) => console.log(msg), LogLevel.DEBUG, "Looking for feature background steps in feature: {}", featureReferenceId);

        // Assume feature is in scope unless we find it isn't for an Update
        let featureInScope = true;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:

                backgroundSteps = FeatureBackgroundSteps.find(
                    {
                        designId: designId,
                        designVersionId: designVersionId,
                        designUpdateId: 'NONE',
                        featureReferenceId: featureReferenceId
                    },
                    {sort:{stepIndex: 1}}
                );

                log((msg) => console.log(msg), LogLevel.DEBUG, "Feature Background Steps found: {}", backgroundSteps.count());

                return {
                    steps: backgroundSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: featureReferenceId,
                    parentInScope: featureInScope
                };

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                        // Update data wanted
                        backgroundSteps = FeatureBackgroundSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                featureReferenceId: featureReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        log((msg) => console.log(msg), LogLevel.DEBUG, "Update Feature Background Steps found: {}", backgroundSteps.count());

                        // For updates, check if feature is REALLY in scope
                        const feature = DesignUpdateComponents.findOne(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                componentType: ComponentType.FEATURE,
                                componentReferenceId: featureReferenceId
                            }
                        );

                        if(feature){
                            featureInScope = feature.isInScope;
                        }

                        break;

                    case DisplayContext.BASE_VIEW:
                        // Base design version data wanted
                        backgroundSteps = FeatureBackgroundSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: 'NONE',
                                featureReferenceId: featureReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        log((msg) => console.log(msg), LogLevel.DEBUG, "Update Base Background Steps found: {}", backgroundSteps.count());

                        break;
                }

                return {
                    steps: backgroundSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: featureReferenceId,
                    parentInScope: featureInScope
                };
        }

    }

    getScenarioStepsInScenario(view, displayContext, stepContext, designId, designVersionId, updateId, scenarioReferenceId){
        let scenarioSteps = null;

        // Assume all scenarios are in scope - will check update scenarios to see if they actually are
        let scenarioInScope = true;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:

                scenarioSteps = ScenarioSteps.find(
                    {
                        designId: designId,
                        designVersionId: designVersionId,
                        designUpdateId: 'NONE',
                        scenarioReferenceId: scenarioReferenceId
                    },
                    {sort:{stepIndex: 1}}
                );

                console.log("Scenario Steps found: " + scenarioSteps.count());

                return {
                    steps: scenarioSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: scenarioReferenceId,
                    parentInScope: scenarioInScope
                };

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                        // Update data wanted
                        scenarioSteps = ScenarioSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                scenarioReferenceId: scenarioReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        console.log("Update Scenario Steps found: " + scenarioSteps.count());

                        // For updates, check if scenario is REALLY in scope
                        const scenario = DesignUpdateComponents.findOne(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                componentType: ComponentType.SCENARIO,
                                componentReferenceId: scenarioReferenceId
                            }
                        );

                        if(scenario){
                            scenarioInScope = scenario.isInScope;
                        }

                        break;

                    case DisplayContext.BASE_VIEW:
                        // Base design version data wanted
                        scenarioSteps = ScenarioSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: 'NONE',
                                scenarioReferenceId: scenarioReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        console.log("Update Base Scenario Steps found: " + scenarioSteps.count());

                        break;
                }

                return {
                    steps: scenarioSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: scenarioReferenceId,
                    parentInScope: scenarioInScope
                };
        }
    }

    getTextDataForDesignComponent(userContext, mode, view, displayContext){

        let currentDesignComponent = null;
        let currentUpdateComponent = null;

        if(userContext) {

            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                    currentDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId});
                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    currentUpdateComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});


                    // For an update the current item is the update item but we can also get its equivalent in the original design
                    if(currentUpdateComponent) {
                        console.log("DCT Container: Update component is " + currentUpdateComponent.componentNameNew);

                        let updateItemReferenceId = currentUpdateComponent.componentReferenceId;
                        currentDesignComponent = DesignComponents.findOne({componentReferenceId: updateItemReferenceId});

                        if(currentDesignComponent) {
                            console.log("DCT Container: Design component is " + currentDesignComponent.componentName);
                        }
                    }
                    break;
            }

            return {
                currentDesignComponent: currentDesignComponent,
                currentUpdateComponent: currentUpdateComponent,
                mode: mode,
                view: view,
                context: displayContext,
                userContext: userContext
            }
        } else {
            return {
                currentDesignComponent: null,
                currentUpdateComponent: null,
                mode: mode,
                view: view,
                context: displayContext,
                userContext: userContext
            }
        }
    };

    getDomainDictionaryTerms(designId, designVersionId){

        // Just want all terms relevant to this design / design version
        console.log ("Looking for Domain Dictionary terms for Design: " + designId + " and Design Version: " + designVersionId);

        const domainDictionaryItems = DomainDictionary.find(
            {
                designId: designId,
                designVersionId: designVersionId
            },
            {sort:{sortingName: 1}}     // The sorting name is the term name except when term is first created
        );

        console.log ("Domain Dictionary terms found: " + domainDictionaryItems.count());

        return {
            dictionaryTerms: domainDictionaryItems.fetch()
        }
    };

    getDesignMashScenarioData(userContext){

    }

}

export default new ClientContainerServices();