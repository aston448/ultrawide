
import { UserContext }       from '../../collections/context/user_context.js';

class UserContextDataClass {

    // INSERT ==========================================================================================================

    insertNewUserContext(context){

        return UserContext.insert(
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

    // SELECT ==========================================================================================================

    getUserContext(userId){

        return UserContext.findOne({userId: userId});
    }

    getAllUserContextsForDesign(designId){

        return UserContext.find({designId: designId}).fetch();
    }

    getAllUserContextsForComponent(componentId){

        return UserContext.find({designComponentId: componentId}).fetch();
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

    clearComponentContext(userId){

        return UserContext.update(
            {userId: userId},
            {
                $set:{
                    designComponentId:              'NONE',
                    designComponentType:            'NONE',
                    featureReferenceId:             'NONE',
                    featureAspectReferenceId:       'NONE',
                    scenarioReferenceId:            'NONE',
                    scenarioStepId:                 'NONE',
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeUserContext(userId){

        return UserContext.remove({userId: userId});
    }
}

export const UserContextData = new UserContextDataClass();