
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

    setDummyUserContextForDesigner(){
        server.call('testUserContext.setFullDummyEditContext', 'gloria');
    }

    setDummyUserContextForDeveloper(){
        server.call('testUserContext.setFullDummyEditContext', 'hugh');
    }

    setDummyUserContextForManager(){
        server.call('testUserContext.setFullDummyEditContext', 'miles');
    }

}

export default new TestFixtures();
