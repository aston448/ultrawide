import {Designs}                    from '../../collections/design/designs.js'
import {DesignVersions}             from '../../collections/design/design_versions.js'
import {DesignVersionComponents}    from '../../collections/design/design_version_components.js'
import {DesignUpdates}              from '../../collections/design_update/design_updates.js'
import {DesignUpdateComponents}     from '../../collections/design_update/design_update_components.js'
import {WorkPackages}               from '../../collections/work/work_packages.js';
import {WorkPackageComponents}      from '../../collections/work/work_package_components.js';
import {DomainDictionary}           from '../../collections/design/domain_dictionary';

import { ComponentType } from '../../constants/constants.js';
import { DefaultItemNames } from '../../constants/default_names.js';

import DesignVersionData            from '..//design/design_version_db.js';

class DesignData {

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

    checkForFeatures(designId){

        const features = DesignVersionComponents.find({designId: designId, componentType: ComponentType.FEATURE});

        return features !== null;

    }

    checkForUpdateFeatures(designId){

        const updateFeatures = DesignUpdateComponents.find({designId: designId, componentType: ComponentType.FEATURE});

        return updateFeatures !== null;
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

        DesignVersions.remove({designId: designId});

        Designs.remove({_id: designId});
    }
}

export default new DesignData();