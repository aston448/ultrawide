/**
 * Created by aston on 19/09/2016.
 */


import {UserCurrentEditContext} from '../collections/context/user_current_edit_context.js'
import {UserCurrentViewOptions} from '../collections/context/user_current_view_options.js'
import {UserCurrentDevUpdates} from '../collections/design_update/user_current_dev_updates.js'

class UserContextServices{

    // Save
    saveUserContext(context){

        // Remove the current context
        UserCurrentEditContext.remove({userId: context.userId});

        // Add the new one
        UserCurrentEditContext.insert(
            {
                userId:                     context.userId,
                designId:                   context.designId,
                designVersionId:            context.designVersionId,
                designUpdateId:             context.designUpdateId,
                workPackageId:              context.workPackageId,
                designComponentId:          context.designComponentId,
                designComponentType:        context.designComponentType,
                featureReferenceId:         context.featureReferenceId,
                scenarioReferenceId:        context.scenarioReferenceId,
                scenarioStepId:             context.scenarioStepId,
                featureFilesLocation:       context.featureFilesLocation,
                featureTestResultsLocation: context.featureTestResultsLocation,
                moduleTestResultsLocation:  context.moduleTestResultsLocation
            }
        )
    };

    saveUserViewOptions(userViewOptions){

        // Remove current options
        UserCurrentViewOptions.remove({userId: userViewOptions.userId});

        // And add new
        UserCurrentViewOptions.insert({
            userId:                     userViewOptions.userId,
            designDetailsVisible:       userViewOptions.designDetailsVisible,
            designAccTestsVisible:      userViewOptions.designAccTestsVisible,
            designUnitTestsVisible:     userViewOptions.designUnitTestsVisible,
            designDomainDictVisible:    userViewOptions.designDomainDictVisible,
            // Design Update Screen - Scope and Design always visible
            updateDetailsVisible:       userViewOptions.updateDetailsVisible,
            updateAccTestsVisible:      userViewOptions.updateAccTestsVisible,
            updateUnitTestsVisible:     userViewOptions.updateUnitTestsVisible,
            updateDomainDictVisible:    userViewOptions.updateDomainDictVisible,
            // Work package editor - Scope and Design always visible
            wpDetailsVisible:           userViewOptions.wpDetailsVisible,
            wpDomainDictVisible:        userViewOptions.wpDomainDictVisible,
            // Developer Screen - Design always visible
            devDetailsVisible:          userViewOptions.devDetailsVisible,
            devAccTestsVisible:         userViewOptions.devAccTestsVisible,
            devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
            devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
            devDomainDictVisible:       userViewOptions.devDomainDictVisible
        });

    }

    // saveUserDevContext(userId, designId, designVersionId, workPackageId, featureFilesLocation){
    //
    //     // Remove the current context
    //     UserCurrentDevContext.remove({userId: userId});
    //     UserCurrentDevUpdates.remove({userId: userId});
    //
    //     // Add the new one
    //     UserCurrentDevContext.insert(
    //         {
    //             userId:                 userId,
    //             designId:               designId,
    //             designVersionId:        designVersionId,
    //             workPackageId:          workPackageId,
    //             featureFilesLocation:   featureFilesLocation
    //         },
    //         (error, result) => {
    //             if(error){
    //                 console.log("Failed to set user dev context: " + error);
    //             } else {
    //
    //                 console.log("Success setting dev context");
    //
    //             }
    //         }
    //     );
    // };


}

export default new UserContextServices();