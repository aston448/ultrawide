import {WorkSummaryType, RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkProgressSummaryActions {

    // Goto DVs

    designerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

    designerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

    // Goto DUs

    designerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.MANAGER, 'miles', expectation);
    }

    // Goto WPs

    designerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.MANAGER, 'miles', expectation);
    }

    designerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.MANAGER, 'miles', expectation);
    }
}
export default new WorkProgressSummaryActions()
