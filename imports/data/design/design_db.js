import {Designs}                    from '../../collections/design/designs.js'
import {DesignPermutations}         from '../../collections/design/design_permutations.js';
import {DesignVersions}             from '../../collections/design/design_versions.js'
import {DesignVersionComponents}    from '../../collections/design/design_version_components.js'
import {DesignUpdateComponents}     from '../../collections/design_update/design_update_components.js'
import { ComponentType }            from '../../constants/constants.js';

import { DefaultItemNames }         from '../../constants/default_names.js';

import { DesignVersionData }        from '../design/design_version_db.js';

class DesignDataClass {

    // INSERT ==========================================================================================================
    insertNewDesign(){

        return Designs.insert(
            {
                designName: DefaultItemNames.NEW_DESIGN_NAME
            }
        );
    }

    // Import a design from saved data
    importDesign(design){

        if(Meteor.isServer) {
            return Designs.insert(
                {
                    designName: design.designName,
                    designRawText: design.designRawText,
                    isRemovable: design.isRemovable,
                    designStatus: design.designStatus
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getDesignById(designId){
        return Designs.findOne({_id: designId});
    }

    getDesignByName(designName){
        return Designs.findOne({designName: designName});
    }

    getDesignVersions(designId){
        return DesignVersions.find({designId: designId}).fetch();
    }

    getOtherDesignVersions(designId, designVersionId){

        return DesignVersions.find({_id: {$ne: designVersionId}, designId: designId}).fetch();
    }

    getDesignVersionsOrderByVersion(designId){

        return DesignVersions.find(
            {designId: designId},
            {sort: {designVersionIndex: 1}}
        ).fetch();
    }

    getAllDesigns(){

        return Designs.find({}, {sort: {designName: 1}}).fetch();
    }

    getOtherDesigns(designId){

        return Designs.find({_id: {$ne: designId}}).fetch();
    }

    checkForFeatures(designId){

        const features = DesignVersionComponents.find({designId: designId, componentType: ComponentType.FEATURE});

        return features.count() > 0;

    }

    checkForUpdateFeatures(designId){

        const updateFeatures = DesignUpdateComponents.find({designId: designId, componentType: ComponentType.FEATURE});

        return updateFeatures.count() > 0;
    }

    // UPDATE ==========================================================================================================

    setRemovable(designId, isRemovable){

        return Designs.update(
            {_id: designId},
            {
                $set: {
                    isRemovable: isRemovable
                }
            }
        );
    }

    updateDesignName(designId, newName){

        return Designs.update(
            {_id: designId},
            {
                $set: {
                    designName: newName
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeDesignAndAllData(designId, designVersions){

        // Remove all data relating to the design
        designVersions.forEach((designVersion) => {

            DesignVersionData.removeDesignVersionData(designVersion._id);
        });

        DesignPermutations.remove({designId: designId});

        DesignVersions.remove({designId: designId});

        Designs.remove({_id: designId});
    }
}

export const DesignData = new DesignDataClass();