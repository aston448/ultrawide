
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import TestFixtures from './test_fixtures.js';

class UserContextVerifications{

    // Positive Checks -------------------------------------------------------------------------------------------------
    userContextForRole_DesignIs(userRole, designName){

        server.call('verifyUserContext.designIs', designName, TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );

    };

    // Negative Checks -------------------------------------------------------------------------------------------------

    userContextDesignNotSetForRole(userRole){

        server.call('verifyUserContext.designIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextDesignVersionNotSetForRole(userRole){

        server.call('verifyUserContext.designVersionIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextDesignUpdateNotSetForRole(userRole){

        server.call('verifyUserContext.designUpdateIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextWorkPackageNotSetForRole(userRole){

        server.call('verifyUserContext.workPackageIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextDesignComponentNotSetForRole(userRole){

        server.call('verifyUserContext.designComponentIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextDesignComponentTypeNotSetForRole(userRole){

        server.call('verifyUserContext.designComponentTypeIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextFeatureReferenceNotSetForRole(userRole){

        server.call('verifyUserContext.featureReferenceIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextFeatureAspectReferenceNotSetForRole(userRole){

        server.call('verifyUserContext.featureAspectReferenceIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextScenarioReferenceNotSetForRole(userRole){

        server.call('verifyUserContext.scenarioReferenceIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };

    userContextScenarioStepNotSetForRole(userRole){

        server.call('verifyUserContext.scenarioStepIsNone', TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );
    };
}

export default new UserContextVerifications();
