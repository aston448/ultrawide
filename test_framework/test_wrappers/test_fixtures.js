
import {RoleType, WorkPackageType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class TestFixturesClass {

    getUserForRole(role){

        // In this test framework there are 4 users set up each with a single role:
        // Gloria Slap - 'gloria' - Designer
        // Hugh Genjine - 'hugh' - Developer
        // Miles Behind - 'miles' - Manager
        // Wilma Cargo - 'wilma' - Guest Viewer

        switch(role){
            case RoleType.DESIGNER:
                return 'gloria';
            case RoleType.DEVELOPER:
                return 'hugh';
            case RoleType.MANAGER:
                return 'miles';
            case RoleType.GUEST_VIEWER:
                return 'wilma';
        }

        // Note we also have a second Developer, Davey Rocket
    };

    logTestSuite(suiteName){
        server.call('testFixtures.logTestSuite', suiteName);
    }

    logDebug(string, data){
        server.call('testFixtures.logDebug', string, data);
    }

    clearAllData(){
        server.call('testFixtures.clearAllData');
    };

    clearAllDesignData(){
        server.call('testFixtures.clearAllDesignData');
    }

    removeAllMeteorUsers(){
        server.call('testFixtures.removeMeteorUsers');
    }

    clearDesignUpdates(){
        server.call('testFixtures.clearDesignUpdates');
    }

    clearWorkPackages(){
        server.call('testFixtures.clearWorkPackages');
    }

    resetUserViewOptions(){
        server.call('testFixtures.resetUserViewOptions');
    }

    setDummyUserContextForDesigner(){
        server.call('testUserContext.setFullDummyEditContext', 'gloria');
    }

    setDummyUserContextForDeveloper(){
        server.call('testUserContext.setFullDummyEditContext', 'hugh');
    }

    setDummyUserContextForManager(){
        server.call('testUserContext.setFullDummyEditContext', 'miles');
    }

    addDesignWithDefaultData(expectation){
        // This creates a Design and populates the initial Design Version with a set of data - see AddBasicDesignData

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER, expectation);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1', expectation);
        server.call('testDesigns.selectDesign', 'Design1', 'gloria', expectation);
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', expectation);
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria', expectation);

        // Add Basic Data to the Design Version
        server.call('testDesignVersions.editDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria', expectation);
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1', expectation);
    }

    addBaseDesignWorkPackages(expectation){

        // Call this only after adding Default Data
        const workPackageType = WorkPackageType.WP_BASE;
        const userRole = RoleType.MANAGER;
        const userName = 'miles';

        // Add two WPS
        server.call('testWorkPackages.addNewWorkPackage', workPackageType, userRole, userName, expectation);
        server.call('testWorkPackages.selectWorkItem', DefaultItemNames.NEW_WORK_PACKAGE_NAME, RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles', expectation);
        server.call('testWorkPackages.publishSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);

        server.call('testWorkPackages.addNewWorkPackage', workPackageType, userRole, userName, expectation);
        server.call('testWorkPackages.selectWorkItem', DefaultItemNames.NEW_WORK_PACKAGE_NAME, RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage2', RoleType.MANAGER, 'miles', expectation);
        server.call('testWorkPackages.publishSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);

    }

    writeIntegrationTestResults_ChimpMocha(locationName, results){

        server.call('testFixtures.writeIntegrationTestResults_ChimpMocha', locationName, results);
    }

    writeUnitTestResults_MeteorMocha(locationName, results){

        server.call('testFixtures.writeUnitTestResults_MeteorMocha', locationName, results);
    }

    clearTestResultsFiles(locationName){

        server.call('testFixtures.clearTestFiles', locationName);
    }

    clearBackupFiles(){

        server.call('testFixtures.clearBackupFiles');
    }

    clearTestLocations(){

        server.call('testFixtures.clearTestLocations');
    }

}

export const TestFixtures =  new TestFixturesClass();
