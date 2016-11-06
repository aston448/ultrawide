/**
 * Created by aston on 14/08/2016.
 */
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Designs from '../collections/design/designs.js';

import {ComponentType} from '../constants/constants.js'

import  DesignServices          from '../servicers/design_services.js';
import  DesignComponentServices from '../servicers/design_component_services.js';
import  ApplicationServices     from '../servicers/application_services.js';
import  DesignSectionServices   from '../servicers/design_section_services.js';
import  FeatureServices         from '../servicers/feature_services.js';
import  ScenarioServices        from '../servicers/scenario_services.js';
import  UserContextServices     from '../servicers/user_context_services.js';

import DesignValidationApi      from '../apiValidation/apiDesignValidation.js';

import { removeDesign } from '../apiValidatedMethods/design_methods.js'


class ServerDesignApi {

    removeDesign(userRole, designId, callback){

        removeDesign.call(
            {
                userRole: userRole,
                designId: designId
            },
            (err, result) => {
                callback(err, result);
            }
        );

    };

}

export default new ServerDesignApi();




// Meteor methods
Meteor.methods({

    // Design Management -----------------------------------------------------------------------------------------------

    //TODO Add / Remove Designs : DesignServices
    'design.addNewDesign'(){
        console.log('Adding new Design');
        DesignServices.addDesign(true); // This call always creates a new default Design Version
    },

    'design.updateDesignName'(designId, newName){
        console.log('Updating Design Name');
        DesignServices.updateDesignName(designId, newName);
    },


    //
    // 'design.removeDesign'(userRole, designId){
    //
    //     if(DesignValidation.validateRemoveDesign(userRole, designId)) {
    //         console.log('Removing Design');
    //         DesignServices.removeDesign(designId);
    //     }
    //
    // },


    // Design Component Management -------------------------------------------------------------------------------------

    // Save the name of any Design Component
    'design.saveComponentName'(designComponentId, componentName, componentNameRaw){

        console.log("Saving component name for " + designComponentId);

        let result = DesignComponentServices.saveDesignComponentName(designComponentId, componentName, componentNameRaw);
        if(result){
            return 'RESULT!';
        } else {
            return 'BOO';
        }
    },

    // Save a feature narrative
    'design.saveFeatureNarrative' (featureId, rawText, plainText){
        console.log("Saving feature narrative...");
        DesignComponentServices.saveNarrative(
            featureId,
            rawText,
            plainText
        );
    },

    // Remove a component from the design
    'design.deleteComponent'(designComponentId, parentId){

        console.log("Deleting " + designComponentId);

        // Delete only allowed if no children...
        if (DesignComponentServices.hasNoChildren(designComponentId)){
            DesignComponentServices.deleteComponent(designComponentId, parentId);
        } else {
            console.log("Cannot delete " + designComponentId);
        }
    },

    // Move a component to a new location within the design
    'design.moveComponent'(designComponentId, newParentId){

        DesignComponentServices.moveComponent(designComponentId, newParentId);

    },

    // Move a component to a new position in its current list
    'design.reorderComponent'(designComponentId, targetComponentId){

        DesignComponentServices.reorderComponent(designComponentId, targetComponentId);

    },

    // Design Building -------------------------------------------------------------------------------------------------

    // A design can be broken into Applications and must have at least one
    'design.addNewApplication'(designVersionId){

        console.log("Adding new application...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            'NONE',
            'APPLICATION',
            0,                          // Apps are at level 0
            'New Application',
            ApplicationServices.getDefaultRawName(),
            ApplicationServices.getDefaultRawText());

    },

    // An application can be broken into sections
    'design.addNewSectionToApplication'(designVersionId, parentId){

        console.log("Adding new design section...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            parentId,
            ComponentType.DESIGN_SECTION,
            1,                          // All sections added to the design version are level 1
            'New Design Section',
            DesignSectionServices.getDefaultRawName(),
            DesignSectionServices.getDefaultRawText());

    },

    // A section can be nested
    'design.addNewSectionToDesignSection'(designVersionId, parentSectionId, parentLevel){

        console.log("Adding new design section...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            parentSectionId,
            ComponentType.DESIGN_SECTION,
            parentLevel + 1,
            'New Design Section',
            DesignSectionServices.getDefaultRawName(),
            DesignSectionServices.getDefaultRawText());
    },

    // Features can be added directly to an Application or to a Design Section
    'design.addNewFeature'(designVersionId, parentId){

        console.log("Adding new feature...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            parentId,
            ComponentType.FEATURE,
            0,
            'New Feature or Use Case',
            FeatureServices.getDefaultRawName(),
            FeatureServices.getDefaultRawText(),
            FeatureServices.getDefaultRawNarrative()
        );
    },

    // Feature aspects may be added to a Feature
    'design.addNewFeatureAspectToFeature'(designVersionId, parentId){

        console.log("Adding new feature aspect...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            parentId,
            ComponentType.FEATURE_ASPECT,
            0,
            'New Feature Aspect',
            FeatureServices.getDefaultRawAspectName(),
            FeatureServices.getDefaultRawText());
    },


    // A scenario can be added to a feature or a feature aspect
    'design.addNewScenario'(designVersionId, parentId){

        console.log("Adding new scenario...");
        DesignComponentServices.addNewComponent(
            designVersionId,
            parentId,
            ComponentType.SCENARIO,
            0,
            'New Scenario',
            ScenarioServices.getDefaultRawName(),
            ScenarioServices.getDefaultRawText(),
        );
    },


});