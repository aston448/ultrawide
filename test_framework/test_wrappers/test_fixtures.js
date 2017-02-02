
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class TestFixtures{

    getUserForRole(role){

        // In this test framework there are 3 users set up each with a single role:
        // Gloria Slap - 'gloria' - Designer
        // Hugh Jengine - 'hugh' - Developer
        // Miles Behind - 'miles' - Manager

        switch(role){
            case RoleType.DESIGNER:
                return 'gloria';
            case RoleType.DEVELOPER:
                return 'hugh';
            case RoleType.MANAGER:
                return 'miles';
        }
    };

    clearAllData(){
        server.call('testFixtures.clearAllData');
    };

    clearDesgnUpdates(expectation){
        server.call('textFixtures.clearDesignUpdates');
    }

    setDummyUserContextForDesigner(expectation){
        server.call('testUserContext.setFullDummyEditContext', 'gloria', expectation);
    }

    setDummyUserContextForDeveloper(expectation){
        server.call('testUserContext.setFullDummyEditContext', 'hugh', expectation);
    }

    setDummyUserContextForManager(expectation){
        server.call('testUserContext.setFullDummyEditContext', 'miles', expectation);
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

}

export default new TestFixtures();
