/**
 * Created by aston on 20/08/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import  TextEditorServices  from '../servicers/design/text_editor_services.js';


// Meteor methods
Meteor.methods({

    'textEditor.saveText'(designComponentId, rawText){

        //console.log("Saving text..." + rawText);
        TextEditorServices.saveText(designComponentId, rawText);
    },

    'textEditor.saveUpdateText'(designUpdateComponentId, rawText){

        //console.log("Saving update text..." + rawText);
        TextEditorServices.saveUpdateText(designUpdateComponentId, rawText);
    }

});