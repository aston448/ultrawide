
// Ultrawide Services
import { DesignVersionStatus }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

import DesignVersionServices        from './design_version_services.js';
import DesignComponentModules       from '../../service_modules/design/design_component_service_modules.js';

import DesignData                   from '../../data/design/design_db.js';
import DefaultFeatureAspectData     from '../../data/design/default_feature_aspect_db.js'

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

                // Add initial Design Version

                DesignVersionServices.addNewDesignVersion(
                    designId,
                    DefaultItemNames.NEW_DESIGN_VERSION_NAME,
                    DefaultItemNames.NEW_DESIGN_VERSION_NUMBER,
                    DesignVersionStatus.VERSION_NEW
                );

                // Set up default Feature Aspects
                this.initialiseDefaultFeatureAspectsForDesign(designId);
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

    initialiseDefaultFeatureAspectsForDesign(designId){

        // Create the 8 default aspects for a Design.  User can then customise them as required
        const aspect1 =    {
            defaultAspectName:      'Interface',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Interface'),
            defaultAspectIncluded:  true,
            defaultAspectIndex:     1
        };

        const aspect2 =    {
            defaultAspectName:      'Actions',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Actions'),
            defaultAspectIncluded:  true,
            defaultAspectIndex:     2
        };

        const aspect3 =    {
            defaultAspectName:      'Conditions',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Conditions'),
            defaultAspectIncluded:  true,
            defaultAspectIndex:     3
        };

        const aspect4 =    {
            defaultAspectName:      'Consequences',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Consequences'),
            defaultAspectIncluded:  true,
            defaultAspectIndex:     4
        };

        const aspect5 =    {
            defaultAspectName:      'Not Set',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Not Set'),
            defaultAspectIncluded:  false,
            defaultAspectIndex:     5
        };

        const aspect6 =    {
            defaultAspectName:      'Not Set',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Not Set'),
            defaultAspectIncluded:  false,
            defaultAspectIndex:     6
        };

        const aspect7 =    {
            defaultAspectName:      'Not Set',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Not Set'),
            defaultAspectIncluded:  false,
            defaultAspectIndex:     7
        };

        const aspect8 =    {
            defaultAspectName:      'Not Set',
            defaultAspectNameRaw:   DesignComponentModules.getRawTextFor('Not Set'),
            defaultAspectIncluded:  false,
            defaultAspectIndex:     8
        };


        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect1);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect2);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect3);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect4);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect5);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect6);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect7);
        DefaultFeatureAspectData.insertDefaultAspect(designId, aspect8);
    }

    updateDefaultFeatureAspectName(defaultAspectId, newNamePlain, newNameRaw){

        if(Meteor.isServer){

            DefaultFeatureAspectData.updateAspectName(defaultAspectId, newNamePlain, newNameRaw);
        }
    }

    updateDefaultFeatureAspectIncluded(defaultAspectId, included){

        if(Meteor.isServer){

            DefaultFeatureAspectData.updateAspectIncluded(defaultAspectId, included);
        }
    }

}

export default new DesignServices();