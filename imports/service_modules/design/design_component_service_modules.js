
// Ultrawide Services
import { ComponentType, LogLevel }  from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import { DesignComponentServices }      from '../../servicers/design/design_component_services.js';
import { WorkPackageModules }           from '../../service_modules/work/work_package_service_modules.js';

// Data Access
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DefaultFeatureAspectData }     from '../../data/design/default_feature_aspect_db.js';
import {setCurrentUserSummaryItem} from "../../redux/actions";

//======================================================================================================================
//
// Server Modules for Design Component Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignComponentModulesClass{

    updateComponentHierarchyIndex(designComponent){

        let indexData = {
            aspectRef:  'NONE',
            featureRef: 'NONE',
            s4Ref:      'NONE',
            s3Ref:      'NONE',
            s2Ref:      'NONE',
            s1Ref:      'NONE',
            appRef:     'NONE'
        };

        indexData = this.getDataForParent(designComponent, indexData);

        DesignComponentData.setComponentHierarchyRefs(designComponent._id, indexData);

    }

    getDataForParent(component, indexData){

        const parentComponent = DesignComponentData.getDesignComponentByRef(component.designVersionId, component.componentParentReferenceIdNew);

        if(parentComponent) {
            switch (parentComponent.componentType) {
                case ComponentType.FEATURE_ASPECT:
                    indexData.aspectRef = parentComponent.componentReferenceId;
                    break;
                case ComponentType.FEATURE:
                    indexData.featureRef = parentComponent.componentReferenceId;
                    break;
                case ComponentType.DESIGN_SECTION:
                    switch(parentComponent.componentLevel){
                        case 1:
                            indexData.s1Ref = parentComponent.componentReferenceId;
                            break;
                        case 2:
                            indexData.s2Ref = parentComponent.componentReferenceId;
                            break;
                        case 3:
                            indexData.s3Ref = parentComponent.componentReferenceId;
                            break;
                        case 4:
                            indexData.s4Ref = parentComponent.componentReferenceId;
                            break;
                    }
                    break;
                case ComponentType.APPLICATION:
                    indexData.appRef = parentComponent.componentReferenceId;
                    break;
            }

            if(parentComponent.componentType !== ComponentType.APPLICATION) {
                indexData = this.getDataForParent(parentComponent, indexData);
            }
        }

        return indexData;
    }

    getAllDvComponentParents(designComponent){

        let parents = [];

        if(designComponent.appRef !== 'NONE'){

            parents.push(DesignComponentData.getAppParent(designComponent.designVersionId, designComponent.appRef));
        }

        if(designComponent.s1Ref !== 'NONE'){

            parents.push(DesignComponentData.getS1Parent(designComponent.designVersionId, designComponent.s1Ref));
        }

        if(designComponent.s2Ref !== 'NONE'){

            parents.push(DesignComponentData.getS2Parent(designComponent.designVersionId, designComponent.s2Ref));
        }

        if(designComponent.s3Ref !== 'NONE'){

            parents.push(DesignComponentData.getS1Parent(designComponent.designVersionId, designComponent.s3Ref));
        }

        if(designComponent.s4Ref !== 'NONE'){

            parents.push(DesignComponentData.getS1Parent(designComponent.designVersionId, designComponent.s4Ref));
        }

        if(designComponent.featureRef !== 'NONE'){

            parents.push(DesignComponentData.getFeatureParent(designComponent.designVersionId, designComponent.featureRef));
        }

        if(designComponent.aspectRef !== 'NONE'){

            parents.push(DesignComponentData.getAspectParent(designComponent.designVersionId, designComponent.aspectRef));
        }

        return parents;
    }

    getAllDvChildComponents(designComponent){

        switch(designComponent.componentType) {

            case ComponentType.APPLICATION:

                return DesignComponentData.getAppChildren(designComponent.designVersionId, designComponent.componentReferenceId);

            case ComponentType.DESIGN_SECTION:

                switch (designComponent.componentLevel) {

                    case 1:

                        return DesignComponentData.getS1Children(designComponent.designVersionId, designComponent.componentReferenceId);

                    case 2:

                        return DesignComponentData.getS2Children(designComponent.designVersionId, designComponent.componentReferenceId);

                    case 3:

                        return DesignComponentData.getS3Children(designComponent.designVersionId, designComponent.componentReferenceId);

                    case 4:

                        return DesignComponentData.getS4Children(designComponent.designVersionId, designComponent.componentReferenceId);
                }

                break;

            case ComponentType.FEATURE:

                return DesignComponentData.getFeatureChildren(designComponent.designVersionId, designComponent.componentReferenceId);

            case ComponentType.FEATURE_ASPECT:

                return DesignComponentData.getAspectChildren(designComponent.designVersionId, designComponent.componentReferenceId);

            case ComponentType.SCENARIO:

                return [];

            default:

                return [];
        }

    }

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
