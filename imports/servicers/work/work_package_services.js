
// Ultrawide Services
import { DesignUpdateServices }         from '../../servicers/design_update/design_update_services.js';
import { WorkPackageStatus, WorkPackageTestStatus, UpdateMergeStatus, WorkPackageReviewType, MashTestStatus, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js'

// Data Access
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { UserMashScenarioTestData }     from "../../data/mash/user_mash_scenario_test_db";


//======================================================================================================================
//
// Server Code for Work Package Items.
//
// Methods called directly by Server API
//
//======================================================================================================================
class WorkPackageServicesClass {

    // Add a new Work Package
    addNewWorkPackage(designVersionId, designUpdateId, wpType, populateWp){

        if(Meteor.isServer) {

            return WorkPackageData.insertNewWorkPackage(designVersionId, designUpdateId, wpType);
        }
    };


    publishWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_AVAILABLE);
        }
    };

    withdrawWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_NEW);
        }
    };

    adoptWorkPackage(workPackageId, userId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_ADOPTED);
            WorkPackageData.setAdoptingUser(workPackageId, userId);
        }
    }

    releaseWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_AVAILABLE);
            WorkPackageData.setAdoptingUser(workPackageId, 'NONE');
        }
    }

    updateWorkPackageTestCompleteness(userContext, workPackageId){

        if(Meteor.isServer) {

            // A WP is complete if Adopted and, for active scenarios:
            // - No failing test Scenarios
            // - No untested Scenarios that are not ignored

            const wpScenarios = WorkPackageData.getActiveScenarios(workPackageId);
            const wp = WorkPackageData.getWorkPackageById(workPackageId);

            // Assume complete until we find trouble
            let wpTestStatus = WorkPackageTestStatus.WP_TESTS_COMPLETE;

            log((msg) => console.log(msg), LogLevel.DEBUG, 'Updating WP Completeness for WP {}...', wp.workPackageName);

            // Only Adopted WPs can go to complete...
            if(wp.workPackageStatus === WorkPackageStatus.WP_ADOPTED) {

                // No scenarios = not complete
                if(wpScenarios.length > 0) {

                    // This loop breaks as soon as we decide it is not complete
                    for (let scenario of wpScenarios) {

                        // Get latest test results
                        const mashScenarioResults = UserMashScenarioTestData.getAllScenarioTestData(userContext.userId, userContext.designVersionId, scenario.componentReferenceId);

                        let passCount = 0;
                        let failCount = 0;
                        let missingCount = 0;

                        mashScenarioResults.forEach((mashScenarioResult) => {

                            if(mashScenarioResult.testOutcome === MashTestStatus.MASH_PASS){
                                passCount++;
                            } else {
                                if(mashScenarioResult.testOutcome === MashTestStatus.MASH_FAIL){
                                    failCount++;
                                } else {
                                    missingCount++;
                                }
                            }
                        });

                        let problem = false;

                        if ((passCount + failCount + missingCount) > 0) {

                            // Any fails its bad
                            if (failCount > 0) {
                                problem = true;
                            } else {
                                // No fails so any passes is good
                                if ((passCount > 0) && (missingCount === 0)
                                ) {
                                    problem = false;
                                } else {
                                    if((scenario.reviewStatus !== WorkPackageReviewType.REVIEW_IGNORE)){
                                        problem = true;
                                    }
                                }
                            }
                        } else {
                            problem = true;
                        }

                        if (problem) {

                            // Check it is not a removed Scenario before failing the WP
                            const designComponent = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, scenario.componentReferenceId);

                            if (designComponent.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {
                                log((msg) => console.log(msg), LogLevel.DEBUG, '  Not Removed');
                                wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
                                break;
                            }
                        }
                    }
                } else {
                    wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
                }
            } else {
                wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
            }

            // Update the WP status
            log((msg) => console.log(msg), LogLevel.DEBUG, 'UpdatingWP Completeness to {}...', wpTestStatus);
            WorkPackageData.setWorkPackageTestStatus(workPackageId, wpTestStatus);

            // Also update the status of the relevant DU if any
            if(wp.designUpdateId !== 'NONE') {
                log((msg) => console.log(msg), LogLevel.DEBUG, 'Updating DU...');
                DesignUpdateServices.updateDesignUpdateWorkPackageTestStatus(wp.designUpdateId);
            }
        }
    };

    updateWorkPackageName(workPackageId, newName){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageName(workPackageId, newName);
        }
    };

    updateWorkPackageLink(workPackageId, newLink){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageLink(workPackageId, newLink);
        }
    }

    removeWorkPackage(workPackageId){

        if(Meteor.isServer) {
            // Delete all components in the work package
            let removedComponents = WorkPackageData.removeAllComponents(workPackageId);

            if(removedComponents >= 0){

                // Clear any design components associated with this WP
                DesignComponentData.removeWorkPackageIds(workPackageId);
                DesignUpdateComponentData.removeWorkPackageIds(workPackageId);

                // OK so delete the WP itself
                WorkPackageData.removeWorkPackage(workPackageId);
            }
        }
    };

}

export const WorkPackageServices = new WorkPackageServicesClass();
