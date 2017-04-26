import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkSummaryType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import TestFixtures from './test_fixtures.js';

class WorkProgressSummaryVerifications {

    // Contains Initial DV ---------------------------------------------------------------------------------------------

    designerWorkProgressSummaryContainsInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryContainsInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryContainsInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryDoesNotContainInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryDoesNotContainInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryDoesNotContainInitialDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Contains Update DV ----------------------------------------------------------------------------------------------

    designerWorkProgressSummaryContainsUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryContainsUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryContainsUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryDoesNotContainUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryDoesNotContainUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryDoesNotContainUpdateableDesignVersion(designVersionName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Contains Update -------------------------------------------------------------------------------------------------

    designerWorkProgressSummaryContainsUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryContainsUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryContainsUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryDoesNotContainUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryDoesNotContainUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryDoesNotContainUpdate(designUpdateName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Contains Base WP ------------------------------------------------------------------------------------------------

    designerWorkProgressSummaryContainsBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryContainsBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryContainsBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryDoesNotContainBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryDoesNotContainBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryDoesNotContainBaseWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Contains Update WP ----------------------------------------------------------------------------------------------

    designerWorkProgressSummaryContainsUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryContainsUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryContainsUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryContainsItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryDoesNotContainUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryDoesNotContainUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryDoesNotContainUpdateWp(workPackageName) {

        server.call('verifyWorkProgress.summaryDoesNotContainItem', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Summary Content -------------------------------------------------------------------------------------------------

    designerWorkProgressSummaryForInitialDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, expectedSummary, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryForInitialDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, expectedSummary, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryForInitialDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_DV, designVersionName, expectedSummary, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryForUpdatableDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, expectedSummary, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryForUpdatableDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, expectedSummary, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryForUpdatableDesignVersionIs(designVersionName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_DV, designVersionName, expectedSummary, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryForUpdateIs(designUpdateName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, expectedSummary, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryForUpdateIs(designUpdateName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, expectedSummary, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryForUpdateIs(designUpdateName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE, designUpdateName, expectedSummary, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryForBaseWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, expectedSummary, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryForBaseWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, expectedSummary, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryForBaseWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_BASE_WP, workPackageName, expectedSummary, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerWorkProgressSummaryForUpdateWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, expectedSummary, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerWorkProgressSummaryForUpdateWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, expectedSummary, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerWorkProgressSummaryForUpdateWorkPackageIs(workPackageName, expectedSummary){

        server.call('verifyWorkProgress.summaryForWorkItemIs', WorkSummaryType.WORK_SUMMARY_UPDATE_WP, workPackageName, expectedSummary, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };
}

export default new WorkProgressSummaryVerifications();
