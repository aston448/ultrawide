import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';

import  ClientLoginServices     from '../../imports/apiClient/apiClientLogin.js';
import  ClientDesignServices    from '../../imports/apiClient/apiClientDesign.js'

Meteor.methods({

    'test.createMeteorUser'(role){
        ClientLoginServices.createMeteorUser(role);
    },

    'test.addNewDesign'(role){
        ClientDesignServices.addNewDesign(role);
    },

    'test.verifyNoNewDesign'(){

        const newDesign = Designs.findOne({designName: 'New Design'});

        if(newDesign){
            throw new Meteor.Error("FAIL", "New design was created!");
        }
    },

    'test.verifyNewDesign'(){

        const newDesign = Designs.findOne({designName: 'New Design'});

        if(newDesign){
            if(!newDesign.isRemovable){
                throw new Meteor.Error("FAIL", "New design is not removable");
            }
            return true
        } else {
            throw new Meteor.Error("FAIL", "No new design was created");
        }
    },

    'test.verifyNewDesignVersion'(){

        const newDesign = Designs.findOne({designName: 'New Design'});
        const newDesignVersion = DesignVersions.findOne({
            designId: newDesign._id,
            designVersionName: 'First Draft',
            designVersionNumber: '0.1'
        });

        if(newDesignVersion){
            return true
        } else {
            throw new Meteor.Error("FAIL", "No new Design Version was created for the new Design");
        }
    },

});