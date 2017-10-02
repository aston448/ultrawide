
// Ultrawide Services
import { DesignVersionStatus }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

import DesignVersionServices        from './design_version_services.js';

import DesignData                     from '../../../imports/service_modules_db/design/design_db.js';

//======================================================================================================================
//
// Server Code for Design Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignServices{

    // Add a new design an its default draft design version
    addDesign(createDesignVersion){

        if(Meteor.isServer) {

            let designId = DesignData.insertNewDesign();

            if (designId && createDesignVersion) {
                //console.log("Creating Design Version for Design: " + designId);

                DesignVersionServices.addNewDesignVersion(
                    designId,
                    DefaultItemNames.NEW_DESIGN_VERSION_NAME,
                    DefaultItemNames.NEW_DESIGN_VERSION_NUMBER,
                    DesignVersionStatus.VERSION_NEW
                );

            }

            return designId;
        }
    };
    

    updateDesignName(designId, newName){

        if(Meteor.isServer) {
          let result = DesignData.updateDesignName(designId, newName);
        }
    }

    // Call this whenever a feature is added or removed from Design or its Updates
    setRemovable(designId){

        if(Meteor.isServer) {

            // If this design has any features at all in any version it is not removable
            const features = DesignData.checkForFeatures(designId);


            // Its possible someone could have create a Design with no features and the be working on an Update to add some so check for that too
            let updateFeatures = false;
            if(!features) {
                updateFeatures = DesignData.checkForUpdateFeatures(designId);
            }

            let isRemovable = !(features || updateFeatures);

            DesignData.setRemovable(designId, isRemovable);
        }
    }

    // This can only be called for removable designs - see setRemovable
    removeDesign(designId){

        if(Meteor.isServer) {

            // Remove all data relating to the design - there can't be much as there can't be any features
            const designVersions = DesignData.getDesignVersions(designId);

            DesignData.removeDesignAndAllData(designId, designVersions);
        }
    }

}

export default new DesignServices();