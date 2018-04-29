
// Ultrawide Services
import { ComponentType, DesignUpdateMergeAction, LogLevel } from '../../constants/constants.js';

import { DesignVersionModules }         from '../../service_modules/design/design_version_service_modules.js';

// Data Access
import { DesignUpdateData }             from '../../data/design_update/design_update_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
//======================================================================================================================
//
// Server Modules for Design Update Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignUpdateModulesClass{


    componentIsRemovedInOtherUpdate(component, currentDesignVersionId){

        // Is there a parallel update where the same component is removed
        return DesignUpdateComponentData.hasOtherRemovedInstancesInDesignVersion(currentDesignVersionId, component.designUpdateId, component.componentReferenceId);
    };

    removeMergedUpdateFromDesignVersion(designUpdateId){

        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);

        if(update.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.unmergeDesignUpdate(designUpdateId);
        }
    };

    addUpdateToDesignVersion(designUpdateId){

        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);

        if(update.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.mergeDesignUpdate(designUpdateId);
        }
    };


    // This function defines which item types are scopable - i.e. we can base changes on them
    isScopable(itemType){

        switch(itemType){
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
            case ComponentType.SCENARIO:
                return true;
                break;
            default:
                return false;
                break;
        }
    };

}

export const DesignUpdateModules = new DesignUpdateModulesClass();
