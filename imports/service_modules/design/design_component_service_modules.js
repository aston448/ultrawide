import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

import { ComponentType, WorkPackageStatus, WorkPackageType, LogLevel } from '../../constants/constants.js';
import {getIdFromMap, log} from '../../common/utils.js';

import  DesignComponentServices     from '../../servicers/design/design_component_services.js';

class DesignComponentModules{

    addDefaultFeatureAspects(designVersionId, featureId, defaultRawText, defaultRawNarrative){
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Interface', this.getRawTextFor('Interface'), defaultRawText, defaultRawNarrative, false);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Actions', this.getRawTextFor('Actions'), defaultRawText, defaultRawNarrative, false);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Conditions', this.getRawTextFor('Conditions'), defaultRawText, defaultRawNarrative, false);
        DesignComponentServices.addNewComponent(designVersionId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Consequences', this.getRawTextFor('Consequences'), defaultRawText, defaultRawNarrative, false);
    }

    getRawTextFor(aspectName){
        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : aspectName,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    }

    updateWorkPackages(designVersionId, newComponentId){

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        const component = DesignComponents.findOne({_id: newComponentId});

        workPackages.forEach((wp) => {

            WorkPackageComponents.insert(
                {
                    workPackageId:                  wp._id,
                    workPackageType:                wp.workPackageType,
                    componentId:                    component._id,
                    componentReferenceId:           component.componentReferenceId,
                    componentType:                  component.componentType,
                    componentParentReferenceId:     component.componentParentReferenceId,
                    componentFeatureReferenceId:    component.componentFeatureReferenceId,
                    componentLevel:                 component.componentLevel,
                    componentIndex:                 component.componentIndex,
                    componentParent:                false,
                    componentActive:                false       // Start by assuming nothing in scope
                }
            );
        });

    };

    updateWorkPackageLocation(designComponentId, reorder){

        const component = DesignComponents.findOne({_id: designComponentId});

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    component.designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        //console.log("Update WP Location WPs to update: " + workPackages.length);

        workPackages.forEach((wp) => {
            if(reorder){
                // Just a reordering job so can keep the WP scope as it is
                WorkPackageComponents.update(
                    {
                        workPackageId:                  wp._id,
                        workPackageType:                wp.workPackageType,
                        componentId:                    designComponentId
                    },
                    {
                        $set:{
                            componentParentReferenceId:     component.componentParentReferenceId,
                            componentFeatureReferenceId:    component.componentFeatureReferenceId,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndex,
                        }
                    },
                    {multi: true},
                    (error, result) => {
                        if(error) {
                            // Error handler
                            //console.log("Update WP Location Error: " + error);
                            return false;
                        } else {
                            //console.log("Update WP Location Success: " + result);
                            return true;
                        }
                    }
                );
            } else {
                // Moved to a new section so will have to descope from WP
                WorkPackageComponents.update(
                    {
                        workPackageId:                  wp._id,
                        workPackageType:                wp.workPackageType,
                        componentId:                    designComponentId
                    },
                    {
                        $set:{
                            componentParentReferenceId:     component.componentParentReferenceId,
                            componentFeatureReferenceId:    component.componentFeatureReferenceId,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndex,
                            componentParent:                false,      // Reset WP status
                            componentActive:                false
                        }
                    },
                    {multi: true},
                    (error, result) => {
                        if(error) {
                            // Error handler
                            //console.log("Update WP Move Location Error: " + error);
                            return false;
                        } else {
                            //console.log("Update WP Move Location Success: " + result);
                            return true;
                        }
                    }
                );
            }

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
            WorkPackageComponents.remove(
                {
                    workPackageId:                  wp._id,
                    workPackageType:                wp.workPackageType,
                    componentId:                    designComponentId
                }
            );
        });

    };

    // Called when restoring data after a reset
    importComponent(designId, designVersionId, component){

        // Fix missing feature refs
        let componentFeatureReferenceId = component.componentFeatureReferenceId;
        if (component.componentType === ComponentType.FEATURE && componentFeatureReferenceId === 'NONE'){
            componentFeatureReferenceId = component.componentReferenceId;
        }

        const designComponentId = DesignComponents.insert(
            {
                // Identity
                componentReferenceId:       component.componentReferenceId,
                designId:                   designId,                               // Will be a new id for the restored data
                designVersionId:            designVersionId,                        // Ditto
                componentType:              component.componentType,
                componentLevel:             component.componentLevel,
                componentParentId:          component.componentParentId,            // This will be wrong and fixed by restore process
                componentParentReferenceId: component.componentParentReferenceId,
                componentFeatureReferenceId:componentFeatureReferenceId,
                componentIndex:             component.componentIndex,

                // Data
                componentName:              component.componentName,
                componentNameRaw:           component.componentNameRaw,
                componentNarrative:         component.componentNarrative,
                componentNarrativeRaw:      component.componentNarrativeRaw,
                componentTextRaw:           component.componentTextRaw,

                // State (shared and persistent only)
                isRemovable:                component.isRemovable,
                isRemoved:                  component.isRemoved,
                isNew:                      component.isNew,
                lockingUser:                component.lockingUser,
                designUpdateId:             component.designUpdateId
            }
        );

        return designComponentId;

    };

    // Resets parent ids after an import of data
    importRestoreParent(designComponentId, componentMap){

        const designComponent = DesignComponents.findOne({_id: designComponentId});

        const oldParentId = designComponent.componentParentId;
        let newParentId = 'NONE';

        if(oldParentId != 'NONE'){
            newParentId = getIdFromMap(componentMap, oldParentId);
        }

        DesignComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentParentId: newParentId
                }
            }
        )


    }

    // Set any other components to no longer new
    setComponentsOld(designComponentId){
        DesignComponents.update(
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
        return DesignComponents.find({componentParentId: designComponentId}).count() === 0;
    };

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignComponents.find({_id: {$ne: componentId}, componentType: componentType, componentParentId: parentId}, {sort:{componentIndex: -1}});

        // If no components then leave as default of 100
        if(peerComponents.count() > 0){
            //console.log("Highest peer is " + peerComponents.fetch()[0].componentName);

            let newIndex = peerComponents.fetch()[0].componentIndex + 100;

            DesignComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndex: newIndex
                    }
                }
            );
        }
    }

}

export default new DesignComponentModules();