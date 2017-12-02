
// Ultrawide Services
import DesignUpdateServices         from '../../servicers/design_update/design_update_services.js';
import { WorkPackageStatus, WorkPackageTestStatus, UpdateMergeStatus, WorkPackageReviewType, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js'

// Data Access
import DesignComponentData          from '../../data/design/design_component_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
import WorkPackageData              from '../../data/work/work_package_db.js';
import UserDvMashScenarioData       from '../../data/mash/user_dv_mash_scenario_db.js';


//======================================================================================================================
//
// Server Code for Work Package Items.
//
// Methods called directly by Server API
//
//======================================================================================================================
class WorkPackageServices{

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

            // A WP is complete if, for active scenarios:
            // - No failing test Scenarios
            // - No untested Scenarios that are not ignored

            const wpScenarios = WorkPackageData.getActiveScenarios(workPackageId);
            const wp = WorkPackageData.getWorkPackageById(workPackageId);

            // Assume complete until we find trouble
            let wpTestStatus = WorkPackageTestStatus.WP_TESTS_COMPLETE;

            log((msg) => console.log(msg), LogLevel.INFO, 'Updating WP Completeness for WP {}...', wp.workPackageName);

            // This loop breaks as soon as we decide it is not complete
            for (let scenario of wpScenarios){

                // Get latest test results
                let scenarioMash = UserDvMashScenarioData.getScenario(userContext, scenario.componentReferenceId);

                let problem = false;

                // Not complete if no test data
                if(scenarioMash) {

                    // Not complete if any fails

                    if (
                        (scenarioMash.accFailCount && scenarioMash.accFailCount > 0) ||
                        (scenarioMash.intFailCount && scenarioMash.intFailCount > 0) ||
                        (scenarioMash.unitFailCount && scenarioMash.unitFailCount > 0)
                        ) {
                            log((msg) => console.log(msg), LogLevel.INFO, '  Fails');
                            problem = true;
                    }

                    // Not complete if no passes and not ignored
                    let passCount = 0;
                    if(scenarioMash.accPassCount){passCount += scenarioMash.accPassCount}
                    if(scenarioMash.intPassCount){passCount += scenarioMash.intPassCount}
                    if(scenarioMash.unitPassCount){passCount += scenarioMash.unitPassCount}

                    log((msg) => console.log(msg), LogLevel.INFO, '  Pass count = {}', passCount);

                    if (
                        (passCount === 0) &&
                        (scenario.reviewStatus !== WorkPackageReviewType.REVIEW_IGNORE)
                    ) {
                        log((msg) => console.log(msg), LogLevel.INFO, '  No Passes');
                        problem = true;
                    }
                } else {
                    log((msg) => console.log(msg), LogLevel.INFO, '  No Mash');
                    problem = true;
                }

                if(problem){

                    // Check it is not a removed Scenario before failing the WP
                    const designComponent = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, scenario.componentReferenceId);

                    if(designComponent.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED){
                        log((msg) => console.log(msg), LogLevel.INFO, '  Not Removed');
                        wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
                        break;
                    }
                }
            }

            // Update the WP status
            log((msg) => console.log(msg), LogLevel.INFO, 'UpdatingWP Completeness to {}...', wpTestStatus);
            WorkPackageData.setWorkPackageTestStatus(workPackageId, wpTestStatus);

            // Also update the status of the relevant DU if any
            if(wp.designUpdateId !== 'NONE') {
                log((msg) => console.log(msg), LogLevel.INFO, 'Updating DU...');
                DesignUpdateServices.updateDesignUpdateWorkPackageTestStatus(wp.designUpdateId);
            }
        }
    };

    updateWorkPackageName(workPackageId, newName){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageName(workPackageId, newName);
        }
    };


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

export default new WorkPackageServices();
