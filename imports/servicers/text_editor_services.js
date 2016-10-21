/**
 * Created by aston on 20/08/2016.
 */

import { DesignComponents } from '../collections/design/design_components.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';

class TextEditorServices{


    // Save text for a component in the base design (initial edit only)
    saveText(designComponentId, rawText){

        DesignComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentTextRaw: rawText
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);
                }
            }
        );
    };

    // Save text for a component in a design update
    saveUpdateText(designUpdateComponentId, rawText){

        // When updating an update we update the new text and mark as text changed
        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    componentTextRawNew: rawText,
                    isTextChanged: true
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);
                }
            }
        );
    };

}

export default new TextEditorServices();