
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
    };

    saveUserViewOptions(userViewOptions){

        if(Meteor.isServer) {

            // Remove current options
            UserCurrentViewOptions.remove({userId: userViewOptions.userId});

            // And add new
            UserCurrentViewOptions.insert({
                userId:                         userViewOptions.userId,
                designDetailsVisible:           userViewOptions.designDetailsVisible,
                designTestSummaryVisible:       userViewOptions.designTestSummaryVisible,
                designDomainDictVisible:        userViewOptions.designDomainDictVisible,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:           userViewOptions.updateDetailsVisible,
                updateProgressVisible:          userViewOptions.updateProgressVisible,
                updateSummaryVisible:           userViewOptions.updateSummaryVisible,
                updateDomainDictVisible:        userViewOptions.updateDomainDictVisible,
                updateTestSummaryVisible:       userViewOptions.updateTestSummaryVisible,

                // Work package editor - Scope and Design always visible
                wpDetailsVisible:               userViewOptions.wpDetailsVisible,
                wpDomainDictVisible:            userViewOptions.wpDomainDictVisible,
                // Developer Screen - Design always visible
                devDetailsVisible:              userViewOptions.devDetailsVisible,
                devTestSummaryVisible:          userViewOptions.devTestSummaryVisible,
                devAccTestsVisible:             userViewOptions.devAccTestsVisible,
                devIntTestsVisible:             userViewOptions.devIntTestsVisible,
                devUnitTestsVisible:            userViewOptions.devUnitTestsVisible,
                devFeatureFilesVisible:         userViewOptions.devFeatureFilesVisible,
                devDomainDictVisible:           userViewOptions.devDomainDictVisible
            });
        }
    };

    saveUserRole(role){

        if(Meteor.isServer) {

        }
    }
}

export default new UserContextServices();