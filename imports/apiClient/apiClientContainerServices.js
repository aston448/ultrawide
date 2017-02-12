
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserRoles }                        from '../collections/users/user_roles.js';
import { UserCurrentEditContext }           from '../collections/context/user_current_edit_context.js';
import { Designs }                          from '../collections/design/designs.js';
import { DesignVersions }                   from '../collections/design/design_versions.js';
import { DesignUpdates }                    from '../collections/design_update/design_updates.js';
import { WorkPackages }                     from '../collections/work/work_packages.js';
import { WorkPackageComponents }            from '../collections/work/work_package_components.js';
import { DesignComponents }                 from '../collections/design/design_components.js';
import { DesignUpdateComponents }           from '../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }           from '../collections/design/feature_background_steps.js';
import { ScenarioSteps }                    from '../collections/design/scenario_steps.js';
import { DomainDictionary }                 from '../collections/design/domain_dictionary.js';
import { UserDevFeatures }                  from '../collections/dev/user_dev_features.js';
import { UserWorkPackageMashData }          from '../collections/dev/user_work_package_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../collections/dev/user_work_package_feature_step_data.js';
import { UserUnitTestMashData }              from '../collections/dev/user_unit_test_mash_data.js';
import { UserDevTestSummaryData }           from '../collections/dev/user_dev_test_summary_data.js';
import { UserAccTestResults }               from '../collections/dev/user_acc_test_results.js';

// Ultrawide GUI Components


// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext, StepContext, WorkPackageType, UserDevFeatureStatus, MashStatus, LogLevel } from '../constants/constants.js';
import ClientDesignServices from './apiClientDesign.js';

import { log } from '../common/utils.js';

// REDUX services
import store from '../redux/store'
import { setCurrentUserItemContext } from '../redux/actions'


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
        const uvHandle = Meteor.subscribe('userCurrentViewOptions');
        const uuHandle = Meteor.subscribe('userCurrentDevUpdates');
        const dHandle = Meteor.subscribe('designs');
        const dvHandle = Meteor.subscribe('designVersions');

        const loading = (
            !urHandle.ready()   ||
            !ucHandle.ready()   ||
            !uvHandle.ready()   ||
            !uuHandle.ready()   ||
            !dHandle.ready()   ||
            !dvHandle.ready()
        );

        return {isLoading: loading};

    }

    getUserData(userContext){

        if(Meteor.isClient) {

            const currentUser = UserRoles.findOne({userId: userContext.userId});

            return {
                user: currentUser,
            }
        }

    };

    getDesignVersionData(designVersionId, callback){

        console.log("Getting Design Version Data for DV " + designVersionId);

        let duHandle = Meteor.subscribe('designUpdates', designVersionId);
        let dcHandle = Meteor.subscribe('designComponents', designVersionId);
        let ducHandle = Meteor.subscribe('designUpdateComponents', designVersionId);
        let fbHandle = Meteor.subscribe('featureBackgroundSteps', designVersionId);
        let ssHandle = Meteor.subscribe('scenarioSteps', designVersionId);
        let ddHandle = Meteor.subscribe('domainDictionary', designVersionId);
        let wpHandle = Meteor.subscribe('workPackages', designVersionId);
        let wcHandle = Meteor.subscribe('workPackageComponents', designVersionId);


        Tracker.autorun((loader) => {

            let loading = (
                !duHandle.ready() || !dcHandle.ready() || !ducHandle.ready() || !fbHandle.ready() || !ssHandle.ready() || !ddHandle.ready() || !wpHandle.ready() || !wcHandle.ready()
            );

            console.log("loading = " + loading);

            if(!loading && callback){
                callback();

                // Stop this checking once we are done or there wil be random chaos
                loader.stop();
            }

        });

    }

    getDevData(){

        // Subscribe to dev data when user enters dev work view
        const dfHandle = Meteor.subscribe('userDevFeatures');
        const dbHandle = Meteor.subscribe('userDevFeatureBackgroundSteps');
        const fsHandle = Meteor.subscribe('userDevFeatureScenarios');
        const ssHandle = Meteor.subscribe('userDevFeatureScenarioSteps');
        const wmHandle = Meteor.subscribe('userWorkPackageMashData');
        const wsHandle = Meteor.subscribe('userWorkPackageFeatureStepData');
        const mmHandle = Meteor.subscribe('userUnitTestMashData');
        const arHandle = Meteor.subscribe('userAccTestResults');
        const irHandle = Meteor.subscribe('userIntTestResults');
        const mrHandle = Meteor.subscribe('userUnitTestResults');
        const tsHandle = Meteor.subscribe('userDevTestSummaryData');

        const loading = (
            !dfHandle.ready()   ||
            !dbHandle.ready()   ||
            !fsHandle.ready()   ||
            !ssHandle.ready()   ||
            !wmHandle.ready()   ||
            !wsHandle.ready()   ||
            !mmHandle.ready()   ||
            !arHandle.ready()   ||
            !irHandle.ready()   ||
            !mrHandle.ready()   ||
            !tsHandle.ready()
        );

        console.log('Subscribing to Dev Data');

        return loading;

    }

    getApplicationHeaderData(userContext, view){

        console.log("Getting header data for view: " + view + " and context design " + userContext.designId + " and design version " + userContext.designVersionId);

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
                case ViewType.DESIGN_UPDATABLE_VIEW:
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
                    break;
                default:
                    // No data required
            }

            console.log("Returning design" + currentDesign);
            return {
                view: view,
                currentDesign: currentDesign,
                currentDesignVersion: currentDesignVersion,
                currentDesignUpdate: currentDesignUpdate,
                currentWorkPackage: currentWorkPackage
            };

        } else {
            return {
                view: null,
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

        //console.log("Designs found: " + currentDesigns.count());

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

            //console.log("Design Versions found: " + currentDesignVersions.count());

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

            //console.log("Base WPs found found: " + currentWorkPackages.count());

            return {
                wpType: WorkPackageType.WP_BASE,
                workPackages: currentWorkPackages.fetch(),
                designVersionStatus: designVersionStatus
            };

        } else {
            return {
                wpType: WorkPackageType.WP_BASE,
                workPackages: [],
                designVersionStatus: null
            };
        }
    };

    // Get a list of Work Packages for a Design Update
    getWorkPackagesForCurrentDesignUpdate(currentDesignVersionId, currentDesignUpdateId){

        //console.log("Looking for Update WPs for DV: " + currentDesignVersionId + " and DU: " + currentDesignUpdateId);

        if(currentDesignVersionId != 'NONE') {
            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            if (currentDesignUpdateId != 'NONE') {

                // Get all the WPs available for the selected update
                const currentWorkPackages = WorkPackages.find(
                    {
                        designVersionId: currentDesignVersionId,
                        designUpdateId: currentDesignUpdateId,
                        workPackageType: WorkPackageType.WP_UPDATE
                    }
                );

                return {
                    wpType: WorkPackageType.WP_UPDATE,
                    workPackages: currentWorkPackages.fetch(),
                    designVersionStatus: designVersionStatus
                };
            } else {
                return {
                    wpType: WorkPackageType.WP_UPDATE,
                    workPackages: [],
                    designVersionStatus: designVersionStatus
                };
            }

        } else {

            return {
                wpType: WorkPackageType.WP_UPDATE,
                workPackages: [],
                designVersionStatus: null
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

            //console.log("Design Updates found: " + currentDesignUpdates.count());

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

        //console.log("Getting Application data for " + view + " and DV: " + designVersionId + " DU: " + designUpdateId + " WP: " + workPackageId);


        const baseApplications = DesignComponents.find(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.APPLICATION
            },
            {sort: {componentIndex: 1}}
        );

        let baseApplicationsArr = baseApplications.fetch();
        //console.log("Found " + baseApplicationsArr.length + " base applications.");


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
            //console.log("Found " + wpApplicationsArr.length + " WP applications.");

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
            //console.log("Found " + wpApplicationsInScopeArr.length + " WP in scope applications.");

        }

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
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

        //console.log("Looking for " + componentType + " data for view " + view + " and context " + displayContext);

        switch(view)
        {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                // DESIGN:  Just provide data for Design Version

                currentComponents = DesignComponents.find(
                    {
                        designVersionId: designVersionId,
                        componentType: componentType,
                        componentParentId: parentId
                    },
                    {sort:{componentIndex: 1}}
                );

                //console.log("Components found: " + currentComponents.count());

                return {
                    components: currentComponents.fetch(),
                    displayContext: displayContext
                };

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // DESIGN UPDATE:  Need to provide data in the context of SCOPE, EDIT, VIEW and BASE Design Version

                //console.log("Looking for components for version in context: " + displayContext + " for DV " + designVersionId + " update " + updateId + " with parent " + parentId);

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                        // Display all components that should be in scope plus stuff to add things to
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
                    case DisplayContext.UPDATE_VIEW:
                        // Display all components that should be in scope
                        switch(componentType){
                            case ComponentType.DESIGN_SECTION:
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

                //console.log("Design update components found: " + currentComponents.count());

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
                //console.log("Looking for components for WP in context: " + displayContext + " for DV " + designVersionId + " WP " + workPackageId + " with parent " + parentId);

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

                //console.log("WP components found: " + currentComponents.count());

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
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:

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
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                    case DisplayContext.WP_VIEW:
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

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
        }

    }

    getScenarioStepsInScenario(view, displayContext, stepContext, designId, designVersionId, updateId, scenarioReferenceId){
        let scenarioSteps = null;

        // Assume all scenarios are in scope - will check update scenarios to see if they actually are
        let scenarioInScope = true;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:

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
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

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

                    default:
                        log((msg) => console.log(msg), LogLevel.ERROR, "INVALID DISPLAY CONTEXT TYPE!: {}", displayContext);
                }

                return {
                    steps: scenarioSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: scenarioReferenceId,
                    parentInScope: scenarioInScope
                };

                break;
            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
        }
    }

    getTextDataForDesignComponent(userContext, view, displayContext){

        let currentDesignComponent = null;
        let currentUpdateComponent = null;

        if(userContext && userContext.designComponentId != 'NONE') {

            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:

                    console.log("DCT Container: UC Design component is " + userContext.designComponentId);
                    currentDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId});

                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    currentUpdateComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

                    // For an update the current item is the update item but we can also get its equivalent in the original design
                    if(currentUpdateComponent) {
                        console.log("DCT Container: Update component is " + currentUpdateComponent.componentNameNew);

                        currentDesignComponent = DesignComponents.findOne({
                            designVersionId:        currentUpdateComponent.designVersionId,
                            componentReferenceId:   currentUpdateComponent.componentReferenceId
                        });

                        if(currentDesignComponent) {
                            console.log("DCT Container: Design component is " + currentDesignComponent.componentName);
                        }
                    }
                    break;

                case ViewType.DESIGN_UPDATABLE_VIEW:

                    // Want the current version plus the related DU component to give old text if text has changed
                    currentDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId});
                    const currentUpdateComponents = DesignUpdateComponents.find({
                        designVersionId:        currentDesignComponent.designVersionId,
                        componentReferenceId:   currentDesignComponent.componentReferenceId,
                        isTextChanged:          true,
                        isNew:                  false,
                    }).fetch();

                    // Could be more than one but all should have the same OLD values so just pick first
                    if(currentUpdateComponents.length > 0){
                        currentUpdateComponent = currentUpdateComponents[0];
                    } else {
                        currentUpdateComponent = null;
                    }
                    break;

                default:
                    console.log("Unknown view type: " + view);
            }

            return {
                currentDesignComponent: currentDesignComponent,
                currentUpdateComponent: currentUpdateComponent,
                displayContext: displayContext
            }
        } else {
            return {
                currentDesignComponent: null,
                currentUpdateComponent: null,
                displayContext: displayContext,
            }
        }
    };

    getDomainDictionaryTerms(designId, designVersionId){

        // Just want all terms relevant to this design / design version
        //console.log ("Looking for Domain Dictionary terms for Design: " + designId + " and Design Version: " + designVersionId);

        const domainDictionaryItems = DomainDictionary.find(
            {
                designId: designId,
                designVersionId: designVersionId
            },
            {sort:{sortingName: 1}}     // The sorting name is the term name except when term is first created
        );

        //console.log ("Domain Dictionary terms found: " + domainDictionaryItems.count());

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

                    if(this.isDescendantOf(feature, selectedWpItem, userContext)){
                        wantedFeatures.push(feature);
                    }
                });

                let featureMashData = [];
                let featureMash = null;

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} child features for current component", wantedFeatures.length);

                // Get feature mash data
                wantedFeatures.forEach((feature) => {
                    featureMash = UserWorkPackageMashData.findOne({
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

                scenarioMashData = UserWorkPackageMashData.find({
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

                aspectScenarioMashData = UserWorkPackageMashData.find({
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

    getWorkPackageMashData(userContext, mashCurrentItem){

        // Return all the data that is relevant to the currently selected Design Item or item in the Mash

        let selectionComponentId = userContext.designComponentId;
        let selectionComponentType = userContext.designComponentType;

        if(mashCurrentItem){
            // We don't want the main selection from the design - we want local mash data
            selectionComponentId = mashCurrentItem.designComponentId;
            selectionComponentType = mashCurrentItem.mashComponentType;
        }

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data for component type {} with id {} ", selectionComponentType, selectionComponentId);

        // Get user context current Design Component
        let selectedDesignComponent = null;
        if(selectionComponentId === 'NONE'){
            return [];

        } else {
            if (userContext.designUpdateId === 'NONE') {
                selectedDesignComponent = DesignComponents.findOne({_id: selectionComponentId})
            } else {
                selectedDesignComponent = DesignUpdateComponents.findOne({_id: selectionComponentId})
            }

            log((msg) => console.log(msg), LogLevel.TRACE, "User context is USER: {}, DV: {}, DU: {}, WP: {}",
            userContext.userId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

            switch (selectionComponentType) {
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    // Return any FEATURE that is a child of this item
                    let returnData = [];

                    const intTestMash = UserWorkPackageMashData.find(
                        {
                            userId: userContext.userId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            workPackageId: userContext.workPackageId,
                            mashComponentType: ComponentType.FEATURE
                        },
                        {sort:{mashItemFeatureIndex: 1}}    // Features have their own sorting so as to get a global order
                    ).fetch();

                    log((msg) => console.log(msg), LogLevel.TRACE, "Found {} Features in total", intTestMash.length);

                    intTestMash.forEach((mashItem) => {

                        let mashDesignComponent = null;
                        if (userContext.designUpdateId === 'NONE') {
                            mashDesignComponent = DesignComponents.findOne({_id: mashItem.designComponentId})
                        } else {
                            mashDesignComponent = DesignUpdateComponents.findOne({_id: mashItem.designComponentId})
                        }

                        if (this.isDescendantOf(mashDesignComponent, selectedDesignComponent, userContext)) {
                            returnData.push(mashItem);
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} descendant Features", returnData.length);

                    });

                    return returnData;

                case ComponentType.FEATURE:
                    // Return any FEATURE ASPECT related to this Feature
                    return UserWorkPackageMashData.find(
                        {
                            userId: userContext.userId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            workPackageId: userContext.workPackageId,
                            mashComponentType: ComponentType.FEATURE_ASPECT,
                            designFeatureReferenceId: selectedDesignComponent.componentReferenceId
                        },
                        {sort:{mashItemIndex: 1}}
                    ).fetch();

                case ComponentType.FEATURE_ASPECT:
                    // Return any SCENARIO data related to this Feature Aspect
                    if(selectedDesignComponent) {
                        return UserWorkPackageMashData.find(
                            {
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                workPackageId: userContext.workPackageId,
                                mashComponentType: ComponentType.SCENARIO,
                                designFeatureAspectReferenceId: selectedDesignComponent.componentReferenceId
                            },
                            {sort: {mashItemIndex: 1}}
                        ).fetch();
                    } else {
                        // Its just possible the Developer deleted this component
                        return[];
                    }

                case ComponentType.SCENARIO:
                    // Return any data related to this Scenario (at most one test)
                    if(selectedDesignComponent) {
                        return UserWorkPackageMashData.find(
                            {
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                workPackageId: userContext.workPackageId,
                                mashComponentType: ComponentType.SCENARIO,
                                designScenarioReferenceId: selectedDesignComponent.componentReferenceId
                            },
                            {sort:{mashItemIndex: 1}}
                        ).fetch();
                    } else {
                        // Its just possible the Developer deleted this component
                        return[];
                    }

                default:
                    // No component or irrelevant component:
                    return [];
            }
        }

    }

    getNonDesignAcceptanceScenarioData(userContext){

        // For acceptance tests get any Scenarios found in the tests for a Design Feature that are not in the Design
        let selectedDesignComponent = null;

        if (userContext.designUpdateId === 'NONE') {
            selectedDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId})
        } else {
            selectedDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId})
        }

        if(selectedDesignComponent){

            log((msg) => console.log(msg), LogLevel.DEBUG, "Looking for feature with ref id {}", selectedDesignComponent.componentReferenceId);

            const feature = UserWorkPackageMashData.findOne({
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                designFeatureReferenceId: selectedDesignComponent.componentReferenceId,
                mashComponentType: ComponentType.FEATURE
            });

            if(feature){
                let nonDesignedScenarios = UserWorkPackageMashData.find({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    mashComponentType: ComponentType.SCENARIO,
                    accMashStatus: MashStatus.MASH_NOT_DESIGNED
                }).fetch();

                log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} non-designed Scenarios", nonDesignedScenarios.length);

                return nonDesignedScenarios;

            } else {
                return [];
            }
        } else {
            return [];
        }


    }

    checkForExistingFeatureFile(userContext){

        let featureName = '';

        if(userContext.designComponentType === ComponentType.FEATURE){

            // The selected Feature must relate to a design or design update feature...
            if(userContext.designUpdateId === 'NONE'){
                featureName = DesignComponents.findOne({componentReferenceId: userContext.featureReferenceId}).componentName
            } else {
                featureName = DesignUpdateComponents.findOne({componentReferenceId: userContext.featureReferenceId}).componentNameNew
            }
        }

        const featureFile = UserDevFeatures.findOne({featureName: featureName});

        return featureFile;

    }

    isDescendantOf(child, parent, userContext){

        let parentRefId = 'NONE';
        let found = false;

        if (userContext.designUpdateId === 'NONE') {
            // DESIGN VERSION SEARCH

            // Check immediate parent
            parentRefId = child.componentParentReferenceId;

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant: ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);

            // If the component is directly under the current component then wanted
            if(parentRefId === parent.componentReferenceId){
                return true;
            }

            // Iterate up until we reach top of tree
            found = false;

            while((parentRefId != 'NONE') && !found){
                // Get next parent up

                parentRefId = DesignComponents.findOne({
                    designVersionId: userContext.designVersionId,
                    componentReferenceId: parentRefId
                }).componentParentReferenceId;

                log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant (loop): ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);

                // Return true if match
                if(parentRefId === parent.componentReferenceId){
                    found =  true;
                }
            }

            return found;

        } else {
            // DESIGN UPDATE SEARCH

            // Check immediate parent
            parentRefId = child.componentParentReferenceIdNew;

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant: ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);

            // If the component is directly under the current component then wanted
            if(parentRefId === parent.componentReferenceId){
                return true;
            }

            // Iterate up until we reach top of tree
            found = false;

            while((parentRefId != 'NONE') && !found){
                // Get next parent up

                parentRefId = DesignUpdateComponents.findOne({
                    designVersionId: userContext.designVersionId,
                    componentReferenceId: parentRefId
                }).componentParentReferenceIdNew;

                log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant (loop): ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);

                // Return true if match
                if(parentRefId === parent.componentReferenceId){
                    found =  true;
                }
            }

            return found;

        }

        // Iterate up until we reach top of tree
        let parentId = '';

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

            return UserWorkPackageMashData.find(
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

        return UserWorkPackageMashData.find(
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
    getMashScenarioUnitTestResults(userContext, scenario){

        return UserUnitTestMashData.find({
            userId:                         userContext.userId,
            designScenarioReferenceId:      scenario.designScenarioReferenceId,
        }).fetch();

    }

    getMashUnlinkedUnitTestResults(userContext){

        return UserUnitTestMashData.find({
            userId:                         userContext.userId,
            designScenarioReferenceId:      'NONE'
        }).fetch();
    }

    getMashScenarioSteps(userContext){
        // Returns steps for the current scenario that are:
        // 1. In Design Only
        // 2. Linked across Design - Dev
        // 3. In Dev Only (but with Scenario that is in Design)

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting mash Scenario Steps for Scenario {}", userContext.scenarioReferenceId);

        const designSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        const linkedSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_LINKED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        const devSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_NOT_DESIGNED
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

    };

    getTestSummaryData(scenario){

        return UserDevTestSummaryData.findOne({scenarioReferenceId: scenario.componentReferenceId});

    }

    getTestSummaryFeatureData(feature){

        return UserDevTestSummaryData.findOne({scenarioReferenceId: 'NONE', featureReferenceId: feature.componentReferenceId});

    }

}

export default new ClientContainerServices();