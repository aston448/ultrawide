
// External
import fs from 'fs';

// Ultrawide Collections
import { AppGlobalData }                from '../../collections/app/app_global_data.js';
import { DesignBackups }                from '../../collections/backup/design_backups.js';
import { UserRoles }                    from '../../collections/users/user_roles.js';
import { UserCurrentEditContext }       from '../../collections/context/user_current_edit_context.js';
import { UserTestTypeLocations }        from '../../collections/configure/user_test_type_locations.js';
import { UserSettings }                 from '../../collections/configure/user_settings.js';
import { TestOutputLocations }          from '../../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles }      from '../../collections/configure/test_output_location_files.js';
import { Designs }                      from '../../collections/design/designs.js';
import { DesignVersions }               from '../../collections/design/design_versions.js';
import { DesignUpdates }                from '../../collections/design_update/design_updates.js';
import { UserDesignUpdateSummary }      from '../../collections/summary/user_design_update_summary.js';
import { WorkPackages }                 from '../../collections/work/work_packages.js';
import { DomainDictionary }             from '../../collections/design/domain_dictionary.js'
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
import { ScenarioSteps }                from '../../collections/design/scenario_steps.js';
import { FeatureBackgroundSteps }       from '../../collections/design/feature_background_steps.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { UltrawideDirectory, WorkPackageType, LogLevel } from '../../constants/constants.js';
import { getIdFromMap, padDigits, log }              from '../../common/utils.js';

import DesignComponentServices          from '../../servicers/design/design_component_services.js';
import TestOutputLocationServices       from '../../servicers/configure/test_output_location_services.js';
import DesignServices                   from '../../servicers/design/design_services.js';
import DesignVersionServices            from '../../servicers/design/design_version_services.js';
import DesignUpdateServices             from '../../servicers/design_update/design_update_services.js';
import WorkPackageServices              from '../../servicers/work/work_package_services.js';
import DomainDictionaryServices         from '../../servicers/design/domain_dictionary_services.js';
import DesignUpdateComponentServices    from '../../servicers/design_update/design_update_component_services.js';
import UserSettingServices              from '../../servicers/configure/user_setting_services.js';

//======================================================================================================================
//
// Server Modules for Import Export.
//
// Methods called from within main API methods
//
//======================================================================================================================

class ImpexModules{

    markAllBackupsAsUnconfirmed(){

        // Set all to no existing - we are about to confirm if files do actually exist
        const updated = DesignBackups.update({}, {$set: {fileExists: false}}, {multi: true});

        console.log(updated + " backup file records set to non-existent");
    }

    addConfirmBackupFile(fileName, filePath){

        const existingFile = DesignBackups.findOne({backupFileName: fileName});

        if(existingFile){

            console.log("Found existing backup file: " + fileName);
            // Confirm as existing
            DesignBackups.update(
                {_id: existingFile._id},
                {
                    $set:{
                        fileExists: true
                    }
                }
            );

        } else {

            // A new file we don't know about
            const metadata = this.getFileMetadata(filePath, fileName);

            console.log("Adding new backup file: " + fileName);

            DesignBackups.insert({
                backupName:             metadata.backupName,
                backupFileName:         fileName,
                backupDesignName:       metadata.designName,
                backupDate:             metadata.backupDate,
                backupDataVersion:      metadata.backupDataVersion,
                fileExists:             true
            })
        }
    }

    removeNonExistingBackups(){

        DesignBackups.remove({
            fileExists: false
        });
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

        const appData = AppGlobalData.findOne({
            versionKey: 'CURRENT_VERSION'
        });

        if(appData){
            return appData.dataVersion;
        } else {
            throw new Meteor.Error('NO_GLOBAL_DATA', 'Cannot find Ultrawide global data');
        }

    }

    getDataDirectory(){

        const appData = AppGlobalData.findOne({
            versionKey: 'CURRENT_VERSION'
        });

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
                const existingUser = UserRoles.findOne({userName: user.userName});

                if(existingUser){

                    // Don't need to create but map backup userId to actual so backup user-data can be corrected
                    usersMapping.push({oldId: user.userId, newId: existingUser.userId});

                    // But do need to reset the user context as ids may be out of date
                    UserCurrentEditContext.update(
                        {userId: existingUser.userId},
                        {
                            $set:{
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
                            }
                        }
                    );

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
                    UserRoles.insert({
                        userId: newUserId,
                        userName: user.userName,
                        password: password,
                        displayName: user.displayName,
                        isDesigner: user.isDesigner,
                        isDeveloper: user.isDeveloper,
                        isManager: user.isManager,
                        isAdmin: false,
                        isActive: user.isActive
                    });

                    // Add to mapping
                    usersMapping.push({oldId: user.userId, newId: newUserId});

                    // And create a default new User Context
                    UserCurrentEditContext.insert({
                        userId: newUserId,
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

        // Return the new user mappings
        return usersMapping;
    }

    restoreTestOutputLocationData(testOutputLocationData, backupDataVersion, currentDataVersion, userMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Locations...");

        const newTestOutputLocationData = this.migrateTestOutputLocationData(testOutputLocationData, backupDataVersion, currentDataVersion);

        let locationsMapping = [];

        newTestOutputLocationData.forEach((location) => {

            let locationId = 'NONE';

            const existingLocation = TestOutputLocations.findOne({
                locationName: location.locationName
            });

            if(existingLocation){

                log((msg) => console.log(msg), LogLevel.DEBUG, "Merging Test Output Location: {}", location.locationName);

                // Just get the ID for mapping.  We don't revert this data to the backup version
                locationId = existingLocation._id;

            } else {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location: {}", location.locationName);

                const userId = getIdFromMap(userMapping, location.userId);

                locationId = TestOutputLocationServices.importLocation(location, userId);
            }

            locationsMapping.push({oldId: location._id, newId: locationId});

        });

        return locationsMapping;
    };

    restoreTestOutputLocationFileData(testOutputLocationFileData, backupDataVersion, currentDataVersion, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Test Output Location Files...");

        const newTestOutputLocationFileData = this.migrateTestOutputLocationData(testOutputLocationFileData, backupDataVersion, currentDataVersion);

        newTestOutputLocationFileData.forEach((locationFile) => {

            const locationId = getIdFromMap(locationsMapping, locationFile.locationId);

            const existingLocationFile = TestOutputLocationFiles.findOne({
                locationId: locationFile.locationId,
                fileAlias: locationFile.fileAlias
            });

            // Add the location file if not already existing
            if(!existingLocationFile) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Test Output Location File: {}", locationFile.fileAlias);

                let locationFileId = TestOutputLocationServices.importLocationFile(locationFile, locationId);
            }

        });

    };

    restoreUserTestTypeLocationsData(testOutputLocationData, backupDataVersion, currentDataVersion, userMapping, locationsMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring User Test Output Location Settings...");

        const newTestOutputLocationData = this.migrateUserTestTypeLocationData(testOutputLocationData, backupDataVersion, currentDataVersion);

        newTestOutputLocationData.forEach((userLocation) => {

            const locationId = getIdFromMap(locationsMapping, userLocation.locationId);
            const userId = getIdFromMap(userMapping, userLocation.userId);

            const existingUserLocation = UserTestTypeLocations.findOne({
                userId: userId,
                locationId: locationId,
            });

            // Add the user location config if not already existing
            if(!existingUserLocation) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding User Test Location: {}", userLocation.locationName);

                TestOutputLocationServices.importUserConfiguration(userLocation, locationId, userId);
            }
        });
    }

    restoreUserSettingsData(userSettingsData, backupDataVersion, currentDataVersion, userMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring User Settings...");

        const newUserSettingsData = this.migrateUserSettingsData(userSettingsData, backupDataVersion, currentDataVersion);

        newUserSettingsData.forEach((userSetting) => {

            const userId = getIdFromMap(userMapping, userSetting.userId);

            const existingUserSetting = UserSettings.findOne({
                userId: userId,
                settingName: userSetting.settingName
            });

            if(!existingUserSetting) {

                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding User Setting: {}", userSetting.settingName);

                UserSettingServices.importUserSetting(userSetting, userId);
            }
        });
    }

    restoreDesignData(designData, backupDataVersion, currentDataVersion){

        let designsMapping = [];

        const newDesignData = this.migrateDesignData(designData, backupDataVersion, currentDataVersion);

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

    restoreDesignVersionData(designVersionData, backupDataVersion, currentDataVersion, designsMapping){

        let designVersionsMapping = [];

        const newDesignVersionData = this.migrateDesignVersionData(designVersionData, backupDataVersion, currentDataVersion);

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

    restoreDesignUpdateData(designUpdateData, backupDataVersion, currentDataVersion, designVersionsMapping){

        let designUpdatesMapping = [];

        const newDesignUpdateData = this.migrateDesignUpdateData(designUpdateData, backupDataVersion, currentDataVersion);

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

        newDesignComponentData.forEach((component) => {
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Design Component {} - {}", component.componentType, component.componentNameNew);

            let designId = getIdFromMap(designsMapping, component.designId);
            let designVersionId = getIdFromMap(designVersionsMapping, component.designVersionId);
            let workPackageId = getIdFromMap(workPackagesMapping, component.workPackageId);

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

    restoreDesignUpdateComponentData(designUpdateComponentData, backupDataVersion, currentDataVersion, designsMapping, designVersionsMapping, designUpdatesMapping, workPackagesMapping){

        log((msg) => console.log(msg), LogLevel.INFO, "Restoring Design Update Components...");

        let designUpdateComponentsMapping = [];
        let componentCount = 0;

        const newDesignUpdateComponentData = this.migrateDesignUpdateComponentData(designUpdateComponentData, backupDataVersion, currentDataVersion);

        if(designsMapping && designVersionsMapping && designUpdatesMapping && workPackagesMapping) {

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
            workPackage = WorkPackages.findOne({_id: workPackageId});

            let designVersionId = workPackage.designVersionId;

            switch (workPackage.workPackageType) {
                case WorkPackageType.WP_BASE:
                    if(hasDesignVersionComponents) {
                        wpDesignComponentId = getIdFromMap(designVersionComponentsMapping, wpComponent.componentId);
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

export default new ImpexModules();

