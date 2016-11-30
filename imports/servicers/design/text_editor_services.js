
// Ultrawide Collections
import { DesignComponents }         from '../../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

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
            DesignComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentTextRaw: rawText
                    }
                }
            );
        }
    };

    // Save text for a component in a design update
    saveUpdateText(designUpdateComponentId, rawText){
        if(Meteor.isServer) {
            // When updating an update we update the new text and mark as text changed
            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        componentTextRawNew: rawText,
                        isTextChanged: true
                    }
                }
            );
        }
    };
}

export default new TextEditorServices();