
// Ultrawide Collections
import {UserCurrentEditContext} from '../../collections/context/user_current_edit_context.js'
import {UserCurrentViewOptions} from '../../collections/context/user_current_view_options.js'

//======================================================================================================================
//
// Server Code for User Context.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserContextServices{

    // Save
    saveUserContext(context){

        if(Meteor.isServer) {
            // Remove the current context
            UserCurrentEditContext.remove({userId: context.userId});

            // Add the new one
            UserCurrentEditContext.insert(
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

        //console.log("User Context Saved.  DV: " + context.designVersionId + " DU: " + context.designUpdateId + " WP: " + context.workPackageId);
    };

    saveUserViewOptions(userViewOptions, userId){

        if(Meteor.isServer) {

            const currentViewOptions = UserCurrentViewOptions.findOne({userId: userId});

            if(currentViewOptions){

                UserCurrentViewOptions.update(
                    {userId: userId},
                    {
                        $set:{
                            designDetailsVisible:       userViewOptions.designDetailsVisible,
                            designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                            testSummaryVisible:         userViewOptions.testSummaryVisible,
                            updateProgressVisible:      userViewOptions.updateProgressVisible,
                            updateSummaryVisible:       userViewOptions.updateSummaryVisible,
                            devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                            devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                            devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
                            devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                            designShowAllAsTabs:        userViewOptions.designShowAllAsTabs,
                            updateShowAllAsTabs:        userViewOptions.updateShowAllAsTabs,
                            workShowAllAsTabs:          userViewOptions.workShowAllAsTabs
                        }
                    }
                );

            } else {

                UserCurrentViewOptions.insert({
                    userId:                     userId,
                    designDetailsVisible:       userViewOptions.designDetailsVisible,
                    designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                    testSummaryVisible:         userViewOptions.testSummaryVisible,
                    updateProgressVisible:      userViewOptions.updateProgressVisible,
                    updateSummaryVisible:       userViewOptions.updateSummaryVisible,
                    devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                    devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                    devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
                    devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                    designShowAllAsTabs:        userViewOptions.designShowAllAsTabs,
                    updateShowAllAsTabs:        userViewOptions.updateShowAllAsTabs,
                    workShowAllAsTabs:          userViewOptions.workShowAllAsTabs
                });
            }
        }
    };

    saveUserRole(role){

        if(Meteor.isServer) {

        }
    }
}

export default new UserContextServices();