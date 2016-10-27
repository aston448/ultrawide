import fs from 'fs';

import { UserRoles }                    from '../collections/users/user_roles.js';
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

import DesignServices                   from '../servicers/design_services.js';
import DesignVersionServices            from '../servicers/design_version_services.js';
import DesignUpdateServices             from '../servicers/design_update_services.js';
import WorkPackageServices              from '../servicers/work_package_services.js';
import DomainDictionaryServices         from '../servicers/domain_dictionary_services.js';
import DesignComponentServices          from '../servicers/design_component_services.js';
import DesignUpdateComponentServices    from '../servicers/design_update_component_services.js';
import ScenarioServices                 from '../servicers/scenario_services.js';

import {getIdFromMap, log}              from '../common/utils.js';


import { DesignUpdateStatus, WorkPackageStatus, WorkPackageType, ComponentType, LogLevel} from '../constants/constants.js';

class ImpExServices{

    exportUltrawideData(){
        // Export all the essential data to a file

        // User Data
        this.produceExportFile(UserRoles, 'USERS');

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
        let path = '/Users/aston/WebstormProjects/shared/'; //process.env["PWD"] + '/public/';

        const data = collection.find({});
        const jsonData = JSON.stringify(data.fetch());

        fs.writeFile(path + fileName +'.EXP', jsonData);

    }

    importUltrawideData(){
        // Recreate the data using the latest code so that it is compatible...

        let path = '/Users/aston/WebstormProjects/shared/'; // process.env["PWD"] + '/public/';

        // Users - TODO - currently being created by fixtures

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


        // Design Items ================================================================================================

         // Designs ----------------------------------------------------------------------------------------------------
        const designString = fs.readFileSync(path + 'DESIGNS.EXP');

        let designs = JSON.parse(designString);

        designs.forEach((design) => {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design: {}", design.designName);

            designId = DesignServices.importDesign(design);
            if(designId){
                // Store the new Design ID
                designsMapping.push({oldId: design._id, newId: designId});
            }
        });


        // Design Versions ---------------------------------------------------------------------------------------------
        const designVersionsString = fs.readFileSync(path + 'DESIGN_VERSIONS.EXP');

        designId = null;

        let designVersions = JSON.parse(designVersionsString);

        designVersions.forEach((designVersion) => {
            designId = getIdFromMap(designsMapping, designVersion.designId);
            if(designId) {

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

        // Design Updates ----------------------------------------------------------------------------------------------
        const designUpdatesString = fs.readFileSync(path + 'DESIGN_UPDATES.EXP');

        designVersionId = null;

        let designUpdates = JSON.parse(designUpdatesString);

        designUpdates.forEach((designUpdate) => {
            designVersionId = getIdFromMap(designVersionsMapping, designUpdate.designVersionId);
            if(designVersionId) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Update: {} to Design Version {}",  designUpdate.updateName, designVersionId);

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

        // Work Packages -----------------------------------------------------------------------------------------------
        const workPackagesString = fs.readFileSync(path + 'WORK_PACKAGES.EXP');

        designVersionId = null;
        designUpdateId = null;

        let workPackages = JSON.parse(workPackagesString);

        workPackages.forEach((workPackage) => {

            designVersionId = getIdFromMap(designVersionsMapping, workPackage.designVersionId);

            if(designVersionId) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Work Package: {} of type {} to Design Version {}",
                    workPackage.workPackageName, workPackage.workPackageType, designVersionId);

                if(workPackage.workPackageType === WorkPackageType.WP_UPDATE){
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
        });

        // Design Data =================================================================================================

        // Domain Dictionary -------------------------------------------------------------------------------------------

        const domainDictionaryString = fs.readFileSync(path + 'DOMAIN_DICTIONARY.EXP');

        designId = null;
        designVersionId = null;

        let dictionaryTerms = JSON.parse(domainDictionaryString);

        dictionaryTerms.forEach((term) => {
            console.log("Adding Dictionary Term " + term.domainTermNew);

            designId = getIdFromMap(designsMapping, term.designId);
            designVersionId = getIdFromMap(designVersionsMapping, term.designVersionId);

            domainTermId = DomainDictionaryServices.addNewTerm(designId, designVersionId);

            if(domainTermId){
                // Set the actual term and definition
                DomainDictionaryServices.updateTermName(domainTermId, term.domainTermNew, term.domainTermOld);
                DomainDictionaryServices.updateTermDefinition(domainTermId, term.domainTextRaw)
            }
        });

        // Design Components -------------------------------------------------------------------------------------------

        const designComponentsString = fs.readFileSync(path + 'DESIGN_COMPONENTS.EXP');

        designId = null;
        designVersionId = null;

        let designComponents = JSON.parse(designComponentsString);

        designComponents.forEach((component) => {
            console.log("Adding Design Component " + component.componentType + " - " + component.componentName);

            designId = getIdFromMap(designsMapping, component.designId);
            designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);

            designComponentId = DesignComponentServices.importComponent(
                designId,
                designVersionId,
                component
            );

            if(designComponentId){
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

        // Design Update Components ------------------------------------------------------------------------------------

        const designUpdateComponentsString = fs.readFileSync(path + 'DESIGN_UPDATE_COMPONENTS.EXP');

        designId = null;
        designVersionId = null;
        designUpdateId = null;

        let designUpdateComponents = JSON.parse(designUpdateComponentsString);

        designUpdateComponents.forEach((updateComponent) => {
            console.log("Adding Design Update Component " + updateComponent.componentType + " - " + updateComponent.componentNameNew);

            designId = getIdFromMap(designsMapping, updateComponent.designId);
            designVersionId = getIdFromMap(designVersionsMapping, updateComponent.designVersionId);
            designUpdateId = getIdFromMap(designUpdatesMapping, updateComponent.designUpdateId);

            designUpdateComponentId = DesignUpdateComponentServices.importComponent(
                designId,
                designVersionId,
                designUpdateId,
                updateComponent
            );

            if(designUpdateComponentId){
                // Map old component ids to new
                designUpdateComponentsMapping.push({oldId: updateComponent._id, newId: designUpdateComponentId});
            }

        });

        // Update Design Update Component parents for the new design update components
        designUpdateComponentsMapping.forEach((updateComponent) => {
            DesignUpdateComponentServices.importRestoreParent(updateComponent.newId, designUpdateComponentsMapping)
        });

        // Make sure Design is no longer removable
        DesignServices.setRemovable(designId);

        // Work Package Components -------------------------------------------------------------------------------------

        const workPackageComponentsString = fs.readFileSync(path + 'WORK_PACKAGE_COMPONENTS.EXP');

        workPackageId = null;
        let wpDesignComponentId = null;
        let workPackage = null;

        let workPackageComponents = JSON.parse(workPackageComponentsString);

        workPackageComponents.forEach((wpComponent) => {
            console.log("Adding Work Package Component " + wpComponent.componentType + " - " + wpComponent._id);

            workPackageId = getIdFromMap(workPackagesMapping, wpComponent.workPackageId);

            // WP Component could be a Design Component or a Design Update Component
            workPackage = WorkPackages.findOne({_id: workPackageId});

            switch(workPackage.workPackageType){
                case WorkPackageType.WP_BASE:
                    wpDesignComponentId = getIdFromMap(designComponentsMapping, wpComponent.componentId);
                    break;
                case WorkPackageType.WP_UPDATE:
                    wpDesignComponentId = getIdFromMap(designUpdateComponentsMapping, wpComponent.componentId);
                    break;
            }

            workPackageComponentId = WorkPackageServices.importComponent(
                workPackageId,
                wpDesignComponentId,
                wpComponent
            );

            if(workPackageComponentId){
                // Map old component ids to new
                workPackageComponentsMapping.push({oldId: wpComponent._id, newId: workPackageComponentId});
            }

        });

        // Feature Background Steps ----------------------------------------------------------------------------------------------

        const backgroundStepsString = fs.readFileSync(path + 'FEATURE_BACKGROUND_STEPS.EXP');

        designId = null;
        designVersionId = null;
        designUpdateId = null;

        let backgroundSteps = JSON.parse(backgroundStepsString);

        backgroundSteps.forEach((step) => {
            console.log("Adding Background Step " + step.stepType + " " + step.stepText);

            designId = getIdFromMap(designsMapping, step.designId);
            designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
            designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);

            featureBackgroundStepId = ScenarioServices.importFeatureBackgroundStep(
                designId,
                designVersionId,
                designUpdateId,
                step
            );

            // Currently don't need to map step ids..

        });

        // Scenario Steps ----------------------------------------------------------------------------------------------

        const scenarioStepsString = fs.readFileSync(path + 'SCENARIO_STEPS.EXP');

        designId = null;
        designVersionId = null;
        designUpdateId = null;

        let scenarioSteps = JSON.parse(scenarioStepsString);

        scenarioSteps.forEach((step) => {
            console.log("Adding Scenario Step " + step.stepType + " " + step.stepText);

            designId = getIdFromMap(designsMapping, step.designId);
            designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
            designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);

            scenarioStepId = ScenarioServices.importScenarioStep(
                designId,
                designVersionId,
                designUpdateId,
                step
            );

            // Currently don't need to map step ids..

        });

    };



}

export default new ImpExServices();
