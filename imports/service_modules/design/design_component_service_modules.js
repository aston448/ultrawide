
// Ultrawide Services
import { ComponentType, LogLevel }  from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import { DesignComponentServices }      from '../../servicers/design/design_component_services.js';
import { WorkPackageModules }           from '../../service_modules/work/work_package_service_modules.js';

// Data Access
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DefaultFeatureAspectData }     from '../../data/design/default_feature_aspect_db.js';

//======================================================================================================================
//
// Server Modules for Design Component Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignComponentModulesClass{

    addDefaultFeatureAspects(designId, designVersionId, featureReferenceId, defaultRawText, view){

        const defaultAspects = DefaultFeatureAspectData.getIncludedDefaultAspectsForDesign(designId);

        defaultAspects.forEach((defaultAspect) => {

            DesignComponentServices.addNewComponent(
                designVersionId,
                featureReferenceId,
                ComponentType.FEATURE_ASPECT,
                0,
                defaultAspect.defaultAspectName,
                defaultAspect.defaultAspectNameRaw,
                defaultRawText,
                false,
                view);

        });
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
        const workPackages = DesignVersionData.getBaseWorkPackages(designVersionId);

        const component = DesignComponentData.getDesignComponentById(newComponentId);

        if(component) {

            // But not if its a new Application with no parent...
            if(component.componentParentReferenceIdNew !== 'NONE')
            {
                const componentParent = DesignComponentData.getDesignComponentByRef(designVersionId, component.componentParentReferenceIdNew);

                // If the parent is in the WP actual scope, add in this component too
                workPackages.forEach((wp) => {

                    WorkPackageModules.addNewDesignComponentToWorkPackage(wp, component, componentParent._id, designVersionId, 'NONE');
                });
            }

        } else {

            log((msg) => console.log(msg), LogLevel.WARNING, 'New component {} was not found in the DB', newComponentId);
        }
    };

    updateWorkPackageLocation(designComponentId, reorder){

        const component = DesignComponentData.getDesignComponentById(designComponentId);

        // See if any base WPs affected by this update
        const workPackages = DesignVersionData.getBaseWorkPackages(component.designVersionId);

        const componentParent = DesignComponentData.getDesignComponentByRef(component.designVersionId, component.componentParentReferenceIdNew);

        workPackages.forEach((wp) => {

            WorkPackageModules.updateDesignComponentLocationInWorkPackage(reorder, wp, component, componentParent);
        });
    }

    removeWorkPackageItems(designComponentRef, designVersionId){

        // See if any base WPs affected by this update
        const workPackages = DesignVersionData.getBaseWorkPackages(designVersionId);

        workPackages.forEach((wp) => {

            WorkPackageModules.removeDesignComponentFromWorkPackage(wp, designComponentRef);
        });
    };

    hasNoChildren(designComponentId){

        const component = DesignComponentData.getDesignComponentById(designComponentId);

        let count = 0;

        if(component){
            count = DesignComponentData.getChildCount(component.designVersionId, component.componentReferenceId);
        }

        return count === 0;
    };

    setIndex(componentId){

        // Get the max index of OTHER components of this type under the same parent
        const component = DesignComponentData.getDesignComponentById(componentId);

        const peerComponents = DesignComponentData.getPeerComponents(component.designVersionId, component.componentReferenceId, component.componentType, component.componentParentReferenceIdNew);

        // If no components then leave as default
        if(peerComponents.length > 0){
            log((msg) => console.log(msg), LogLevel.TRACE, "Setting index.  Current highest peer is {}", peerComponents[0].componentNameNew);

            let newIndex = peerComponents[0].componentIndexNew + 100;

            DesignComponentData.updateIndex(componentId, newIndex, newIndex);
        }
    }
}

export const DesignComponentModules = new DesignComponentModulesClass();
