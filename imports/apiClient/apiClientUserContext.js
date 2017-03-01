// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../collections/context/user_current_view_options.js';
import { UserRoles }                from '../collections/users/user_roles.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, ViewMode, DisplayContext, DesignVersionStatus, DesignUpdateStatus, ComponentType, LocationType, LogLevel, WorkPackageStatus, WorkPackageType } from '../constants/constants.js';
import { log } from '../common/utils.js';

import ClientContainerServices          from '../apiClient/apiClientContainerServices.js';
import ClientDesignVersionServices      from '../apiClient/apiClientDesignVersion.js';
import ClientDesignUpdateServices       from '../apiClient/apiClientDesignUpdate.js';
import ClientWorkPackageServices        from '../apiClient/apiClientWorkPackage.js';
import ClientDesignComponentServices    from '../apiClient/apiClientDesignComponent.js';


// REDUX services
import store from '../redux/store'
import {setCurrentView, setCurrentViewMode, setCurrentRole, setCurrentUserName, setCurrentUserItemContext, setCurrentUserViewOptions, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems} from '../redux/actions'

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
                scenarioStepId:                 userContext.scenarioStepId,
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                unitTestResultsLocation:        userContext.unitTestResultsLocation
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
                scenarioStepId:                 'NONE',
                featureFilesLocation:           'NONE',
                acceptanceTestResultsLocation:  'NONE',
                integrationTestResultsLocation: 'NONE',
                unitTestResultsLocation:        'NONE',
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

            this.onMainDataLoaded();
        } else {
            // Need to load data
            if(userContext.designVersionId != 'NONE'){
                log((msg) => console.log(msg), LogLevel.TRACE, "Loading data for DV {}", userContext.designVersionId);

                store.dispatch(setCurrentView(ViewType.WAIT));

                // This should wait until data loaded to call the function
                ClientContainerServices.getDesignVersionData(userContext.designVersionId, this.onMainDataLoaded);

            } else {
                log((msg) => console.log(msg), LogLevel.TRACE, "No DV set");
                // Will have to wait for a DV to be selected to get data
                this.onMainDataLoaded();
            }
        }

    }

    onMainDataLoaded(){

        // Go to Home screen
        store.dispatch(setCurrentView(ViewType.HOME));

    }

    setOpenItems(userContext, roleType){

        // Set default view settings for open items

        let dvArr = [];
        let duArr = [];
        let wpArr = [];

        try {

            // Set all Applications and Design Sections to be open for all Design Versions, Design Updates and Work Packages

            // All Design Versions
            const designVersionOpenComponents = DesignComponents.find(
                {
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},

                },
                {fields: {_id: 1}}
            );


            designVersionOpenComponents.forEach((component) => {
                dvArr.push(component._id);
            });


            // All Design Updates
            const designUpdateOpenComponents = DesignUpdateComponents.find(
                {
                    componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
                },
                {fields: {_id: 1}}
            );


            designUpdateOpenComponents.forEach((component) => {
                duArr.push(component._id);
            });


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

                    if (wpComponent.componentParentReferenceId === 'NONE') {
                        // No Parent, just make sure component is open
                        if (!wpArr.includes(wpComponent._id)) {
                            wpArr.push(wpComponent._id);
                        }
                    } else {
                        // Get the parent
                        let wpParent = WorkPackageComponents.findOne({
                            componentReferenceId: wpComponent.componentParentReferenceId
                        });

                        // Keep going up until the parent is already open or top of tree
                        while (!wpArr.includes(wpParent._id) && wpParent.componentParentReferenceId != 'NONE') {
                            wpComponent = wpParent;

                            if (!wpArr.includes(wpComponent._id)) {
                                wpArr.push(wpComponent._id);
                            }

                            wpParent = WorkPackageComponents.findOne({
                                componentReferenceId: wpComponent.componentParentReferenceId
                            });
                        }
                    }

                } else {
                    if (userContext.designUpdateId != 'NONE') {
                        // Not in a WP but in a Design update so open to the DU component

                        let duComponent = DesignUpdateComponents.findOne({
                            _id: userContext.designComponentId
                        });

                        if(duComponent) {
                            if (duComponent.componentParentIdNew === 'NONE') {
                                // No Parent, just make sure component is open
                                if (!duArr.includes(duComponent._id)) {
                                    duArr.push(duComponent._id);
                                }
                            } else {
                                // Get the parent
                                let duParent = DesignUpdateComponents.findOne({
                                    _id: duComponent.componentParentIdNew
                                });

                                // Keep going up until the parent is already open or top of tree
                                while (!duArr.includes(duParent._id) && duParent.componentParentIdNew != 'NONE') {
                                    duComponent = duParent;

                                    if (!duArr.includes(duComponent._id)) {
                                        duArr.push(duComponent._id);
                                    }

                                    duParent = DesignUpdateComponents.findOne({
                                        _id: duComponent.componentParentIdNew
                                    });
                                }
                            }
                        } else {
                            // Must be a base design component
                            let baseComponent = DesignComponents.findOne({
                                _id: userContext.designComponentId
                            });

                            if(baseComponent){
                                if (baseComponent.componentParentId === 'NONE') {
                                    // No Parent, just make sure component is open
                                    if (!dvArr.includes(baseComponent._id)) {
                                        dvArr.push(baseComponent._id);
                                    }
                                } else {
                                    // Get the parent
                                    let dvParent = DesignComponents.findOne({
                                        _id: baseComponent.componentParentId
                                    });

                                    // Keep going up until the parent is already open or top of tree
                                    while (!dvArr.includes(dvParent._id) && dvParent.componentParentId != 'NONE') {
                                        baseComponent = dvParent;

                                        if (!dvArr.includes(baseComponent._id)) {
                                            dvArr.push(baseComponent._id);
                                        }

                                        dvParent = DesignComponents.findOne({
                                            _id: baseComponent.componentParentId
                                        });
                                    }
                                }
                            }
                        }

                    } else {
                        if (userContext.designVersionId != 'NONE') {
                            // Just in a DV so open that component

                            let dvComponent = DesignComponents.findOne({
                                _id: userContext.designComponentId
                            });

                            if (dvComponent.componentParentId === 'NONE') {
                                // No Parent, just make sure component is open
                                if (!dvArr.includes(dvComponent._id)) {
                                    dvArr.push(dvComponent._id);
                                }
                            } else {
                                // Get the parent
                                let dvParent = DesignComponents.findOne({
                                    _id: dvComponent.componentParentId
                                });

                                // Keep going up until the parent is already open or top of tree
                                while (!dvArr.includes(dvParent._id) && dvParent.componentParentId != 'NONE') {
                                    dvComponent = dvParent;

                                    if (!dvArr.includes(dvComponent._id)) {
                                        log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Opening {}", dvComponent.componentName);
                                        dvArr.push(dvComponent._id);
                                    }

                                    dvParent = DesignComponents.findOne({
                                        _id: dvComponent.componentParentId
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenDesignItems(
            Meteor.userId(),
            dvArr,
            null,
            true
        ));

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            Meteor.userId(),
            duArr,
            null,
            true
        ));

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            Meteor.userId(),
            wpArr,
            null,
            true
        ));

    }


    setViewFromUserContext(userContext, userRole){

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
                            ClientDesignVersionServices.editDesignVersion(userRole, userViewOptions, userContext, userContext.designVersionId, false, true);

                            if(userContext.designComponentId != 'NONE'){
                                ClientDesignComponentServices.setDesignComponent(userContext.designComponentId, userContext, DisplayContext.BASE_EDIT);
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

                                            // Go to edit update in Edit Mode
                                            ClientDesignUpdateServices.editDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId);
                                            return;

                                        default:
                                            // Anything else, just view the update - but there will be an option to switch to edit for DRAFT
                                            ClientDesignUpdateServices.viewDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId)
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

                            // View that final design version
                            ClientDesignVersionServices.viewDesignVersion(userRole, userViewOptions, userContext, userContext.designVersionId, false, true);
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
                                ClientWorkPackageServices.developWorkPackage(userRole, userContext, userViewOptions, userContext.workPackageId, true);
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

                                        ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        return;

                                    case WorkPackageType.WP_UPDATE:

                                        ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
                                        return;
                                }
                                break;
                            case WorkPackageStatus.WP_COMPLETE:

                                // View Only
                                switch(workPackage.workPackageType){
                                    case WorkPackageType.WP_BASE:

                                        ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        return;

                                    case WorkPackageType.WP_UPDATE:

                                        ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
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

    updateContextFilePath(type, userContext, newPath){


        // Set to original values
        let newFeatureFilesLocation = userContext.featureFilesLocation;
        let newAcceptanceTestResultsLocation = userContext.acceptanceTestResultsLocation;
        let newIntegrationTestResultsLocation = userContext.integrationTestResultsLocation;
        let newUnitTestResultsLocation = userContext.unitTestResultsLocation;

        // Then update the one that changed
        switch(type){
            case LocationType.LOCATION_FEATURE_FILES:
                newFeatureFilesLocation = newPath;
                break;
            case LocationType.LOCATION_ACCEPTANCE_TEST_OUTPUT:
                newAcceptanceTestResultsLocation = newPath;
                break;
            case LocationType.LOCATION_INTEGRATION_TEST_OUTPUT:
                newIntegrationTestResultsLocation = newPath;
                break;
            case LocationType.LOCATION_MODULE_TEST_OUTPUT:
                newUnitTestResultsLocation = newPath;
                break;
        }

        // And dispatch a new context
        const context = {
            userId:                         userContext.userId,
            designId:                       userContext.designId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            workPackageId:                  userContext.workPackageId,
            designComponentId:              userContext.designComponentId,
            designComponentType:            userContext.designComponentType,
            featureReferenceId:             userContext.featureReferenceId,
            featureAspectReferenceId:       userContext.featureAspectReferenceId,
            scenarioReferenceId:            userContext.scenarioReferenceId,
            scenarioStepId:                 userContext.scenarioStepId,
            featureFilesLocation:           newFeatureFilesLocation,
            acceptanceTestResultsLocation:  newAcceptanceTestResultsLocation,
            integrationTestResultsLocation: newIntegrationTestResultsLocation,
            unitTestResultsLocation:      newUnitTestResultsLocation
        };

        store.dispatch(setCurrentUserItemContext(context, true));

    }

    // Get readable details of the current user context
    getContextNameData(userContext){

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

        if(userContext.designId != 'NONE'){
            contextNameData.design = Designs.findOne({_id: userContext.designId}).designName;
        }

        if(userContext.designVersionId != 'NONE'){
            contextNameData.designVersion = DesignVersions.findOne({_id: userContext.designVersionId}).designVersionName;
        }

        if(userContext.designUpdateId != 'NONE'){
            contextNameData.designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId}).updateName;
        }

        if(userContext.workPackageId != 'NONE'){
            contextNameData.workPackage = WorkPackages.findOne({_id: userContext.workPackageId}).workPackageName;
        }

        if(userContext.designComponentId != 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.application = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.application = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    break;
                case ComponentType.DESIGN_SECTION:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.designSection = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.designSection = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    break;
                case ComponentType.FEATURE:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.feature = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    break;
                case ComponentType.FEATURE_ASPECT:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.featureAspect = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.featureAspect = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext);
                    break;
                case ComponentType.SCENARIO:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.scenario = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.scenario = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext);
                    contextNameData.featureAspect = this.getParent(ComponentType.FEATURE_ASPECT, userContext);
                    break;
            }
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Returning {}", contextNameData);

        return contextNameData;

    };

    getParent(parentType, context){

        if(context.designComponentId != 'NONE') {

            let currentItemType = context.designComponentType;
            let currentItemId = context.designComponentId;

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for parent of type {} for component {} ", parentType, currentItemId);

            if (context.designUpdateId === 'NONE') {

                let currentItem = DesignComponents.findOne({_id: currentItemId});
                let parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});



                log((msg) => console.log(msg), LogLevel.TRACE, "Immediate parent is type {}", parentItem.componentType);

                while (parentItem && (parentItem.componentType != parentType) && (currentItem.componentParentId != 'NONE')) {
                    currentItem = parentItem;
                    parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});

                    if (parentItem) {
                        log((msg) => console.log(msg), LogLevel.TRACE, "Next parent is type {}", parentItem.componentType);
                    } else {
                        log((msg) => console.log(msg), LogLevel.TRACE, "No more parents");
                    }
                }

                if(!parentItem){
                    return 'NONE';
                }

                return parentItem.componentName;

            } else {
                let currentUpdateItem = DesignUpdateComponents.findOne({_id: currentItemId});
                let parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});

                while ((parentUpdateItem.componentType != parentType) && (currentUpdateItem.componentParentIdNew != 'NONE')) {
                    currentUpdateItem = parentUpdateItem;
                    parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});
                }

                return parentUpdateItem.componentName;
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

}

export default new ClientUserContextServices();