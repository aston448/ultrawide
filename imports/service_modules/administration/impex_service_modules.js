
// External
import fs from 'fs';

// Ultrawide Services
import { UltrawideDirectory, WorkPackageType, LogLevel } from '../../constants/constants.js';
import { getIdFromMap, log }            from '../../common/utils.js';

import { DesignServices }                   from '../../servicers/design/design_services.js';
import { DomainDictionaryServices }         from '../../servicers/design/domain_dictionary_services.js';
import { DesignComponentModules }           from '../../service_modules/design/design_component_service_modules.js';

// Data Access
import { AppGlobalData }                    from '../../data/app/app_global_db.js';
import { UserContextData }                  from '../../data/context/user_context_db.js';
import { UserRoleData }                     from '../../data/users/user_role_db.js';
import { UserSettingsData }                  from '../../data/configure/user_setting_db.js';
import { DesignData }                       from '../../data/design/design_db.js';
import { DesignVersionData }                from '../../data/design/design_version_db.js';
import { DesignUpdateData }                 from '../../data/design_update/design_update_db.js';
import { WorkPackageData }                  from '../../data/work/work_package_db.js';
import { WorkPackageComponentData }        from '../../data/work/work_package_component_db.js';
import { DesignComponentData }              from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }        from '../../data/design_update/design_update_component_db.js';
import { DesignBackupData }                 from '../../data/backups/design_backup_db.js';
import { UserTestTypeLocationData }         from '../../data/configure/user_test_type_location_db.js';
import { TestOutputLocationData }           from '../../data/configure/test_output_location_db.js';
import { TestOutputLocationFileData }       from '../../data/configure/test_output_location_file_db.js';
import { DefaultFeatureAspectData }         from '../../data/design/default_feature_aspect_db.js';

//======================================================================================================================
//
// Server Modules for Import Export.
//
// Methods called from within main API methods
//
//======================================================================================================================

class ImpexModulesClass{

    markAllBackupsAsUnconfirmed(){

        // Set all to no existing - we are about to confirm if files do actually exist
        const updated = DesignBackupData.markAllAsNoFile();

        console.log(updated + " backup file records set to non-existent");
    }

    addConfirmBackupFile(fileName, filePath){

        const existingFile = DesignBackupData.getBackupByFileName(fileName);

        if(existingFile){

            console.log("Found existing backup file: " + fileName);
            // Confirm as existing
            DesignBackupData.setFileExists(existingFile._id, true);

        } else {

            // A new file we don't know about
            const metadata = this.getFileMetadata(filePath, fileName);

            console.log("Adding new backup file: " + fileName);

            DesignBackupData.insertNewBackup(metadata, fileName);
        }
    }

    removeNonExistingBackups(){

        DesignBackupData.removeAllNonExistingBackups();
    }


    getFileMetadata(filePath, fileName){

        try {
            const fileContents = fs.readFileSync(filePath + fileName);
            const fileData = JSON.parse(fileContents);

            return fileData.metadata;

        } catch (e){
            log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Backup file: {}  Error: {}", fileName, e);
        }
    }

    getBackupLocation(){

        const baseDir = this.getDataDirectory();

        let backupLocation = baseDir + UltrawideDirectory.BACKUP_DIR;

        if(!backupLocation.endsWith('/')){
            backupLocation = backupLocation + '/';
        }

        return backupLocation;
    }

    getCurrentDataVersion(){

        const appData = AppGlobalData.getDataByVersionKey('CURRENT_VERSION');

        if(appData){
            return appData.dataVersion;
        } else {
            throw new Meteor.Error('NO_GLOBAL_DATA', 'Cannot find Ultrawide global data');
        }

    }

    getDataDirectory(){

        const appData = AppGlobalData.getDataByVersionKey('CURRENT_VERSION');

        if(appData){

            return appData.dataStore;

        } else {
            throw new Meteor.Error('NO_GLOBAL_DATA', 'Cannot find Ultrawide global data');
        }
    }

    readBackupFile(backupFileName){

        const backupLocation = this.getBackupLocation();

        if(backupLocation){

            let backupData = null;

            try {
                const backupContents = fs.readFileSync(backupLocation + backupFileName);
                backupData = JSON.parse(backupContents);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Can't open Backup file: {}  Error: {}", backupLocation + backupFileName, e);
            }

            return backupData;

        } else {

            return null;
        }
    }

    // Data Restore Functions ------------------------------------------------------------------------------------------

    restoreDesignUsers(userData, backupDataVersion, currentDataVersion){

        let usersMapping = [];

        // Migrate to latest data version if needed
        const migratedUserData = this.migrateUserData(userData, backupDataVersion, currentDataVersion);

        migratedUserData.forEach((user) => {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Processing User : {}", user.displayName);

            // Ignore the admin user as it must already exist at this stage
            if(user.userName !== 'admin') {

                // See if user exists
                const existingUser = UserRoleData.getRoleByUserName(user.userName);

                if(existingUser){

                    // Don't need to create but map backup userId to actual so backup user-data can be corrected
                    usersMapping.push({oldId: user.userId, newId: existingUser.userId});

                    // But do need to reset or default the user context as ids may be out of date
                    const userContext = UserContextData.getUserContext(existingUser.userId);

                    if(userContext){
                        UserContextData.clearUserContext(existingUser.userId);
                    } else {
                        UserContextData.insertEmptyUserContext(existingUser.userId);
                    }

                } else {

                    let newUserId = '';

                    // This user does not seem to exist so need to create it
                    let password = user.password;

                    if (!(password)) {
                        password = 'password';
                    }

                    // Create a new Meteor account if not existing
                    const meteorUser = Accounts.findUserByUsername(user.userName);

                    if(!meteorUser) {
                        newUserId = Accounts.createUser(
                            {
                                username: user.userName,
                                password: password
                            }
                        );
                    } else {
                        newUserId = meteorUser._id;
                    }

                    // And add to the DB
                    UserRoleData.insertNewUserRole(newUserId, user);

                    // Add to mapping
                    usersMapping.push({oldId: user.userId, newId: newUserId});

                    // And create a default new User Context
                    UserContextData.insertEmptyUserContext(newUserId);
                }
            }
        });

        // Return the new user mappings
        return usersMapping;
    }

    restoreTestOutputLocationData(testOutputLocationData, backupDataVersion, currentDataVersion, userMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Locations...");

        const newTestOutputLocationData = this.migrateTestOutputLocationData(testOutputLocationData, backupDataVersion, currentDataVersion);

        let locationsMapping = [];

        newTestOutputLocationData.forEach((location) => {

            let locationId = 'NONE';

            const existingLocation = TestOutputLocationData.getOutputLocationByName(location.locationName);

            if(existingLocation){

                log((msg) => console.log(msg), LogLevel.DEBUG, "Merging Test Output Location: {}", location.locationName);

                // Just get the ID for mapping.  We don't revert this data to the backup version
                locationId = existingLocation._id;

            } else {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location: {}", location.locationName);

                const userId = getIdFromMap(userMapping, location.userId);

                locationId = TestOutputLocationData.importLocation(location, userId);
            }

            locationsMapping.push({oldId: location._id, newId: locationId});

        });

        return locationsMapping;
    };

    restoreTestOutputLocationFileData(testOutputLocationFileData, backupDataVersion, currentDataVersion, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Location Files...");

        const newTestOutputLocationFileData = this.migrateTestOutputLocationFileData(testOutputLocationFileData, backupDataVersion, currentDataVersion);

        newTestOutputLocationFileData.forEach((locationFile) => {

            const locationId = getIdFromMap(locationsMapping, locationFile.locationId);

            const existingLocationFile = TestOutputLocationFileData.getLocationFileByAlias(locationFile.locationId, locationFile.fileAlias);

            // Add the location file if not already existing
            if(!existingLocationFile) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location File: {}", locationFile.fileAlias);

                let locationFileId = TestOutputLocationFileData.importLocationFile(locationFile, locationId);
            }

        });

    };

    restoreUserTestTypeLocationsData(testTypeLocationData, backupDataVersion, currentDataVersion, userMapping, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring User Test Output Location Settings...");

        const newTestOutputLocationData = this.migrateUserTestTypeLocationData(testTypeLocationData, backupDataVersion, currentDataVersion);

        newTestOutputLocationData.forEach((userLocation) => {

            const locationId = getIdFromMap(locationsMapping, userLocation.locationId);
            const userId = getIdFromMap(userMapping, userLocation.userId);

            const existingUserLocation = UserTestTypeLocationData.getUserLocationById(userId, locationId);

            // Add the user location config if not already existing
            if(!existingUserLocation) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding User Test Location: {}", userLocation.locationName);

                UserTestTypeLocationData.importUserConfiguration(userLocation, locationId, userId);
            }
        });
    }

    restoreUserSettingsData(userSettingsData, backupDataVersion, currentDataVersion, userMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring User Settings...");

        const newUserSettingsData = this.migrateUserSettingsData(userSettingsData, backupDataVersion, currentDataVersion);

        newUserSettingsData.forEach((userSetting) => {

            const userId = getIdFromMap(userMapping, userSetting.userId);

            const existingUserSetting = UserSettingsData.getUserSettingByName(userId, userSetting.settingName);

            if(!existingUserSetting) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding User Setting: {}", userSetting.settingName);

                UserSettingsData.importUserSetting(userSetting, userId);
            }
        });
    }

    restoreDesignData(designData, backupDataVersion, currentDataVersion){

        let designsMapping = [];

        const newDesignData = this.migrateDesignData(designData, backupDataVersion, currentDataVersion);

        newDesignData.forEach((design) => {

            log((msg) => console.log(msg), LogLevel.INFO, "Adding Design: {}", design.designName);

            let designId = DesignData.importDesign(design);

            if (designId) {
                // Store the new Design ID
                designsMapping.push({oldId: design._id, newId: designId});
            }
        });

        return designsMapping;

    };

    restoreDefaultFeatureAspects(defaultFeatureAspectData, backupDataVersion, currentDataVersion, designsMapping){

        // There is only ever 1 design in backup so we know the new ID will be first in the mapping list.
        const newDefaultFeatureAspectData = this.migrateDefaultFeatureAspectData(defaultFeatureAspectData, designsMapping[0].oldId, backupDataVersion, currentDataVersion);

        newDefaultFeatureAspectData.forEach((defaultFeatureAspect) => {

            let designId = getIdFromMap(designsMapping, defaultFeatureAspect.designId);

            if (designId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Default Feature Aspect: {} to Design {}", defaultFeatureAspect.defaultAspectName, designId);

                DefaultFeatureAspectData.insertDefaultAspect(
                    designId,
                    defaultFeatureAspect
                );
            }
        });
    }

    restoreDesignVersionData(designVersionData, backupDataVersion, currentDataVersion, designsMapping){

        let designVersionsMapping = [];

        const newDesignVersionData = this.migrateDesignVersionData(designVersionData, backupDataVersion, currentDataVersion);

        newDesignVersionData.forEach((designVersion) => {

            let designId = getIdFromMap(designsMapping, designVersion.designId);

            if (designId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Design Version: {} to Design {}", designVersion.designVersionName, designId);

                let designVersionId = DesignVersionData.importDesignVersion(
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

    restoreDesignUpdateData(designUpdateData, backupDataVersion, currentDataVersion, designVersionsMapping){

        let designUpdatesMapping = [];

        const newDesignUpdateData = this.migrateDesignUpdateData(designUpdateData, backupDataVersion, currentDataVersion);

        newDesignUpdateData.forEach((designUpdate) => {

            let designVersionId = getIdFromMap(designVersionsMapping, designUpdate.designVersionId);

            if (designVersionId) {

                log((msg) => console.log(msg), LogLevel.INFO, "Adding Design Update: {} to Design Version {}", designUpdate.updateName, designVersionId);

                let designUpdateId = DesignUpdateData.importDesignUpdate(
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


    restoreWorkPackageData(workPackageData, backupDataVersion, currentDataVersion, designVersionsMapping, designUpdatesMapping, userMapping, hasDesignUpdates){

        let workPackagesMapping = [];

        const newWorkPackageData = this.migrateWorkPackageData(workPackageData, backupDataVersion, currentDataVersion);

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

                    let workPackageId = WorkPackageData.importWorkPackage(
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

    restoreDomainDictionaryData(dictionaryData, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Domain Dictionary...");

        const newDictionaryData = this.migrateDomainDictionaryData(dictionaryData, backupDataVersion, currentDataVersion);

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

    restoreDesignVersionComponentData(designComponentData, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping, workPackagesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Version Components...");

        let designComponentsMapping = [];
        let componentCount = 0;

        const newDesignComponentData = this.migrateDesignComponentData(designComponentData, backupDataVersion, currentDataVersion);

        let designComponentBatch = [];

        newDesignComponentData.forEach((component) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Design Component {} - {}", component.componentType, component.componentNameNew);

            let designId = getIdFromMap(designsMapping, component.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);
            let workPackageId = getIdFromMap(workPackagesMapping, component.workPackageId);

            designComponentBatch.push(
                {
                    // Identity
                    componentReferenceId:           component.componentReferenceId,
                    designId:                       designId,                               // Will be a new id for the restored data
                    designVersionId:                designVersionId,                        // Ditto
                    componentType:                  component.componentType,
                    componentLevel:                 component.componentLevel,

                    componentParentReferenceIdOld:  component.componentParentReferenceIdOld,
                    componentParentReferenceIdNew:  component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                    componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                    componentIndexOld:              component.componentIndexNew,
                    componentIndexNew:              component.componentIndexNew,

                    // Data
                    componentNameOld:               component.componentNameOld,
                    componentNameNew:               component.componentNameNew,
                    componentNameRawOld:            component.componentNameRawOld,
                    componentNameRawNew:            component.componentNameRawNew,
                    componentNarrativeOld:          component.componentNarrativeOld,
                    componentNarrativeNew:          component.componentNarrativeNew,
                    componentNarrativeRawOld:       component.componentNarrativeRawOld,
                    componentNarrativeRawNew:       component.componentNarrativeRawNew,
                    componentTextRawOld:            component.componentTextRawOld,
                    componentTextRawNew:            component.componentTextRawNew,

                    // State (shared and persistent only)
                    isNew:                          component.isNew,
                    workPackageId:                  workPackageId,
                    updateMergeStatus:              component.updateMergeStatus,
                    isDevUpdated:                   component.isDevUpdated,
                    isDevAdded:                     component.isDevAdded,

                    isRemovable:                    component.isRemovable,

                    // Test Expectation
                    requiresAcceptanceTest:         component.requiresAcceptanceTest ? component.requiresAcceptanceTest : false,
                    requiresIntegrationTest:        component.requiresIntegrationTest ? component.requiresIntegrationTest : false,
                    requiresUnitTest:               component.requiresUnitTest ? component.requiresUnitTest : false
                }
            );

            componentCount++;
        });

        // Bulk insert the lot for efficiency
        if(designComponentBatch.length > 0) {
            DesignComponentData.bulkInsert(designComponentBatch);
        }

        // Make sure any Designs affected are no longer removable
        designsMapping.forEach((designMap) => {
            DesignServices.setRemovable(designMap.newId);
        });

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Design Version Components", componentCount);

        return designComponentsMapping;
    };

    restoreDesignUpdateComponentData(designUpdateComponentData, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Update Components...");

        let designUpdateComponentsMapping = [];
        let componentCount = 0;

        const newDesignUpdateComponentData = this.migrateDesignUpdateComponentData(designUpdateComponentData, backupDataVersion, currentDataVersion);

        if(designsMapping && designVersionsMapping && designUpdatesMapping && workPackagesMapping) {

            let designUpdateComponentBatch = [];

            newDesignUpdateComponentData.forEach((component) => {
                log((msg) => console.log(msg), LogLevel.TRACE, "Adding Design Update Component {} - {}", component.componentType, component.componentNameNew);

                let designId = getIdFromMap(designsMapping, component.designId);
                let designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);
                let designUpdateId = getIdFromMap(designUpdatesMapping, component.designUpdateId);
                let workPackageId = getIdFromMap(workPackagesMapping, component.workPackageId);

                designUpdateComponentBatch.push(
                    {
                        // Identity
                        componentReferenceId:           component.componentReferenceId,
                        designId:                       designId,                                           // Restored Design Id
                        designVersionId:                designVersionId,                                    // Restored Design Version Id
                        designUpdateId:                 designUpdateId,                                     // Restored Design Update Id
                        componentType:                  component.componentType,
                        componentLevel:                 component.componentLevel,
                        componentParentReferenceIdOld:  component.componentParentReferenceIdOld,
                        componentParentReferenceIdNew:  component.componentParentReferenceIdNew,
                        componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                        componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                        componentIndexOld:              component.componentIndexOld,
                        componentIndexNew:              component.componentIndexNew,

                        // Data
                        componentNameOld:               component.componentNameOld,
                        componentNameNew:               component.componentNameNew,
                        componentNameRawOld:            component.componentNameRawOld,
                        componentNameRawNew:            component.componentNameRawNew,
                        componentNarrativeOld:          component.componentNarrativeOld,
                        componentNarrativeNew:          component.componentNarrativeNew,
                        componentNarrativeRawOld:       component.componentNarrativeRawOld,
                        componentNarrativeRawNew:       component.componentNarrativeRawNew,
                        componentTextRawOld:            component.componentTextRawOld,
                        componentTextRawNew:            component.componentTextRawNew,

                        // Update State
                        isNew:                          component.isNew,
                        isDefault:                      component.isDefault ? component.isDefault : false,
                        isChanged:                      component.isChanged,
                        isNarrativeChanged:             component.isNarrativeChanged ? component.isNarrativeChanged : false,
                        isTextChanged:                  component.isTextChanged,
                        isMoved:                        component.isMoved,
                        isRemoved:                      component.isRemoved,
                        isRemovedElsewhere:             component.isRemovedElsewhere,
                        isDevUpdated:                   component.isDevUpdated,
                        isDevAdded:                     component.isDevAdded,
                        workPackageId:                  workPackageId,

                        // Editing state (shared and persistent)
                        isRemovable:                    component.isRemovable,
                        isScopable:                     component.isScopable,
                        scopeType:                      component.scopeType,
                        lockingUser:                    component.lockingUser,

                        // Test Expectation
                        requiresAcceptanceTest:         component.requiresAcceptanceTest ? component.requiresAcceptanceTest : false,
                        requiresIntegrationTest:        component.requiresIntegrationTest ? component.requiresIntegrationTest : false,
                        requiresUnitTest:               component.requiresUnitTest ? component.requiresUnitTest : false
                    }
                );

                componentCount++;

            });

            if(designUpdateComponentBatch.length > 0) {
                DesignUpdateComponentData.bulkInsert(designUpdateComponentBatch);
            }

            // Make sure Design is no longer removable
            designsMapping.forEach((designMap) => {
                DesignServices.setRemovable(designMap.newId);
            });

        } else {
            log((msg) => console.log(msg), LogLevel.ERROR, "Mapping not available to restore Design Update Components: DE: {} DV: {} DU: {} WP: {}", designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping);
        }

        log((msg) => console.log(msg), LogLevel.INFO, "Added {} Design Update Components", componentCount);

        return designUpdateComponentsMapping;
    };

    restoreWorkPackageComponentData(workPackageComponentData, backupDataVersion, currentDataVersion, workPackagesMapping, designVersionComponentsMapping, designUpdateComponentsMapping, hasDesignVersionComponents, hasDesignUpdateComponents){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Work Package Components...");

        let workPackageComponentsMapping = [];
        let wpDesignComponentId = null;
        let workPackage = null;
        let componentCount = 0;

        const newWorkPackageComponentData = this.migrateWorkPackageComponentData(workPackageComponentData, backupDataVersion, currentDataVersion);

        newWorkPackageComponentData.forEach((wpComponent) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Work Package Component {} - {}", wpComponent.componentType, wpComponent._id);
            let skip = false;

            let workPackageId = getIdFromMap(workPackagesMapping, wpComponent.workPackageId);

            // WP Component could be a Design Component or a Design Update Component
            workPackage = WorkPackageData.getWorkPackageById(workPackageId);

            let designVersionId = workPackage.designVersionId;

            if(!skip) {
                let workPackageComponentId = WorkPackageComponentData.importComponent(
                    workPackage.designVersionId,
                    workPackage.designUpdateId,
                    workPackageId,
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


    // Migration Functions ---------------------------------------------------------------------------------------------

    migrateUserData(userData, backupVersion, currentVersion){

        // Add to this function for each release as required
        let newUserData = userData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
                        // No changes
                        newUserData = userData;
                }
        }

        return newUserData;
    };

    migrateTestOutputLocationData(testOutputLocationData, backupVersion, currentVersion){

        // Add to this function for each release
        let newTestOutputLocationData = testOutputLocationData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
                        // Need to clear down the existing data
                        TestOutputLocationData.removeAllLocations();
                        TestOutputLocationFileData.removeAllFiles();
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
                    case 1:
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
                    case 1:
                        // No changes
                        newUserTestTypeLocationData = userTestTypeLocationData;
                }
        }

        return newUserTestTypeLocationData;
    };

    migrateUserSettingsData(userSettingsData, backupVersion, currentVersion){

        // Add to this function for each release as required
        let newUserSettingsData = userSettingsData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
                        // No changes
                        newUserSettingsData = userSettingsData;
                }
        }

        return newUserSettingsData;
    }

    migrateDesignData(designData, backupVersion, currentVersion){

        // Add to this function for each release
        let newDesignData = designData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
                        // No changes
                        newDesignData = designData;
                }
        }

        return newDesignData;
    };

    migrateDefaultFeatureAspectData(defaultFeatureAspectData, designId, backupVersion, currentVersion){


        // Add to this function for each release
        let newDefaultFeatureAspectData = defaultFeatureAspectData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:

                        // Create Ultrawide standard default data if needed...
                        if(!newDefaultFeatureAspectData){
                            newDefaultFeatureAspectData = [];
                        }

                        if(newDefaultFeatureAspectData.length === 0){

                            // Create 8 default aspects
                            const aspect1 = {
                                designId:               designId,
                                defaultAspectName:      'Interface',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Interface'),
                                defaultAspectIncluded:  true,
                                defaultAspectIndex:     1
                            };

                            const aspect2 = {
                                designId:               designId,
                                defaultAspectName:      'Actions',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Actions'),
                                defaultAspectIncluded:  true,
                                defaultAspectIndex:     2
                            };

                            const aspect3 = {
                                designId:               designId,
                                defaultAspectName:      'Conditions',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Conditions'),
                                defaultAspectIncluded:  true,
                                defaultAspectIndex:     3
                            };

                            const aspect4 = {
                                designId:               designId,
                                defaultAspectName:      'Consequences',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Consequences'),
                                defaultAspectIncluded:  true,
                                defaultAspectIndex:     4
                            };

                            const aspect5 = {
                                designId:               designId,
                                defaultAspectName:      'Unused 1',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Unused 1'),
                                defaultAspectIncluded:  false,
                                defaultAspectIndex:     5
                            };

                            const aspect6 = {
                                designId:               designId,
                                defaultAspectName:      'Unused 2',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Unused 2'),
                                defaultAspectIncluded:  false,
                                defaultAspectIndex:     6
                            };

                            const aspect7 = {
                                designId:               designId,
                                defaultAspectName:      'Unused 3',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Unused 3'),
                                defaultAspectIncluded:  false,
                                defaultAspectIndex:     7
                            };

                            const aspect8 = {
                                designId:               designId,
                                defaultAspectName:      'Unused 4',
                                defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Unused 4'),
                                defaultAspectIncluded:  false,
                                defaultAspectIndex:     8
                            };

                            newDefaultFeatureAspectData.push(aspect1);
                            newDefaultFeatureAspectData.push(aspect2);
                            newDefaultFeatureAspectData.push(aspect3);
                            newDefaultFeatureAspectData.push(aspect4);
                            newDefaultFeatureAspectData.push(aspect5);
                            newDefaultFeatureAspectData.push(aspect6);
                            newDefaultFeatureAspectData.push(aspect7);
                            newDefaultFeatureAspectData.push(aspect8);

                        } else {
                            newDefaultFeatureAspectData = defaultFeatureAspectData;
                        }
                }
        }

        return newDefaultFeatureAspectData;
    }

    migrateDesignVersionData(designVersionData, backupVersion, currentVersion){

        // Add to this function for each release
        let newDesignVersionData = designVersionData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
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
                    case 1:
                        // No changes
                        newDesignUpdateData = designUpdateData
                }
        }

        return newDesignUpdateData;
    };

    migrateWorkPackageData(workPackageData, backupVersion, currentVersion){

        // Add to this function for each release
        let newWorkPackageData = workPackageData;

        switch(backupVersion){
            case 1:
                switch(currentVersion){
                    case 1:
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
                        // No changes
                        newDesignVersionComponentData = designComponentData;
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

}

export const ImpexModules = new ImpexModulesClass();

