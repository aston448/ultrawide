import {
    DesignStatus, DesignVersionStatus, DesignUpdateStatus,
    WorkPackageStatus, ViewType,
    UltrawideAction, ComponentType, MashStatus,
    MashTestStatus, FeatureTestSummaryStatus,
    DisplayContext, DesignUpdateMergeAction, UpdateMergeStatus,
    MenuAction,
    TestLocationFileStatus, TestLocationFileType,
    LogLevel}
    from '../constants/constants.js';
import {BacklogType, TestType} from "../constants/constants";


// In this class we can change what is displayed without buggering up the existing data.
// Could be changed to source from stored data ...

class TextLookupsClass {

    designStatus(status){

        switch(status){
            case DesignStatus.DESIGN_LIVE:
                return 'ACTIVE DESIGN';
            case DesignStatus.DESIGN_ARCHIVED:
                return 'ARCHIVED DESIGN';
        }
    }

    designVersionStatus(status){

        switch(status){
            case DesignVersionStatus.VERSION_NEW:
                return 'NEW';
            case DesignVersionStatus.VERSION_DRAFT:
                return 'DRAFT';
            case DesignVersionStatus.VERSION_UPDATABLE:
                return 'UPDATABLE';
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                return 'INITIAL VERSION COMPLETED';
            case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                return 'UPDATABLE VERSION COMPLETED';
        }
    }

    designUpdateStatus(status){

        switch(status){
            case DesignUpdateStatus.UPDATE_NEW:
                return 'NEW';
            case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                return 'DRAFT';
            case DesignUpdateStatus.UPDATE_MERGED:
                return 'MERGED';
            case DesignUpdateStatus.UPDATE_IGNORED:
                return 'IGNORED';
        }
    }

    workPackageStatus(status){

        switch(status){
            case WorkPackageStatus.WP_NEW:
                return 'Unavailable';
            case WorkPackageStatus.WP_ADOPTED:
                return 'Adopted by ';
            case WorkPackageStatus.WP_AVAILABLE:
                return 'Available';
        }
    }

    viewText(view){

        switch(view){
            case ViewType.ADMIN:
                return 'ADMINISTRATION';
            case ViewType.AUTHORISE:
                return 'LOGIN';
            // case ViewType.ROLES:
            //     return 'ROLE SELECTION';
            case ViewType.CONFIGURE:
                return 'USER SETTINGS';
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                return 'DESIGN EDITOR';
            case ViewType.DESIGN_UPDATABLE:
                return 'DESIGN VERSION PROGRESS';
            case ViewType.DESIGN_UPDATE_EDIT:
                return 'DESIGN UPDATE EDITOR';
            case ViewType.DESIGN_UPDATE_VIEW:
                return 'DESIGN UPDATE VIEW';
            // case ViewType.DESIGNS:
            //     return 'SELECT DESIGN';
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                return 'WORK PACKAGE IMPLEMENTATION';
            case ViewType.SELECT:
                return 'HOME PAGE FOR: ';
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                return 'WORK PACKAGE SCOPING';
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return 'WORK PACKAGE VIEW';
        }
    }

    backlogType(backlogType){
        switch(backlogType){
            case BacklogType.BACKLOG_SCENARIO_ANOMALY:
                return 'Scenario Design Anomaly Backlog';
            case BacklogType.BACKLOG_FEATURE_ANOMALY:
                return 'Feature Design Anomaly Backlog';
            case BacklogType.BACKLOG_WP_ASSIGN:
                return 'Work Assignment Backlog';
            case BacklogType.BACKLOG_DESIGN:
                return 'Design Features Scenario Backlog';
            case BacklogType.BACKLOG_TEST_EXP:
                return 'Test Expectations Backlog';
            case BacklogType.BACKLOG_TEST_MISSING:
                return 'Missing Tests Backlog';
            case BacklogType.BACKLOG_TEST_FAIL:
                return 'Failing Tests Backlog'
        }
    }

    ultrawideAction(action){

        switch(action){
            case UltrawideAction.ACTION_HOME:
                return 'HOME FOR CURRENT DESIGN VERSION';
            case UltrawideAction.ACTION_DESIGNS:
                return 'CHOOSE WORKING DESIGN';
            case UltrawideAction.ACTION_LAST_DESIGNER:
            case UltrawideAction.ACTION_LAST_DEVELOPER:
            case UltrawideAction.ACTION_LAST_MANAGER:
                return 'RESUME CURRENT WORK';
            case UltrawideAction.ACTION_CONFIGURE:
                return 'CONFIGURATION and SETTINGS';
        }
    }

    componentTypeName(componentType){

        switch(componentType){
            case ComponentType.DESIGN:
                return 'Design';
            case ComponentType.APPLICATION:
                return 'Application';
            case ComponentType.DESIGN_SECTION:
                return 'Section';
            case ComponentType.FEATURE:
                return 'Feature';
            case ComponentType.FEATURE_ASPECT:
                return 'Feature Aspect';
            case ComponentType.SCENARIO:
                return 'Scenario';
            default:
                return 'Text not defined';
        }
    };

    componentTypeHeader(componentType){

        switch(componentType){
            case ComponentType.DESIGN:
                return 'DESIGN:';
            case ComponentType.APPLICATION:
                return 'APPLICATION:';
            case ComponentType.DESIGN_SECTION:
                return 'SECTION:';
            case ComponentType.FEATURE:
                return 'FEATURE:';
            case ComponentType.FEATURE_ASPECT:
                return 'ASPECT:';
            case ComponentType.SCENARIO:
                return 'SCENARIO:';
            default:
                return 'Text not defined';
        }
    };

    mashStatus(mashStatus){

        switch(mashStatus){
            case MashStatus.MASH_LINKED:
                return 'Implemented';
            case MashStatus.MASH_NOT_IMPLEMENTED:
                return 'Not Implemented';
            case MashStatus.MASH_NOT_DESIGNED:
                return 'Not in Design';
            default:
                return 'UNKNOWN';
        }

    };

    mashTestStatus(mashTestStatus){

        switch(mashTestStatus){
            case MashTestStatus.MASH_NOT_LINKED:
            case MashTestStatus.MASH_NO_TESTS:
                return 'Missing';
            case MashTestStatus.MASH_PENDING:
                return 'Pending';
            case MashTestStatus.MASH_PASS:
                return 'Pass';
            case MashTestStatus.MASH_FAIL:
                return 'Fail';
            case MashTestStatus.MASH_INCOMPLETE:
                return 'Incomplete';
            default:
                return 'No Data';
        }
    };

    featureSummaryStatus(featureSummaryStatus){

        switch(featureSummaryStatus){
            case FeatureTestSummaryStatus.FEATURE_PASSING_TESTS:
                return 'Tests are passing in this feature';
            case FeatureTestSummaryStatus.FEATURE_FAILING_TESTS:
                return 'Tests are failing in this feature';
            case FeatureTestSummaryStatus.FEATURE_NO_TESTS:
                return 'No tests in this feature';
            default:
                return 'No tests in this feature';
        }
    };

    testType(testType){

        switch(testType){
            case TestType.ACCEPTANCE:
                return 'ACC';
            case TestType.INTEGRATION:
                return 'INT';
            case TestType.UNIT:
                return 'UNIT';
        }
    }

    mashTestTypes(displayContext){

        let testType = '';
        switch (displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                return 'Acceptance';
            case DisplayContext.MASH_INT_TESTS:
                return 'Integration';
            case DisplayContext.MASH_UNIT_TESTS:
                return 'Unit';
        }
    };

    updateMergeActions(mergeAction){

        switch(mergeAction){
            case DesignUpdateMergeAction.MERGE_INCLUDE:
                return 'Include';
            case DesignUpdateMergeAction.MERGE_ROLL:
                return 'Roll forward';
            case DesignUpdateMergeAction.MERGE_IGNORE:
                return 'Ignore';
        }
    };

    updateMergeStatus(mergeStatus){

        switch(mergeStatus){
            case UpdateMergeStatus.COMPONENT_BASE:
                return 'Base Version - Unchanged';
            case UpdateMergeStatus.COMPONENT_ADDED:
                return 'Added in this Version';
            case UpdateMergeStatus.COMPONENT_MODIFIED:
                return 'Name Modified in this Version';
            case UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED:
                return 'Details Modified in this Version';
            case UpdateMergeStatus.COMPONENT_MOVED:
                return 'Moved in this Version';
            case UpdateMergeStatus.COMPONENT_REMOVED:
                return 'Removed in this version';
            case UpdateMergeStatus.COMPONENT_BASE_PARENT:
                return 'Has updated children...';
            case UpdateMergeStatus.COMPONENT_SCENARIO_QUERIED:
                return 'Check tests for this Scenario';
        }
    }

    menuItems(menuAction){

        switch(menuAction){
            case MenuAction.MENU_ACTION_GOTO_DESIGNS:
                return 'Designs';
            case MenuAction.MENU_ACTION_GOTO_CONFIG:
                return 'Configuration';
            case MenuAction.MENU_ACTION_GOTO_SELECTION:
                return 'Item Selection';
            case MenuAction.MENU_ACTION_VIEW_DETAILS:
                return 'Details';
            case MenuAction.MENU_ACTION_VIEW_PROGRESS:
                return 'Working View';
            case MenuAction.MENU_ACTION_VIEW_UPD_SUMM:
                return 'Update Summary';
            case MenuAction.MENU_ACTION_VIEW_TEST_SUMM:
                return 'Test Summary';
            case MenuAction.MENU_ACTION_VIEW_TEST_RESULTS:
                return 'Test Results';
            case MenuAction.MENU_ACTION_VIEW_DICT:
                return 'Domain Dictionary';
            case MenuAction.MENU_ACTION_VIEW_ALL_TABS:
                return 'View All as Tabs';
            case MenuAction.MENU_ACTION_REFRESH_TESTS:
                return 'Test and Progress Data';
            case MenuAction.MENU_ACTION_REFRESH_PROGRESS:
                return 'Progress Data';
            case MenuAction.MENU_ACTION_REFRESH_DATA:
                return 'All Data';
        }
    }

    testFileType(fileType){

        switch(fileType){

            case TestLocationFileType.UNIT:
                return 'Unit';
            case TestLocationFileType.INTEGRATION:
                return 'Integration';
            case TestLocationFileType.ACCEPTANCE:
                return 'Acceptance';
            default:
                return 'None';
        }
    }

    fileStatus(fileStatus){

        switch(fileStatus){
            case TestLocationFileStatus.FILE_UPLOADED:
                return 'UPLOADED';
            case TestLocationFileStatus.FILE_NOT_UPLOADED:
                return 'MISSING';
        }
    }

    logLevel(logLevel){

        switch(logLevel) {
            case LogLevel.TRACE:
                return 'TRACE:   ';
            case LogLevel.PERF:
                return 'PERF:    ';
            case LogLevel.DEBUG:
                return 'DEBUG:   ';
            case LogLevel.INFO:
                return 'INFO:    ';
            case LogLevel.WARNING:
                return 'WARNING: ';
            case LogLevel.ERROR:
                return 'ERROR:   ';
        }
    }

}

export const TextLookups = new TextLookupsClass();
