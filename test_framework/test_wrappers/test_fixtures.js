
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class TestFixtures{

    getUserForRole(role){

        // In this test framework there are 3 users set up each with a single role:
        // Gloria Slap - 'gloria' - Designer
        // Hugh Gengine - 'hugh' - Developer
        // Miles Behind - 'miles' - Manager

        switch(role){
            case RoleType.DESIGNER:
                return 'gloria';
            case RoleType.DEVELOPER:
                return 'hugh';
            case RoleType.MANAGER:
                return 'miles';
        }

        // Note we also have a second Developer, Davey Rocket
    };

    logTestSuite(suiteName){
        server.call('testFixtures.logTestSuite', suiteName);
    }

    clearAllData(){
        server.call('testFixtures.clearAllData');
    };

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

export default new TestFixtures();
