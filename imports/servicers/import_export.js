import fs from 'fs';

import { UserRoles }                    from '../collections/users/user_roles.js';
import { UserCurrentEditContext }       from '../collections/context/user_current_edit_context.js';
import { Designs }                      from '../collections/design/designs.js';
import { DesignVersions }               from '../collections/design/design_versions.js';
import { DesignUpdates }                from '../collections/design_update/design_updates.js';
import { WorkPackages }                 from '../collections/work/work_packages.js';
import { DomainDictionary }             from '../collections/design/domain_dictionary.js'
import { DesignComponents }             from '../collections/design/design_components.js';
import { ScenarioSteps }                from '../collections/design/scenario_steps.js';
import { FeatureBackgroundSteps }       from '../collections/design/feature_background_steps.js';
import { DesignUpdateComponents }       from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents }        from '../collections/work/work_package_components.js';

import DesignServices                   from './design_services.js';
import DesignVersionServices            from './design_version_services.js';
import DesignUpdateServices             from './design_update_services.js';
import WorkPackageServices              from './work_package_services.js';
import DomainDictionaryServices         from '../service_modules/server/domain_dictionary_services.js';
import DesignComponentServices          from './design_component_services.js';
import DesignUpdateComponentServices    from './design_update_component_services.js';
import ScenarioServices                 from './scenario_services.js';

import {getIdFromMap, log}              from '../common/utils.js';


import { DesignUpdateStatus, WorkPackageStatus, WorkPackageType, ComponentType, LogLevel} from '../constants/constants.js';

class ImpExServices{

    exportUltrawideData(){
        // Export all the essential data to a file

        // User Data
        this.produceExportFile(UserRoles, 'USERS');

        // User Context
        this.produceExportFile(UserCurrentEditContext, 'USER_CONTEXT');

        // Designs
        this.produceExportFile(Designs, 'DESIGNS');

        // Design Versions
        this.produceExportFile(DesignVersions, 'DESIGN_VERSIONS');

        // Design Updates
        this.produceExportFile(DesignUpdates, 'DESIGN_UPDATES');

        // Work Packages
        this.produceExportFile(WorkPackages, 'WORK_PACKAGES');

        // Domain Dictionary
        this.produceExportFile(DomainDictionary, 'DOMAIN_DICTIONARY');

        // Design Components
        this.produceExportFile(DesignComponents, 'DESIGN_COMPONENTS');

        // Design Update Components
        this.produceExportFile(DesignUpdateComponents, 'DESIGN_UPDATE_COMPONENTS');

        // Work Package Components
        this.produceExportFile(WorkPackageComponents, 'WORK_PACKAGE_COMPONENTS');

        // Feature Background Steps
        this.produceExportFile(FeatureBackgroundSteps, 'FEATURE_BACKGROUND_STEPS');

        // Scenario Steps
        this.produceExportFile(ScenarioSteps, 'SCENARIO_STEPS');
    };

    produceExportFile(collection, fileName){
        let path = process.env["PWD"] + '/backup/';

        const data = collection.find({});
        const jsonData = JSON.stringify(data.fetch());

        fs.writeFile(path + fileName +'.EXP', jsonData);

    }

    importUltrawideData(){
        // Recreate the data using the latest code so that it is compatible...

        let path = process.env["PWD"] + '/backup/';

        // Users - TODO - currently being created by fixtures

        let usersMapping = [];
        let designsMapping = [];
        let designVersionsMapping = [];
        let designUpdatesMapping = [];
        let workPackagesMapping = [];
        let designComponentsMapping = [];
        let designUpdateComponentsMapping = [];
        let workPackageComponentsMapping = [];

        let designId = null;
        let designVersionId = null;
        let designUpdateId = null;
        let workPackageId = null;
        let domainTermId = null;
        let designComponentId = null;
        let designUpdateComponentId = null;
        let workPackageComponentId = null;
        let featureBackgroundStepId = null;
        let scenarioStepId = null;


        // User Data ===================================================================================================

        // User context is completely reset except for the path information which is restored

        let userData = '';
        let userContextData = '';
        let users = [];
        let userContexts = [];

        try {
            userData = fs.readFileSync(path + 'USERS.EXP');
            userContextData = fs.readFileSync(path + 'USER_CONTEXT.EXP');
            users = JSON.parse(userData);
            userContexts = JSON.parse(userContextData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open User export files: {}", e);
        }

        if(users.length > 0){

            users.forEach((user) => {
                log((msg) => console.log(msg), LogLevel.DEBUG, "Processing User : {}", user.displayName);

                // Create a new Meteor account
                let userId = Accounts.createUser(
                    {
                        username: user.userName,
                        password: user.userName
                    }
                );

                UserRoles.insert({
                    userId: userId,
                    userName: user.userName,
                    displayName: user.displayName,
                    isDesigner: user.isDesigner,
                    isDeveloper: user.isDeveloper,
                    isManager: user.isManager
                });

                usersMapping.push({oldId: user.userId, newId: userId});

                // And create some basic new User Context
                if(userContexts.length > 0) {
                    userContexts.forEach((userContext) => {

                        if (userContext.userId === user.userId) {
                            // This context relates to the old user id so insert a new context, just restoring path info

                            UserCurrentEditContext.insert({
                                userId: userId,             // New User Id
                                designId: 'NONE',
                                designVersionId: 'NONE',
                                designUpdateId: 'NONE',
                                workPackageId: 'NONE',
                                designComponentId: 'NONE',
                                designComponentType: 'NONE',

                                featureReferenceId: 'NONE',
                                featureAspectReferenceId: 'NONE',
                                scenarioReferenceId: 'NONE',
                                scenarioStepId: 'NONE',

                                featureFilesLocation: userContext.featureFilesLocation,
                                acceptanceTestResultsLocation: userContext.acceptanceTestResultsLocation,
                                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                                moduleTestResultsLocation: userContext.moduleTestResultsLocation
                            });
                        }
                    });
                } else {
                    // Use empty user context
                    UserCurrentEditContext.insert({
                        userId: userId,             // New User Id
                        designId: 'NONE',
                        designVersionId: 'NONE',
                        designUpdateId: 'NONE',
                        workPackageId: 'NONE',
                        designComponentId: 'NONE',
                        designComponentType: 'NONE',

                        featureReferenceId: 'NONE',
                        featureAspectReferenceId: 'NONE',
                        scenarioReferenceId: 'NONE',
                        scenarioStepId: 'NONE',

                        featureFilesLocation: 'NONE',
                        acceptanceTestResultsLocation: 'NONE',
                        integrationTestResultsLocation: 'NONE',
                        moduleTestResultsLocation: 'NONE'
                    });
                }

            });
        }


        // Design Items ================================================================================================

        let hasDesignUpdates = true;
        let hasWorkPackages = true;
        let hasDesignComponents = true;
        let hasDesignUpdateComponents = true;

         // Designs ----------------------------------------------------------------------------------------------------
        let designData = '';
        let designs = [];

        try {
            designData = fs.readFileSync(path + 'DESIGNS.EXP');
            designs = JSON.parse(designData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Designs export file: {}", e);
        }

        if(designs.length > 0) {

            designs.forEach((design) => {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design: {}", design.designName);

                designId = DesignServices.importDesign(design);
                if (designId) {
                    // Store the new Design ID
                    designsMapping.push({oldId: design._id, newId: designId});
                }
            });
        } else {
            // Abort
            log((msg) => console.log(msg), LogLevel.WARNING, "No Designs - No dice...");
            return;
        }


        // Design Versions ---------------------------------------------------------------------------------------------
        let designVersionsData = '';
        let designVersions = [];

        try{
            designVersionsData = fs.readFileSync(path + 'DESIGN_VERSIONS.EXP');
            designVersions = JSON.parse(designVersionsData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Versions export file: {}", e);
        }

        if(designVersions.length > 0) {
            designId = null;

            designVersions.forEach((designVersion) => {
                designId = getIdFromMap(designsMapping, designVersion.designId);
                if (designId) {

                    log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Version: {} to Design {}", designVersion.designVersionName, designId);

                    designVersionId = DesignVersionServices.importDesignVersion(
                        designId,
                        designVersion
                    );

                    if (designVersionId) {
                        // Store the new Design Version ID
                        designVersionsMapping.push({oldId: designVersion._id, newId: designVersionId});
                    }
                }
            });
        } else {
            // Abort - everything else needs a Design Version
            log((msg) => console.log(msg), LogLevel.WARNING, "No Design Versions - Invalid data.");
            return;
        }


        // Design Updates ----------------------------------------------------------------------------------------------
        let designUpdatesData = '';
        let designUpdates = [];

        try{
            designUpdatesData = fs.readFileSync(path + 'DESIGN_UPDATES.EXP');
            designUpdates = JSON.parse(designUpdatesData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Updates export file: {}", e);
        }

        if(designUpdates.length > 0) {
            designVersionId = null;

            designUpdates.forEach((designUpdate) => {
                designVersionId = getIdFromMap(designVersionsMapping, designUpdate.designVersionId);
                if (designVersionId) {

                    log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Update: {} to Design Version {}", designUpdate.updateName, designVersionId);

                    designUpdateId = DesignUpdateServices.importDesignUpdate(
                        designVersionId,
                        designUpdate
                    );

                    if (designUpdateId) {
                        // Store the new Design Update ID
                        designUpdatesMapping.push({oldId: designUpdate._id, newId: designUpdateId});
                    }
                }
            });
        } else {
            // No Design Updates - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Design Updates found...");
            hasDesignUpdates = false;
        }

        // Work Packages -----------------------------------------------------------------------------------------------
        let workPackagesData = '';
        let workPackages = [];

        try{
            workPackagesData = fs.readFileSync(path + 'WORK_PACKAGES.EXP');
            workPackages = JSON.parse(workPackagesData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Work Packages export file: {}", e);
        }

        designVersionId = null;
        designUpdateId = null;

        if(workPackages.length > 0) {
            workPackages.forEach((workPackage) => {

                designVersionId = getIdFromMap(designVersionsMapping, workPackage.designVersionId);

                if (designVersionId) {

                    log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Work Package: {} of type {} to Design Version {}",
                        workPackage.workPackageName, workPackage.workPackageType, designVersionId);

                    if((workPackage.workPackageType === WorkPackageType.WP_UPDATE) && !hasDesignUpdates){
                        log((msg) => console.log(msg), LogLevel.WARNING, "INVALID DATA: Update WP found when no Updates!  Skipping");
                    } else {

                        if (workPackage.workPackageType === WorkPackageType.WP_UPDATE) {
                            designUpdateId = getIdFromMap(designUpdatesMapping, workPackage.designUpdateId);
                        } else {
                            designUpdateId = 'NONE';
                        }

                        workPackageId = WorkPackageServices.importWorkPackage(
                            designVersionId,
                            designUpdateId,
                            workPackage
                        );

                        if (workPackageId) {
                            // Store the new Work Package ID
                            workPackagesMapping.push({oldId: workPackage._id, newId: workPackageId});
                        }
                    }
                }
            });
        } else {
            // No Work Packages - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Work Packages found...");
            hasWorkPackages = false;
        }

        // Design Data =================================================================================================

        // Domain Dictionary -------------------------------------------------------------------------------------------
        let domainDictionaryData = '';
        let dictionaryTerms = [];

        try{
            domainDictionaryData = fs.readFileSync(path + 'DOMAIN_DICTIONARY.EXP');
            dictionaryTerms = JSON.parse(domainDictionaryData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Domain Dictionary export file: {}", e);
        }

        if(dictionaryTerms.length > 0) {
            designId = null;
            designVersionId = null;

            dictionaryTerms.forEach((term) => {
                console.log("Adding Dictionary Term " + term.domainTermNew);

                designId = getIdFromMap(designsMapping, term.designId);
                designVersionId = getIdFromMap(designVersionsMapping, term.designVersionId);

                domainTermId = DomainDictionaryServices.addNewTerm(designId, designVersionId);

                if (domainTermId) {
                    // Set the actual term and definition
                    DomainDictionaryServices.updateTermName(domainTermId, term.domainTermNew, term.domainTermOld);
                    DomainDictionaryServices.updateTermDefinition(domainTermId, term.domainTextRaw)
                }
            });
        } else {
            // No Domain Dictionary - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Domain Dictionary found...");
        }

        // Design Components -------------------------------------------------------------------------------------------
        let designComponentsData = '';
        let designComponents = [];

        try{
            designComponentsData = fs.readFileSync(path + 'DESIGN_COMPONENTS.EXP');
            designComponents = JSON.parse(designComponentsData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Components export file: {}", e);
        }

        if(designComponents.length > 0) {
            designId = null;
            designVersionId = null;


            designComponents.forEach((component) => {
                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Component {} - {}", component.componentType, component.componentName);

                designId = getIdFromMap(designsMapping, component.designId);
                designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);

                designComponentId = DesignComponentServices.importComponent(
                    designId,
                    designVersionId,
                    component
                );

                if (designComponentId) {
                    // Map old component ids to new
                    designComponentsMapping.push({oldId: component._id, newId: designComponentId});
                }

            });

            // Update Design Component parents for the new design components
            designComponentsMapping.forEach((component) => {
                DesignComponentServices.importRestoreParent(component.newId, designComponentsMapping)
            });

            // Make sure Design is no longer removable
            DesignServices.setRemovable(designId);
        } else {
            // No Design Components - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Design Components found...");
        }

        // Design Update Components ------------------------------------------------------------------------------------

        // No point unless some Design Updates were found...
        if(hasDesignUpdates) {

            let designUpdateComponentsData = '';
            let designUpdateComponents = [];

            try {
                designUpdateComponentsData = fs.readFileSync(path + 'DESIGN_UPDATE_COMPONENTS.EXP');
                designUpdateComponents = JSON.parse(designUpdateComponentsData);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Update Components export file: {}", e);
            }

            if (designUpdateComponents.length > 0) {

                designId = null;
                designVersionId = null;
                designUpdateId = null;

                designUpdateComponents.forEach((updateComponent) => {
                    log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Update Component {} - {}", updateComponent.componentType, updateComponent.componentNameNew);

                    designId = getIdFromMap(designsMapping, updateComponent.designId);
                    designVersionId = getIdFromMap(designVersionsMapping, updateComponent.designVersionId);
                    designUpdateId = getIdFromMap(designUpdatesMapping, updateComponent.designUpdateId);

                    designUpdateComponentId = DesignUpdateComponentServices.importComponent(
                        designId,
                        designVersionId,
                        designUpdateId,
                        updateComponent
                    );

                    if (designUpdateComponentId) {
                        // Map old component ids to new
                        designUpdateComponentsMapping.push({
                            oldId: updateComponent._id,
                            newId: designUpdateComponentId
                        });
                    }

                });

                // Update Design Update Component parents for the new design update components
                designUpdateComponentsMapping.forEach((updateComponent) => {
                    DesignUpdateComponentServices.importRestoreParent(updateComponent.newId, designUpdateComponentsMapping)
                });

                // Make sure Design is no longer removable
                DesignServices.setRemovable(designId);

            } else {
                // No Design Update Components - could be OK
                log((msg) => console.log(msg), LogLevel.INFO, "No Design Update Components found...");
            }
        }

        // Work Package Components -------------------------------------------------------------------------------------
        let workPackageComponentsData = '';
        let workPackageComponents = [];

        try{
            workPackageComponentsData = fs.readFileSync(path + 'WORK_PACKAGE_COMPONENTS.EXP');
            workPackageComponents = JSON.parse(workPackageComponentsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Work Package Components export file: {}", e);
        }

        if (workPackageComponents.length > 0) {

            workPackageId = null;
            let wpDesignComponentId = null;
            let workPackage = null;


            workPackageComponents.forEach((wpComponent) => {
                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Work Package Component {} - {}", wpComponent.componentType, wpComponent._id);
                let skip = false;

                workPackageId = getIdFromMap(workPackagesMapping, wpComponent.workPackageId);

                // WP Component could be a Design Component or a Design Update Component
                workPackage = WorkPackages.findOne({_id: workPackageId});


                switch (workPackage.workPackageType) {
                    case WorkPackageType.WP_BASE:
                        if(hasDesignComponents) {
                            wpDesignComponentId = getIdFromMap(designComponentsMapping, wpComponent.componentId);
                        } else {
                            log((msg) => console.log(msg), LogLevel.INFO, "Skipping WP component because no design components...");
                            skip = true;
                        }
                        break;
                    case WorkPackageType.WP_UPDATE:
                        if(hasDesignUpdateComponents) {
                            wpDesignComponentId = getIdFromMap(designUpdateComponentsMapping, wpComponent.componentId);
                        } else {
                            log((msg) => console.log(msg), LogLevel.INFO, "Skipping WP component because no design update components...");
                            skip = true;
                        }
                        break;
                }

                if(!skip) {
                    workPackageComponentId = WorkPackageServices.importComponent(
                        workPackageId,
                        wpDesignComponentId,
                        wpComponent
                    );

                    if (workPackageComponentId) {
                        // Map old component ids to new
                        workPackageComponentsMapping.push({oldId: wpComponent._id, newId: workPackageComponentId});
                    }
                }

            });
        } else {
            // No Work Package Components - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Work Package Components found...");
        }

        // Feature Background Steps ----------------------------------------------------------------------------------------------
        let backgroundStepsData = '';
        let backgroundSteps = [];

        try{
            backgroundStepsData = fs.readFileSync(path + 'FEATURE_BACKGROUND_STEPS.EXP');
            backgroundSteps = JSON.parse(backgroundStepsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Feature Background Steps export file: {}", e);
        }

        if (backgroundSteps.length > 0) {
            designId = null;
            designVersionId = null;
            designUpdateId = null;


            backgroundSteps.forEach((step) => {

                let newStep = this.migrateStep(step);

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Background Step {} {}", newStep.stepType, newStep.stepText);

                designId = getIdFromMap(designsMapping, newStep.designId);
                designVersionId = getIdFromMap(designVersionsMapping, newStep.designVersionId);
                designUpdateId = getIdFromMap(designUpdatesMapping, newStep.designUpdateId);

                featureBackgroundStepId = ScenarioServices.importFeatureBackgroundStep(
                    designId,
                    designVersionId,
                    designUpdateId,
                    newStep
                );

                // Currently don't need to map step ids..

            });
        } else {
            // No Feature Background Steps - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Feature Background Steps found...");
        }

        // Scenario Steps ----------------------------------------------------------------------------------------------
        let scenarioStepsData = '';
        let scenarioSteps = [];

        try{
            scenarioStepsData = fs.readFileSync(path + 'SCENARIO_STEPS.EXP');
            scenarioSteps = JSON.parse(scenarioStepsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Scenario Steps export file: {}", e);
        }

        if (scenarioSteps.length > 0) {

            designId = null;
            designVersionId = null;
            designUpdateId = null;


            scenarioSteps.forEach((step) => {

                let newStep = this.migrateStep(step);

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Scenario Step {} {}", newStep.stepType, newStep.stepText);

                designId = getIdFromMap(designsMapping, newStep.designId);
                designVersionId = getIdFromMap(designVersionsMapping, newStep.designVersionId);
                designUpdateId = getIdFromMap(designUpdatesMapping, newStep.designUpdateId);

                scenarioStepId = ScenarioServices.importScenarioStep(
                    designId,
                    designVersionId,
                    designUpdateId,
                    newStep
                );

                // Currently don't need to map step ids..

            });
        } else {
            // No Scenario Steps - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Scenario Steps found...");
        }

    };


    // MIGRATION FUNCTIONS
    migrateStep(step){
        let newStep = step;

        if(!step.stepFullName){
            newStep.stepFullName = step.stepType + ' ' + step.stepText;
        }

        return newStep;
    }



}

export default new ImpExServices();
