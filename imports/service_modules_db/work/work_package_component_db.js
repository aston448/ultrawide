
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';


import { DesignVersionStatus, WorkSummaryType, WorkPackageStatus, ComponentType, WorkPackageScopeType, UpdateScopeType, MashTestStatus, DesignUpdateStatus, DesignUpdateMergeAction, UpdateMergeStatus, LogLevel }      from '../../constants/constants.js';

class WorkPackageComponentData {

    // INSERT ==========================================================================================================

    insertNewWorkPackageComponent(designVersionId, workPackageId, wpType, component, scopeType){

        WorkPackageComponents.insert(
            {
                designVersionId:                designVersionId,
                workPackageId:                  workPackageId,
                workPackageType:                wpType,
                componentId:                    component._id,
                componentReferenceId:           component.componentReferenceId,
                componentType:                  component.componentType,
                componentParentReferenceId:     component.componentParentReferenceIdNew,
                componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                componentIndex:                 component.componentIndexNew,
                scopeType:                      scopeType
            }
        );
    }

    // SELECT ==========================================================================================================

    getWpComponentByComponentId(workPackageId, designComponentId){

        return WorkPackageComponents.findOne({
            workPackageId:          workPackageId,
            componentId:            designComponentId
        });
    }

    getWpComponentByComponentRef(workPackageId, designComponentReferenceId){

        return WorkPackageComponents.findOne({
            workPackageId:              workPackageId,
            componentReferenceId:       designComponentReferenceId
        });
    }

    getWorkPackageFeatureByRef(workPackageId, featureReferenceId){

        return WorkPackageComponents.findOne(
            {
                workPackageId: workPackageId,
                componentType: ComponentType.FEATURE,
                componentReferenceId: featureReferenceId
            }
        );
    }

    getDvScenarioWpComponentByReference(designVersionId, componentReferenceId){

        // Note that this can only be used to get Scenarios as they cannot be on more than one WP in a DV

        return WorkPackageComponents.findOne({
            designVersionId:            designVersionId,
            componentReferenceId:       componentReferenceId,
            scopeType:                  WorkPackageScopeType.SCOPE_ACTIVE
        });
    }

    getOtherDvWpComponentInstance(designVersionId, componentReferenceId, thisWorkPackageId){

        // Look for another instance of this component in this DV but in another WP
        return WorkPackageComponents.findOne({
            designVersionId:        designVersionId,
            componentReferenceId:   componentReferenceId,
            workPackageId:          {$ne: thisWorkPackageId}
        });
    }

    // UPDATE ==========================================================================================================

    updateExistingWpComponent(wpComponentId, designComponent, scopeType){

        WorkPackageComponents.update(
            {_id: wpComponentId},
            {
                $set:{
                    componentId:                    designComponent._id,
                    componentParentReferenceId:     designComponent.componentParentReferenceIdNew,
                    componentFeatureReferenceId:    designComponent.componentFeatureReferenceIdNew,
                    componentIndex:                 designComponent.componentIndexNew,
                    scopeType:                      scopeType
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeComponent(wpComponentId){

        return WorkPackageComponents.remove({_id: wpComponentId});
    }
}

export default new WorkPackageComponentData();