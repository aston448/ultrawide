/**
 * Created by aston on 12/10/2016.
 */
import { Meteor } from 'meteor/meteor';


import  ImpExServices     from '../servicers/import_export.js';

// Meteor methods
Meteor.methods({

    'impex.exportData'(){
        ImpExServices.exportUltrawideData();
    },

    'impex.importData'(){
        ImpExServices.importUltrawideData();
    },
});