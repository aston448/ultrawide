
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';

import { DesignVersionStatus, WorkSummaryType, WorkPackageStatus, WorkPackageType, ComponentType, WorkPackageScopeType, UpdateScopeType, MashTestStatus, DesignUpdateStatus, DesignUpdateMergeAction, UpdateMergeStatus, LogLevel }      from '../../constants/constants.js';

class WorkPackageData {

    // SELECT ==========================================================================================================

    getWorkPackageById(workPackageId){

        return WorkPackages.findOne({_id: workPackageId});
    }

    getActiveWorkPackagesForDesignUpdate(designVersionId, designUpdateId){

        return WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();
    }

    getActiveScenarios(workPackageId){

        return WorkPackageComponents.find({
            workPackageId: workPackageId,
            componentType: ComponentType.SCENARIO,
            scopeType: WorkPackageScopeType.SCOPE_ACTIVE
        }).fetch();
    }

    getAllWorkPackageComponents(workPackageId){

        return WorkPackageComponents.find({workPackageId: workPackageId}).fetch();
    }
}

export default new WorkPackageData();