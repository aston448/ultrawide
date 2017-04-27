import {WorkSummaryType, RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkProgressSummaryActions {

    // Goto DVs

    designerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.DESIGNER, expectation);
    }

    developerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.DEVELOPER, expectation);
    }

    managerGoesToInitialDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, RoleType.MANAGER, expectation);
    }

    designerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.DESIGNER, expectation);
    }

    developerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.DEVELOPER, expectation);
    }

    managerGoesToUpdatableDesignVersion(designVersionName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, RoleType.MANAGER, expectation);
    }

    // Goto DUs

    designerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.DESIGNER, expectation);
    }

    developerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.DEVELOPER, expectation);
    }

    managerGoesToDesignUpdate(designUpdateName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, RoleType.MANAGER, expectation);
    }

    // Goto WPs

    designerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.DESIGNER, expectation);
    }

    developerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.DEVELOPER, expectation);
    }

    managerGoesToBaseWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, RoleType.MANAGER, expectation);
    }

    designerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.DESIGNER, expectation);
    }

    developerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.DEVELOPER, expectation);
    }

    managerGoesToUpdateWorkPackage(workPackageName, expectation) {
        server.call('testWorkProgress.gotoWorkItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, RoleType.MANAGER, expectation);
    }
}
export default new WorkProgressSummaryActions()
