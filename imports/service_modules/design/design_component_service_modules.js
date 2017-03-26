
// Ultrawide Collections
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, WorkPackageStatus, WorkPackageType, LogLevel } from '../../constants/constants.js';

import  DesignComponentServices     from '../../servicers/design/design_component_services.js';

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

    updateWorkPackages(designVersionId, newComponentId){

        // See if any base WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     'NONE',
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();

        const component = DesignVersionComponents.findOne({_id: newComponentId});

        workPackages.forEach((wp) => {

            const wpComponentId = WorkPackageComponents.insert(
                {
                    designVersionId:                designVersionId,
                    workPackageId:                  wp._id,
                    workPackageType:                wp.workPackageType,
                    componentId:                    component._id,
                    componentReferenceId:           component.componentReferenceId,
                    componentType:                  component.componentType,
                    componentParentReferenceId:     component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdNew:    component.componentFeatureReferenceIdNew,
                    componentLevel:                 component.componentLevel,
                    componentIndex:                 component.componentIndexNew,
                    componentParent:                false,
                    componentActive:                false       // Start by assuming nothing in scope
                }
            );

            // If the added item is a Scenario or a Feature Aspect and its parent is already in scope for this WP then put it in scope for the WP
            if(component.componentType === ComponentType.SCENARIO || component.componentType === ComponentType.FEATURE_ASPECT){

                // Get the Design parent
                const parent = DesignVersionComponents.findOne({_id: component.componentParentIdNew});

                // Get the parent in the WP
                const wpParent = WorkPackageComponents.findOne({workPackageId: wp._id, componentReferenceId: parent.componentReferenceId});

                // Update if active in this WP - Scenarios if sibling Scenarios are active.
                if(component.componentType === ComponentType.SCENARIO && (wpParent.componentActive || wpParent.componentParent)){
                    WorkPackageComponents.update(
                        {_id: wpComponentId},
                        {
                            $set:{componentActive: true}
                        }
                    );
                }

                // Feature Aspects if Feature is active
                if(component.componentType === ComponentType.FEATURE_ASPECT && wpParent.componentActive){
                    WorkPackageComponents.update(
                        {_id: wpComponentId},
                        {
                            $set:{componentActive: true}
                        }
                    );
                }
            }
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
                            componentFeatureReferenceIdNew:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
                        }
                    },
                    {multi: true}
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
                            componentFeatureReferenceIdNew:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
                            componentParent:                false,      // Reset WP status
                            componentActive:                false
                        }
                    },
                    {multi: true}
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
