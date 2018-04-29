/**
 * Created by aston on 05/12/2016.
 */

import { AppGlobal }                from '../../imports/collections/app/app_global.js';
import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { DomainDictionary }         from '../../imports/collections/design/domain_dictionary.js';
import { DesignVersionComponents }  from '../../imports/collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';
import { UserContext }              from '../../imports/collections/context/user_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';
import { UserDesignVersionMashScenarios }  from '../../imports/collections/mash/user_dv_mash_scenarios.js';
import { UserMashScenarioTests }    from '../../imports/collections/mash/user_mash_scenario_tests.js';
import { UserDevTestSummary }       from '../../imports/collections/summary/user_dev_test_summary.js';
import { UserWorkProgressSummary }  from '../../imports/collections/summary/user_work_progress_summary.js';

import { ClientAppHeaderServices }      from '../../imports/apiClient/apiClientAppHeader.js';

import {RoleType, WorkSummaryType, UltrawideDirectory, ViewMode, DisplayContext, ComponentType, TestLocationFileType, TestRunner} from '../../imports/constants/constants.js';

class TestDataHelpersClass {

    getStore(){
        return ClientAppHeaderServices.getStore();
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

    getExpectation(expectation){
        return (expectation != null) ? expectation : {success: true, message: 'SUCCESS'};
    }

    processClientCallOutcome(outcome, expectation, location){

        if(!location){
            location = 'Unknown Proc';
        }

        if(expectation.success){
            // Were expecting this call to be valid
            if(!(outcome.success)){
                // Something wrong in test or code
                throw new Meteor.Error('INVALID', location + ': Unexpected validation failure: ' + outcome.message);
            }
        } else {
            // Check we did get an error
            if(outcome.success){
                throw new Meteor.Error('UNEXPECTED', location + ': Expecting failure: \"' + expectation.message + '\" but got SUCCESS');
            }

            // Were expecting a validation failure - check its the right one
            if(outcome.message !== expectation.message){
                throw new Meteor.Error('UNEXPECTED', location + ': Expecting failure: \"' + expectation.message + '\" but got: \"' + outcome.message + '\"');
            }
        }
    };

    getDataDir(){

        const globalData = AppGlobal.findOne({
            versionKey: 'CURRENT_VERSION'
        });

        if(globalData){
            return globalData.dataStore;
        } else {
            throw new Meteor.Error("FAIL", "Global data not found!");
        }
    }

    getTestOutputDir(){

        return this.getDataDir() + UltrawideDirectory.TEST_OUTPUT_DIR;
    }

    getUser(userName){

        const user = UserRoles.findOne({userName: userName});

        if(user){
            return user;
        } else {
            throw new Meteor.Error("FAIL", "User not found for " + userName);
        }
    }

    getUserContext(userName){

        const user = UserRoles.findOne({userName: userName});
        if(!user){
            throw new Meteor.Error("FAIL", "User " + userName + " not found.");
        }

        const userContext = UserContext.findOne({userId: user.userId});

        if(!userContext){
            throw new Meteor.Error("FAIL", "User Context not found for " + userName + " with id " + user.userId);
        }

        return userContext;

    };

    getUserRole(userName){

        switch(userName){
            case 'gloria':
                return RoleType.DESIGNER;
            case 'hugh':
            case 'davey':
                return RoleType.DEVELOPER;
            case 'miles':
                return RoleType.MANAGER;
        }
    }

    getViewOptions(userId){


        const viewOptions = UserCurrentViewOptions.findOne({userId: userId});

        if(!viewOptions){
            throw new Meteor.Error("FAIL", "View Options not found for user id " + userId);
        }

        return viewOptions;
    }

    getDesign(designName){

        const design = Designs.findOne({designName: designName});
        if(!design){
            throw new Meteor.Error("FAIL", "Design " + designName + " not found.");
        }

        return design;
    };

    getDesignVersion(designId, designVersionName){

        const designVersion = DesignVersions.findOne({designId: designId, designVersionName: designVersionName});
        const design = Designs.findOne({_id: designId});

        if(!designVersion){
            throw new Meteor.Error("FAIL", "Design Version " + designVersionName + " not found for Design " + design.designName);
        }

        return designVersion;
    };

    getDesignUpdate(designVersionId, designUpdateName){

        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const designUpdate = DesignUpdates.findOne({designVersionId: designVersionId, updateName: designUpdateName});

        if(!designUpdate){
            throw new Meteor.Error("FAIL", "Design Update " + designUpdateName + " not found for Design Version " + designVersion.designVersionName);
        }

        return designUpdate;
    }

    getContextWorkPackage(workPackageId){

        const workPackage = WorkPackages.findOne({_id: workPackageId});

        if(workPackage){
            return workPackage;
        } else {
            throw new Meteor.Error("FAIL", "Work Package not found for User Context id " + workPackageId);
        }

    }

    getContextDesignComponent(componentId){

        const component = DesignVersionComponents.findOne({_id: componentId});

        if(component){
            return component;
        } else {
            throw new Meteor.Error("FAIL", "Design Component not found for User Context component id " + componentId);
        }

    }

    getContextDesignUpdateComponent(componentId){

        const updateComponent = DesignUpdateComponents.findOne({_id: componentId});

        if(updateComponent){
            return updateComponent;
        } else {
            throw new Meteor.Error("FAIL", "Update Component not found for User Context component id " + componentId);
        }

    }

    getWorkPackage(designVersionId, designUpdateId, workPackageName){

        const designVersion = DesignVersions.findOne({_id: designVersionId});
        let designUpdateName = 'NONE';
        if(designUpdateId !== 'NONE'){
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        const workPackage = WorkPackages.findOne({
            designVersionId: designVersionId,
            designUpdateId: designUpdateId,
            workPackageName: workPackageName});

        if(!workPackage){
            throw new Meteor.Error("FAIL", "Work Package " + workPackageName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return workPackage;
    };

    getDomainDictionaryTerm(designId, designVersionId, termName){

        const dictionaryTerm = DomainDictionary.findOne({designId: designId, designVersionId: designVersionId, domainTermNew: termName});

        if(dictionaryTerm){
            return dictionaryTerm;
        } else {
            throw new Meteor.Error("FAIL", "Dictionary entry " + termName + " not found.");
        }
    }

    getDesignComponent(designVersionId, designUpdateId, componentName){

        let designComponent = null;
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});

        if(designUpdateId === 'NONE'){
            designComponent = DesignVersionComponents.findOne({
                designVersionId: designVersionId,
                componentNameNew:  componentName
            });

        } else {
            designComponent = DesignUpdateComponents.findOne({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentNameNew:  componentName
            });
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return designComponent;

    };

    getDesignComponentWithParent(designVersionId, componentType, componentParentName, componentName){

        let designComponent = null;
        let parentComponent = null;
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});


        const designComponents = DesignVersionComponents.find({
            designVersionId: designVersionId,
            componentType: componentType,
            componentNameNew:  componentName
        }).fetch();

        // Get the component that has the expected parent- except for Applications that have no parent
        if(componentType !== ComponentType.APPLICATION) {
            designComponents.forEach((component) => {

                parentComponent = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdNew});

                if (parentComponent.componentNameNew === componentParentName) {
                    designComponent = component;
                }

            });
        } else {
            // Application names are unique so assume can be only one
            designComponent = designComponents[0];
        }

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " with parent " + componentParentName);
        }

        return designComponent;

    };

    getDesignComponentWithParentOld(designVersionId, componentType, componentParentName, componentName){

        let designComponent = null;
        let parentComponent = null;
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});


        const designComponents = DesignVersionComponents.find({
            designVersionId: designVersionId,
            componentType: componentType,
            componentNameOld:  componentName
        }).fetch();

        // Get the component that has the expected parent- except for Applications that have no parent
        if(componentType !== ComponentType.APPLICATION) {
            designComponents.forEach((component) => {

                parentComponent = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdOld});

                if (parentComponent.componentNameOld === componentParentName) {
                    designComponent = component;
                }

            });
        } else {
            // Application names are unique so assume can be only one
            designComponent = designComponents[0];
        }

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found as old version for Design Version " + designVersion.designVersionName + " with parent " + componentParentName);
        }

        return designComponent;

    };

    getDesignComponentOldWithParent(designVersionId, componentType, componentParentName, componentName){

        let designComponent = null;
        let parentComponent = null;
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});


        const designComponents = DesignVersionComponents.find({
            designVersionId: designVersionId,
            componentType: componentType,
            componentNameOld:  componentName
        }).fetch();

        // Get the component that has the expected parent- except for Applications that have no parent
        if(componentType !== ComponentType.APPLICATION) {
            designComponents.forEach((component) => {

                parentComponent = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdOld});

                if (parentComponent.componentNameOld === componentParentName) {
                    designComponent = component;
                }

            });
        } else {
            // Application names are unique so assume can be only one
            designComponent = designComponents[0];
        }

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " with parent " + componentParentName);
        }

        return designComponent;

    };

    getDesignUpdateComponentWithParent(designVersionId, designUpdateId, componentType, componentParentName, componentName){

        let designUpdateComponent = null;
        let parentComponent = null;
        const designVersion = DesignVersions.findOne({_id: designVersionId});

        const designUpdateComponents = DesignUpdateComponents.find({
            designVersionId: designVersionId,
            designUpdateId: designUpdateId,
            componentType: componentType,
            componentNameNew:  componentName
        }).fetch();

        // Get the component that has the expected parent- except for Applications that have no parent
        if(componentType !== ComponentType.APPLICATION) {
            designUpdateComponents.forEach((component) => {

                //console.log("  Component " + component.componentNameNew + " DU: " + component.designUpdateId + " PAR REF: " + component.componentParentReferenceIdNew);

                parentComponent = DesignUpdateComponents.findOne({designVersionId: component.designVersionId, designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdNew});

                if (parentComponent.componentNameNew === componentParentName) {
                    designUpdateComponent = component;
                }

            });
        } else {
            // Application names are unique so assume can be only one
            designUpdateComponent = designUpdateComponents[0];
        }

        let designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;

        if(!designUpdateComponent){
            //console.log("Design Update Component " + componentType + " : " + componentName + " not found with parent " + componentParentName + " for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName)
            throw new Meteor.Error("FAIL DU", "Design Update Component " + componentType + " : " + componentName + " not found with new parent " + componentParentName + " for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return designUpdateComponent;

    };

    getDesignUpdateComponentWithParentOld(designVersionId, designUpdateId, componentType, componentParentName, componentName){

        let designUpdateComponent = null;
        let parentComponent = null;
        const designVersion = DesignVersions.findOne({_id: designVersionId});

        const designUpdateComponents = DesignUpdateComponents.find({
            designVersionId: designVersionId,
            designUpdateId: designUpdateId,
            componentType: componentType,
            componentNameOld:  componentName
        }).fetch();

        // Get the component that has the expected parent- except for Applications that have no parent
        if(componentType !== ComponentType.APPLICATION) {
            designUpdateComponents.forEach((component) => {

                //console.log("  Component " + component.componentNameNew + " DU: " + component.designUpdateId + " PAR REF: " + component.componentParentReferenceIdNew);

                parentComponent = DesignUpdateComponents.findOne({designVersionId: component.designVersionId, designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdOld});

                if (parentComponent.componentNameOld === componentParentName) {
                    designUpdateComponent = component;
                }

            });
        } else {
            // Application names are unique so assume can be only one
            designUpdateComponent = designUpdateComponents[0];
        }

        let designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;

        if(!designUpdateComponent){
            //console.log("Design Update Component " + componentType + " : " + componentName + " not found with parent " + componentParentName + " for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName)
            throw new Meteor.Error("FAIL", "Design Update Component " + componentType + " : " + componentName + " not found with old parent " + componentParentName + " for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return designUpdateComponent;

    };

    getWorkPackageComponentWithParent(designVersionId, designUpdateId, workPackageId, componentType, componentParentName, componentName, expectationFailure = false){
        // Allows us to get a component by combination of name and parent name - so we can get Feature Aspects successfully
        let designComponents = [];
        let designComponent = null;
        let parentComponent = null;
        let designComponentRef = '';
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const workPackage = WorkPackages.findOne({_id: workPackageId});

        if(designUpdateId === 'NONE'){
            designComponents = DesignVersionComponents.find({
                designVersionId: designVersionId,
                componentType: componentType,
                componentNameNew:  componentName
            }).fetch();

            // Get the component that has the expected parent- except for Applications that have no parent
            if(componentType !== ComponentType.APPLICATION) {
                designComponents.forEach((component) => {

                    parentComponent = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdNew});

                    if (parentComponent.componentNameNew === componentParentName) {
                        designComponent = component;
                    }

                });
            } else {
                // Application names are unique so assume can be only one
                designComponent = designComponents[0];
            }

        } else {
            designComponents = DesignUpdateComponents.find({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: componentType,
                componentNameNew:  componentName
            }).fetch();

            // Get the component that has the expected parent- except for Applications that have no parent
            if(componentType !== ComponentType.APPLICATION) {
                designComponents.forEach((component) => {

                    let parentComponent = DesignUpdateComponents.findOne({designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdNew});

                    if (parentComponent.componentNameNew === componentParentName) {
                        designComponent = component;
                    }
                });
            } else {
                // Application names are unique so assume can be only one
                designComponent = designComponents[0];
            }

            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        if(designComponent){
            designComponentRef = designComponent.componentReferenceId;
        } else {
            if(expectationFailure){
                // There should not be a Design Component if there is no WP component as the name comes from the base Design, not the WP
                return true;
            } else {
                throw new Meteor.Error("FAIL WP", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
            }
        }

        const workPackageComponent = WorkPackageComponents.findOne({
            designVersionId: designVersionId,
            workPackageId: workPackageId,
            componentReferenceId: designComponentRef
        });

        if(!workPackageComponent){
            if(expectationFailure){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName + " and Work Package " + workPackage.workPackageName);
            }
        }

        return workPackageComponent;

    };

    getWorkPackageComponentParentName(designVersionId, designUpdateId, workPackageId, componentType, componentName){

        let designComponent = null;
        let designComponentParentRef = '';
        let parentComponent = null;
        let designUpdateName = 'NONE';
        let parentComponentName = '';
        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const workPackage = WorkPackages.findOne({_id: workPackageId});

        if(designUpdateId === 'NONE'){
            designComponent = DesignVersionComponents.findOne({
                designVersionId: designVersionId,
                componentType: componentType,
                componentNameNew:  componentName
            });

            if(designComponent){
                designComponentParentRef = designComponent.componentParentReferenceIdNew;
            } else {
                throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
            }

            if(designComponentParentRef === 'NONE'){
                return 'NONE';
            } else {
                parentComponent = DesignVersionComponents.findOne({
                    designVersionId: designVersionId,
                    componentReferenceId: designComponentParentRef
                });

                if(parentComponent){
                    return parentComponent.componentNameNew;
                } else {
                    return 'NONE';
                }
            }

        } else {
            designComponent = DesignUpdateComponents.findOne({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: componentType,
                componentNameNew:  componentName
            });
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
            if(designComponent){
                designComponentParentRef = designComponent.componentParentReferenceIdNew;
            } else {
                throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
            }

            if(designComponentParentRef === 'NONE'){
                return 'NONE';
            } else {
                parentComponent = DesignUpdateComponents.findOne({
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    componentReferenceId: designComponentParentRef
                });

                if(parentComponent){
                    return parentComponent.componentNameNew;
                } else {
                    return 'NONE';
                }
            }
        }


    }

    getTestOutputLocation(locationName){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(!location){
            throw new Meteor.Error("FAIL_NO_LOCATION", "Test Output Location " + locationName + " not found");
        } else {
            return location;
        }
    };

    getTestOutputLocationFile(locationName, fileAlias){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(!location){
            throw new Meteor.Error("FAIL", "Test Output Location " + locationName + " not found");
        } else {

            const file = TestOutputLocationFiles.findOne({locationId: location._id, fileAlias: fileAlias});

            if(!file){
                throw new Meteor.Error("FAIL", "Test Output Location File " + fileAlias + " not found for location " + locationName);
            } else {
                return file;
            }
        }
    };

    getUserTestOutputConfiguration(locationName, userId){

        const config = UserTestTypeLocations.findOne({
            userId:         userId,
            locationName:   locationName
        });

        const user = UserRoles.findOne({userId: userId});

        if(!user){
            throw new Meteor.Error("FAIL", "User not found for user id " + userId);
        }

        if(config){
            return config;
        } else {
            throw new Meteor.Error("FAIL", "User Test Location Config not found for location " + locationName + " for user name " + user.userName );
        }
    };

    getIntegrationResultsOutputFiles_ChimpMocha(locationName){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(location) {
            return TestOutputLocationFiles.find({
                locationId: location._id,
                fileType: TestLocationFileType.INTEGRATION,
                testRunner: TestRunner.CHIMP_MOCHA
            }).fetch();
        } else {
            throw new Meteor.Error("FAIL", "Test Output Location " + locationName + " not found");
        }
    };

    getUnitResultsOutputFiles_MeteorMocha(locationName){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(location) {
            return TestOutputLocationFiles.find({
                locationId: location._id,
                fileType: TestLocationFileType.UNIT,
                testRunner: TestRunner.METEOR_MOCHA
            }).fetch();
        } else {
            throw new Meteor.Error("FAIL", "Test Output Location " + locationName + " not found");
        }
    };

    getMashTestResult(userContext, scenarioName){

        const testScenarios = UserDesignVersionMashScenarios.find({}).fetch();

        // console.log("Current Results are:");
        // testScenarios.forEach((mashScenario) => {
        //     console.log("    Scenario: " + mashScenario.scenarioName + "  Result: " + mashScenario.intMashTestStatus);
        // });
        // console.log("Test Mash Scenarios: " + testScenarios.length);

        const testResult = UserDesignVersionMashScenarios.findOne({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId,
            scenarioName:       scenarioName
        });

        if(testResult) {
            return testResult
        } else {
            throw new Meteor.Error("FAIL", "Test Result not found  for Scenario " + scenarioName + " in user context DV: " + userContext.designVersionId);
        }
    };

    getUnitTestResult(userContext, scenarioName, unitTestName, expectFailure = false){

        let testScenario = null;

        if(userContext.designUpdateId === 'NONE'){
            testScenario = DesignVersionComponents.findOne({
                designVersionId:    userContext.designVersionId,
                componentNameNew:      scenarioName
            });
        } else {
            testScenario = DesignUpdateComponents.findOne({
                designVersionId:    userContext.designVersionId,
                designUpdateId:     userContext.designUpdateId,
                componentNameNew:   scenarioName
            });
        }

        if(testScenario){

            // Assumption that unit test names are unique in a scenario in the test data
            const unitTestResult = UserMashScenarioTests.findOne({
                userId:                     userContext.userId,
                designVersionId:            userContext.designVersionId,
                designScenarioReferenceId:  testScenario.componentReferenceId,
                testName:                   unitTestName
            });

            if(unitTestResult){
                if(expectFailure){
                    throw new Meteor.Error("FAIL", "Unit Test Result WAS found for test " + unitTestName + " in Scenario " + scenarioName);
                } else {
                    return unitTestResult;
                }
            } else {
                if(expectFailure){
                    return true;
                } else {
                    throw new Meteor.Error("FAIL", "Unit Test Result not found for test " + unitTestName + " in Scenario " + scenarioName);
                }
            }
        } else {
            throw new Meteor.Error("FAIL", "Test Scenario " + scenarioName + " not found in design");
        }
    }

    getTestSummaryFeatureData(userId, designVersionId, featureReferenceId, featureName){

        const summaryData = UserDevTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            featureReferenceId:     featureReferenceId,
            scenarioReferenceId:    'NONE'
        });

        if(summaryData){
            return summaryData;
        } else {
            throw new Meteor.Error("FAIL", "Test Summary Data not found for Feature " + featureName);
        }
    }

    getTestSummaryScenarioData(userId, designVersionId, scenarioReferenceId, scenarioName){

        // Scenario data is actually the Design Mash data for the Test Summary

        const summaryData = UserDesignVersionMashScenarios.findOne({
            userId:                     userId,
            designVersionId:            designVersionId,
            designScenarioReferenceId:  scenarioReferenceId
        });

        if(summaryData){
            return summaryData;
        } else {
            throw new Meteor.Error("FAIL", "Test Summary Data not found for Scenario " + scenarioName);
        }
    }

    getWorkProgressDataFor(userContext, itemType, itemName){

        let item = null;
        let workProgress = null;

        switch(itemType){
            case WorkSummaryType.WORK_SUMMARY_BASE_DV:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_DV:

                workProgress = UserWorkProgressSummary.findOne({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    workSummaryType: itemType
                });

                break;

            case WorkSummaryType.WORK_SUMMARY_UPDATE:

                item = DesignUpdates.findOne({updateName: itemName});

                if(item) {
                    workProgress = UserWorkProgressSummary.findOne({
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: item._id,
                        workSummaryType: itemType
                    });
                }

                break;

            case WorkSummaryType.WORK_SUMMARY_BASE_WP:
            case WorkSummaryType.WORK_SUMMARY_UPDATE_WP:

                item = WorkPackages.findOne({workPackageName: itemName});

                if(item) {
                    workProgress = UserWorkProgressSummary.findOne({
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        workPackageId: item._id,
                        workSummaryType: itemType
                    });
                }
                break;
        }


        if(workProgress){
            return workProgress;
        } else {
            throw new Meteor.Error("NOT_FOUND", "Work Progress item " + itemType + " called " + itemName + " not found for user " + userContext.userId);
        }



    }

}

export const TestDataHelpers = new TestDataHelpersClass();