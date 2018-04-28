
import { TestFixtures } from './test_fixtures.js';

class UserContextVerificationsClass{

    // Positive Checks -------------------------------------------------------------------------------------------------
    userContextForRole_DesignIs(userRole, designName){

        server.call('verifyUserContext.designIs', designName, TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );

    };

    userContextForRole_DesignVersionIs(userRole, designVersionName){

        server.call('verifyUserContext.designVersionIs', designVersionName, TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );

    };

    userContextForRole_DesignUpdateIs(userRole, designUpdateName){

        server.call('verifyUserContext.designUpdateIs', designUpdateName, TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );

    };

    userContextForRole_WorkPackageIs(userRole, workPackageName){

        server.call('verifyUserContext.workPackageIs', workPackageName, TestFixtures.getUserForRole(userRole),
            (function(error, result){
                return(error === null);
            })
        );

    };

    userContextForRole_DesignComponentIs(userRole, componentType,  parentName, designComponentName){

        server.call('verifyUserContext.designComponentIs', componentType, parentName, designComponentName, TestFixtures.getUserForRole(userRole),
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

export const UserContextVerifications = new UserContextVerificationsClass();
