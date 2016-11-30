
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
                    scenarioStepId:                 context.scenarioStepId,
                    featureFilesLocation:           context.featureFilesLocation,
                    acceptanceTestResultsLocation:  context.acceptanceTestResultsLocation,
                    integrationTestResultsLocation: context.integrationTestResultsLocation,
                    moduleTestResultsLocation:      context.moduleTestResultsLocation
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
                designAccTestsVisible:          userViewOptions.designAccTestsVisible,
                designIntTestsVisible:          userViewOptions.designIntTestsVisible,
                designModTestsVisible:          userViewOptions.designModTestsVisible,
                designDomainDictVisible:        userViewOptions.designDomainDictVisible,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:           userViewOptions.updateDetailsVisible,
                updateAccTestsVisible:          userViewOptions.updateAccTestsVisible,
                updateIntTestsVisible:          userViewOptions.updateIntTestsVisible,
                updateModTestsVisible:          userViewOptions.updateModTestsVisible,
                updateDomainDictVisible:        userViewOptions.updateDomainDictVisible,
                // Work package editor - Scope and Design always visible
                wpDetailsVisible:               userViewOptions.wpDetailsVisible,
                wpDomainDictVisible:            userViewOptions.wpDomainDictVisible,
                // Developer Screen - Design always visible
                devDetailsVisible:              userViewOptions.devDetailsVisible,
                devAccTestsVisible:             userViewOptions.devAccTestsVisible,
                devIntTestsVisible:             userViewOptions.devIntTestsVisible,
                devModTestsVisible:             userViewOptions.devModTestsVisible,
                devFeatureFilesVisible:         userViewOptions.devFeatureFilesVisible,
                devDomainDictVisible:           userViewOptions.devDomainDictVisible
            });
        }
    };
}

export default new UserContextServices();