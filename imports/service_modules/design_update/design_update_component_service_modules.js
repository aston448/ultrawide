import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

import { ComponentType, DesignUpdateMergeAction, DesignVersionStatus, DesignUpdateStatus, LogLevel } from '../../constants/constants.js';
import { log} from '../../common/utils.js';

class DesignUpdateComponentModules{

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignUpdateComponents.find({_id: {$ne: componentId}, componentType: componentType, componentParentIdNew: parentId}, {sort:{componentIndexNew: -1}});

        // If no components then leave as default of 100
        if(peerComponents.count() > 0){
            //console.log("Highest peer is " + peerComponents.fetch()[0].componentNameOld);

            let newIndex = peerComponents.fetch()[0].componentIndexOld + 100;

            DesignUpdateComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndexOld: newIndex,
                        componentIndexNew: newIndex
                    }
                }
            );
        }
    };

    updateParentScope(designUpdateComponentId, newScope){

        if(newScope){
            // Setting this component in scope
            // Set all parents to be in Parent Scope (unless already in scope themselves)

            let parentAddId = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentParentIdNew;

            let applicationAdd = false;

            // Applications at the top level are created with parent id = 'NONE';
            while(!applicationAdd){

                DesignUpdateComponents.update(
                    {_id: parentAddId, isInScope: false},
                    {
                        $set:{
                            isParentScope: true
                        }
                    }
                );


                // If we have just updated an Application its time to stop
                applicationAdd = (parentAddId === 'NONE');

                // Get next parent if continuing
                if(!applicationAdd) {
                    parentAddId = DesignUpdateComponents.findOne({_id: parentAddId}).componentParentIdNew;
                }
            }
        } else {
            // Setting this component out of scope:

            // That does not mean children of it are out of scope...

            let descopedItem = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            // Remove all parents from parent scope if they no longer have a child in scope

            // Are there any other in scope or parent scope components that have the same parent id as the descoped item.  If so we don't descope the parent
            let inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, $or:[{isInScope: true}, {isParentScope: true}]}).count();
            let continueLooking = true;

            while(inScopeChildren == 0 && continueLooking){

                DesignUpdateComponents.update(
                    {_id: descopedItem.componentParentIdNew},
                    {
                        $set:{
                            isParentScope: false
                        }
                    }
                );

                // Stop looking if we have reached the Application level
                continueLooking = (descopedItem.componentType != ComponentType.APPLICATION);

                // Get next parent if continuing
                if(continueLooking) {
                    // Move descoped item up to the parent that has just been descoped
                    descopedItem = DesignUpdateComponents.findOne({_id: descopedItem.componentParentIdNew});
                    // And see if its parent has any in scope children
                    inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, isInScope: true}).count();
                }
            }
        }
    };

    hasNoChildren(designUpdateComponentId){
        // Children are those with their parent id = this item and not logically deleted
        return DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId, isRemoved: false}).count() === 0;
    };

    // Check to see if parent is not logically deleted
    isDeleted(designUpdateComponentParentId){

        //console.log("checking to see if " + designUpdateComponentParentId + " is removed...");

        // OK if there actually is no parent
        if(designUpdateComponentParentId === 'NONE'){
            return false;
        }

        //console.log("Not top level...")

        // Otherwise OK if parent is not removed
        return parent = DesignUpdateComponents.findOne({_id: designUpdateComponentParentId}).isRemoved;

    }
}

export default new DesignUpdateComponentModules()
