// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../collections/context/user_current_view_options.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, DesignVersionStatus, DesignUpdateStatus, ComponentType, LogLevel, WorkPackageStatus, WorkPackageType, WindowSize, DisplayContext } from '../constants/constants.js';
import { log } from '../common/utils.js';

import ClientContainerServices              from '../apiClient/apiClientContainerServices.js';
import ClientDesignVersionServices          from '../apiClient/apiClientDesignVersion.js';
import ClientDesignComponentServices        from '../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateServices           from '../apiClient/apiClientDesignUpdate.js';
import ClientDesignUpdateComponentServices  from '../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageServices            from '../apiClient/apiClientWorkPackage.js';
import ClientWorkPackageComponentServices   from '../apiClient/apiClientWorkPackageComponent.js';

// REDUX services
import store from '../redux/store'
import {setCurrentView, setCurrentRole, setCurrentUserItemContext, setCurrentUserViewOptions, setCurrentWindowSize, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems, updateOpenItemsFlag} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client User Context Services - Supports client calls for actions relating to User Context - current item, dev context
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientUserContextServices {

    getUserContext(userId){

        const userContext = UserCurrentEditContext.findOne({userId: userId});


        if(userContext){

            const context = {
                userId:                         userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designComponentId:              userContext.designComponentId,
                designComponentType:            userContext.designComponentType,
                featureReferenceId:             userContext.featureReferenceId,
                featureAspectReferenceId:       userContext.featureAspectReferenceId,
                scenarioReferenceId:            userContext.scenarioReferenceId,
                scenarioStepId:                 userContext.scenarioStepId
            };

            store.dispatch(setCurrentUserItemContext(context, false));  // Don't save - we are reading from DB here!


        } else {
            // No context saved so default to nothing
            const emptyContext = {
                userId:                         userId,
                designId:                       'NONE',
                designVersionId:                'NONE',
                designUpdateId:                 'NONE',
                workPackageId:                  'NONE',
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(emptyContext, true));

        }

        return userContext;

    };

    getUserViewOptions(userId){

        const userViewOptions = UserCurrentViewOptions.findOne({userId: userId});

        if(userViewOptions){

            const viewOptions = {
                userId:                     userId,
                designDetailsVisible:       userViewOptions.designDetailsVisible,
                designTestSummaryVisible:   userViewOptions.designTestSummaryVisible,
                designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:       userViewOptions.updateDetailsVisible,
                updateTestSummaryVisible:   userViewOptions.updateTestSummaryVisible,
                updateDomainDictVisible:    userViewOptions.updateDomainDictVisible,
                // Work package editor - Scope and Design always visible
                wpDetailsVisible:           userViewOptions.wpDetailsVisible,
                wpDomainDictVisible:        userViewOptions.wpDomainDictVisible,
                // Developer Screen - Design always visible
                devDetailsVisible:          userViewOptions.devDetailsVisible,
                devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
                devTestSummaryVisible:      userViewOptions.devTestSummaryVisible,
                devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                devDomainDictVisible:       userViewOptions.devDomainDictVisible
            };

            store.dispatch(setCurrentUserViewOptions(viewOptions, false)); // Don't save - we are reading from DB here!

        } else {

            const defaultOptions = {
                userId:                     userId,
                designDetailsVisible:       true,
                designTestSummaryVisible:   false,
                designDomainDictVisible:    true,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:       true,
                updateTestSummaryVisible:   false,
                updateDomainDictVisible:    false,
                // Work package editor - Scope and Design always visible
                wpDetailsVisible:           true,
                wpDomainDictVisible:        false,
                // Developer Screen - Design always visible
                devDetailsVisible:          false,
                devAccTestsVisible:         false,
                devIntTestsVisible:         false,
                devUnitTestsVisible:        false,
                devTestSummaryVisible:      false,
                devFeatureFilesVisible:     false,
                devDomainDictVisible:       false
            };

            store.dispatch(setCurrentUserViewOptions(defaultOptions, true));
        }

        return userViewOptions;
    }

    setUserRole(roleType){
        store.dispatch(setCurrentRole(roleType));
    }

    loadMainData(userContext){
        log((msg) => console.log(msg), LogLevel.TRACE, "Loading main data...");

        const dvCount = DesignComponents.find({}).count();

        if(dvCount > 0){
            log((msg) => console.log(msg), LogLevel.TRACE, "Data already loaded...");

            this.onAllDataLoaded();
        } else {

            // Need to load data
            if(userContext.designVersionId != 'NONE'){
                log((msg) => console.log(msg), LogLevel.TRACE, "Loading data for DV {}", userContext.designVersionId);

                // Show wait screen
                store.dispatch(setCurrentView(ViewType.WAIT));

                // If there is a current WP, load data for that too once DV data is loaded
                if(userContext.workPackageId != 'NONE'){

                    // Load DV data and when done load WP data
                    ClientContainerServices.getDesignVersionData(userContext, this.onDesignVersionDataLoaded(userContext));

                } else {

                    // Just load the DV data and continue
                    ClientContainerServices.getDesignVersionData(userContext, this.onAllDataLoaded);
                }

            } else {

                log((msg) => console.log(msg), LogLevel.TRACE, "No DV set");
                // Will have to wait for a DV to be selected to get data
                this.onAllDataLoaded();
            }
        }

    }

    onDesignVersionDataLoaded(userContext){

        // Load WP data and then continue
        ClientContainerServices.getWorkPackageData(userContext, this.onAllDataLoaded)
    }

    onAllDataLoaded(){

        // Go to Home screen
        store.dispatch(setCurrentView(ViewType.HOME));
    }

    setOpenDesignVersionItems(userContext){

        // Set default view settings for open items
        let dvArr = [];

        try {

            // Set all Applications and Design Sections to be open for all Design Versions, Design Updates and Work Packages

            // All Design Versions
            const designVersionOpenComponents = DesignComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},

                },
                {fields: {_id: 1}}
            );


            designVersionOpenComponents.forEach((component) => {
                dvArr.push(component._id);
            });

            // Plus for the actual open item context, open the FEATURE that the item is in and select it as the current item
            log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
                userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

            if (userContext.designComponentId != 'NONE') {

                // There is a current component...
                if (userContext.designVersionId != 'NONE') {

                    let dvComponent = DesignComponents.findOne({
                        _id: userContext.designComponentId
                    });

                    if(dvComponent) {

                        switch(dvComponent.componentType){

                            case ComponentType.APPLICATION:
                            case ComponentType.DESIGN_SECTION:
                                // Already open
                                break;
                            case ComponentType.FEATURE:
                                // Open it and all stuff below
                                dvArr = ClientDesignComponentServices.setOpenClosed(dvComponent, dvArr, true);
                                break;
                            default:
                                // Anything else is below a Feature so open the Feature and select that
                                const dvFeatureComponent = DesignComponents.findOne({
                                    designVersionId:        dvComponent.designVersionId,
                                    componentReferenceId:   dvComponent.componentFeatureReferenceId
                                });

                                if(dvFeatureComponent){
                                    // Reset user context
                                    userContext.designComponentId = dvFeatureComponent._id;
                                    userContext.designComponentType = ComponentType.FEATURE;
                                    userContext.featureReferenceId = dvFeatureComponent.componentReferenceId;
                                    userContext.featureAspectReferenceId = 'NONE';
                                    userContext.scenarioReferenceId = 'NONE';
                                    userContext.scenarioStepId = 'NONE';

                                    store.dispatch(setCurrentUserItemContext(userContext, true));

                                    // Open the feature
                                    dvArr = ClientDesignComponentServices.setOpenClosed(dvFeatureComponent, dvArr, true);
                                }
                        }
                    }
                }
            }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open DV item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenDesignItems(
            dvArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }

    setOpenDesignUpdateItems(userContext){

        // Set default view settings for open items
        let duArr = [];

        try {

            // Set all Applications and Design Sections to be open

            // All Design Updates in current design version and update
            const designUpdateOpenComponents = DesignUpdateComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
                },
                {fields: {_id: 1}}
            );


            designUpdateOpenComponents.forEach((component) => {
                duArr.push(component._id);
            });


            // Plus for the actual open item context, open the FEATURE that the item is in and select it as the current item
            log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
                userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

            if (userContext.designComponentId != 'NONE') {

                // There is a current component...
                if (userContext.designUpdateId != 'NONE') {

                    // In a Design update so open to the DU component

                    let duComponent = DesignUpdateComponents.findOne({
                        _id: userContext.designComponentId
                    });

                    console.log("Opening design update component " + duComponent.componentNameNew);

                    if(duComponent) {

                        switch(duComponent.componentType){

                            case ComponentType.APPLICATION:
                            case ComponentType.DESIGN_SECTION:
                                // Already open
                                break;
                            case ComponentType.FEATURE:
                                // Open it and all stuff below
                                duArr = ClientDesignUpdateComponentServices.setOpenClosed(duComponent, duArr, true);
                                break;
                            default:
                                // Anything else is below a Feature so open the Feature and select that
                                const duFeatureComponent = DesignUpdateComponents.findOne({
                                    designUpdateId:         duComponent.designUpdateId,
                                    componentReferenceId:   duComponent.componentFeatureReferenceIdNew
                                });

                                if(duFeatureComponent){
                                    // Reset user context
                                    userContext.designComponentId = duFeatureComponent._id;
                                    userContext.designComponentType = ComponentType.FEATURE;
                                    userContext.featureReferenceId = duFeatureComponent.componentReferenceId;
                                    userContext.featureAspectReferenceId = 'NONE';
                                    userContext.scenarioReferenceId = 'NONE';
                                    userContext.scenarioStepId = 'NONE';

                                    store.dispatch(setCurrentUserItemContext(userContext, true));

                                    // Open the feature
                                    duArr = ClientDesignUpdateComponentServices.setOpenClosed(duFeatureComponent, duArr, true);
                                }
                        }

                    }

                }
            }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open DU item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            duArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }

    setOpenWorkPackageItems(userContext){

        // Set default view settings for open WP items

        let wpArr = [];

        try {

            // Set all Applications and Design Sections to be open for all Design Versions, Design Updates and Work Packages


            // Work Packages - open in scope items down to Feature level
            const workPackageOpenComponents = WorkPackageComponents.find(
                {
                    $or: [{componentActive: true}, {componentParent: true}],
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}

                },
                {fields: {_id: 1}}
            );

            workPackageOpenComponents.forEach((component) => {
                wpArr.push(component._id);
            });


            // Plus for the actual open item context, open all the way down to that item
            log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
                userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

            if (userContext.designComponentId != 'NONE') {
                // There is a current component...
                if (userContext.workPackageId != 'NONE') {
                    // User is in a WP so drill down to that item...

                    let wpComponent = WorkPackageComponents.findOne({
                        componentId: userContext.designComponentId
                    });

                    if(wpComponent) {

                        switch(wpComponent.componentType){

                            case ComponentType.APPLICATION:
                            case ComponentType.DESIGN_SECTION:
                                // Already open
                                break;
                            case ComponentType.FEATURE:
                                // Open it and all stuff below
                                wpArr = ClientWorkPackageComponentServices.setOpenClosed(wpComponent, wpArr, true);
                                break;
                            default:
                                // Anything else is below a Feature so open the Feature and select that
                                const wpFeatureComponent = WorkPackageComponents.findOne({
                                    workPackageId:          wpComponent.workPackageId,
                                    componentReferenceId:   wpComponent.componentFeatureReferenceId
                                });

                                if(wpFeatureComponent){
                                    // Reset user context.  Feature id is the DESIGN component ID, not the WP component ID
                                    userContext.designComponentId = wpFeatureComponent.componentId;
                                    userContext.designComponentType = ComponentType.FEATURE;
                                    userContext.featureReferenceId = wpFeatureComponent.componentReferenceId;
                                    userContext.featureAspectReferenceId = 'NONE';
                                    userContext.scenarioReferenceId = 'NONE';
                                    userContext.scenarioStepId = 'NONE';

                                    store.dispatch(setCurrentUserItemContext(userContext, true));

                                    // Open the feature
                                    wpArr = ClientWorkPackageComponentServices.setOpenClosed(wpFeatureComponent, wpArr, true);
                                }
                        }
                    }
                }
            }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            wpArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }


    setViewFromUserContext(userContext, userRole, testIntegrationDataContext, testDataFlag){

        const userViewOptions = UserCurrentViewOptions.findOne({userId: userContext.userId});

        // If no design / design version selected go to Designs screen
        if(userContext.designId === 'NONE' || userContext.designVersionId === 'NONE'){
            store.dispatch(setCurrentView(ViewType.DESIGNS));
            return;
        }

        // Decide where to go depending on the user context
        switch(userRole){
            case RoleType.DESIGNER:

                // If a designer, go to the design version that is in the context.  If its new, editing it.
                // If published and an update is new / draft go to update
                // If final go to view

                // See what status the design version has
                const designVersion = DesignVersions.findOne({_id: userContext.designVersionId});

                // Just in case stored data is out of date for some reason, back to Designs if not found
                if (designVersion) {
                    switch (designVersion.designVersionStatus) {
                        case DesignVersionStatus.VERSION_NEW:
                        case DesignVersionStatus.VERSION_DRAFT:

                            // Straight to edit of new update - set mash data stale so test data loaded if Test Summary is showing
                            if(userContext.designComponentId != 'NONE'){
                                ClientDesignVersionServices.editDesignVersion(userRole, userViewOptions, userContext, userContext.designVersionId, testDataFlag, testIntegrationDataContext);
                            } else {
                                store.dispatch(setCurrentView(ViewType.SELECT));
                            }
                            return;

                        case DesignVersionStatus.VERSION_UPDATABLE:

                            // If there is an update in the context go to that otherwise go to selection
                            if (userContext.designUpdateId != 'NONE') {

                                // See what the status of this update is - is it editable?
                                const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

                                // Just in case stored data is out of date for some reason, back to select if not found
                                if (designUpdate) {
                                    switch (designUpdate.updateStatus) {
                                        case DesignUpdateStatus.UPDATE_NEW:
                                        case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:

                                            // Go to edit update in Edit Mode
                                            if(userContext.designComponentId != 'NONE') {
                                                ClientDesignUpdateServices.editDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId);
                                            } else {
                                                store.dispatch(setCurrentView(ViewType.SELECT));
                                            }
                                            return;

                                        default:
                                            // Anything else, just view the update - here there could be a test summary
                                            if(userContext.designComponentId != 'NONE') {
                                                ClientDesignUpdateServices.viewDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId, testDataFlag, testIntegrationDataContext);
                                            } else {
                                                store.dispatch(setCurrentView(ViewType.SELECT));
                                            }
                                            return;
                                    }
                                } else {
                                    // No update selected
                                    store.dispatch(setCurrentView(ViewType.SELECT));
                                    return;
                                }
                            } else {
                                store.dispatch(setCurrentView(ViewType.SELECT));
                                return;

                            }
                        case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                        case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                            // View that final design version if user had selected something in it
                            if(userContext.designComponentId != 'NONE') {
                                ClientDesignVersionServices.viewDesignVersion(userRole, userViewOptions, userContext, userContext.designVersionId, testDataFlag, testIntegrationDataContext);
                            } else {
                                store.dispatch(setCurrentView(ViewType.SELECT));
                            }
                            return;
                    }
                } else {
                    // No Design Version found
                    store.dispatch(setCurrentView(ViewType.DESIGNS));
                    return;
                }

                break;
            case RoleType.DEVELOPER:
                // If a developer go to the Work Package they are currently working on if it is set

                log((msg) => console.log(msg), LogLevel.TRACE, "Developer Context WP is {}", userContext.workPackageId);

                if(userContext.workPackageId != 'NONE'){

                    const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

                    // If bad data return to Designs
                    if(workPackage){
                        switch(workPackage.workPackageStatus){
                            case WorkPackageStatus.WP_ADOPTED:

                                // Development

                                // If a Design Component is selected then we are IN the work package...
                                if(userContext.designComponentId != 'NONE') {
                                    ClientWorkPackageServices.developWorkPackage(userRole, userContext, userViewOptions, userContext.workPackageId, testDataFlag, testIntegrationDataContext);
                                } else {
                                    // Just go to WP selection
                                    store.dispatch(setCurrentView(ViewType.SELECT));
                                }
                                return;

                            case WorkPackageStatus.WP_AVAILABLE:
                            case WorkPackageStatus.WP_COMPLETE:
                            case WorkPackageStatus.WP_NEW:

                                // Anything else, allow developer to select a WP
                                store.dispatch(setCurrentView(ViewType.SELECT));
                                return;
                        }
                    } else {
                        log((msg) => console.log(msg), LogLevel.TRACE, "WP Not Found!");
                        store.dispatch(setCurrentView(ViewType.SELECT));
                        return;
                    }
                } else {
                    store.dispatch(setCurrentView(ViewType.SELECT));
                    return;
                }
                return;
            case RoleType.MANAGER:
                // If a manager go to a WP if being edited
                if(userContext.workPackageId != 'NONE'){

                    const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

                    // If bad data return to Selection
                    if(workPackage){
                        switch(workPackage.workPackageStatus){

                            case WorkPackageStatus.WP_NEW:
                            case WorkPackageStatus.WP_AVAILABLE:
                            case WorkPackageStatus.WP_ADOPTED:

                                // New or Development so still editable
                                switch(workPackage.workPackageType){
                                    case WorkPackageType.WP_BASE:
                                        if(userContext.designComponentId != 'NONE') {
                                            ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;

                                    case WorkPackageType.WP_UPDATE:
                                        if(userContext.designComponentId != 'NONE') {
                                            ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;
                                }
                                break;
                            case WorkPackageStatus.WP_COMPLETE:

                                // View Only
                                switch(workPackage.workPackageType){
                                    case WorkPackageType.WP_BASE:
                                        if(userContext.designComponentId != 'NONE') {
                                            ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;

                                    case WorkPackageType.WP_UPDATE:
                                        if(userContext.designComponentId !== 'NONE') {
                                            ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;
                                }
                                break;
                        }
                    } else {
                        store.dispatch(setCurrentView(ViewType.SELECT));
                        return;
                    }
                } else {
                    store.dispatch(setCurrentView(ViewType.SELECT));
                    return;
                }
                return;
        }


    };


    // Get readable details of the current user context
    getContextNameData(userContext, displayContext){

        log((msg) => console.log(msg), LogLevel.TRACE, "Getting context name data...");

        let contextNameData = {
            design:             'NONE',
            designVersion:      'NONE',
            designUpdate:       'NONE',
            workPackage:        'NONE',
            application:        'NONE',
            designSection:      'NONE',
            feature:            'NONE',
            featureAspect:      'NONE',
            scenario:           'NONE'
        };

        if(userContext.designId !== 'NONE'){

            const design = Designs.findOne({_id: userContext.designId});

            if(design){
                contextNameData.design = design.designName;
            }
        }

        if(userContext.designVersionId !== 'NONE'){

            const designVersion = DesignVersions.findOne({_id: userContext.designVersionId});

            if(designVersion) {
                contextNameData.designVersion = designVersion.designVersionName;
            }
        }

        if(userContext.designUpdateId !== 'NONE'){

            const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

            if(designUpdate) {
                contextNameData.designUpdate = designUpdate.updateName;
            }
        }

        if(userContext.workPackageId !== 'NONE'){

            const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

            if(workPackage) {
                contextNameData.workPackage = workPackage.workPackageName;
            }
        }

        // After here is is possible that the data is not yet subscribed to so skip if not
        if(store.getState().designVersionDataLoaded) {

            // TODO - rethink how this works
            return contextNameData;

            if (userContext.designComponentId !== 'NONE') {
                switch (userContext.designComponentType) {
                    case ComponentType.APPLICATION:
                        if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {
                            contextNameData.application = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                        } else {
                            contextNameData.application = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                        }
                        break;
                    case ComponentType.DESIGN_SECTION:
                        if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {
                            contextNameData.designSection = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                        } else {
                            contextNameData.designSection = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                        }
                        contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                        break;
                    case ComponentType.FEATURE:
                        if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {
                            contextNameData.feature = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                        } else {
                            contextNameData.feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                        }
                        contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                        contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                        break;
                    case ComponentType.FEATURE_ASPECT:
                        if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {

                            const contextFeatureAspect = DesignComponents.findOne({_id: userContext.designComponentId});

                            if(contextFeatureAspect){
                                contextNameData.featureAspect = contextFeatureAspect.componentName;
                            }

                        } else {

                            const contextUpdateFeatureAspect = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

                            if(contextUpdateFeatureAspect){
                                contextNameData.featureAspect = contextUpdateFeatureAspect.componentNameNew;
                            }
                        }
                        contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                        contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                        contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext, displayContext);
                        break;
                    case ComponentType.SCENARIO:
                        if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {

                            const contextScenario = DesignComponents.findOne({_id: userContext.designComponentId});

                            if(contextScenario){
                                contextNameData.scenario = contextScenario.componentName;
                            }

                        } else {

                            const contextUpdateScenario = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

                            if(contextUpdateScenario){
                                contextNameData.scenario = contextUpdateScenario.componentNameNew;
                            }

                        }
                        contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                        contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                        contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext, displayContext);
                        contextNameData.featureAspect = this.getParent(ComponentType.FEATURE_ASPECT, userContext, displayContext);
                        break;
                }
            }
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Returning {}", contextNameData);

        return contextNameData;

    };

    getParent(parentType, userContext, displayContext){

        if(userContext.designComponentId !== 'NONE') {

            let currentItemType = userContext.designComponentType;
            let currentItemId = userContext.designComponentId;

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for parent of type {} for component {} ", parentType, currentItemId);

            if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {

                let currentItem = DesignComponents.findOne({_id: currentItemId});

                if(currentItem) {
                    let parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});


                    log((msg) => console.log(msg), LogLevel.TRACE, "Immediate parent is type {}", parentItem.componentType);

                    while (parentItem && (parentItem.componentType !== parentType) && (currentItem.componentParentId !== 'NONE')) {
                        currentItem = parentItem;
                        parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});

                        if (parentItem) {
                            log((msg) => console.log(msg), LogLevel.TRACE, "Next parent is type {}", parentItem.componentType);
                        } else {
                            log((msg) => console.log(msg), LogLevel.TRACE, "No more parents");
                        }
                    }

                    if (!parentItem) {
                        return 'NONE';
                    }

                    return parentItem.componentName;

                } else {

                    return 'NONE';
                }

            } else {
                let currentUpdateItem = DesignUpdateComponents.findOne({_id: currentItemId});
                if(currentUpdateItem) {
                    let parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});

                    while ((parentUpdateItem.componentType !== parentType) && (currentUpdateItem.componentParentIdNew !== 'NONE')) {
                        currentUpdateItem = parentUpdateItem;
                        parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});
                    }

                    return parentUpdateItem.componentName;
                } else {

                    return 'NONE';
                }
            }
        } else {
            return 'NONE';
        }
    };

    resetContextsOnDesignRemoval(removedDesignId){

        // This prevents errors after re-login if a Design is removed that other people have accessed

        const affectedUsers = UserCurrentEditContext.find({designId: removedDesignId}).fetch();

        affectedUsers.forEach((user) => {

            UserCurrentEditContext.update(
                {_id: user._id},
                {
                    $set:{
                        designId:                       'NONE',
                        designVersionId:                'NONE',
                        designUpdateId:                 'NONE',
                        workPackageId:                  'NONE',
                        designComponentId:              'NONE',
                        designComponentType:            'NONE',
                        featureReferenceId:             'NONE',
                        featureAspectReferenceId:       'NONE',
                        scenarioReferenceId:            'NONE',
                        scenarioStepId:                 'NONE',
                    }
                }
            );
        })
    };

    resetContextsOnDesignComponentRemoval(removedDesignComponentId){

        // This prevents errors after re-login if a Design Component is removed that other people have accessed

        const affectedUsers = UserCurrentEditContext.find({designComponentId: removedDesignComponentId}).fetch();

        affectedUsers.forEach((user) => {

            UserCurrentEditContext.update(
                {_id: user._id},
                {
                    $set:{
                        designComponentId:              'NONE',
                        designComponentType:            'NONE',
                        featureReferenceId:             'NONE',
                        featureAspectReferenceId:       'NONE',
                        scenarioReferenceId:            'NONE',
                        scenarioStepId:                 'NONE',
                    }
                }
            );
        })
    };

    getWindowSizeClass(){

        const windowSize = store.getState().currentWindowSize;

        switch(windowSize){
            case WindowSize.WINDOW_SMALL:
                return 'design-editor-small';
            case WindowSize.WINDOW_LARGE:
                return 'design-editor-large';

        }
    }

    setWindowSize(newSize){
        store.dispatch(setCurrentWindowSize(newSize));
    }
}

export default new ClientUserContextServices();