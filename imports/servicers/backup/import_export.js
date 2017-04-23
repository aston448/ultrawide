// External
import fs from 'fs';

// Ultrawide Collections
import { UserRoles }                    from '../../collections/users/user_roles.js';
import { UserCurrentEditContext }       from '../../collections/context/user_current_edit_context.js';
import { UserTestTypeLocations }        from '../../collections/configure/user_test_type_locations.js';
import { TestOutputLocations }          from '../../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles }      from '../../collections/configure/test_output_location_files.js';
import { Designs }                      from '../../collections/design/designs.js';
import { DesignVersions }               from '../../collections/design/design_versions.js';
import { DesignUpdates }                from '../../collections/design_update/design_updates.js';
import { DesignUpdateSummary }          from '../../collections/summary/design_update_summary.js';
import { WorkPackages }                 from '../../collections/work/work_packages.js';
import { DomainDictionary }             from '../../collections/design/domain_dictionary.js'
import { DesignVersionComponents }             from '../../collections/design/design_version_components.js';
import { ScenarioSteps }                from '../../collections/design/scenario_steps.js';
import { FeatureBackgroundSteps }       from '../../collections/design/feature_background_steps.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { DesignBackups }                from '../../collections/backup/design_backups.js';
import { AppGlobalData }                from '../../collections/app/app_global_data.js';

// Ultrawide Services
import {getIdFromMap, padDigits, log}              from '../../common/utils.js';
import { DesignStatus, WorkPackageType, UpdateMergeStatus, LogLevel, ExportFileName} from '../../constants/constants.js';

import TestOutputLocationServices       from '../configure/test_output_location_services.js';
import DesignServices                   from '../design/design_services.js';
import DesignVersionServices            from '../design/design_version_services.js';
import DesignUpdateServices             from '../design_update/design_update_services.js';
import DesignUpdateSummaryServices      from '../design_update/design_update_summary_services.js';
import WorkPackageServices              from '../work/work_package_services.js';
import DomainDictionaryServices         from '../design/domain_dictionary_services.js';
import DesignComponentServices          from '../design/design_component_services.js';
import DesignUpdateComponentServices    from '../design_update/design_update_component_services.js';
import ScenarioServices                 from '../design/scenario_services.js';

//======================================================================================================================
//
// Server Code for Import / Export.
//
// Methods called directly by Server API
//
//======================================================================================================================

class ImpExServices{

    forceRemoveDesign(designId){

        const designVersionData = DesignVersions.find({designId: designId}).fetch();

        designVersionData.forEach((designVersion) => {

            // All updates in this Version
            DesignUpdates.remove({designVersionId: designVersion._id});

            // All DU Summaries for this version
            DesignUpdateSummary.remove({designVersionId: designVersion._id});

            // All Work packages in this version
            let workPackageData = WorkPackages.find({designVersionId: designVersion._id}).fetch();
            workPackageData.forEach((workPackage) => {

                // All work package components in this Work Package
                WorkPackageComponents.remove({workPackageId: workPackage._id});

            });

            WorkPackages.remove({designVersionId: designVersion._id});

            // All design components in this version
            DesignVersionComponents.remove({designVersionId: designVersion._id});

            // All Design Update components in this version
            DesignUpdateComponents.remove({designVersionId: designVersion._id});

            // All Feature background steps in this Version
            FeatureBackgroundSteps.remove({designVersionId: designVersion._id});

            // All Scenario Steps in this version
            ScenarioSteps.remove({designVersionId: designVersion._id});

            // All Domain Dictionary entries for this version
            DomainDictionary.remove({designVersionId: designVersion._id});

        });

        DesignVersions.remove({designId: designId});
        Designs.remove({_id: designId});

    }

    backupDesign(designId){
        if(Meteor.isServer){
            let designBackup = {};

            const designData = Designs.find({_id: designId}).fetch();   // Will be only 1 but want as an array
            const designVersionData = DesignVersions.find({designId: designId}).fetch();

            let designVersions = [];
            let designUpdates = [];
            let designUpdateSummaries = [];
            let workPackages = [];
            let designComponents = [];
            let designUpdateComponents = [];
            let workPackageComponents = [];
            let featureBackgroundSteps = [];
            let scenarioSteps = [];
            let domainDictionary = [];

            designVersionData.forEach((designVersion) => {
                designVersions.push(designVersion);

                // All updates in this Version
                let designUpdateData = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
                designUpdateData.forEach((designUpdate) => {
                    designUpdates.push(designUpdate);
                });

                // All update summaries in this Version
                let designUpdateSummaryData = DesignUpdateSummary.find({designVersionId: designVersion._id}).fetch();
                designUpdateSummaryData.forEach((designUpdateSummary) => {
                    designUpdateSummaries.push(designUpdateSummary);
                });

                // All Work packages in this version
                let workPackageData = WorkPackages.find({designVersionId: designVersion._id}).fetch();
                workPackageData.forEach((workPackage) => {
                    workPackages.push(workPackage);

                    // All work package components in this Work Package
                    let workPackageComponentData = WorkPackageComponents.find({workPackageId: workPackage._id}).fetch();
                    workPackageComponentData.forEach((workPackageComponent) => {
                        workPackageComponents.push(workPackageComponent)
                    })
                });

                // All design components in this version
                let designComponentData = DesignVersionComponents.find({designVersionId: designVersion._id}).fetch();
                designComponentData.forEach((designComponent) => {
                    designComponents.push(designComponent);
                });

                // All Design Update components in this version
                let designUpdateComponentData = DesignUpdateComponents.find({designVersionId: designVersion._id}).fetch();
                designUpdateComponentData.forEach((designUpdateComponent) => {
                    designUpdateComponents.push(designUpdateComponent);
                });

                // All Feature background steps in this Version
                let featureBackgroundStepsData = FeatureBackgroundSteps.find({designVersionId: designVersion._id}).fetch();
                featureBackgroundStepsData.forEach((backgroundStep) => {
                    featureBackgroundSteps.push(backgroundStep);
                });

                // All Scenario Steps in this version
                let scenarioStepsData = ScenarioSteps.find({designVersionId: designVersion._id}).fetch();
                scenarioStepsData.forEach((scenarioStep) => {
                    scenarioSteps.push(scenarioStep);
                });

                // All Domain Dictionary entries for this version
                let dictionaryData = DomainDictionary.find({designVersionId: designVersion._id}).fetch();
                dictionaryData.forEach((domainItem) => {
                    domainDictionary.push(domainItem);
                });

            });

            designBackup = {
                designs: designData,
                designVersions: designVersions,
                designUpdates: designUpdates,
                designUpdateSummaries: designUpdateSummaries,
                workPackages: workPackages,
                designComponents: designComponents,
                designUpdateComponents: designUpdateComponents,
                workPackageComponents: workPackageComponents,
                featureBackgroundSteps: featureBackgroundSteps,
                scenarioSteps: scenarioSteps,
                domainDictionary: domainDictionary
            };

            const jsonData = JSON.stringify(designBackup);

            const filePath = process.env["PWD"] + '/backup/';
            const dateNow = new Date();
            const fileDate = dateNow.getFullYear() + '_' + (dateNow.getMonth()+1) + '_' + dateNow.getDate() + '_' + dateNow.getHours() + '_' + dateNow.getMinutes() + '_' + dateNow.getSeconds();
            const displayDate = dateNow.getDate() + '-' + (dateNow.getMonth()+1) + '-' + dateNow.getFullYear() + ' ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds();
            const fileName = designData[0].designName.trim() + '_' + fileDate;
            const dataVersions = AppGlobalData.find({}, {$sort: {versionDate: -1}}).fetch();
            const latestDataVersion = dataVersions[0].dataVersion;

            try {
                fs.writeFile(filePath + fileName + '.BAK', jsonData);

                log((msg) => console.log(msg), LogLevel.INFO, "Design backed up as: {}", filePath + fileName + '.BAK');

                // If that has not errored, add the backup to the list
                DesignBackups.insert({
                    designId:               designId,
                    backupName:             'Backup ' + displayDate,
                    backupFileName:         filePath + fileName,
                    backupDataVersion:      latestDataVersion
                });

            } catch (e){
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't save Design backup: {}", e);
            }

        }
    };

    restoreDesignBackup(backupId, currentDesignId){

        if(Meteor.isServer){

            const backup = DesignBackups.findOne({_id: backupId});
            let backupJson = null;
            let backupData = null;

            try {
                backupJson = fs.readFileSync(backup.backupFileName);
                backupData = JSON.parse(backupJson);
            } catch (e){
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't read Design backup: {}.  Error: {}", backup.backupFileName, e);
            }

            const dataVersions = AppGlobalData.find({}, {$sort: {versionDate: -1}}).fetch();
            const latestDataVersion = dataVersions[0].dataVersion;

            let newDesignData = backupData.designs;
            let newDesignVersionData = backup.designVersions;
            let newDesignUpdateData = backup.designUpdates;
            let newDesignUpdateSummaryData = backup.designUpdateSummaries;
            let newWorkPackageData = backup.workPackages;
            let newDesignComponentData = backup.designComponents;
            let newDesignUpdateComponentData = backup.designUpdateComponents;
            let newWorkPackageComponentData = backup.workPackageComponents;
            let newFeatureBackgroundStepsData = backup.featureBackgroundSteps;
            let newScenarioStepsData = backup.scenarioSteps;
            let newDomainDictionaryData = backup.domainDictionary;

            // Migrate data if needed
            if(backup.dataVersion < latestDataVersion){
                newDesignData = this.migrateDesignData(backupData.designs, backup.dataVersion, latestDataVersion);
                newDesignVersionData = this.migrateDesignVersionData(backupData.designVersions, backup.dataVersion, latestDataVersion);
                newDesignUpdateData = this.migrateDesignUpdateData(backupData.designUpdates, backup.dataVersion, latestDataVersion);
                newDesignUpdateSummaryData = this.migrateDesignUpdateSummaryData(backupData.designUpdateSummaries, backup.dataVersion, latestDataVersion);
                newWorkPackageData = this.migrateWorkPackageData(backupData.workPackages, backup.dataVersion, latestDataVersion);
                newDesignComponentData = this.migrateDesignComponentData(backupData.designComponents, backup.dataVersion, latestDataVersion);
                newDesignUpdateComponentData = this.migrateDesignUpdateComponentData(backupData.designUpdateComponents, backup.dataVersion, latestDataVersion);
                newWorkPackageComponentData = this.migrateWorkPackageComponentData(backupData.workPackageComponents, backup.dataVersion, latestDataVersion);
                newFeatureBackgroundStepsData = this.migrateFeatureBackgroundStepData(backupData.featureBackgroundSteps, backup.dataVersion, latestDataVersion);
                newScenarioStepsData = this.migrateScenarioStepData(backupData.scenarioSteps, backup.dataVersion, latestDataVersion);
                newDomainDictionaryData = this.migrateDomainDictionaryData(backupData.domainDictionary, backup.dataVersion, latestDataVersion)
            }

            // Restore the backup data
            let designsMapping = this.restoreDesignData(newDesignData);

            let designVersionsMapping = this.restoreDesignVersionData(newDesignVersionData, designsMapping);

            let designUpdatesMapping = this.restoreDesignUpdateData(newDesignUpdateData, designVersionsMapping);

            this.restoreDesignUpdateSummaryData(newDesignUpdateSummaryData, designVersionsMapping, designUpdatesMapping);

            let hasUpdates = newDesignUpdateData.length > 0;

            // Get current user mapping for WP adoption
            let userMapping = [];

            UserRoles.forEach((user) => {
                userMapping.push({oldId: user.userId, newId: user.userId});
            });

            let workPackagesMapping = this.restoreWorkPackageData(newWorkPackageData, designVersionsMapping, designUpdatesMapping, userMapping, hasUpdates);

            let designComponentsMapping = this.restoreDesignVersionComponentData(newDesignComponentData, designsMapping, designVersionsMapping, workPackagesMapping);

            let designUpdateComponentsMapping = this.restoreDesignUpdateComponentData(newDesignUpdateComponentData, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);

            let hasDesignComponents = newDesignComponentData.length > 0;
            let hasDesignUpdateComponents = newDesignUpdateComponentData.length > 0;
            let workPackageComponentsMapping = this.restoreWorkPackageComponentData(newWorkPackageComponentData, workPackagesMapping, designComponentsMapping, designUpdateComponentsMapping, hasDesignComponents, hasDesignUpdateComponents);

            this.restoreFeatureBackgroundStepData(newFeatureBackgroundStepsData, designsMapping, designVersionsMapping, designUpdatesMapping);

            this.restoreScenarioStepData(newScenarioStepsData, designsMapping, designVersionsMapping, designUpdatesMapping);

            this.restoreDomainDictionaryData(newDomainDictionaryData, designsMapping, designVersionsMapping);

            // Remove the current data - it has different IDs
            this.removeCurrentDesignData(backupData.designs);

        }
    };

    // Remove unwanted duplicate Design Data after a restore
    removeCurrentDesignData(currentDesignId){

        const design = Designs.findOne({_id: currentDesignId});

        if(design) {

            const designVersions = DesignVersions.find({designId: design._id}).fetch();

            designVersions.forEach((designVersion) => {

                // All updates in this Version
                DesignUpdates.remove({designVersionId: designVersion._id});

                // All update summaries in this Version
                DesignUpdateSummary.remove({designVersionId: designVersion._id});

                let workPackages = WorkPackages.find({designVersionId: designVersion._id}).fetch();
                workPackages.forEach((workPackage) => {

                    // All work package components in this Work Package
                    WorkPackageComponents.remove({workPackageId: workPackage._id});
                });

                // All Work packages in this version
                WorkPackages.remove({designVersionId: designVersion._id});

                // All design components in this version
                DesignVersionComponents.remove({designVersionId: designVersion._id});

                // All Design Update components in this version
                DesignUpdateComponents.remove({designVersionId: designVersion._id});

                // All Feature background steps in this Version
                FeatureBackgroundSteps.remove({designVersionId: designVersion._id});

                // All Scenario Steps in this version
                ScenarioSteps.remove({designVersionId: designVersion._id});

                // All Domain Dictionary entries for this version
                DomainDictionary.remove({designVersionId: designVersion._id});

            });

            // And then remove the design versions
            DesignVersions.remove({designId: design._id});

            // And the design
            Designs.remove({_id: currentDesignId});

        }
    };

    migrateTestOutputLocationData(testOutputLocationData, backupVersion, currentVersion){
        // Add to this function for each release
        let newTestOutputLocationData = testOutputLocationData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newTestOutputLocationData = testOutputLocationData;
                }
        }

        return newTestOutputLocationData;
    };

    migrateTestOutputLocationFileData(testOutputLocationFileData, backupVersion, currentVersion){
        // Add to this function for each release
        let newTestOutputLocationFileData = testOutputLocationFileData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newTestOutputLocationFileData = testOutputLocationFileData;
                }
        }

        return newTestOutputLocationFileData;
    };

    migrateUserTestTypeLocationData(userTestTypeLocationData, backupVersion, currentVersion){
        // Add to this function for each release
        let newUserTestTypeLocationData = userTestTypeLocationData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newUserTestTypeLocationData = userTestTypeLocationData;
                }
        }

        return newUserTestTypeLocationData;
    };

    migrateDesignData(designData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignData = designData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        newDesignData = [];

                        designData.forEach((design) => {
                            let newDesign = {
                                _id:            design._id,
                                designName:     design.designName,
                                designRawText:  design.designRawText,
                                isRemovable:    design.isRemovable,
                                designStatus:   DesignStatus.DESIGN_LIVE    // New field added
                            };

                            newDesignData.push(newDesign);
                        });
                }
        }

        return newDesignData;
    };

    migrateDesignVersionData(designVersionData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignVersionData = designVersionData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newDesignVersionData = designVersionData
                }
        }

        return newDesignVersionData;
    };

    migrateDesignUpdateData(designUpdateData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignUpdateData = designUpdateData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newDesignUpdateData = designUpdateData
                }
        }

        return newDesignUpdateData;
    };

    migrateDesignUpdateSummaryData(designUpdateSummaryData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignUpdateSummaryData = designUpdateSummaryData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newDesignUpdateSummaryData = designUpdateSummaryData
                }
        }

        return newDesignUpdateSummaryData;
    };

    migrateWorkPackageData(workPackageData, backupVersion, currentVersion){
        // Add to this function for each release
        let newWorkPackageData = workPackageData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newWorkPackageData = workPackageData
                }
        }

        return newWorkPackageData;
    };

    migrateDesignComponentData(designComponentData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignVersionComponentData = designComponentData;


        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // Migrate to Design Version Component data
                        // designComponentData.forEach((component) => {
                        //
                        //     let newDesignVersionComponent = {};
                        //
                        //     newDesignVersionComponent._id = component._id;
                        //     newDesignVersionComponent.componentReferenceId = component.componentReferenceId;
                        //     newDesignVersionComponent.designId = component.designId;
                        //     newDesignVersionComponent.designVersionId = component.designVersionId;
                        //     newDesignVersionComponent.componentType = component.componentType;
                        //     newDesignVersionComponent.componentLevel = component.componentLevel;
                        //
                        //     // Location
                        //     newDesignVersionComponent.componentParentIdOld = component.componentParentId;
                        //     newDesignVersionComponent.componentParentIdNew = component.componentParentId;
                        //     newDesignVersionComponent.componentParentReferenceIdOld = component.componentParentReferenceId;
                        //     newDesignVersionComponent.componentParentReferenceIdNew = component.componentParentReferenceId;
                        //     newDesignVersionComponent.componentFeatureReferenceIdOld = component.componentFeatureReferenceId;
                        //     newDesignVersionComponent.componentFeatureReferenceIdNew = component.componentFeatureReferenceId;
                        //     newDesignVersionComponent.componentIndexOld = component.componentIndex;
                        //     newDesignVersionComponent.componentIndexNew = component.componentIndex;
                        //
                        //     // Data
                        //     newDesignVersionComponent.componentNameOld = component.componentName;
                        //     newDesignVersionComponent.componentNameNew = component.componentName;
                        //     newDesignVersionComponent.componentNameRawOld = component.componentNameRaw;
                        //     newDesignVersionComponent.componentNameRawNew = component.componentNameRaw;
                        //     newDesignVersionComponent.componentNarrativeOld = component.componentNarrative;
                        //     newDesignVersionComponent.componentNarrativeNew = component.componentNarrative;
                        //     newDesignVersionComponent.componentNarrativeRawOld = component.componentNarrativeRaw;
                        //     newDesignVersionComponent.componentNarrativeRawNew = component.componentNarrativeRaw;
                        //     newDesignVersionComponent.componentTextRawOld = component.componentTextRaw;
                        //     newDesignVersionComponent.componentTextRawNew = component.componentTextRaw;
                        //
                        //     // Component State
                        //     newDesignVersionComponent.isNew = component.isNew;
                        //     newDesignVersionComponent.workPackageId = 'NONE';
                        //     newDesignVersionComponent.updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;
                        //     newDesignVersionComponent.isDevUpdated = false;
                        //     newDesignVersionComponent.isDevAdded = false;
                        //
                        //     // Editing state (shared and persistent)
                        //     newDesignVersionComponent.isRemovable = component.isRemovable;
                        //
                        //     newDesignVersionComponentData.push(newDesignVersionComponent);
                        // });
                }
        }

        return newDesignVersionComponentData;
    };

    migrateDesignUpdateComponentData(designUpdateComponentData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDesignUpdateComponentData = designUpdateComponentData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newDesignUpdateComponentData = designUpdateComponentData
                }
        }

        return newDesignUpdateComponentData;
    };

    migrateWorkPackageComponentData(workPackageComponentData, backupVersion, currentVersion){
        // Add to this function for each release
        let newWorkPackageComponentData = workPackageComponentData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newWorkPackageComponentData = workPackageComponentData
                }
        }

        return newWorkPackageComponentData;
    };

    migrateFeatureBackgroundStepData(featureBackgroundStepsData, backupVersion, currentVersion){
        // Add to this function for each release
        let newFeatureBackgroundStepsData = featureBackgroundStepsData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newFeatureBackgroundStepsData = featureBackgroundStepsData
                }
        }

        return newFeatureBackgroundStepsData;
    };

    migrateScenarioStepData(scenarioStepsData, backupVersion, currentVersion){
        // Add to this function for each release
        let newScenarioStepsData = scenarioStepsData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newScenarioStepsData = scenarioStepsData
                }
        }

        return newScenarioStepsData;
    };

    migrateDomainDictionaryData(domainDictionaryData, backupVersion, currentVersion){
        // Add to this function for each release
        let newDomainDictionaryData = domainDictionaryData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 2:
                        // No changes
                        newDomainDictionaryData = domainDictionaryData
                }
        }

        return newDomainDictionaryData;
    };

    restoreTestOutputLocationData(newTestOutputLocationData, userMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Locations...");

        let locationsMapping = [];

        newTestOutputLocationData.forEach((location) => {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location: {}", location.locationName);

            const userId = getIdFromMap(userMapping, location.userId);

            let locationId = TestOutputLocationServices.importLocation(location, userId);
            if (locationId) {
                // Store the new Design ID
                locationsMapping.push({oldId: location._id, newId: locationId});
            }
        });

        return locationsMapping;
    };

    restoreTestOutputLocationFileData(newTestOutputLocationFileData, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Location Files...");

        newTestOutputLocationFileData.forEach((locationFile) => {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location File: {}", locationFile.fileAlias);

            const locationId = getIdFromMap(locationsMapping, locationFile.locationId);

            let locationFileId = TestOutputLocationServices.importLocationFile(locationFile, locationId);

        });

    };

    restoreUserTestTypeLocationsData(newTestOutputLocationData, userMapping, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring User Test Output Location Settings...");

        newTestOutputLocationData.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Adding User Test Location: {}", userLocation.locationName);

            const locationId = getIdFromMap(locationsMapping, userLocation.locationId);
            const userId = getIdFromMap(userMapping, userLocation.userId);

            let userTestTypeLocationId = TestOutputLocationServices.importUserConfiguration(userLocation, locationId, userId);

        });
    }

    restoreDesignData(newDesignData){

        let designsMapping = [];

        newDesignData.forEach((design) => {

            log((msg) => console.log(msg), LogLevel.INFO, "Adding Design: {}", design.designName);

            let designId = DesignServices.importDesign(design);
            if (designId) {
                // Store the new Design ID
                designsMapping.push({oldId: design._id, newId: designId});
            }
        });

        return designsMapping;

    };

    restoreDesignVersionData(newDesignVersionData, designsMapping){

        let designVersionsMapping = [];

        newDesignVersionData.forEach((designVersion) => {
            let designId = getIdFromMap(designsMapping, designVersion.designId);
            if (designId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Design Version: {} to Design {}", designVersion.designVersionName, designId);

                let designVersionId = DesignVersionServices.importDesignVersion(
                    designId,
                    designVersion
                );

                if (designVersionId) {
                    // Store the new Design Version ID
                    designVersionsMapping.push({oldId: designVersion._id, newId: designVersionId});
                }
            }
        });

        return designVersionsMapping;
    };

    restoreDesignUpdateData(newDesignUpdateData, designVersionsMapping){

        let designUpdatesMapping = [];

        newDesignUpdateData.forEach((designUpdate) => {
            let designVersionId = getIdFromMap(designVersionsMapping, designUpdate.designVersionId);
            if (designVersionId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Design Update: {} to Design Version {}", designUpdate.updateName, designVersionId);

                let designUpdateId = DesignUpdateServices.importDesignUpdate(
                    designVersionId,
                    designUpdate
                );

                if (designUpdateId) {
                    // Store the new Design Update ID
                    designUpdatesMapping.push({oldId: designUpdate._id, newId: designUpdateId});
                }
            }
        });

        return designUpdatesMapping;
    };

    restoreDesignUpdateSummaryData(newDesignUpdateSummaryData, designVersionsMapping, designUpdatesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Update Summaries...");

        newDesignUpdateSummaryData.forEach((designUpdateSummary) => {
            let designVersionId = getIdFromMap(designVersionsMapping, designUpdateSummary.designVersionId);
            let designUpdateId = getIdFromMap(designUpdatesMapping, designUpdateSummary.designUpdateId);

            if (designVersionId && designUpdateId) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Design Update Summary to Design Version {}", designVersionId);

                let designUpdateSummaryId = DesignUpdateSummaryServices.importDesignUpdateSummary(
                    designVersionId,
                    designUpdateId,
                    designUpdateSummary
                );

            }
        });
    };

    restoreWorkPackageData(newWorkPackageData, designVersionsMapping, designUpdatesMapping, userMapping, hasDesignUpdates){

        let workPackagesMapping = [];

        newWorkPackageData.forEach((workPackage) => {

            let designVersionId = getIdFromMap(designVersionsMapping, workPackage.designVersionId);
            let adoptingUserId = getIdFromMap(userMapping, workPackage.adoptingUserId);

            if (designVersionId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Work Package: {} of type {} to Design Version {}",
                    workPackage.workPackageName, workPackage.workPackageType, designVersionId);

                if((workPackage.workPackageType === WorkPackageType.WP_UPDATE) && !hasDesignUpdates){
                    log((msg) => console.log(msg), LogLevel.WARNING, "INVALID DATA: Update WP found when no Updates!  Skipping");
                } else {

                    let designUpdateId = 'NONE';
                    if (workPackage.workPackageType === WorkPackageType.WP_UPDATE) {
                        designUpdateId = getIdFromMap(designUpdatesMapping, workPackage.designUpdateId);
                    }

                    let workPackageId = WorkPackageServices.importWorkPackage(
                        designVersionId,
                        designUpdateId,
                        adoptingUserId,
                        workPackage
                    );

                    if (workPackageId) {
                        // Store the new Work Package ID
                        workPackagesMapping.push({oldId: workPackage._id, newId: workPackageId});
                    }
                }
            }
        });

        return workPackagesMapping;
    };

    restoreDomainDictionaryData(newDictionaryData, designsMapping, designVersionsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Domain Dictionary...");

        let componentCount = 0;

        newDictionaryData.forEach((term) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Dictionary Term {}", term.domainTermNew);

            let designId = getIdFromMap(designsMapping, term.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, term.designVersionId);

            let domainTermId = DomainDictionaryServices.addNewTerm(designId, designVersionId);

            if (domainTermId) {
                // Set the actual term and definition
                DomainDictionaryServices.updateTermName(domainTermId, term.domainTermNew, term.domainTermOld);
                DomainDictionaryServices.updateTermDefinition(domainTermId, term.domainTextRaw)
            }

            componentCount++;
        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Dictionary Terms", componentCount);
    };

    restoreDesignVersionComponentData(newDesignComponentData, designsMapping, designVersionsMapping, workPackagesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Version Components...");

        let designComponentsMapping = [];
        let componentCount = 0;

        newDesignComponentData.forEach((component) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Design Component {} - {}", component.componentType, component.componentNameNew);

            let designId = getIdFromMap(designsMapping, component.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);
            let workPackageId = getIdFromMap(workPackagesMapping, updateComponent.workPackageId);

            let designComponentId = DesignComponentServices.importComponent(
                designId,
                designVersionId,
                workPackageId,
                component
            );

            if (designComponentId) {
                // Map old component ids to new
                designComponentsMapping.push({oldId: component._id, newId: designComponentId});
            }

            componentCount++;

        });

        // Update Design Component parents for the new design components
        designComponentsMapping.forEach((component) => {
            DesignComponentServices.importRestoreParent(component.newId, designComponentsMapping)
        });

        // Make sure any Designs affected are no longer removable
        designsMapping.forEach((designMap) => {
            DesignServices.setRemovable(designMap.newId);
        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Design Version Components", componentCount);

        return designComponentsMapping;
    };

    restoreDesignUpdateComponentData(newDesignUpdateComponentData, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Update Components...");

        let designUpdateComponentsMapping = [];
        let componentCount = 0;

        if(designsMapping && designVersionsMapping && designUpdatesMapping) {

            newDesignUpdateComponentData.forEach((updateComponent) => {
                log((msg) => console.log(msg), LogLevel.TRACE, "Adding Design Update Component {} - {}", updateComponent.componentType, updateComponent.componentNameNew);

                let designId = getIdFromMap(designsMapping, updateComponent.designId);
                let designVersionId = getIdFromMap(designVersionsMapping, updateComponent.designVersionId);
                let designUpdateId = getIdFromMap(designUpdatesMapping, updateComponent.designUpdateId);
                let workPackageId = getIdFromMap(workPackagesMapping, updateComponent.workPackageId);

                let designUpdateComponentId = DesignUpdateComponentServices.importComponent(
                    designId,
                    designVersionId,
                    designUpdateId,
                    workPackageId,
                    updateComponent
                );

                if (designUpdateComponentId) {
                    // Map old component ids to new
                    designUpdateComponentsMapping.push({
                        oldId: updateComponent._id,
                        newId: designUpdateComponentId
                    });
                }

                componentCount++;

            });

            // Update Design Update Component parents for the new design update components
            designUpdateComponentsMapping.forEach((updateComponent) => {
                DesignUpdateComponentServices.importRestoreParent(updateComponent.newId, designUpdateComponentsMapping)
            });

            // Make sure Design is no longer removable
            designsMapping.forEach((designMap) => {
                DesignServices.setRemovable(designMap.newId);
            });

        } else {
            log((msg) => console.log(msg), LogLevel.ERROR, "Mapping not available to restore Design Update Components: DE: {} DV: {} DU: {}", designsMapping, designVersionsMapping, designUpdatesMapping);
        }

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Design Update Components", componentCount);

        return designUpdateComponentsMapping;
    };

    restoreWorkPackageComponentData(newWorkPackageComponentData, workPackagesMapping, designComponentsMapping, designUpdateComponentsMapping, hasDesignComponents, hasDesignUpdateComponents){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Work Package Components...");

        let workPackageComponentsMapping = [];
        let wpDesignComponentId = null;
        let workPackage = null;
        let componentCount = 0;

        newWorkPackageComponentData.forEach((wpComponent) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Work Package Component {} - {}", wpComponent.componentType, wpComponent._id);
            let skip = false;

            let workPackageId = getIdFromMap(workPackagesMapping, wpComponent.workPackageId);

            // WP Component could be a Design Component or a Design Update Component
            workPackage = WorkPackages.findOne({_id: workPackageId});

            let designVersionId = workPackage.designVersionId;

            switch (workPackage.workPackageType) {
                case WorkPackageType.WP_BASE:
                    if(hasDesignComponents) {
                        wpDesignComponentId = getIdFromMap(designComponentsMapping, wpComponent.componentId);
                    } else {
                        log((msg) => console.log(msg), LogLevel.DEBUG, "Skipping WP component because no design components...");
                        skip = true;
                    }
                    break;
                case WorkPackageType.WP_UPDATE:
                    if(hasDesignUpdateComponents) {
                        wpDesignComponentId = getIdFromMap(designUpdateComponentsMapping, wpComponent.componentId);
                    } else {
                        log((msg) => console.log(msg), LogLevel.DEBUG, "Skipping WP component because no design update components...");
                        skip = true;
                    }
                    break;
            }

            if(!skip) {
                let workPackageComponentId = WorkPackageServices.importComponent(
                    designVersionId,
                    workPackageId,
                    wpDesignComponentId,
                    wpComponent
                );

                if (workPackageComponentId) {
                    // Map old component ids to new
                    workPackageComponentsMapping.push({oldId: wpComponent._id, newId: workPackageComponentId});
                }

                componentCount++;
            }

        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Work Package Components", componentCount);

        return workPackageComponentsMapping;
    };

    restoreFeatureBackgroundStepData(newFeatureBackgroundStepsData, designsMapping, designVersionsMapping, designUpdatesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Feature Background Steps...");

        let componentCount = 0;

        newFeatureBackgroundStepsData.forEach((step) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Background Step {} {}", step.stepType, step.stepText);

            let designId = getIdFromMap(designsMapping, step.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
            let designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);

            let featureBackgroundStepId = ScenarioServices.importFeatureBackgroundStep(
                designId,
                designVersionId,
                designUpdateId,
                step
            );

            componentCount++;
            // Currently don't need to map step ids..

        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Feature Background Steps", componentCount);
    };

    restoreScenarioStepData(newScenarioStepsData, designsMapping, designVersionsMapping, designUpdatesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Scenario Steps...");

        let componentCount = 0;

        newScenarioStepsData.forEach((step) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Scenario Step {} {}", step.stepType, step.stepText);

            let designId = getIdFromMap(designsMapping, step.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
            let designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);

            let scenarioStepId = ScenarioServices.importScenarioStep(
                designId,
                designVersionId,
                designUpdateId,
                step
            );

            componentCount++;
            // Currently don't need to map step ids..

        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Scenario Steps", componentCount);
    }

    getBackupPath(){

        //return '/ultrawide_data/';

        const iniFile = process.env["PWD"] + '/ultrawide.ini';

        if(fs.existsSync(iniFile)){
            try {
                log((msg) => console.log(msg), LogLevel.INFO, "Opening ini file: {}", iniFile);

                const iniData = fs.readFileSync(iniFile);
                const iniJson = JSON.parse(iniData);

                log((msg) => console.log(msg), LogLevel.INFO, "Backup location is: {}", iniJson.backupPath);

                return iniJson.backupPath;
            } catch (e){
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Ultrawide ini file: {}", e);
                return'NONE';
            }

        } else {
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't locate Ultrawide ini file");
            return 'NONE';
        }
    }

    exportUltrawideData(){
        // Export all the essential data to a file

        let path = this.getBackupPath();

        if(path !== 'NONE' && path.length > 0) {

            if (fs.existsSync(path) === false) {
                fs.mkdirSync(path);
            }

            // Create the double backup folder
            let date = new Date();
            let dateDir = date.getFullYear() + '_' + padDigits((date.getMonth() + 1), 2) + '_' + padDigits(date.getDate(), 2) + '_' + padDigits(date.getHours(), 2) + padDigits(date.getMinutes(), 2) + padDigits(date.getSeconds(), 2);
            let doubleBackupPath = path + dateDir + '/';
            if (fs.existsSync(doubleBackupPath) === false) {
                fs.mkdirSync(doubleBackupPath);
            }

            // User Data
            this.produceExportFile(UserRoles, path, doubleBackupPath, ExportFileName.USERS);

            // User Context
            this.produceExportFile(UserCurrentEditContext, path, doubleBackupPath, ExportFileName.USER_CONTEXT);

            // Test Output Locations
            this.produceExportFile(TestOutputLocations, path, doubleBackupPath, ExportFileName.TEST_OUTPUT_LOCATIONS);
            this.produceExportFile(TestOutputLocationFiles, path, doubleBackupPath, ExportFileName.TEST_OUTPUT_LOCATION_FILES);
            this.produceExportFile(UserTestTypeLocations, path, doubleBackupPath, ExportFileName.USER_TEST_TYPE_LOCATIONS);

            // Designs
            this.produceExportFile(Designs, path, doubleBackupPath, ExportFileName.DESIGNS);

            // Design Versions
            this.produceExportFile(DesignVersions, path, doubleBackupPath, ExportFileName.DESIGN_VERSIONS);

            // Design Updates
            this.produceExportFile(DesignUpdates, path, doubleBackupPath, ExportFileName.DESIGN_UPDATES);

            // Design Update Summaries
            this.produceExportFile(DesignUpdateSummary, path, doubleBackupPath, ExportFileName.DESIGN_UPDATE_SUMMARIES);

            // Work Packages
            this.produceExportFile(WorkPackages, path, doubleBackupPath, ExportFileName.WORK_PACKAGES);

            // Domain Dictionary
            this.produceExportFile(DomainDictionary, path, doubleBackupPath, ExportFileName.DOMAIN_DICTIONARY);

            // Design Components
            this.produceExportFile(DesignVersionComponents, path, doubleBackupPath, ExportFileName.DESIGN_VERSION_COMPONENTS);

            // Design Update Components
            this.produceExportFile(DesignUpdateComponents, path, doubleBackupPath, ExportFileName.DESIGN_UPDATE_COMPONENTS);

            // Work Package Components
            this.produceExportFile(WorkPackageComponents, path, doubleBackupPath, ExportFileName.WORK_PACKAGE_COMPONENTS);

            // Feature Background Steps
            this.produceExportFile(FeatureBackgroundSteps, path, doubleBackupPath, ExportFileName.FEATURE_BACKGROUND_STEPS);

            // Scenario Steps
            this.produceExportFile(ScenarioSteps, path, doubleBackupPath, ExportFileName.SCENARIO_STEPS);
        } else {
            log((msg) => console.log(msg), LogLevel.ERROR, "No backup produced");
        }
    };

    produceExportFile(collection, path, doubleBackupPath, fileName){

        // Backup to the backup folder for restore from there.
        // Also take a timed backup so that files could be retrieved from earlier version if last backup was bad for some reason

        const data = collection.find({});
        const jsonData = JSON.stringify(data.fetch());

        fs.writeFile(path + fileName, jsonData);

        fs.writeFile(doubleBackupPath + fileName, jsonData);

    }

    createAdminUser(){

        // Create a new Meteor account
        let userId = Accounts.createUser(
            {
                username: 'admin',
                password: 'admin'
            }
        );

        UserRoles.insert({
            userId:         userId,
            userName:       'admin',
            password:       'admin',
            displayName:    'Admin User',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      false,
            isAdmin:        true
        });


    }

    importUltrawideData(){
        // Recreate the data using the latest code so that it is compatible...

        let path = this.getBackupPath();

        if(path === 'NONE' || path.length === 0){
            this.createAdminUser();
            //log((msg) => console.log(msg), LogLevel.ERROR, "Export location not found.  Aborting");
            return;
        }

        let usersMapping = [];
        let testOutputLocationsMapping = [];
        let designsMapping = [];
        let designVersionsMapping = [];
        let designUpdatesMapping = [];
        let workPackagesMapping = [];
        let designComponentsMapping = [];
        let designUpdateComponentsMapping = [];
        let workPackageComponentsMapping = [];


        // User Data ===================================================================================================

        // User context is completely reset except for the path information which is restored

        let userData = '';
        let userContextData = '';
        let users = [];
        let userContexts = [];

        try {
            userData = fs.readFileSync(path + ExportFileName.USERS);
            userContextData = fs.readFileSync(path + ExportFileName.USER_CONTEXT);
            users = JSON.parse(userData);
            userContexts = JSON.parse(userContextData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open User export files: {}", e);
        }

        if(users.length > 0){

            // Recreate admin
            //this.createAdminUser();

            users.forEach((user) => {
                log((msg) => console.log(msg), LogLevel.DEBUG, "Processing User : {}", user.displayName);

                // Don't restore the admin user if there was one
                if(user.userName !== 'admin') {

                    let password = user.password;

                    if(!(password)){
                        password = 'password';
                    }

                    // Create a new Meteor account
                    let userId = Accounts.createUser(
                        {
                            username: user.userName,
                            password: password
                        }
                    );

                    UserRoles.insert({
                        userId: userId,
                        userName: user.userName,
                        password: user.password,
                        displayName: user.displayName,
                        isDesigner: user.isDesigner,
                        isDeveloper: user.isDeveloper,
                        isManager: user.isManager,
                        isAdmin: false,
                        isActive: user.isActive
                    });

                    usersMapping.push({oldId: user.userId, newId: userId});

                    // And create some basic new User Context
                    if (userContexts.length > 0) {
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
                                    scenarioStepId: 'NONE'
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
                            scenarioStepId: 'NONE'
                        });
                    }
                }

            });
        } else {
            // No user data
            log((msg) => console.log(msg), LogLevel.DEBUG, "NO USER DATA - creating basic admin user");
            this.createAdminUser();
        }

        let locationData = '';
        let locationFileData = '';
        let userLocationData = '';
        let outputLocations = [];
        let outputLocationFiles = [];
        let userOutputLocations = [];

        let backupDataVersion = 1;
        let currentDataVersion = 2;


        // Test Output Locations ---------------------------------------------------------------------------------------
        try {
            locationData = fs.readFileSync(path + ExportFileName.TEST_OUTPUT_LOCATIONS);
            locationFileData = fs.readFileSync(path + ExportFileName.TEST_OUTPUT_LOCATION_FILES);
            userLocationData = fs.readFileSync(path + ExportFileName.USER_TEST_TYPE_LOCATIONS);
            outputLocations = JSON.parse(locationData);
            outputLocationFiles = JSON.parse(locationFileData);
            userOutputLocations = JSON.parse(userLocationData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Test Location files: {}", e);
        }

        if(outputLocations.length > 0){

            let migratedLocations = this.migrateTestOutputLocationData(outputLocations, backupDataVersion, currentDataVersion);
            testOutputLocationsMapping = this.restoreTestOutputLocationData(migratedLocations, usersMapping);
        }

        if(outputLocationFiles.length > 0){

            let migratedLocationFiles = this.migrateTestOutputLocationFileData(outputLocationFiles, backupDataVersion, currentDataVersion);
            this.restoreTestOutputLocationFileData(migratedLocationFiles, testOutputLocationsMapping);
        }

        if(userOutputLocations.length > 0){

            let migratedUserOutputLocations = this.migrateUserTestTypeLocationData(userOutputLocations, backupDataVersion, currentDataVersion);
            this.restoreUserTestTypeLocationsData(migratedUserOutputLocations, usersMapping, testOutputLocationsMapping);
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
            designData = fs.readFileSync(path + ExportFileName.DESIGNS);
            designs = JSON.parse(designData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Designs export file: {}", e);
        }

        if(designs.length > 0) {

            let migratedDesigns = this.migrateDesignData(designs, backupDataVersion, currentDataVersion);
            designsMapping = this.restoreDesignData(migratedDesigns);

        } else {
            // Abort
            log((msg) => console.log(msg), LogLevel.WARNING, "No Designs - No dice...");
            return;
        }


        // Design Versions ---------------------------------------------------------------------------------------------
        let designVersionsData = '';
        let designVersions = [];

        try{
            designVersionsData = fs.readFileSync(path + ExportFileName.DESIGN_VERSIONS);
            designVersions = JSON.parse(designVersionsData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Versions export file: {}", e);
        }

        if(designVersions.length > 0) {

            let migratedDesignVersions = this.migrateDesignVersionData(designVersions, backupDataVersion, currentDataVersion);
            designVersionsMapping = this.restoreDesignVersionData(migratedDesignVersions, designsMapping);

        } else {
            // Abort - everything else needs a Design Version
            log((msg) => console.log(msg), LogLevel.WARNING, "No Design Versions - Invalid data.");
            return;
        }


        // Design Updates ----------------------------------------------------------------------------------------------
        let designUpdatesData = '';
        let designUpdates = [];

        try{
            designUpdatesData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATES);
            designUpdates = JSON.parse(designUpdatesData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Updates export file: {}", e);
        }

        if(designUpdates.length > 0) {

            let migratedDesignUpdates = this.migrateDesignUpdateData(designUpdates, backupDataVersion, currentDataVersion);
            designUpdatesMapping = this.restoreDesignUpdateData(migratedDesignUpdates, designVersionsMapping);

        } else {
            // No Design Updates - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Design Updates found...");
            hasDesignUpdates = false;
        }

        // Design Update Summaries -------------------------------------------------------------------------------------
        let designUpdateSummaryData = '';
        let designUpdateSummaries = [];

        try{
            designUpdateSummaryData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATE_SUMMARIES);
            designUpdateSummaries = JSON.parse(designUpdateSummaryData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Update Summaries export file: {}", e);
        }

        if(designUpdateSummaries.length > 0) {

            let migratedDesignUpdateSummaries = this.migrateDesignUpdateSummaryData(designUpdateSummaries, backupDataVersion, currentDataVersion);
            this.restoreDesignUpdateSummaryData(migratedDesignUpdateSummaries, designVersionsMapping, designUpdatesMapping);

        } else {
            // No Design Update Summaries - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Design Update Summaries found...");
        }

        // Work Packages -----------------------------------------------------------------------------------------------
        let workPackagesData = '';
        let workPackages = [];

        try{
            workPackagesData = fs.readFileSync(path + ExportFileName.WORK_PACKAGES);
            workPackages = JSON.parse(workPackagesData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Work Packages export file: {}", e);
        }

        if(workPackages.length > 0) {

            let migratedWorkPackages = this.migrateWorkPackageData(workPackages, backupDataVersion, currentDataVersion);
            workPackagesMapping = this.restoreWorkPackageData(migratedWorkPackages, designVersionsMapping, designUpdatesMapping, usersMapping, hasDesignUpdates);

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
            domainDictionaryData = fs.readFileSync(path + ExportFileName.DOMAIN_DICTIONARY);
            dictionaryTerms = JSON.parse(domainDictionaryData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Domain Dictionary export file: {}", e);
        }

        if(dictionaryTerms.length > 0) {

            let migratedDictionaryTerms = this.migrateDomainDictionaryData(dictionaryTerms, backupDataVersion, currentDataVersion);
            this.restoreDomainDictionaryData(migratedDictionaryTerms, designsMapping, designVersionsMapping);

        } else {
            // No Domain Dictionary - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Domain Dictionary found...");
        }

        // Design Components -------------------------------------------------------------------------------------------
        let designComponentsData = '';
        let designComponents = [];

        try{
            designComponentsData = fs.readFileSync(path + ExportFileName.DESIGN_VERSION_COMPONENTS);
            designComponents = JSON.parse(designComponentsData);
        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Components export file: {}", e);
        }

        if(designComponents.length > 0) {

            let migratedDesignComponents = this.migrateDesignComponentData(designComponents, backupDataVersion, currentDataVersion);
            designComponentsMapping = this.restoreDesignVersionComponentData(migratedDesignComponents, designsMapping, designVersionsMapping, workPackagesMapping);

        } else {
            // No Design Components - could be OK
            log((msg) => console.log(msg), LogLevel.INFO, "No Design Components found...");
            hasDesignComponents = false;
        }

        // Design Update Components ------------------------------------------------------------------------------------

        // No point unless some Design Updates were found...
        if(hasDesignUpdates) {

            let designUpdateComponentsData = '';
            let designUpdateComponents = [];

            try {
                designUpdateComponentsData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATE_COMPONENTS);
                designUpdateComponents = JSON.parse(designUpdateComponentsData);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Update Components export file: {}", e);
            }

            if (designUpdateComponents.length > 0) {

                let migratedDesignUpdateComponents = this.migrateDesignUpdateComponentData(designUpdateComponents, backupDataVersion, currentDataVersion);
                designUpdateComponentsMapping = this.restoreDesignUpdateComponentData(migratedDesignUpdateComponents, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);

            } else {
                // No Design Update Components - could be OK
                log((msg) => console.log(msg), LogLevel.INFO, "No Design Update Components found...");
                hasDesignUpdateComponents = false;
            }
        }

        // Work Package Components -------------------------------------------------------------------------------------
        let workPackageComponentsData = '';
        let workPackageComponents = [];

        try{
            workPackageComponentsData = fs.readFileSync(path + ExportFileName.WORK_PACKAGE_COMPONENTS);
            workPackageComponents = JSON.parse(workPackageComponentsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Work Package Components export file: {}", e);
        }

        if (workPackageComponents.length > 0) {

            let migratedWorkPackageComponents = this.migrateWorkPackageComponentData(workPackageComponents, backupDataVersion, currentDataVersion);
            workPackageComponentsMapping = this.restoreWorkPackageComponentData(migratedWorkPackageComponents, workPackagesMapping, designComponentsMapping, designUpdateComponentsMapping, hasDesignComponents, hasDesignUpdateComponents);

        } else {
            // No Work Package Components - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Work Package Components found...");
        }

        // Feature Background Steps ----------------------------------------------------------------------------------------------
        let backgroundStepsData = '';
        let backgroundSteps = [];

        try{
            backgroundStepsData = fs.readFileSync(path + ExportFileName.FEATURE_BACKGROUND_STEPS);
            backgroundSteps = JSON.parse(backgroundStepsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Feature Background Steps export file: {}", e);
        }

        if (backgroundSteps.length > 0) {

            let migratedBackgroundSteps = this.migrateFeatureBackgroundStepData(backgroundSteps, backupDataVersion, currentDataVersion);
            this.restoreFeatureBackgroundStepData(migratedBackgroundSteps, designsMapping, designVersionsMapping, designUpdatesMapping);

        } else {
            // No Feature Background Steps - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Feature Background Steps found...");
        }

        // Scenario Steps ----------------------------------------------------------------------------------------------
        let scenarioStepsData = '';
        let scenarioSteps = [];

        try{
            scenarioStepsData = fs.readFileSync(path + ExportFileName.SCENARIO_STEPS);
            scenarioSteps = JSON.parse(scenarioStepsData);
        } catch (e) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Scenario Steps export file: {}", e);
        }

        if (scenarioSteps.length > 0) {

            let migratedScenarioSteps = this.migrateScenarioStepData(scenarioSteps, backupDataVersion, currentDataVersion);
            this.restoreScenarioStepData(migratedScenarioSteps, designsMapping, designVersionsMapping, designUpdatesMapping);

        } else {
            // No Scenario Steps - could be OK
            log((msg) => console.log(msg), LogLevel.DEBUG, "No Scenario Steps found...");
        }

    };



}

export default new ImpExServices();
