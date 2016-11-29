
import { Meteor } from 'meteor/meteor';

import {ComponentType} from '../constants/constants.js'

import  DesignUpdateServices  from '../servicers/design_update/design_update_services.js';
import  DesignUpdateComponentServices  from '../servicers/design_update/design_update_component_services.js';
import  ScenarioServices        from '../servicers/design/scenario_services.js';

import DesignComponentModules               from '../service_modules/design/design_component_service_modules.js';
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';

import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { addDesignUpdate, updateDesignUpdateName, updateDesignUpdateVersion, publishDesignUpdate, removeDesignUpdate } from '../apiValidatedMethods/design_update_methods.js'


class ServerDesignUpdateApi {

    addDesignUpdate(userRole, designVersionId, callback){

        addDesignUpdate.call(
            {
                userRole:           userRole,
                designVersionId:    designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateName(userRole, designUpdateId, newName, callback){

        updateDesignUpdateName.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newName:        newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateVersion(userRole, designUpdateId, newVersion, callback){

        updateDesignUpdateVersion.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newVersion:     newVersion
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    publishDesignUpdate(userRole, designUpdateId, callback){

        publishDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignUpdate(userRole, designUpdateId, callback){

        removeDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerDesignUpdateApi();


// Meteor methods
Meteor.methods({

    // Design Update Component Management ------------------------------------------------------------------------------

    // Toggle a component in and out of scope
    'designUpdate.toggleScope'(designUpdateComponentId, newScope){

        //console.log("Toggling scope to " + (newScope ? 'true' : 'false'));
        DesignUpdateComponentServices.toggleScope(designUpdateComponentId, newScope);
    },

    // Save the name of any Design Component
    'designUpdate.saveComponentName'(designUpdateComponentId, componentName, componentNameRaw){

        //console.log("Saving component name for " + designUpdateComponentId);
        let result = DesignUpdateComponentServices.saveDesignComponentName(designUpdateComponentId, componentName, componentNameRaw);
    },

    // Save a feature narrative
    'designUpdate.saveFeatureNarrative' (featureId, rawText, plainText){

        //console.log("Saving update feature narrative...");
        DesignUpdateComponentServices.saveNarrative(
            featureId,
            rawText,
            plainText
        );
    },

    // Logically delete a component from the design
    'designUpdate.deleteComponent'(designUpdateComponentId, parentId){

        //console.log("Deleting " + designUpdateComponentId);

        // Delete only allowed if no children...
        if (DesignUpdateComponentServices.hasNoChildren(designUpdateComponentId)){
            DesignUpdateComponentServices.deleteComponent(designUpdateComponentId, parentId);
        } else {
            //console.log("Cannot delete " + designUpdateComponentId);
        }
    },

    // Restore a logically deleted component to the design
    'designUpdate.restoreComponent'(designUpdateComponentId, parentId){

        //console.log("Restoring " + designUpdateComponentId);

        // Restore only allowed if parent not deleted
        if (DesignUpdateComponentServices.isDeleted(parentId)){
            //console.log("Cannot restore " + designUpdateComponentId);
        } else {

            DesignUpdateComponentServices.restoreComponent(designUpdateComponentId, parentId);
        }
    },

    // Move a component to a new location within the design
    'designUpdate.moveComponent'(designUpdateComponentId, newParentId){

        DesignUpdateComponentServices.moveComponent(designUpdateComponentId, newParentId);

    },

    // Move a component to a new position in its current list
    'designUpdate.reorderComponent'(designUpdateComponentId, targetComponentId){

        DesignUpdateComponentServices.reorderComponent(designUpdateComponentId, targetComponentId);

    },

    // Design Update Building ------------------------------------------------------------------------------------------

    // A design can be broken into Applications and must have at least one
    'designUpdate.addNewApplication'(designVersionId, designUpdateId){

        //console.log("Adding new application...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,                            // designVersionId
            designUpdateId,                             // designUpdateId
            'NONE',                                     // parentId
            ComponentType.APPLICATION,                              // componentType
            0,                                          // componentLevel - Apps are at level 0
            DefaultComponentNames.NEW_APPLICATION_NAME,                          // defaultName
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_APPLICATION_NAME),    // defaultRawName
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_APPLICATION_DETAILS),    // defaultRawText
            null,                                       // defaultNarrative
            null                                        // defaultRawNarrative
        );

    },

    // An application can be broken into sections
    'designUpdate.addNewSectionToApplication'(designVersionId, designUpdateId, parentId){

        //console.log("Adding new design section...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,
            designUpdateId,
            parentId,
            ComponentType.DESIGN_SECTION,
            1,                                          // All sections added to the design version are level 1
            DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
            null,
            null
        );

    },

    // A section can be nested
    'designUpdate.addNewSectionToDesignSection'(designVersionId, designUpdateId, parentSectionId, parentLevel){

        //console.log("Adding new design section...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,
            designUpdateId,
            parentSectionId,
            ComponentType.DESIGN_SECTION,
            parentLevel + 1,
            DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
            null,
            null
        );
    },

    // Features can be added directly to an Application or to a Design Section
    'designUpdate.addNewFeature'(designVersionId, designUpdateId, parentId){

        //console.log("Adding new feature...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,
            designUpdateId,
            parentId,
            ComponentType.FEATURE,
            0,
            DefaultComponentNames.NEW_FEATURE_NAME,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_NAME),
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_DETAILS),
            DefaultComponentNames.NEW_NARRATIVE_TEXT,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
        );
    },

    // Feature aspects may be added to a Feature
    'designUpdate.addNewFeatureAspectToFeature'(designVersionId, designUpdateId, parentId){

        //console.log("Adding new feature aspect...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,
            designUpdateId,
            parentId,
            ComponentType.FEATURE_ASPECT,
            0,
            DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_ASPECT_NAME),
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_ASPECT_DETAILS),
            null,
            null
        );
    },

    // A scenario can be added to a feature or a feature aspect
    'designUpdate.addNewScenario'(designVersionId, designUpdateId, parentId){

        //console.log("Adding new scenario...");
        DesignUpdateComponentServices.addNewComponent(
            designVersionId,
            designUpdateId,
            parentId,
            ComponentType.SCENARIO,
            0,
            DefaultComponentNames.NEW_SCENARIO_NAME,
            DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_SCENARIO_NAME),
            DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_SCENARIO_DETAILS),
            null,
            null
        );
    },

});
