
import { UserContext }       from '../../collections/context/user_context.js';

class UserContextData{

    // INSERT ==========================================================================================================

    insertNewUserContext(context){

        UserContext.insert(
            {
                userId:                         context.userId,
                designId:                       context.designId,
                designVersionId:                context.designVersionId,
                designUpdateId:                 context.designUpdateId,
                workPackageId:                  context.workPackageId,
                designComponentId:              context.designComponentId,
                designComponentType:            context.designComponentType,
                featureReferenceId:             context.featureReferenceId,
                scenarioReferenceId:            context.scenarioReferenceId,
                scenarioStepId:                 context.scenarioStepId
            }
        );
    }

    insertEmptyUserContext(userId){

        return UserContext.insert({
            userId: userId,
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

    // UPDATE ==========================================================================================================

    clearUserContext(userId){

        return UserContext.update(
            {userId: userId},
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
    }

    // REMOVE ==========================================================================================================

    removeUserContext(userId){

        return UserContext.remove({userId: userId});
    }
}

export default new UserContextData();