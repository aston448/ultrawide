// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { Designs } from '../collections/design/designs.js';

// Ultrawide Services
import { ViewType } from '../constants/constants.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView} from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Services - Supports client calls for actions relating to a Design
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignServices{



    // User has clicked Add Design in the designs list in the selection screen
    addNewDesign(){
        Meteor.call('design.addNewDesign');
        return true;
    }

    setDesign(currentDesignId, newDesignId){
        // Set a new design as the current design if a new one chosen

        const context = {
            userId:                 Meteor.userId(),
            designId:               newDesignId,
            designVersionId:        'NONE',
            designUpdateId:         'NONE',
            workPackageId:          'NONE',
            designComponentId:      'NONE',
            featureReferenceId:     'NONE',
            scenarioReferenceId:    'NONE',
            scenarioStepId:         'NONE',
            featureFilesLocation:   '',
            saveToDb:               true
        };

        if(newDesignId != currentDesignId) {
            store.dispatch(setCurrentUserItemContext(context));

            return true;
        }

        // Not an error - just indicates no change
        return false;
    }

    workDesign(currentDesignId, newDesignId){

        // Make sure the current design is set
        this.setDesign(currentDesignId, newDesignId);

        // Design set - go to selection screen
        store.dispatch(setCurrentView(ViewType.SELECT));
    }

    // User saves an update to a Design name
    saveDesignName(designId, newName){

        //TODO add validation - duplicate names not allowed
        Meteor.call('design.updateDesignName', designId, newName);
        return true;
    }

    removeDesign(designId){

        // Validation - can only remove removable designs
        const design = Designs.findOne({_id: designId});

        if(design && design.isRemovable){

            // Set no current user context
            const context = {
                userId:                 Meteor.userId(),
                designId:               'NONE',
                designVersionId:        'NONE',
                designUpdateId:         'NONE',
                workPackageId:          'NONE',
                designComponentId:      'NONE',
                featureReferenceId:     'NONE',
                scenarioReferenceId:    'NONE',
                scenarioStepId:         'NONE',
                featureFilesLocation:   'NONE',
                saveToDb:               true
            };

            store.dispatch(setCurrentUserItemContext(context));

            Meteor.call('design.removeDesign', designId);
            return true;

        } else {
            return false;
        }

    }



}

export default new ClientDesignServices();
