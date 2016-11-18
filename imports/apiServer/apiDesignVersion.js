// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Services
import  DesignVersionServices from '../servicers/design/design_version_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Meteor Server Interface for Design Versions
//
// ---------------------------------------------------------------------------------------------------------------------

Meteor.methods({

    'designVersion.updateDesignVersionName'(designVersionId, newName){
        //console.log("Updating design version name to "  + newName);

        DesignVersionServices.updateDesignVersionName(designVersionId, newName);

    },

    'designVersion.updateDesignVersionNumber'(designVersionId, newNumber){
        //console.log("Updating design version number to "  + newNumber);

        DesignVersionServices.updateDesignVersionNumber(designVersionId, newNumber);

    },

    'designVersion.publishDesignVersion'(designVersionId){
        //console.log("Publishing design version "  + designVersionId);

        DesignVersionServices.publishDesignVersion(designVersionId);

    },

    'designVersion.unpublishDesignVersion'(designVersionId){
        //console.log("Un-Publishing design version "  + designVersionId);

        DesignVersionServices.unpublishDesignVersion(designVersionId);

    },

    'designVersion.mergeUpdatesToNewDraftVersion'(designVersionId){
        //console.log("Merging design version updates to new version for "  + designVersionId);

        DesignVersionServices.mergeUpdatesToNewDraftVersion(designVersionId);

    }

});