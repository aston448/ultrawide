
// Ultrawide Services
import {ComponentType} from '../constants/constants.js';
import { DesignUpdateComponentValidationErrors } from '../constants/validation_errors.js';

import DesignUpdateComponentValidationServices  from '../service_modules/validation/design_update_component_validation_services.js';
import DesignUpdateComponentModules             from '../service_modules/design_update/design_update_component_service_modules.js';

// Data Access
import { DesignVersionData }                        from '../data/design/design_version_db.js';
import { DesignUpdateData }                         from '../data/design_update/design_update_db.js';
import { DesignComponentData }                      from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }                from '../data/design_update/design_update_component_db.js';
import DesignComponentValidationServices from "../service_modules/validation/design_component_validation_services";

//======================================================================================================================
//
// Validation API for Design Update Components
//
//======================================================================================================================

class DesignUpdateComponentValidationApi{

    validateAddDesignUpdateComponent(view, mode, parentComponent, componentType){

        if(parentComponent) {

            const parentInOtherUpdates = DesignUpdateData.getComponentInOtherUpdates(parentComponent);

            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent, parentInOtherUpdates);
        } else{
            // Means this is an application being added so no need to check target
            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, null, null);
        }


    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        let newDefaultAspect = false;

        // When a new Feature is added, new default Aspects are not flagged as New items - only aspects deliberately added by user
        if(designUpdateComponent.componentType === ComponentType.FEATURE_ASPECT){

            const feature = DesignUpdateComponentData.getUpdateComponentByRef(
                designUpdateComponent.designVersionId,
                designUpdateComponent.designUpdateId,
                designUpdateComponent.componentParentReferenceIdNew
            );

            if(feature.isNew && !designUpdateComponent.isNew){
                newDefaultAspect = true;
            }
        }

        if(designUpdateComponent.isNew || newDefaultAspect){

            // Added in this Design Update

            // Only removable items (i.e. with no children) can be removed...
            if (designUpdateComponent.isRemovable){
                // Just double check....
                if(DesignUpdateComponentModules.hasNoNonRemovedChildren(designUpdateComponentId)){
                    return DesignUpdateComponentValidationServices.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent);
                } else {
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
                }
            } else {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
            }

        } else {

            // Existing Item being logically deleted - we allow this and cascade to all children as long as there are no new items under it here or elsewhere
            if(DesignUpdateComponentModules.hasNoNewChildrenInAnyUpdate(designUpdateComponentId)){

                // Also check that no children have been put in scope in another update
                if(DesignUpdateComponentModules.hasNoInScopeChildrenInOtherUpdates(designUpdateComponentId)) {
                    return DesignUpdateComponentValidationServices.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent);
                } else {
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_SCOPE;
                }
            } else {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_NEW;
            }
        }


    };

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // Cannot restore a component if its parent is removed
        const parentComponent = DesignUpdateComponentData.getUpdateComponentByRef(
            designUpdateComponent.designVersionId,
            designUpdateComponent.designUpdateId,
            designUpdateComponent.componentParentReferenceIdNew
        );

        return DesignUpdateComponentValidationServices.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent, parentComponent);
    }

    validateUpdateDesignUpdateComponentName(view, mode, designUpdateComponentId, newName){

        // Get other components of the same type that should not have the same name
        const thisUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // Design Update components in this DV that re not this component
        const existingUpdateComponents = DesignVersionData.getOtherExistingUpdateComponentsOfTypeInDv(thisUpdateComponent);

        // Design Version components in this DV that are not the same as this component
        const existingDesignVersionComponents = DesignVersionData.getOtherComponentsOfTypeInDvForDu(thisUpdateComponent);

        // The update component as it exists in the DV
        const thisDesignVersionComponent = DesignComponentData.getDesignComponentByRef(
            thisUpdateComponent.designVersionId,
            thisUpdateComponent.componentReferenceId
        );

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateComponentName(view, mode, thisUpdateComponent, newName, existingUpdateComponents, existingDesignVersionComponents, thisDesignVersionComponent);
    };

    validateUpdateDesignUpdateFeatureNarrative(view, mode, designUpdateComponentId){

        const thisUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateFeatureNarrative(view, mode, thisUpdateComponent);
    };

    validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignUpdateComponentData.getUpdateComponentById(movingComponentId);
        const targetComponent = DesignUpdateComponentData.getUpdateComponentById(targetComponentId);

        return DesignUpdateComponentValidationServices.validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignUpdateComponentData.getUpdateComponentById(movingComponentId);
        const targetComponent = DesignUpdateComponentData.getUpdateComponentById(targetComponentId);

        return DesignUpdateComponentValidationServices.validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, baseComponentId, designUpdateId, updateComponent, newScope){

        const designComponent = DesignComponentData.getDesignComponentById(baseComponentId);

        let hasNoNewChildren = true;
        let hasNoRemovedChildren = true;

        if(updateComponent && !newScope){
            // Component exists and de-scoping
            hasNoNewChildren = DesignUpdateComponentModules.isNotParentOfNewChildren(updateComponent._id, false);
        }

        // A list of this component in other updates for the same design version.  Used to stop stuff being changed in two parallel updates at once
        const componentInOtherDesignUpdates = DesignVersionData.getComponentInOtherDvUpdates(designComponent, designUpdateId);

        return DesignUpdateComponentValidationServices.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designComponent, updateComponent, componentInOtherDesignUpdates, hasNoNewChildren, newScope);
    }

    validateSetScenarioTestExpectations(userRole){

        return DesignUpdateComponentValidationServices.validateSetScenarioTestExpectations(userRole);
    }

}
export default new DesignUpdateComponentValidationApi();
