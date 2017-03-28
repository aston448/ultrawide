
// Ultrawide Collections
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, WorkPackageStatus, WorkPackageType, LogLevel } from '../../constants/constants.js';

import DesignComponentServices      from '../../servicers/design/design_component_services.js';
import WorkPackageModules           from '../../service_modules/work/work_package_service_modules.js';

//======================================================================================================================
//
// Server Modules for Design Component Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignComponentModules{

    addDefaultFeatureAspects(designVersionId, featureId, defaultRawText, view){
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Interface', this.getRawTextFor('Interface'), defaultRawText, false, view);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Actions', this.getRawTextFor('Actions'), defaultRawText, false, view);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Conditions', this.getRawTextFor('Conditions'), defaultRawText, false, view);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Consequences', this.getRawTextFor('Consequences'), defaultRawText, false, view);
    }

    getRawTextFor(plainText){
        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : plainText,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    }

    updateWorkPackagesWithNewItem(designVersionId, newComponentId){

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        const component = DesignVersionComponents.findOne({_id: newComponentId});
        const componentParent = DesignVersionComponents.findOne({_id: component.componentParentIdNew});

        // If the parent is in the WP actual scope, add in this component too
        workPackages.forEach((wp) => {

            WorkPackageModules.addNewDesignComponentToWorkPackage(wp, component, componentParent._id, designVersionId);

        });
    };

    updateWorkPackageLocation(designComponentId, reorder){

        const component = DesignVersionComponents.findOne({_id: designComponentId});

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    component.designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        const componentParent = DesignVersionComponents.findOne({_id: component.componentParentIdNew});

        workPackages.forEach((wp) => {

            WorkPackageModules.updateDesignComponentLocationInWorkPackage(reorder, wp, component, componentParent);

        });
    }

    removeWorkPackageItems(designComponentId, designVersionId){

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        workPackages.forEach((wp) => {

            WorkPackageModules.removeDesignComponentFromWorkPackage(wp._id, designComponentId);

        });

    };

    // Set any other components to no longer new
    setComponentsOld(designComponentId){
        DesignVersionComponents.update(
            {
                _id:     {$ne: designComponentId},
                isNew:   true
            },
            {
                $set:{
                    isNew: false
                }
            },
            {multi: true},

            (error, result) => {
                if(error){
                    // Error handler
                    //console.log("Error: " + error);
                } else {
                    //console.log("Success: " + result);
                }
            }
        );
    }

    hasNoChildren(designComponentId){
        return DesignVersionComponents.find({componentParentIdNew: designComponentId}).count() === 0;
    };

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignVersionComponents.find(
            {
                _id: {$ne: componentId},
                componentType: componentType,
                componentParentIdNew: parentId
            },
            {sort:{componentIndexNew: -1}}
        ).fetch();

        // If no components then leave as default
        if(peerComponents.length > 0){
            //console.log("Highest peer is " + peerComponents[0].componentNameNew);

            let newIndex = peerComponents[0].componentIndexNew + 100;

            DesignVersionComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndexOld: newIndex,
                        componentIndexNew: newIndex
                    }
                }
            );
        }
    }

}

export default new DesignComponentModules();
