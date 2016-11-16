import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';

Meteor.methods({

    'verifyDesigns.noNewDesign'(){

        const newDesign = Designs.findOne({designName: 'New Design'});

        if(newDesign){
            throw new Meteor.Error("FAIL", "New design was created!");
        }
    },

    'verifyDesigns.newDesign'(){

        const newDesign = Designs.findOne({designName: 'New Design'});

        if(newDesign){
            if(!newDesign.isRemovable){
                throw new Meteor.Error("FAIL", "New design is not removable");
            }
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No new design was created");
        }
    },

    'verifyDesigns.newDesignVersion'(){

        const newDesign = Designs.findOne({designName: 'New Design'});
        const newDesignVersion = DesignVersions.findOne({
            designId: newDesign._id,
            designVersionName: 'First Draft',
            designVersionNumber: '0.1'
        });

        if(newDesignVersion){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No new Design Version was created for the new Design");
        }
    },

    'verifyDesigns.designExistsCalled'(designName){
        const design = Designs.findOne({designName: designName});

        if(design){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design exists with name " + designName);
        }
    },

    'verifyDesigns.designDoesNotExistCalled'(designName){
        const design = Designs.findOne({designName: designName});

        if(design){
            throw new Meteor.Error("FAIL", "A Design exists with name " + designName);

        } else {
            return true;
        }
    },

    'verifyDesigns.designCountIs'(designCount){
        const designs = Designs.find({});

        if(designs.count() != designCount){
            throw new Meteor.Error("FAIL", "Expecting " + designCount + " designs but there are " + designs.count());
        } else {
            return true;
        }
    },

});
