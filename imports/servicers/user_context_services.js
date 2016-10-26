/**
 * Created by aston on 19/09/2016.
 */


import {UserCurrentEditContext} from '../collections/context/user_current_edit_context.js'
import {UserCurrentDevContext} from '../collections/context/user_current_dev_context.js'
import {UserCurrentDevUpdates} from '../collections/design_update/user_current_dev_updates.js'

class UserContextServices{

    // Save
    saveUserContext(context){

        // Remove the current context
        UserCurrentEditContext.remove({userId: context.userId});

        // Add the new one
        UserCurrentEditContext.insert(
            {
                userId:                 context.userId,
                designId:               context.designId,
                designVersionId:        context.designVersionId,
                designUpdateId:         context.designUpdateId,
                workPackageId:          context.workPackageId,
                designComponentId:      context.designComponentId,
                designComponentType:    context.designComponentType,
                featureReferenceId:     context.featureReferenceId,
                scenarioReferenceId:    context.scenarioReferenceId,
                scenarioStepId:         context.scenarioStepId,
                featureFilesLocation:   context.featureFilesLocation,
            }
        )
    };

    saveUserDevContext(userId, designId, designVersionId, workPackageId, featureFilesLocation){

        // Remove the current context
        UserCurrentDevContext.remove({userId: userId});
        UserCurrentDevUpdates.remove({userId: userId});

        // Add the new one
        UserCurrentDevContext.insert(
            {
                userId:                 userId,
                designId:               designId,
                designVersionId:        designVersionId,
                workPackageId:          workPackageId,
                featureFilesLocation:   featureFilesLocation
            },
            (error, result) => {
                if(error){
                    console.log("Failed to set user dev context: " + error);
                } else {

                    console.log("Success setting dev context");

                }
            }
        );
    };


}

export default new UserContextServices();