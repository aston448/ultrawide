/**
 * Created by aston on 22/09/2016.
 */

import {Designs} from '../collections/design/designs.js'
import {DesignComponents} from '../collections/design/design_components.js'
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js'
import {DesignVersions} from '../collections/design/design_versions.js'
import {DesignUpdates} from '../collections/design_update/design_updates.js'
import {WorkPackages} from '../collections/work/work_packages.js'
import {WorkPackageComponents} from '../collections/work/work_package_components.js'
import {DesignVersionStatus, ComponentType} from '../constants/constants.js';

import DesignVersionServices from '../servicers/design_version_services.js';

class DesignServices{

    // Add a new design an its default draft design version
    addDesign(createDesignVersion){

        let designId = Designs.insert(
            {
                designName: 'New Design'
            }
        );

        if(designId && createDesignVersion){
            console.log("Creating Design Version for Design: " + designId);

            DesignVersionServices.addNewDesignVersion(designId, 'First Draft', '0.1', DesignVersionStatus.VERSION_NEW);

        }

        return designId;

    };

    updateDesignName(designId, newName){

        Designs.update(
            {_id: designId},
            {
                $set:{
                    designName: newName
                }
            }
        );
    }

    // Call this whenever a feature is added or removed from Design or its Updates
    setRemovable(designId){
        // If this design has any features at all in any version it is not removable
        // Its possible someone could have create a Design with no features and the be working on an Update to add some so check for that too

        const features = DesignComponents.find({designId: designId, componentType: ComponentType.FEATURE});
        const updateFeatures = DesignUpdateComponents.find({designId: designId, componentType: ComponentType.FEATURE});


        let isRemovable = (features.count() === 0 && updateFeatures.count() === 0);

        console.log("Setting Design Removable to " + isRemovable);

        Designs.update(
            {_id: designId},
            {
                $set:{
                    isRemovable: isRemovable
                }
            }
        );
    }

    // This can only be called for removable designs - see setRemovable
    removeDesign(designId){

        // Remove all data relating to the design - there can't be much as there can't be any features
        DesignComponents.remove({designId: designId});
        DesignUpdateComponents.remove({designId: designId});

        let designVersions = DesignVersions.find({designId: designId});

        let workPackages = null;

        designVersions.forEach((dv) => {
            // Remove all design updates
            DesignUpdates.remove({designVersionId: dv._id});

            // Get any WPs
            workPackages = WorkPackages.find({designVersionId: dv._id});

            // Remove any WP components
            workPackages.forEach((wp) => {
                WorkPackageComponents.remove({workPackageId: wp._id});
            });

            // Remove all WPs
            WorkPackages.remove({designVersionId: dv._id});

        });

        // Remove all Design Versions
        DesignVersions.remove({designId: designId});

        // And finally remove the Design
        Designs.remove({_id: designId});
    }

}

export default new DesignServices();