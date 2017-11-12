
import {UserDesignVersionMashScenarios} from '../../collections/mash/user_dv_mash_scenarios.js';

class UserDvMashScenarioData {

    // INSERT ==========================================================================================================

    bulkInsertData(scenarioBatchData){

        UserDesignVersionMashScenarios.batchInsert(scenarioBatchData);
    }
    // SELECT ==========================================================================================================

    getUserDesignVersionData(userContext){

        return UserDesignVersionMashScenarios.find({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId
        }).fetch();
    }

    getScenario(userContext, scenarioRefId){

        return UserDesignVersionMashScenarios.findOne({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            designScenarioReferenceId:  scenarioRefId
        });
    }

    getFeatureScenarios(userId, designVersionId, featureRef){

        return UserDesignVersionMashScenarios.find({
            userId:                     userId,
            designVersionId:            designVersionId,
            designFeatureReferenceId:   featureRef,
        }).fetch();

    }

    getFeatureAspectScenarios(userId, designVersionId, featureAspectReferenceId){

        return UserDesignVersionMashScenarios.find(
            {
                userId:                         userId,
                designVersionId:                designVersionId,
                designFeatureAspectReferenceId: featureAspectReferenceId
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    }

    getScenarios(userId, designVersionId, featureAspectReferenceId, scenarioReferenceId){

        return UserDesignVersionMashScenarios.find(
            {
                userId:                         userId,
                designVersionId:                designVersionId,
                designFeatureAspectReferenceId: featureAspectReferenceId,
                designScenarioReferenceId:      scenarioReferenceId
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    }

    hasUserDvData(userContext){

        return UserDesignVersionMashScenarios.find({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId
        }). count() > 0;
    }

    // REMOVE ==========================================================================================================

    removeAllDvScenariosForUser(userId, designVersionId){

        return UserDesignVersionMashScenarios.remove({
            userId:             userId,
            designVersionId:    designVersionId
        });

    }
}

export default new UserDvMashScenarioData();