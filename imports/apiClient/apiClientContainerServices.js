
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
import { UserDevFeatures }          from '../collections/dev/user_dev_features.js';
import { UserDesignDevMashData }    from '../collections/dev/user_design_dev_mash_data.js';
import { UserUnitTestResults }      from '../collections/dev/user_unit_test_results.js';

// Ultrawide GUI Components


// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext, StepContext, WorkPackageType, UserDevFeatureStatus, MashStatus, LogLevel } from '../constants/constants.js';
import ClientDesignServices from './apiClientDesign.js';

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
        const dmHandle = Meteor.subscribe('userDesignDevMashData');
        const utHandle = Meteor.subscribe('userUnitTestResults');

        const loading = (
            !dfHandle.ready()   ||
            !dbHandle.ready()   ||
            !fsHandle.ready()   ||
            !ssHandle.ready()   ||
            !dmHandle.ready()   ||
            !utHandle.ready()
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
                case ViewType.DEVELOP_BASE_WP:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentWorkPackage = WorkPackages.findOne({_id: userContext.workPackageId});
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:
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
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
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
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
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

                if(currentComponents.count() > 0){
                    return {
                        components: currentComponents.fetch(),
                        displayContext: displayContext
                    };
                } else {
                    return {
                        components: [],
                        displayContext: displayContext
                    };
                }

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
                        scenarioReferenceId: scenarioReferenceId,
                        isRemoved: false
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
                                scenarioReferenceId: scenarioReferenceId,
                                isRemoved: false
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

    getDesignMashData(userContext){

        // Get mash data for key functional items under the current item to display in the Dev Mash.  This could be:
        // - Features UNDER an Application or Design Section
        // - Scenarios in a Feature
        // - Scenarios in a Feature Aspect
        // - Steps in a Scenario

        log((msg) => console.log(msg), LogLevel.TRACE, "Searching for Mash data for user {} context D: {} DV: {}, DU: {}, WP: {} Type: {} FR: {}",
            userContext.userId, userContext.designId, userContext.designVersionId, userContext.designUpdateId,
            userContext.workPackageId, userContext.designComponentType, userContext.featureReferenceId);

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                // Get all features and weed out those that are not children of the specific components

                let selectedWpItem = WorkPackageComponents.findOne({
                    workPackageId: userContext.workPackageId,
                    componentId: userContext.designComponentId
                });

                let features = WorkPackageComponents.find({
                    workPackageId: userContext.workPackageId,
                    componentType: ComponentType.FEATURE,
                    componentActive: true
                }).fetch();

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} features in Work Package", features.length);

                let wantedFeatures = [];

                features.forEach((feature) => {

                    if(this.isDescendentOf(feature, selectedWpItem, userContext)){
                        wantedFeatures.push(feature);
                    }
                });

                let featureMashData = [];
                let featureMash = null;

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} child features for current component", wantedFeatures.length);

                // Get feature mash data
                wantedFeatures.forEach((feature) => {
                    featureMash = UserDesignDevMashData.findOne({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             userContext.designUpdateId,
                        workPackageId:              userContext.workPackageId,
                        mashComponentType:          ComponentType.FEATURE,
                        designFeatureReferenceId:   feature.componentReferenceId
                    });

                    if(featureMash) {
                        featureMashData.push(featureMash);
                    }
                });

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} feature mash entries for current component", featureMashData.length);

                return featureMashData;
                break;

            case ComponentType.FEATURE:
                // Here we want to get all Scenario data that may be related to the feature.  This should already be set in the Mash data

                let scenarioMashData = [];

                scenarioMashData = UserDesignDevMashData.find({
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    designUpdateId:             userContext.designUpdateId,
                    workPackageId:              userContext.workPackageId,
                    designFeatureReferenceId:   userContext.featureReferenceId,
                    mashComponentType:          ComponentType.SCENARIO
                }).fetch();

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} scenario mash entries for current component", scenarioMashData.length);

                return scenarioMashData;
                break;

            case ComponentType.FEATURE_ASPECT:
                // Get all Scenarios in this Feature Aspect

                // // Get reference of particular Aspect selected
                // let aspectRef = null;
                // if(userContext.designUpdateId === 'NONE') {
                //     aspectRef = DesignComponents.findOne({_id: userContext.designComponentId}).componentReferenceId;
                // } else {
                //     aspectRef = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentReferenceId;
                // }

                let aspectScenarioMashData = [];

                aspectScenarioMashData = UserDesignDevMashData.find({
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    designFeatureReferenceId:       userContext.featureReferenceId,
                    designFeatureAspectReferenceId: userContext.featureAspectReferenceId,
                    mashComponentType:              ComponentType.SCENARIO
                }).fetch();

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} scenario mash entries for current aspect {}", aspectScenarioMashData.length, userContext.featureAspectReferenceId);

                return aspectScenarioMashData;
                break;

            case ComponentType.SCENARIO:
                //Get all Scenario Mash Steps for the scenario
                //
                // let stepsScenarioMashData = [];
                //
                // stepsScenarioMashData = UserDesignDevMashData.find({
                //     userId:                         userContext.userId,
                //     designVersionId:                userContext.designVersionId,
                //     designUpdateId:                 userContext.designUpdateId,
                //     workPackageId:                  userContext.workPackageId,
                //     designScenarioReferenceId:      userContext.scenarioReferenceId,
                //     mashComponentType:              ComponentType.SCENARIO_STEP
                // }).fetch();
                //
                // log((msg) => console.log(msg), LogLevel.TRACE, "Found {} scenario step mash entries for current scenario {}", stepsScenarioMashData.length, userContext.scenarioReferenceId);
                //
                // return stepsScenarioMashData;

                break;
            default:

        }

    };

    isDescendentOf(child, parent, context){

        // Check immediate parent
        let parentId = child.componentParentReferenceId;

        log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendent: ParentId = {} Current Item Id = {}", parentId, parent.componentReferenceId);

        // If the component is directly under the current component then wanted
        if(parentId === parent.componentReferenceId){return true;}

        // Iterate up until we reach top of tree
        while(parentId != 'NONE'){
            // Get next parent up

            parentId = WorkPackageComponents.findOne({
                workPackageId: context.workPackageId,
                componentReferenceId: parentId
            }).componentParentReferenceId;

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendent (loop): ParentId = {} Current Item Id = {}", parentId, parent.componentReferenceId);

            // Return true if match
            if(parentId === parent.componentReferenceId){return true;}
        }

        // No parent found
        return false;

    };

    getMashFeatureAspects(userContext, view){

        log((msg) => console.log(msg), LogLevel.TRACE, "Getting mash feature aspects for component {} userId: {} DV: {} DU: {} WP: {} FRef: {}",
            userContext.designComponentType, userContext.userId, userContext.designVersionId,
            userContext.designUpdateId, userContext.workPackageId, userContext.featureReferenceId);


        if(userContext.designComponentType === ComponentType.FEATURE){

            return UserDesignDevMashData.find(
                {
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    designFeatureReferenceId:       userContext.featureReferenceId,
                    mashComponentType:              ComponentType.FEATURE_ASPECT
                },
                {sort: {mashItemIndex: 1}}
            ).fetch();

        } else {
            return [];
        }

    };

    getMashFeatureAspectScenarios(aspect){

        return UserDesignDevMashData.find(
            {
                userId:                         aspect.userId,
                designVersionId:                aspect.designVersionId,
                designUpdateId:                 aspect.designUpdateId,
                workPackageId:                  aspect.workPackageId,
                designFeatureAspectReferenceId: aspect.designComponentReferenceId,
                mashComponentType:              ComponentType.SCENARIO
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

    };

    // Get all unit test results relating to a specific Design Scenario
    getMashScenarioUnitTestResults(scenario){

        return UserUnitTestResults.find({
            userId:                         scenario.userId,
            designScenarioReferenceId:      scenario.designScenarioReferenceId,
        }).fetch();

    }

    getMashUnlinkedUnitTestResults(userContext){

        return UserUnitTestResults.find({
            userId:                         userContext.userId,
            designScenarioReferenceId:      'NONE'
        }).fetch();
    }

    getMashScenarioSteps(userContext){
        // Returns steps for the current scenario that are:
        // 1. In Design Only
        // 2. Linked across Design - Dev
        // 3. In Dev Only (but with Scenario that is in Design)

        log((msg) => console.log(msg), LogLevel.TRACE, "Getting mash Scenario Steps for Scenario {}", userContext.scenarioReferenceId);

        const designSteps = UserDesignDevMashData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                mashStatus:                     MashStatus.MASH_NOT_IMPLEMENTED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        const linkedSteps = UserDesignDevMashData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                mashStatus:                     MashStatus.MASH_LINKED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        // For the linked steps we return the full Scenario Step Data so this can be edited

        const devSteps = UserDesignDevMashData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                mashStatus:                     MashStatus.MASH_NOT_DESIGNED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        return({
            designSteps: designSteps,
            linkedSteps: linkedSteps,
            devSteps: devSteps,
        });
    }

    getDevFilesData(userContext){

        // Get the data on feature files in the user's build area, split into:
        // - Relevant to current WP
        // - Relevant to wider design
        // - Unknown in Design

        const wpFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_IN_WP
        }).fetch();

        const designFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_IN_DESIGN
        }).fetch();

        const unknownFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_UNKNOWN
        }).fetch();

        return{
            wpFiles: wpFiles,
            designFiles: designFiles,
            unknownFiles: unknownFiles
        }

    }

}

export default new ClientContainerServices();