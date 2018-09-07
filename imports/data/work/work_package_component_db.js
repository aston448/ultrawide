
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';

import { ComponentType, WorkPackageScopeType, LogLevel }      from '../../constants/constants.js';

class WorkPackageComponentDataClass {

    // INSERT ==========================================================================================================

    insertNewWorkPackageComponent(designVersionId, designUpdateId, workPackageId, wpType, component, scopeType){

        WorkPackageComponents.insert(
            {
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                workPackageId:                  workPackageId,
                workPackageType:                wpType,
                componentReferenceId:           component.componentReferenceId,
                componentType:                  component.componentType,
                componentParentReferenceId:     component.componentParentReferenceIdNew,
                componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                componentIndex:                 component.componentIndexNew,
                scopeType:                      scopeType
            }
        );
    }

    importComponent(designVersionId, designUpdateId, workPackageId, wpComponent){

        if(Meteor.isServer) {
            return WorkPackageComponents.insert(
                {
                    // Identity
                    designVersionId:                designVersionId,
                    designUpdateId:                 designUpdateId,
                    workPackageId:                  workPackageId,
                    workPackageType:                wpComponent.workPackageType,
                    componentReferenceId:           wpComponent.componentReferenceId,
                    componentParentReferenceId:     wpComponent.componentParentReferenceId,
                    componentFeatureReferenceId:    wpComponent.componentFeatureReferenceId,
                    componentType:                  wpComponent.componentType,
                    componentIndex:                 wpComponent.componentIndex,

                    // Status
                    scopeType:                      wpComponent.scopeType,
                    reviewStatus:                   wpComponent.reviewStatus
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getWpComponentByComponentRef(workPackageId, designComponentReferenceId){

        return WorkPackageComponents.findOne({
            workPackageId:              workPackageId,
            componentReferenceId:       designComponentReferenceId
        });
    }

    getCurrentWpComponents(workPackageId){

        return WorkPackageComponents.find({
            workPackageId:          workPackageId
        }).fetch();
    }

    getActiveWpComponentsByComponentRef(workPackageId, designComponentReferenceId){

        return WorkPackageComponents.find({
            workPackageId:          workPackageId,
            componentReferenceId:   designComponentReferenceId,
            scopeType:              WorkPackageScopeType.SCOPE_ACTIVE
        }).fetch();
    }

    getActiveChildWpComponents(workPackageId, designComponentReferenceId){

        return WorkPackageComponents.find({
            workPackageId:              workPackageId,
            componentParentReferenceId: designComponentReferenceId,
            scopeType:                  WorkPackageScopeType.SCOPE_ACTIVE
        }).fetch();
    }

    getActiveFeatureWpComponents(workPackageId, featureRefId){

        return WorkPackageComponents.find({
            workPackageId:                  workPackageId,
            componentFeatureReferenceId:    featureRefId,
            scopeType:                      WorkPackageScopeType.SCOPE_ACTIVE
        }).fetch();
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

    getChildComponents(workPackageId, parentRefId){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentParentReferenceId: parentRefId
            }
        ).fetch();
    }

    getChildComponentsOfType(workPackageId, childComponentType, parentRefId){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentParentReferenceId: parentRefId,
                componentType: childComponentType
            },
            {sort: {componentIndex: 1}}
        ).fetch();
    }

    getActiveFeatureScenarios(workPackageId, featureReferenceId){

        return WorkPackageComponents.find(
            {
                workPackageId:                  workPackageId,
                componentType:                  ComponentType.SCENARIO,
                componentFeatureReferenceId:    featureReferenceId,
                scopeType:                      WorkPackageScopeType.SCOPE_ACTIVE
            }
        ).fetch();
    }

    getActiveFeatureAspectScenarios(workPackageId, featureAspectReferenceId){

        return WorkPackageComponents.find(
            {
                workPackageId:              workPackageId,
                componentType:              ComponentType.SCENARIO,
                componentParentReferenceId: featureAspectReferenceId,
                scopeType:                  WorkPackageScopeType.SCOPE_ACTIVE
            },
            {sort: {componentIndex: 1}}
        ).fetch();
    }

    getActiveFeatureAspectScenario(workPackageId, featureAspectReferenceId, scenarioReferenceId){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentType: ComponentType.SCENARIO,
                componentReferenceId: scenarioReferenceId,
                componentParentReferenceId: featureAspectReferenceId,
                scopeType: WorkPackageScopeType.SCOPE_ACTIVE
            },
            {sort: {componentIndex: 1}}
        ).fetch();
    }

    getChildFeatureCount(workPackageId, componentReferenceId){

        return WorkPackageComponents.find({
            workPackageId:                workPackageId,
            componentParentReferenceId:   componentReferenceId,
            componentType:                ComponentType.FEATURE
        }).count()
    }

    getNonScenarioChildComponents(workPackageId, parentRefId){

        return WorkPackageComponents.find({
            workPackageId:                  workPackageId,
            componentParentReferenceId:     parentRefId,
            componentType:                  {$ne:(ComponentType.SCENARIO)}
        }).fetch();
    }


    // UPDATE ==========================================================================================================

    updateExistingWpComponent(wpComponentId, designComponent, scopeType){

        WorkPackageComponents.update(
            {_id: wpComponentId},
            {
                $set:{
                    componentReferenceId:           designComponent.componentReferenceId,
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

export const WorkPackageComponentData = new WorkPackageComponentDataClass();