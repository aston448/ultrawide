import { Meteor } from 'meteor/meteor';

import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import {DefaultItemNames}           from '../../imports/constants/default_names.js';

Meteor.methods({

    'verifyDesignComponents.componentExistsCalled'(componentType, componentName){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Component of type " + componentType + " exists with name " + componentName);
        }
    },

    'verifyDesignComponents.componentDoesNotExistCalled'(componentType, componentName){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent){
            throw new Meteor.Error("FAIL", "A Design Component of type " + componentType + " exists with name " + componentName);

        } else {
            return true;
        }
    },

});

