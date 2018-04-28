
// Ultrawide Services
import DesignUpdateComponentModules         from '../../service_modules/design_update/design_update_component_service_modules.js';

// Data Access
import { DesignComponentData }                  from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }            from '../../data/design_update/design_update_component_db.js';

//======================================================================================================================
//
// Server Code for Details Text Editor.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TextEditorServices{

    // Save text for a component in the base design (initial edit only)
    saveText(designComponentId, rawText){

        if(Meteor.isServer) {

            DesignComponentData.updateDetailsText(designComponentId, rawText);
        }
    };

    // Save text for a component in a design update
    saveUpdateText(designUpdateComponentId, rawText){

        if(Meteor.isServer) {

            // When updating an update we update the new text and mark as text changed
            DesignUpdateComponentData.updateDetailsText(designUpdateComponentId, rawText);

            // Update the design version if necessary
            DesignUpdateComponentModules.updateCurrentDesignVersionComponentDetails(designUpdateComponentId);
        }
    };
}

export default new TextEditorServices();