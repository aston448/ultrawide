// External
import fs from 'fs';

// Ultrawide Services
import { padDigits, replaceAll, log }               from '../../common/utils.js';
import { LogLevel }                     from '../../constants/constants.js';

import ImpexModules                     from '../../service_modules/administration/impex_service_modules.js';
import DesignServices                   from '../../servicers/design/design_services.js';

// Data Access
import DesignBackupData                 from '../../data/backups/design_backup_db.js';
import DesignData                       from '../../data/design/design_db.js';
import DesignVersionData                from '../../data/design/design_version_db.js';
import WorkPackageData                  from '../../data/work/work_package_db.js';
import UserRoleData                     from '../../data/users/user_role_db.js';
import UserSettingData                  from '../../data/configure/user_setting_db.js';
import UserTestTypeLocationData         from '../../data/configure/user_test_type_location_db.js';
import TestOutputLocationData           from '../../data/configure/test_output_location_db.js';
import TestOutputLocationFileData       from '../../data/configure/test_output_location_file_db.js';
import DefaultFeatureAspectData         from '../../data/design/default_feature_aspect_db.js';

//======================================================================================================================
//
// Server Code for Import / Export.
//
// Methods called directly by Server API
//
//======================================================================================================================

class ImpExServices{

    // Functions called directly from APIs =============================================================================

    createAdminUser(){

        if(Meteor.isServer){

            let userId = '';

            // Create a new Meteor account
            const adminUser = Accounts.findUserByUsername('admin');

            if(!adminUser) {
                userId = Accounts.createUser(
                    {
                        username: 'admin',
                        password: 'admin123'
                    }
                );
            } else {
                userId = adminUser._id;
            }

            UserRoleData.insertAdminUser(userId);
        }
    }


    checkAndPopulateBackupFileData(backupLocation){

        if(Meteor.isServer) {

            // Mark any current known backups as stale
            ImpexModules.markAllBackupsAsUnconfirmed();

            // Get a list of files from the backup location
            try {
                const candidateFiles = fs.readdirSync(backupLocation);

                candidateFiles.forEach((file) => {

                    // Only interested in UBK files
                    if(file.endsWith('.UBK')){

                        // Add or confirm this file as existing in the data
                        ImpexModules.addConfirmBackupFile(file, backupLocation);

                    }
                });

                // Remove non-existant files from list
                ImpexModules.removeNonExistingBackups();

            } catch (e){
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't read backup directory: {}", e.stack);
                throw new Meteor.Error(e.code, e.stack);
            }
        }
    }

    // User has chosen to back up a selected Design --------------------------------------------------------------------
    backupDesign(designId){

        if(Meteor.isServer){

            let backupLocation = ImpexModules.getBackupLocation();

            const design = DesignData.getDesignById(designId);

            // Will be only 1 but want as an array
            let designData = [];
            designData.push(design);

            const dateTime = new Date();

            const dateString = dateTime.getFullYear() + '-' +
                padDigits((dateTime.getMonth() + 1), 2) + '-' +
                padDigits(dateTime.getDate(), 2) + ' ' +
                padDigits(dateTime.getHours(), 2)  + ':' +
                padDigits(dateTime.getMinutes(), 2) + ':' +
                padDigits(dateTime.getSeconds(), 2);

            const fileDate = dateTime.getFullYear() + '_' +
                padDigits((dateTime.getMonth()+1), 2) + '_' +
                padDigits(dateTime.getDate(), 2) + '_' +
                padDigits(dateTime.getHours(), 2) + '_' +
                padDigits(dateTime.getMinutes(), 2) + '_' +
                padDigits(dateTime.getSeconds(), 2);

            const backupName = design.designName + ': ' + dateString;
            const designName = design.designName;

            const ultrawideDataVersion =  ImpexModules.getCurrentDataVersion();

            let metadata = {
                backupName: backupName,
                designName: designName,
                backupDate: dateTime,
                backupDataVersion: ultrawideDataVersion
            };

            let designVersions = [];
            let designUpdates = [];
            let workPackages = [];
            let designVersionComponents = [];
            let designUpdateComponents = [];
            let workPackageComponents = [];
            let domainDictionary = [];

            // Data stored across Designs ------------------------------------------------------------------------------

            // Store all User Data
            const userRoles = UserRoleData.getAllUserRoles();

            // Store all test output locations
            const testOutputLocations = TestOutputLocationData.getAllLocations();

            // Store all test output location files
            const testOutputLocationFiles = TestOutputLocationFileData.getAllLocationFiles();

            // Store all user test locations
            const userTestTypeLocations = UserTestTypeLocationData.getAllUserTestTypeLocations();

            // Store all user settings
            const userSettings = UserSettingData.getAllUserSettings();


            // Data stored for this Design -----------------------------------------------------------------------------

            const defaultFeatureAspects = DefaultFeatureAspectData.getDefaultAspectsForDesign(designId);

            const designVersionData = DesignData.getDesignVersions(designId);

            designVersionData.forEach((designVersion) => {
                designVersions.push(designVersion);

                // All updates in this Version
                let designUpdateData = DesignVersionData.getAllUpdates(designVersion._id);

                designUpdateData.forEach((designUpdate) => {
                    designUpdates.push(designUpdate);
                });

                // All Work packages in this version
                let workPackageData = DesignVersionData.getAllWorkPackages(designVersion._id);

                workPackageData.forEach((workPackage) => {
                    workPackages.push(workPackage);

                    // All work package components in this Work Package
                    let workPackageComponentData = WorkPackageData.getAllWorkPackageComponents(workPackage._id);

                    workPackageComponentData.forEach((workPackageComponent) => {
                        workPackageComponents.push(workPackageComponent)
                    })
                });

                // All design components in this version
                let designVersionComponentData = DesignVersionData.getAllComponents(designVersion._id);

                designVersionComponentData.forEach((designVersionComponent) => {
                    designVersionComponents.push(designVersionComponent);
                });

                // All Design Update components in this version
                let designUpdateComponentData = DesignVersionData.getAllUpdateComponents(designVersion._id);

                designUpdateComponentData.forEach((designUpdateComponent) => {
                    designUpdateComponents.push(designUpdateComponent);
                });

                // All Domain Dictionary entries for this version
                let dictionaryData = DesignVersionData.getDomainDictionaryEntries(designVersion._id);

                dictionaryData.forEach((domainItem) => {
                    domainDictionary.push(domainItem);
                });
            });

            const designBackup =
                {
                    metadata: metadata,
                    userRoles: userRoles,
                    testOutputLocations: testOutputLocations,
                    testOutputLocationFiles: testOutputLocationFiles,
                    userTestTypeLocations: userTestTypeLocations,
                    userSettings: userSettings,
                    designs: designData,
                    defaultFeatureAspects: defaultFeatureAspects,
                    designVersions: designVersions,
                    designUpdates: designUpdates,
                    workPackages: workPackages,
                    domainDictionary: domainDictionary,
                    designVersionComponents: designVersionComponents,
                    designUpdateComponents: designUpdateComponents,
                    workPackageComponents: workPackageComponents
                };


            const jsonData = JSON.stringify(designBackup);
            //const jsonData = JSON.stringify(designBackup, null, 2); // Use if want readable backup file - but much bigger

            const fileName = 'ULTRAWIDE_' + replaceAll(design.designName.trim(), ' ', '_') + '_' + fileDate + '.UBK';

            try {

                fs.writeFileSync(backupLocation + fileName, jsonData);

                log((msg) => console.log(msg), LogLevel.INFO, "Design backed up as: {}", backupLocation + fileName);

                // If that has not errored, add the backup to the list
                DesignBackupData.insertNewBackup(metadata, fileName);


            } catch (e){
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't save Design backup: {}", e);
                throw e;
            }

        }
    };

    // User has chosen to restore a Design from a backup ---------------------------------------------------------------
    restoreDesign(backupFileName){

        if(Meteor.isServer) {
            let backupDataVersion = 0;
            const currentDataVersion = ImpexModules.getCurrentDataVersion();

            let usersMapping = [];
            let locationsMapping = [];
            let designsMapping = [];
            let designVersionsMapping = [];
            let designUpdatesMapping = [];
            let workPackagesMapping = [];
            let designVersionComponentsMapping = [];
            let designUpdateComponentsMapping = [];

            if (currentDataVersion > 0) {

                // Read the required backup file
                const backupData = ImpexModules.readBackupFile(backupFileName);

                if (backupData) {

                    backupDataVersion = backupData.metadata.backupDataVersion;

                    log((msg) => console.log(msg), LogLevel.INFO, "Restoring from backup with backup data version {} and current data version {}", backupDataVersion, currentDataVersion);

                    // Data to MERGE ---------------------------------------------------------------------------------------

                    // Merge user data.  Make sure all the users associated with this design exist and create a map of any new users created
                    if(backupData.userRoles) {
                        usersMapping = ImpexModules.restoreDesignUsers(backupData.userRoles, backupDataVersion, currentDataVersion);
                    }

                    // Merge test output location data
                    if(backupData.testOutputLocations) {
                        locationsMapping = ImpexModules.restoreTestOutputLocationData(backupData.testOutputLocations, backupDataVersion, currentDataVersion, usersMapping);
                    }

                    // Merge test output location files data
                    if(backupData.testOutputLocationFiles) {
                        ImpexModules.restoreTestOutputLocationFileData(backupData.testOutputLocationFiles, backupDataVersion, currentDataVersion, locationsMapping);
                    }

                    // Merge user test type locations data
                    if(backupData.userTestTypeLocations) {
                        // Remove all existing settings first
                        UserTestTypeLocationData.removeAllUserTestTypeLocations();

                        ImpexModules.restoreUserTestTypeLocationsData(backupData.userTestTypeLocations, backupDataVersion, currentDataVersion, usersMapping, locationsMapping);
                    }

                    // Merge user settings
                    if(backupData.userSettings) {
                        ImpexModules.restoreUserSettingsData(backupData.userSettings, backupDataVersion, currentDataVersion, usersMapping);
                    }

                    // Data to REPLACE -------------------------------------------------------------------------------------

                    // Get this BEFORE we create the replacement Design
                    const oldDesign = DesignData.getDesignByName(backupData.metadata.designName);

                    // Mark old design as going if there is one
                    if(oldDesign) {
                        DesignServices.updateDesignName(oldDesign._id, oldDesign.designName + ' - TO REMOVE');
                    }

                    // Restore Data - this creates new data with new IDs in parallel to any existing data ++++++++++++++++++

                    // Restore Designs
                    designsMapping = ImpexModules.restoreDesignData(backupData.designs, backupDataVersion, currentDataVersion);

                    // Restore Default Feature Aspects
                    ImpexModules.restoreDefaultFeatureAspects(backupData.defaultFeatureAspects, backupDataVersion, currentDataVersion, designsMapping);

                    // Restore Design Versions
                    designVersionsMapping = ImpexModules.restoreDesignVersionData(backupData.designVersions, backupDataVersion, currentDataVersion, designsMapping);

                    // Restore Design Updates
                    designUpdatesMapping = ImpexModules.restoreDesignUpdateData(backupData.designUpdates, backupDataVersion, currentDataVersion, designVersionsMapping);

                    // Restore Work Packages
                    const hasDesignUpdates = (backupData.designUpdates.length > 0);

                    workPackagesMapping = ImpexModules.restoreWorkPackageData(backupData.workPackages, backupDataVersion, currentDataVersion, designVersionsMapping, designUpdatesMapping, usersMapping, hasDesignUpdates);

                    // Restore Domain Dictionary
                    ImpexModules.restoreDomainDictionaryData(backupData.domainDictionary, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping);

                    // Restore Design Version Components
                    designVersionComponentsMapping = ImpexModules.restoreDesignVersionComponentData(backupData.designVersionComponents, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping, workPackagesMapping);

                    // Restore Design Update Components
                    designUpdateComponentsMapping = ImpexModules.restoreDesignUpdateComponentData(backupData.designUpdateComponents, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);

                    // Restore Work Package Components
                    const hasDesignVersionComponents = (backupData.designVersionComponents.length > 0);
                    const hasDesignUpdateComponents = (backupData.designUpdateComponents.length > 0);

                    ImpexModules.restoreWorkPackageComponentData(backupData.workPackageComponents, backupDataVersion, currentDataVersion, workPackagesMapping, designVersionComponentsMapping, designUpdateComponentsMapping, hasDesignVersionComponents, hasDesignUpdateComponents);


                    // Replacement / restore has succeeded so remove the old data if it existed ++++++++++++++++++++++++++++

                    if (oldDesign) {

                        log((msg) => console.log(msg), LogLevel.INFO, "Removing old version of Design {}", oldDesign.designName);

                        let oldDesignVersions = [];

                        oldDesignVersions = DesignData.getDesignVersions(oldDesign._id);

                        DesignData.removeDesignAndAllData(oldDesign._id, oldDesignVersions);
                    }

                    log((msg) => console.log(msg), LogLevel.INFO, "Restore complete.");

                }

            } else {
                log((msg) => console.log(msg), LogLevel.ERROR, "Current application data version is not found.");
                throw new Meteor.Error('DESIGN_RESTORE_FAIL', 'Current application data version is not found.');
            }
        }
    }

    // User has chosen to archive a Design -----------------------------------------------------------------------------
    archiveDesign(designId){

        // 1. Make a Backup
        try{
            this.backupDesign(designId);
        } catch (e) {
            throw new Meteor.Error('DESIGN_ARCHIVE_FAIL', 'Unable to backup the design due to error: ' + e.stack);
        }

        // 2. Delete all data.  The standard restore process can be used to 'un-archive' the design

        log((msg) => console.log(msg), LogLevel.INFO, "Removing Design data...");

        let archivedDesignVersions = DesignData.getDesignVersions(designId);

        DesignData.removeDesignAndAllData(designId, archivedDesignVersions);

        log((msg) => console.log(msg), LogLevel.INFO, "Archiving complete.");
    }


    // Internal

    forceRemoveDesign(designId){

        const designVersions = DesignData.getDesignVersions(designId);

        DesignData.removeDesignAndAllData(designId, designVersions);
    }


    // OLD - Probably safe to remove after refactor testing------------------------------

    // restoreDesignBackup(backupId, currentDesignId){
    //
    //     if(Meteor.isServer){
    //
    //         const backup = DesignBackups.findOne({_id: backupId});
    //
    //         let backupJson = null;
    //         let backupData = null;
    //
    //         try {
    //             backupJson = fs.readFileSync(backup.backupFileName);
    //             backupData = JSON.parse(backupJson);
    //         } catch (e){
    //             log((msg) => console.log(msg), LogLevel.ERROR, "Can't read Design backup: {}.  Error: {}", backup.backupFileName, e);
    //         }
    //
    //         // Returns in descending order
    //         const dataVersions = AppGlobalData.getAllDataVersions();
    //         const latestDataVersion = dataVersions[0].dataVersion;
    //
    //         let newDesignData = backupData.designs;
    //         let newDesignVersionData = backup.designVersions;
    //         let newDesignUpdateData = backup.designUpdates;
    //         let newWorkPackageData = backup.workPackages;
    //         let newDesignComponentData = backup.designVersionComponents;
    //         let newDesignUpdateComponentData = backup.designUpdateComponents;
    //         let newWorkPackageComponentData = backup.workPackageComponents;
    //         let newDomainDictionaryData = backup.domainDictionary;
    //
    //         // Migrate data if needed
    //         if(backup.dataVersion < latestDataVersion){
    //             newDesignData = this.migrateDesignData(backupData.designs, backup.dataVersion, latestDataVersion);
    //             newDesignVersionData = this.migrateDesignVersionData(backupData.designVersions, backup.dataVersion, latestDataVersion);
    //             newDesignUpdateData = this.migrateDesignUpdateData(backupData.designUpdates, backup.dataVersion, latestDataVersion);
    //             //newDesignUpdateSummaryData = this.migrateDesignUpdateSummaryData(backupData.designUpdateSummaries, backup.dataVersion, latestDataVersion);
    //             newWorkPackageData = this.migrateWorkPackageData(backupData.workPackages, backup.dataVersion, latestDataVersion);
    //             newDesignComponentData = this.migrateDesignComponentData(backupData.designComponents, backup.dataVersion, latestDataVersion);
    //             newDesignUpdateComponentData = this.migrateDesignUpdateComponentData(backupData.designUpdateComponents, backup.dataVersion, latestDataVersion);
    //             newWorkPackageComponentData = this.migrateWorkPackageComponentData(backupData.workPackageComponents, backup.dataVersion, latestDataVersion);
    //             newFeatureBackgroundStepsData = this.migrateFeatureBackgroundStepData(backupData.featureBackgroundSteps, backup.dataVersion, latestDataVersion);
    //             newScenarioStepsData = this.migrateScenarioStepData(backupData.scenarioSteps, backup.dataVersion, latestDataVersion);
    //             newDomainDictionaryData = this.migrateDomainDictionaryData(backupData.domainDictionary, backup.dataVersion, latestDataVersion)
    //         }
    //
    //         // Restore the backup data
    //         let designsMapping = this.restoreDesignData(newDesignData);
    //
    //         let designVersionsMapping = this.restoreDesignVersionData(newDesignVersionData, designsMapping);
    //
    //         let designUpdatesMapping = this.restoreDesignUpdateData(newDesignUpdateData, designVersionsMapping);
    //
    //         //this.restoreDesignUpdateSummaryData(newDesignUpdateSummaryData, designVersionsMapping, designUpdatesMapping);
    //
    //         let hasUpdates = newDesignUpdateData.length > 0;
    //
    //         // Get current user mapping for WP adoption
    //         let userMapping = [];
    //
    //         UserRoles.forEach((user) => {
    //             userMapping.push({oldId: user.userId, newId: user.userId});
    //         });
    //
    //         let workPackagesMapping = this.restoreWorkPackageData(newWorkPackageData, designVersionsMapping, designUpdatesMapping, userMapping, hasUpdates);
    //
    //         let designComponentsMapping = this.restoreDesignVersionComponentData(newDesignComponentData, designsMapping, designVersionsMapping, workPackagesMapping);
    //
    //         let designUpdateComponentsMapping = this.restoreDesignUpdateComponentData(newDesignUpdateComponentData, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);
    //
    //         let hasDesignComponents = newDesignComponentData.length > 0;
    //         let hasDesignUpdateComponents = newDesignUpdateComponentData.length > 0;
    //         let workPackageComponentsMapping = this.restoreWorkPackageComponentData(newWorkPackageComponentData, workPackagesMapping, designComponentsMapping, designUpdateComponentsMapping, hasDesignComponents, hasDesignUpdateComponents);
    //
    //         this.restoreFeatureBackgroundStepData(newFeatureBackgroundStepsData, designsMapping, designVersionsMapping, designUpdatesMapping);
    //
    //         this.restoreScenarioStepData(newScenarioStepsData, designsMapping, designVersionsMapping, designUpdatesMapping);
    //
    //         this.restoreDomainDictionaryData(newDomainDictionaryData, designsMapping, designVersionsMapping);
    //
    //         // Remove the current data - it has different IDs
    //         this.removeCurrentDesignData(backupData.designs);
    //
    //     }
    // };

    // // Remove unwanted duplicate Design Data after a restore
    // removeCurrentDesignData(currentDesignId){
    //
    //     const design = Designs.findOne({_id: currentDesignId});
    //
    //     if(design) {
    //
    //         const designVersions = DesignVersions.find({designId: design._id}).fetch();
    //
    //         designVersions.forEach((designVersion) => {
    //
    //             // All updates in this Version
    //             DesignUpdates.remove({designVersionId: designVersion._id});
    //
    //             // // All update summaries in this Version
    //             // UserDesignUpdateSummary.remove({designVersionId: designVersion._id});
    //
    //             let workPackages = WorkPackages.find({designVersionId: designVersion._id}).fetch();
    //             workPackages.forEach((workPackage) => {
    //
    //                 // All work package components in this Work Package
    //                 WorkPackageComponents.remove({workPackageId: workPackage._id});
    //             });
    //
    //             // All Work packages in this version
    //             WorkPackages.remove({designVersionId: designVersion._id});
    //
    //             // All design components in this version
    //             DesignVersionComponents.remove({designVersionId: designVersion._id});
    //
    //             // All Design Update components in this version
    //             DesignUpdateComponents.remove({designVersionId: designVersion._id});
    //
    //             // All Feature background steps in this Version
    //             FeatureBackgroundSteps.remove({designVersionId: designVersion._id});
    //
    //             // All Scenario Steps in this version
    //             ScenarioSteps.remove({designVersionId: designVersion._id});
    //
    //             // All Domain Dictionary entries for this version
    //             DomainDictionary.remove({designVersionId: designVersion._id});
    //
    //         });
    //
    //         // And then remove the design versions
    //         DesignVersions.remove({designId: design._id});
    //
    //         // And the design
    //         Designs.remove({_id: currentDesignId});
    //
    //     }
    // };
    //
    //
    //
    //
    //


    // restoreFeatureBackgroundStepData(newFeatureBackgroundStepsData, designsMapping, designVersionsMapping, designUpdatesMapping){
    //
    //     log((msg) => console.log(msg), LogLevel.INFO, "Restoring Feature Background Steps...");
    //
    //     let componentCount = 0;
    //
    //     newFeatureBackgroundStepsData.forEach((step) => {
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Adding Background Step {} {}", step.stepType, step.stepText);
    //
    //         let designId = getIdFromMap(designsMapping, step.designId);
    //         let designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
    //         let designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);
    //
    //         let featureBackgroundStepId = ScenarioServices.importFeatureBackgroundStep(
    //             designId,
    //             designVersionId,
    //             designUpdateId,
    //             step
    //         );
    //
    //         componentCount++;
    //         // Currently don't need to map step ids..
    //
    //     });
    //
    //     log((msg) => console.log(msg), LogLevel.INFO, "Added {} Feature Background Steps", componentCount);
    // };

    // restoreScenarioStepData(newScenarioStepsData, designsMapping, designVersionsMapping, designUpdatesMapping){
    //
    //     log((msg) => console.log(msg), LogLevel.INFO, "Restoring Scenario Steps...");
    //
    //     let componentCount = 0;
    //
    //     newScenarioStepsData.forEach((step) => {
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Adding Scenario Step {} {}", step.stepType, step.stepText);
    //
    //         let designId = getIdFromMap(designsMapping, step.designId);
    //         let designVersionId = getIdFromMap(designVersionsMapping, step.designVersionId);
    //         let designUpdateId = getIdFromMap(designUpdatesMapping, step.designUpdateId);
    //
    //         let scenarioStepId = ScenarioServices.importScenarioStep(
    //             designId,
    //             designVersionId,
    //             designUpdateId,
    //             step
    //         );
    //
    //         componentCount++;
    //         // Currently don't need to map step ids..
    //
    //     });
    //
    //     log((msg) => console.log(msg), LogLevel.INFO, "Added {} Scenario Steps", componentCount);
    // }

    // getBackupPath(){
    //
    //     //return '/ultrawide_data/';
    //
    //     const iniFile = process.env["PWD"] + '/ultrawide.ini';
    //
    //     if(fs.existsSync(iniFile)){
    //         try {
    //             log((msg) => console.log(msg), LogLevel.INFO, "Opening ini file: {}", iniFile);
    //
    //             const iniData = fs.readFileSync(iniFile);
    //             const iniJson = JSON.parse(iniData);
    //
    //             log((msg) => console.log(msg), LogLevel.INFO, "Backup location is: {}", iniJson.backupPath);
    //
    //             return iniJson.backupPath;
    //         } catch (e){
    //             log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Ultrawide ini file: {}", e);
    //             return'NONE';
    //         }
    //
    //     } else {
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't locate Ultrawide ini file");
    //         return 'NONE';
    //     }
    // }

    // exportUltrawideData(){
    //     // Export all the essential data to a file
    //
    //     let path = this.getBackupPath();
    //
    //     if(path !== 'NONE' && path.length > 0) {
    //
    //         if (fs.existsSync(path) === false) {
    //             fs.mkdirSync(path);
    //         }
    //
    //         // Create the double backup folder
    //         let date = new Date();
    //         let dateDir = date.getFullYear() + '_' + padDigits((date.getMonth() + 1), 2) + '_' + padDigits(date.getDate(), 2) + '_' + padDigits(date.getHours(), 2) + padDigits(date.getMinutes(), 2) + padDigits(date.getSeconds(), 2);
    //         let doubleBackupPath = path + dateDir + '/';
    //         if (fs.existsSync(doubleBackupPath) === false) {
    //             fs.mkdirSync(doubleBackupPath);
    //         }
    //
    //         // User Data
    //         this.produceExportFile(UserRoles, path, doubleBackupPath, ExportFileName.USERS);
    //
    //         this.produceExportFile(UserSettings, path, doubleBackupPath, ExportFileName.USER_SETTINGS);
    //
    //         // User Context
    //         this.produceExportFile(UserContext, path, doubleBackupPath, ExportFileName.USER_CONTEXT);
    //
    //         // Test Output Locations
    //         this.produceExportFile(TestOutputLocations, path, doubleBackupPath, ExportFileName.TEST_OUTPUT_LOCATIONS);
    //         this.produceExportFile(TestOutputLocationFiles, path, doubleBackupPath, ExportFileName.TEST_OUTPUT_LOCATION_FILES);
    //         this.produceExportFile(UserTestTypeLocations, path, doubleBackupPath, ExportFileName.USER_TEST_TYPE_LOCATIONS);
    //
    //         // Designs
    //         this.produceExportFile(Designs, path, doubleBackupPath, ExportFileName.DESIGNS);
    //
    //         // Design Versions
    //         this.produceExportFile(DesignVersions, path, doubleBackupPath, ExportFileName.DESIGN_VERSIONS);
    //
    //         // Design Updates
    //         this.produceExportFile(DesignUpdates, path, doubleBackupPath, ExportFileName.DESIGN_UPDATES);
    //
    //         // // Design Update Summaries
    //         // this.produceExportFile(UserDesignUpdateSummary, path, doubleBackupPath, ExportFileName.DESIGN_UPDATE_SUMMARIES);
    //
    //         // Work Packages
    //         this.produceExportFile(WorkPackages, path, doubleBackupPath, ExportFileName.WORK_PACKAGES);
    //
    //         // Domain Dictionary
    //         this.produceExportFile(DomainDictionary, path, doubleBackupPath, ExportFileName.DOMAIN_DICTIONARY);
    //
    //         // Design Components
    //         this.produceExportFile(DesignVersionComponents, path, doubleBackupPath, ExportFileName.DESIGN_VERSION_COMPONENTS);
    //
    //         // Design Update Components
    //         this.produceExportFile(DesignUpdateComponents, path, doubleBackupPath, ExportFileName.DESIGN_UPDATE_COMPONENTS);
    //
    //         // Work Package Components
    //         this.produceExportFile(WorkPackageComponents, path, doubleBackupPath, ExportFileName.WORK_PACKAGE_COMPONENTS);
    //
    //         // Feature Background Steps
    //         this.produceExportFile(FeatureBackgroundSteps, path, doubleBackupPath, ExportFileName.FEATURE_BACKGROUND_STEPS);
    //
    //         // Scenario Steps
    //         this.produceExportFile(ScenarioSteps, path, doubleBackupPath, ExportFileName.SCENARIO_STEPS);
    //     } else {
    //         log((msg) => console.log(msg), LogLevel.ERROR, "No backup produced");
    //     }
    // };

    // produceExportFile(collection, path, doubleBackupPath, fileName){
    //
    //     // Backup to the backup folder for restore from there.
    //     // Also take a timed backup so that files could be retrieved from earlier version if last backup was bad for some reason
    //
    //     const data = collection.find({});
    //     const jsonData = JSON.stringify(data.fetch());
    //
    //     fs.writeFile(path + fileName, jsonData);
    //
    //     fs.writeFile(doubleBackupPath + fileName, jsonData);
    //
    // }



    // importUltrawideData(){
    //     // Recreate the data using the latest code so that it is compatible...
    //
    //     let path = this.getBackupPath();
    //
    //     if(path === 'NONE' || path.length === 0){
    //         this.createAdminUser();
    //         //log((msg) => console.log(msg), LogLevel.ERROR, "Export location not found.  Aborting");
    //         return;
    //     }
    //
    //     let usersMapping = [];
    //     let testOutputLocationsMapping = [];
    //     let designsMapping = [];
    //     let designVersionsMapping = [];
    //     let designUpdatesMapping = [];
    //     let workPackagesMapping = [];
    //     let designComponentsMapping = [];
    //     let designUpdateComponentsMapping = [];
    //     let workPackageComponentsMapping = [];
    //
    //
    //     // User Data ===================================================================================================
    //
    //     // User context is completely reset except for the path information which is restored
    //
    //     let userData = '';
    //     let userContextData = '';
    //     let users = [];
    //     let userContexts = [];
    //
    //     try {
    //         userData = fs.readFileSync(path + ExportFileName.USERS);
    //         userContextData = fs.readFileSync(path + ExportFileName.USER_CONTEXT);
    //         users = JSON.parse(userData);
    //         userContexts = JSON.parse(userContextData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open User export files: {}", e);
    //     }
    //
    //     if(users.length > 0){
    //
    //         // Recreate admin
    //         this.createAdminUser();
    //
    //         users.forEach((user) => {
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "Processing User : {}", user.displayName);
    //
    //             // Don't restore the admin user if there was one
    //             if(user.userName !== 'admin') {
    //
    //                 let password = user.password;
    //
    //                 if(!(password)){
    //                     password = 'password';
    //                 }
    //
    //                 // Create a new Meteor account
    //                 let userId = Accounts.createUser(
    //                     {
    //                         username: user.userName,
    //                         password: password
    //                     }
    //                 );
    //
    //                 UserRoles.insert({
    //                     userId: userId,
    //                     userName: user.userName,
    //                     displayName: user.displayName,
    //                     isDesigner: user.isDesigner,
    //                     isDeveloper: user.isDeveloper,
    //                     isManager: user.isManager,
    //                     isAdmin: false,
    //                     isActive: user.isActive
    //                 });
    //
    //                 usersMapping.push({oldId: user.userId, newId: userId});
    //
    //                 // And create some basic new User Context
    //                 if (userContexts.length > 0) {
    //                     userContexts.forEach((userContext) => {
    //
    //                         if (userContext.userId === user.userId) {
    //                             // This context relates to the old user id so insert a new context, just restoring path info
    //
    //                             UserContext.insert({
    //                                 userId: userId,             // New User Id
    //                                 designId: 'NONE',
    //                                 designVersionId: 'NONE',
    //                                 designUpdateId: 'NONE',
    //                                 workPackageId: 'NONE',
    //                                 designComponentId: 'NONE',
    //                                 designComponentType: 'NONE',
    //
    //                                 featureReferenceId: 'NONE',
    //                                 featureAspectReferenceId: 'NONE',
    //                                 scenarioReferenceId: 'NONE',
    //                                 scenarioStepId: 'NONE'
    //                             });
    //                         }
    //                     });
    //                 } else {
    //                     // Use empty user context
    //                     UserContext.insert({
    //                         userId: userId,             // New User Id
    //                         designId: 'NONE',
    //                         designVersionId: 'NONE',
    //                         designUpdateId: 'NONE',
    //                         workPackageId: 'NONE',
    //                         designComponentId: 'NONE',
    //                         designComponentType: 'NONE',
    //
    //                         featureReferenceId: 'NONE',
    //                         featureAspectReferenceId: 'NONE',
    //                         scenarioReferenceId: 'NONE',
    //                         scenarioStepId: 'NONE'
    //                     });
    //                 }
    //             }
    //
    //         });
    //     } else {
    //         // No user data
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "NO USER DATA - creating basic admin user");
    //         this.createAdminUser();
    //     }
    //
    //     let locationData = '';
    //     let locationFileData = '';
    //     let userLocationData = '';
    //     let userSettingsData = '';
    //     let outputLocations = [];
    //     let outputLocationFiles = [];
    //     let userOutputLocations = [];
    //     let userSettings = [];
    //
    //     let backupDataVersion = 1;
    //     let currentDataVersion = 2;
    //
    //     // User Settings -----------------------------------------------------------------------------------------------
    //
    //     try {
    //         userSettingsData = fs.readFileSync(path + ExportFileName.USER_SETTINGS);
    //         userSettings = JSON.parse(userSettingsData);
    //     }
    //
    //     catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Test Location files: {}", e);
    //     }
    //
    //     if(userSettings.length > 0){
    //
    //         let migratedUserSettings = this.migrateUserSettingsData(userSettings, backupDataVersion, currentDataVersion);
    //         this.restoreUserSettingsData(migratedUserSettings, usersMapping);
    //     }
    //
    //     // Test Output Locations ---------------------------------------------------------------------------------------
    //     try {
    //         locationData = fs.readFileSync(path + ExportFileName.TEST_OUTPUT_LOCATIONS);
    //         locationFileData = fs.readFileSync(path + ExportFileName.TEST_OUTPUT_LOCATION_FILES);
    //         userLocationData = fs.readFileSync(path + ExportFileName.USER_TEST_TYPE_LOCATIONS);
    //         outputLocations = JSON.parse(locationData);
    //         outputLocationFiles = JSON.parse(locationFileData);
    //         userOutputLocations = JSON.parse(userLocationData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Test Location files: {}", e);
    //     }
    //
    //     if(outputLocations.length > 0){
    //
    //         let migratedLocations = this.migrateTestOutputLocationData(outputLocations, backupDataVersion, currentDataVersion);
    //         testOutputLocationsMapping = this.restoreTestOutputLocationData(migratedLocations, usersMapping);
    //     }
    //
    //     if(outputLocationFiles.length > 0){
    //
    //         let migratedLocationFiles = this.migrateTestOutputLocationFileData(outputLocationFiles, backupDataVersion, currentDataVersion);
    //         this.restoreTestOutputLocationFileData(migratedLocationFiles, testOutputLocationsMapping);
    //     }
    //
    //     if(userOutputLocations.length > 0){
    //
    //         let migratedUserOutputLocations = this.migrateUserTestTypeLocationData(userOutputLocations, backupDataVersion, currentDataVersion);
    //         this.restoreUserTestTypeLocationsData(migratedUserOutputLocations, usersMapping, testOutputLocationsMapping);
    //     }
    //
    //
    //     // Design Items ================================================================================================
    //
    //     let hasDesignUpdates = true;
    //     let hasWorkPackages = true;
    //     let hasDesignComponents = true;
    //     let hasDesignUpdateComponents = true;
    //
    //      // Designs ----------------------------------------------------------------------------------------------------
    //     let designData = '';
    //     let designs = [];
    //
    //     try {
    //         designData = fs.readFileSync(path + ExportFileName.DESIGNS);
    //         designs = JSON.parse(designData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Designs export file: {}", e);
    //     }
    //
    //     if(designs.length > 0) {
    //
    //         let migratedDesigns = this.migrateDesignData(designs, backupDataVersion, currentDataVersion);
    //         designsMapping = this.restoreDesignData(migratedDesigns);
    //
    //     } else {
    //         // Abort
    //         log((msg) => console.log(msg), LogLevel.WARNING, "No Designs - No dice...");
    //         return;
    //     }
    //
    //
    //     // Design Versions ---------------------------------------------------------------------------------------------
    //     let designVersionsData = '';
    //     let designVersions = [];
    //
    //     try{
    //         designVersionsData = fs.readFileSync(path + ExportFileName.DESIGN_VERSIONS);
    //         designVersions = JSON.parse(designVersionsData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Versions export file: {}", e);
    //     }
    //
    //     if(designVersions.length > 0) {
    //
    //         let migratedDesignVersions = this.migrateDesignVersionData(designVersions, backupDataVersion, currentDataVersion);
    //         designVersionsMapping = this.restoreDesignVersionData(migratedDesignVersions, designsMapping);
    //
    //     } else {
    //         // Abort - everything else needs a Design Version
    //         log((msg) => console.log(msg), LogLevel.WARNING, "No Design Versions - Invalid data.");
    //         return;
    //     }
    //
    //
    //     // Design Updates ----------------------------------------------------------------------------------------------
    //     let designUpdatesData = '';
    //     let designUpdates = [];
    //
    //     try{
    //         designUpdatesData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATES);
    //         designUpdates = JSON.parse(designUpdatesData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Updates export file: {}", e);
    //     }
    //
    //     if(designUpdates.length > 0) {
    //
    //         let migratedDesignUpdates = this.migrateDesignUpdateData(designUpdates, backupDataVersion, currentDataVersion);
    //         designUpdatesMapping = this.restoreDesignUpdateData(migratedDesignUpdates, designVersionsMapping);
    //
    //     } else {
    //         // No Design Updates - could be OK
    //         log((msg) => console.log(msg), LogLevel.INFO, "No Design Updates found...");
    //         hasDesignUpdates = false;
    //     }
    //
    //     // // Design Update Summaries -------------------------------------------------------------------------------------
    //     // let designUpdateSummaryData = '';
    //     // let designUpdateSummaries = [];
    //     //
    //     // try{
    //     //     designUpdateSummaryData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATE_SUMMARIES);
    //     //     designUpdateSummaries = JSON.parse(designUpdateSummaryData);
    //     // } catch (e){
    //     //     log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Update Summaries export file: {}", e);
    //     // }
    //     //
    //     // if(designUpdateSummaries.length > 0) {
    //     //
    //     //     let migratedDesignUpdateSummaries = this.migrateDesignUpdateSummaryData(designUpdateSummaries, backupDataVersion, currentDataVersion);
    //     //     this.restoreDesignUpdateSummaryData(migratedDesignUpdateSummaries, designVersionsMapping, designUpdatesMapping);
    //     //
    //     // } else {
    //     //     // No Design Update Summaries - could be OK
    //     //     log((msg) => console.log(msg), LogLevel.INFO, "No Design Update Summaries found...");
    //     // }
    //
    //     // Work Packages -----------------------------------------------------------------------------------------------
    //     let workPackagesData = '';
    //     let workPackages = [];
    //
    //     try{
    //         workPackagesData = fs.readFileSync(path + ExportFileName.WORK_PACKAGES);
    //         workPackages = JSON.parse(workPackagesData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Work Packages export file: {}", e);
    //     }
    //
    //     if(workPackages.length > 0) {
    //
    //         let migratedWorkPackages = this.migrateWorkPackageData(workPackages, backupDataVersion, currentDataVersion);
    //         workPackagesMapping = this.restoreWorkPackageData(migratedWorkPackages, designVersionsMapping, designUpdatesMapping, usersMapping, hasDesignUpdates);
    //
    //     } else {
    //         // No Work Packages - could be OK
    //         log((msg) => console.log(msg), LogLevel.INFO, "No Work Packages found...");
    //         hasWorkPackages = false;
    //     }
    //
    //     // Design Data =================================================================================================
    //
    //     // Domain Dictionary -------------------------------------------------------------------------------------------
    //     let domainDictionaryData = '';
    //     let dictionaryTerms = [];
    //
    //     try{
    //         domainDictionaryData = fs.readFileSync(path + ExportFileName.DOMAIN_DICTIONARY);
    //         dictionaryTerms = JSON.parse(domainDictionaryData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Domain Dictionary export file: {}", e);
    //     }
    //
    //     if(dictionaryTerms.length > 0) {
    //
    //         let migratedDictionaryTerms = this.migrateDomainDictionaryData(dictionaryTerms, backupDataVersion, currentDataVersion);
    //         this.restoreDomainDictionaryData(migratedDictionaryTerms, designsMapping, designVersionsMapping);
    //
    //     } else {
    //         // No Domain Dictionary - could be OK
    //         log((msg) => console.log(msg), LogLevel.INFO, "No Domain Dictionary found...");
    //     }
    //
    //     // Design Components -------------------------------------------------------------------------------------------
    //     let designComponentsData = '';
    //     let designComponents = [];
    //
    //     try{
    //         designComponentsData = fs.readFileSync(path + ExportFileName.DESIGN_VERSION_COMPONENTS);
    //         designComponents = JSON.parse(designComponentsData);
    //     } catch (e){
    //         log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Design Components export file: {}", e);
    //     }
    //
    //     if(designComponents.length > 0) {
    //
    //         let migratedDesignComponents = this.migrateDesignComponentData(designComponents, backupDataVersion, currentDataVersion);
    //         designComponentsMapping = this.restoreDesignVersionComponentData(migratedDesignComponents, designsMapping, designVersionsMapping, workPackagesMapping);
    //
    //     } else {
    //         // No Design Components - could be OK
    //         log((msg) => console.log(msg), LogLevel.INFO, "No Design Components found...");
    //         hasDesignComponents = false;
    //     }
    //
    //     // Design Update Components ------------------------------------------------------------------------------------
    //
    //     // No point unless some Design Updates were found...
    //     if(hasDesignUpdates) {
    //
    //         let designUpdateComponentsData = '';
    //         let designUpdateComponents = [];
    //
    //         try {
    //             designUpdateComponentsData = fs.readFileSync(path + ExportFileName.DESIGN_UPDATE_COMPONENTS);
    //             designUpdateComponents = JSON.parse(designUpdateComponentsData);
    //         } catch (e) {
    //             log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Update Components export file: {}", e);
    //         }
    //
    //         if (designUpdateComponents.length > 0) {
    //
    //             let migratedDesignUpdateComponents = this.migrateDesignUpdateComponentData(designUpdateComponents, backupDataVersion, currentDataVersion);
    //             designUpdateComponentsMapping = this.restoreDesignUpdateComponentData(migratedDesignUpdateComponents, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);
    //
    //         } else {
    //             // No Design Update Components - could be OK
    //             log((msg) => console.log(msg), LogLevel.INFO, "No Design Update Components found...");
    //             hasDesignUpdateComponents = false;
    //         }
    //     }
    //
    //     // Work Package Components -------------------------------------------------------------------------------------
    //     let workPackageComponentsData = '';
    //     let workPackageComponents = [];
    //
    //     try{
    //         workPackageComponentsData = fs.readFileSync(path + ExportFileName.WORK_PACKAGE_COMPONENTS);
    //         workPackageComponents = JSON.parse(workPackageComponentsData);
    //     } catch (e) {
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Work Package Components export file: {}", e);
    //     }
    //
    //     if (workPackageComponents.length > 0) {
    //
    //         let migratedWorkPackageComponents = this.migrateWorkPackageComponentData(workPackageComponents, backupDataVersion, currentDataVersion);
    //         workPackageComponentsMapping = this.restoreWorkPackageComponentData(migratedWorkPackageComponents, workPackagesMapping, designComponentsMapping, designUpdateComponentsMapping, hasDesignComponents, hasDesignUpdateComponents);
    //
    //     } else {
    //         // No Work Package Components - could be OK
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "No Work Package Components found...");
    //     }
    //
    //     // Feature Background Steps ----------------------------------------------------------------------------------------------
    //     let backgroundStepsData = '';
    //     let backgroundSteps = [];
    //
    //     try{
    //         backgroundStepsData = fs.readFileSync(path + ExportFileName.FEATURE_BACKGROUND_STEPS);
    //         backgroundSteps = JSON.parse(backgroundStepsData);
    //     } catch (e) {
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Feature Background Steps export file: {}", e);
    //     }
    //
    //     if (backgroundSteps.length > 0) {
    //
    //         let migratedBackgroundSteps = this.migrateFeatureBackgroundStepData(backgroundSteps, backupDataVersion, currentDataVersion);
    //         this.restoreFeatureBackgroundStepData(migratedBackgroundSteps, designsMapping, designVersionsMapping, designUpdatesMapping);
    //
    //     } else {
    //         // No Feature Background Steps - could be OK
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "No Feature Background Steps found...");
    //     }
    //
    //     // Scenario Steps ----------------------------------------------------------------------------------------------
    //     let scenarioStepsData = '';
    //     let scenarioSteps = [];
    //
    //     try{
    //         scenarioStepsData = fs.readFileSync(path + ExportFileName.SCENARIO_STEPS);
    //         scenarioSteps = JSON.parse(scenarioStepsData);
    //     } catch (e) {
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "Can't open Scenario Steps export file: {}", e);
    //     }
    //
    //     if (scenarioSteps.length > 0) {
    //
    //         let migratedScenarioSteps = this.migrateScenarioStepData(scenarioSteps, backupDataVersion, currentDataVersion);
    //         this.restoreScenarioStepData(migratedScenarioSteps, designsMapping, designVersionsMapping, designUpdatesMapping);
    //
    //     } else {
    //         // No Scenario Steps - could be OK
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "No Scenario Steps found...");
    //     }
    //
    // };



}

export default new ImpExServices();
