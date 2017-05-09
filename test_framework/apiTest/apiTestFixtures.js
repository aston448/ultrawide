import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions}    from '../../imports/collections/context/user_current_view_options.js';
import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { UserDesignUpdateSummary }      from '../../imports/collections/summary/user_design_update_summary.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';
import { DesignVersionComponents }  from '../../imports/collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }   from '../../imports/collections/design/feature_background_steps.js';
import { ScenarioSteps }            from '../../imports/collections/design/scenario_steps.js';
import { DomainDictionary }         from '../../imports/collections/design/domain_dictionary.js';
import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';
import { UserDesignVersionMashScenarios }  from '../../imports/collections/mash/user_dv_mash_scenarios.js';
import { UserUnitTestMashData }     from '../../imports/collections/dev/user_unit_test_mash_data.js';
import { UserIntTestResults }       from '../../imports/collections/dev/user_int_test_results.js';
import { UserUnitTestResults }      from '../../imports/collections/dev/user_unit_test_results.js';
import { UserDevTestSummaryData }   from '../../imports/collections/summary/user_dev_test_summary_data.js';
import { UserWorkProgressSummary }  from '../../imports/collections/summary/user_work_progress_summary.js';

import { RoleType, ViewType, ViewMode, DisplayContext, ComponentType, MashTestStatus, LogLevel } from '../../imports/constants/constants.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import { log } from '../../imports/common/utils.js';
import ClientIdentityServices from '../../imports/apiClient/apiIdentity.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testFixtures.logTestSuite'(suiteName){
        log((msg) => console.log(msg), LogLevel.INFO, "----- {} -----", suiteName);
    },

    'testFixtures.removeMeteorUsers'(){
        // To be called only when new users have been added in a test as an After Each action to prevent tests creating duplicate users
        // Before each must then populate the data agsin with clearAllData
        Meteor.users.remove({});
    },

    'testFixtures.clearAllData'(){

        //console.log('Test Fixtures: CLEAR DB!');

        // Abort reset if not the test instance of Ultrawide
        if(ClientIdentityServices.getApplicationName() !== 'ULTRAWIDE TEST'){

            console.log('Test Fixtures: NOT TEST INSTANCE!!!');

        } else {

            // For testing we clear the DB and start from scratch

            DomainDictionary.remove({});
            ScenarioSteps.remove({});
            FeatureBackgroundSteps.remove({});
            DesignUpdateComponents.remove({});
            DesignVersionComponents.remove({});
            WorkPackageComponents.remove({});
            WorkPackages.remove({});
            UserDesignUpdateSummary.remove({});
            DesignUpdates.remove({});
            DesignVersions.remove({});
            Designs.remove({});
            UserTestTypeLocations.remove({});
            TestOutputLocationFiles.remove({});
            TestOutputLocations.remove({});

            UserDesignVersionMashScenarios.remove({});
            UserUnitTestMashData.remove({});
            UserUnitTestResults.remove({});
            UserIntTestResults.remove({});
            UserDevTestSummaryData.remove({});
            UserWorkProgressSummary.remove({});

            UserCurrentEditContext.remove({});
            UserCurrentViewOptions.remove({});
            UserRoles.remove({});

            // Recreate users and default contexts and options

            let adminUserId = '';
            let designerUserId = '';
            let developerUserId = '';
            let anotherDeveloperUserId = '';
            let managerUserId = '';

            // Only need to recreate meteor accounts after reset

            // ADMIN USER ==============================================================================================

            const adminUser = Accounts.findUserByUsername('admin');
            if(!adminUser){
                console.log('Recreating admin user');
                adminUserId = Accounts.createUser(
                    {
                        username: 'admin',
                        password: 'admin'
                    }
                );
            } else {
                adminUserId = adminUser._id;
            }

            UserRoles.insert({
                userId: adminUserId,
                userName: 'admin',
                password: 'admin',
                displayName: 'Administrator',
                isDesigner: false,
                isDeveloper: false,
                isManager: false,
                isAdmin: true
            });

            // NORMAL USERS ============================================================================================

            // Designer ------------------------------------------------------------------------------------------------
            const designerUser = Accounts.findUserByUsername('gloria');
            if(!designerUser) {
                console.log('Recreating designer user');
                designerUserId = Accounts.createUser(
                    {
                        username: 'gloria',
                        password: 'gloria'
                    }
                );
            } else {
                designerUserId = designerUser._id;
            }

            UserRoles.insert({
                userId: designerUserId,
                userName: 'gloria',
                password: 'gloria',
                displayName: 'Gloria Slap',
                isDesigner: true,
                isDeveloper: false,
                isManager: false
            });

            // Developer -----------------------------------------------------------------------------------------------
            const developerUser = Accounts.findUserByUsername('hugh');
            if(!developerUser) {
                console.log('Recreating developer user');
                developerUserId = Accounts.createUser(
                    {
                        username: 'hugh',
                        password: 'hugh'
                    }
                );
            } else {
                developerUserId = developerUser._id;
            }

            UserRoles.insert({
                userId: developerUserId,
                userName: 'hugh',
                password: 'hugh',
                displayName: 'Hugh Gengin',
                isDesigner: false,
                isDeveloper: true,
                isManager: false
            });

            // Another developer ---------------------------------------------------------------------------------------
            const anotherDeveloperUser = Accounts.findUserByUsername('davey');
            if(!anotherDeveloperUser) {
                console.log('Recreating another developer user');
                anotherDeveloperUserId = Accounts.createUser(
                    {
                        username: 'davey',
                        password: 'davey'
                    }
                );
            } else {
                anotherDeveloperUserId = anotherDeveloperUser._id;
            }

            UserRoles.insert({
                userId: anotherDeveloperUserId,
                userName: 'davey',
                password: 'davey',
                displayName: 'Davey Rocket',
                isDesigner: false,
                isDeveloper: true,
                isManager: false
            });

            // Manager -------------------------------------------------------------------------------------------------
            const managerUser = Accounts.findUserByUsername('miles');
            if(!managerUser) {
                console.log('Recreating manager user');
                managerUserId = Accounts.createUser(
                    {
                        username: 'miles',
                        password: 'miles'
                    }
                );
            } else {
                managerUserId = managerUser._id;
            }

            UserRoles.insert({
                userId: managerUserId,
                userName: 'miles',
                password: 'miles',
                displayName: 'Miles Behind',
                isDesigner: false,
                isDeveloper: false,
                isManager: true
            });


            // Start new users with default context
            UserCurrentEditContext.insert({
                userId: designerUserId
            });

            UserCurrentEditContext.insert({
                userId: developerUserId
            });

            UserCurrentEditContext.insert({
                userId: anotherDeveloperUserId
            });

            UserCurrentEditContext.insert({
                userId: managerUserId
            });


            // And default view options
            UserCurrentViewOptions.insert({
                userId: designerUserId
            });

            // And default view options
            UserCurrentViewOptions.insert({
                userId: developerUserId
            });

            // And default view options
            UserCurrentViewOptions.insert({
                userId: anotherDeveloperUserId
            });

            // And default view options
            UserCurrentViewOptions.insert({
                userId: managerUserId
            });

        }



    },

    'testFixtures.clearDesignUpdates'(){
        DesignUpdateComponents.remove({});
        DesignUpdates.remove({});
    },

    'testFixtures.clearWorkPackages'(){
        WorkPackageComponents.remove({});
        WorkPackages.remove({});
    },

    'testFixtures.resetUserViewOptions'(){
        UserCurrentViewOptions.update(
            {},
            {
                $set:{
                    designDetailsVisible:       true,
                    testSummaryVisible:         false,
                    designDomainDictVisible:    true,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false
                }
            },
            {multi: true}
        );
    },

    'testFixtures.AddBasicDesignData'(designName, designVersionName){

        // Add an Application, Design Sections, Features and Scenarios as basic data for a Design
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;
        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
        const userContext = {
            userId:                         'NONE',
            designId:                       design._id,
            designVersionId:                designVersion._id,
            designUpdateId:                 'NONE',
            workPackageId:                  'NONE',
            designComponentId:              'NONE',
            designComponentType:            'NONE',
            featureReferenceId:             'NONE',
            featureAspectReferenceId:       'NONE',
            scenarioReferenceId:            'NONE',
            scenarioStepId:                 'NONE'
        };
        let rawName = null;

        // Data Available:
        //
        //  Application1
        //      Section1
        //          Feature1
        //              Interface
        //              Actions
        //                  Scenario1
        //                  Scenario7
        //                  ExtraScenario
        //              Conditions
        //                  Scenario2
        //              Consequences
        //              ExtraAspect
        //          Feature444
        //              Interface
        //              Actions
        //              Conditions
        //              Consequences
        //          SubSection1 - removable
        //      Section2
        //          Feature2
        //              Interface
        //              Actions
        //                  Scenario3
        //              Conditions
        //                  Scenario4
        //              Consequences
        //          SubSection2 - removable
        //  Application88 - removable
        //  Application99
        //      Section99
        //          Feature99 - removable


        // Add Application1
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application1Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentNameNew: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application1');
        ClientDesignComponentServices.updateComponentName(view, mode, application1Component._id, 'Application1', rawName);

        // Add Application88 in case a removable App needed
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application88Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentNameNew: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application88');
        ClientDesignComponentServices.updateComponentName(view, mode, application88Component._id, 'Application88', rawName);

        // Add Application99 in case a second Base App needed
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application99Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentNameNew: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application99');
        ClientDesignComponentServices.updateComponentName(view, mode, application99Component._id, 'Application99', rawName);

        // Add Section1
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application1Component);
        const section1Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentNameNew: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section1');
        ClientDesignComponentServices.updateComponentName(view, mode, section1Component._id, 'Section1', rawName);

        // Add Section2
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application1Component);
        const section2Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentNameNew: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section2');
        ClientDesignComponentServices.updateComponentName(view, mode, section2Component._id, 'Section2', rawName);

        // Add Section99
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application99Component);
        const section99Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentNameNew: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section99');
        ClientDesignComponentServices.updateComponentName(view, mode, section99Component._id, 'Section99', rawName);

        // Add Feature1 to Section 1
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section1Component);
        const feature1Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentNameNew: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature1');
        ClientDesignComponentServices.updateComponentName(view, mode, feature1Component._id, 'Feature1', rawName);

        // Add ExtraAspect to Feature1
        ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, feature1Component);
        const extraAspectComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE_ASPECT, componentNameNew: DefaultComponentNames.NEW_FEATURE_ASPECT_NAME});
        rawName = DesignComponentModules.getRawTextFor('ExtraAspect');
        ClientDesignComponentServices.updateComponentName(view, mode, extraAspectComponent._id, 'ExtraAspect', rawName);

        // Add Feature444 to Section 1
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section1Component);
        const feature444Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentNameNew: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature444');
        ClientDesignComponentServices.updateComponentName(view, mode, feature444Component._id, 'Feature444', rawName);

        // Add Feature2 to Section 2
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section2Component);
        const feature2Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentNameNew: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature2');
        ClientDesignComponentServices.updateComponentName(view, mode, feature2Component._id, 'Feature2', rawName);

        // Add Feature99 to Section 99 - and make removable by removing Aspects
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section99Component);
        const feature99Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentNameNew: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature99');
        ClientDesignComponentServices.updateComponentName(view, mode, feature99Component._id, 'Feature99', rawName);
        const feature99Aspects = DesignVersionComponents.find({designVersionId: designVersion._id, componentType: ComponentType.FEATURE_ASPECT, componentParentIdNew: feature99Component._id}).fetch();
        feature99Aspects.forEach((aspect) => {
            ClientDesignComponentServices.removeDesignComponent(view, mode, aspect, userContext)
        });

        // Add SubSection1 to Section1
        ClientDesignComponentServices.addSectionToDesignSection(view, mode, section1Component);
        const subSection1Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentNameNew: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('SubSection1');
        ClientDesignComponentServices.updateComponentName(view, mode, subSection1Component._id, 'SubSection1', rawName);

        // Add SubSection2 to Section2
        ClientDesignComponentServices.addSectionToDesignSection(view, mode, section2Component);
        const subSection2Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentNameNew: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('SubSection2');
        ClientDesignComponentServices.updateComponentName(view, mode, subSection2Component._id, 'SubSection2', rawName);

        // Add Scenario1 to Feature1 Actions
        const featureAspect1Component = DesignVersionComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentNameNew: 'Actions', componentParentIdNew: feature1Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component, 'NONE');
        const scenario1Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario1');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario1Component._id, 'Scenario1', rawName);

        // Add Scenario7 to Feature1 Actions
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component, 'NONE');
        const Scenario7Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario7');
        ClientDesignComponentServices.updateComponentName(view, mode, Scenario7Component._id, 'Scenario7', rawName);

        // Add ExtraScenario to Feature1 Actions
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component, 'NONE');
        const ExtraScenarioComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('ExtraScenario');
        ClientDesignComponentServices.updateComponentName(view, mode, ExtraScenarioComponent._id, 'ExtraScenario', rawName);

        // Add Scenario2 to Feature1 Conditions
        const featureAspect2Component = DesignVersionComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentNameNew: 'Conditions', componentParentIdNew: feature1Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect2Component, 'NONE');
        const scenario2Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario2');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario2Component._id, 'Scenario2', rawName);

        // Add Scenario3 to Feature2 Actions
        const featureAspect3Component = DesignVersionComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentNameNew: 'Actions', componentParentIdNew: feature2Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect3Component, 'NONE');
        const scenario3Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario3');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario3Component._id, 'Scenario3', rawName);

        // Add Scenario4 to Feature2 Conditions
        const featureAspect4Component = DesignVersionComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentNameNew: 'Conditions', componentParentIdNew: feature2Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect4Component, 'NONE');
        const scenario4Component = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentNameNew: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario4');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario4Component._id, 'Scenario4', rawName);
    },

    'testFixtures.clearTestFiles'(locationName){

        let location = null;
        try {
            location = TestDataHelpers.getTestOutputLocation(locationName);
        } catch (e){
            // If no location no need to act
            if(e.error = 'FAIL_NO_LOCATION'){
                return;
            } else {
                throw e;
            }

        }

        if(location) {
            const filesExpected = TestDataHelpers.getIntegrationResultsOutputFiles_ChimpMocha(locationName);

            filesExpected.forEach((file) => {
                if (fs.existsSync(location.locationPath + file.fileName)) {
                    fs.unlinkSync(location.locationPath + file.fileName);
                }
            })
        }

    },

    'testFixtures.writeIntegrationTestResults_ChimpMocha'(locationName, results){

        // Expected input is
        // results [
        //      {
        //          featureName:    Feature1
        //          scenarioName:   Scenario1
        //          result:         PASS,
        //      },
        //      ...etc
        // ]

        const location = TestDataHelpers.getTestOutputLocation(locationName);
        const filesExpected = TestDataHelpers.getIntegrationResultsOutputFiles_ChimpMocha(locationName);

        if(filesExpected.length === 1) {


            // Single output file test case
            const fileName = location.locationPath + filesExpected[0].fileName;

            // console.log("Writing file " + fileName);
            // results.forEach((result) => {
            //     console.log("    Scenario: " + result.scenarioName + " Result: " + result.result);
            // });

            const headerBollox = '[32m Master Chimp and become a testing Ninja! Check out our course: [39m[4m[34mhttp://bit.ly/2btQaFu [39m[24m [33m [chimp] Running...[39m\n';

            // Proper start of file

            let outputPending = [];
            let outputFailures = [];
            let outputPasses = [];

            let resultData = {};
            let errorData = {};

            results.forEach((scenario) => {

                // Make error data if a failure
                if(scenario.result === MashTestStatus.MASH_FAIL){
                    errorData = {
                        message: '[ERROR] Failure Message',
                        reason: 'Failure Message'
                    }
                } else {
                    errorData = {};
                }

                resultData = {
                    title: scenario.scenarioName,
                    fullTitle: scenario.featureName + ' ' + scenario.scenarioName,
                    duration: 5,
                    currentRetry: 0,
                    err: errorData
                };

                // Divvy up rest as expected
                switch(scenario.result){
                    case MashTestStatus.MASH_PENDING:
                        outputPending.push(resultData);
                        break;
                    case MashTestStatus.MASH_FAIL:
                        outputFailures.push(resultData);
                        break;
                    case MashTestStatus.MASH_PASS:
                        outputPasses.push(resultData);
                        break;
                    default:
                        // Nothing added for non-linked tests
                }
            });

            let outputData = {
                stats: {
                    suites: 4,
                    tests: 10,
                    passes: 6,
                    failures: 2,
                    start: "2017-01-27T12:38:02.415Z",
                    end: "2017-01-27T12:38:08.588Z",
                    duration: 1000
                },
                pending: outputPending,
                failures: outputFailures,
                passes: outputPasses,
            };

            const jsonData = JSON.stringify(outputData, null, 2);

            // Add in the screen scrape garbage
            const fileText = headerBollox + jsonData;

            fs.writeFileSync(fileName, fileText);

        } else {

            // Support for testing 2 outputs
            if(filesExpected.length === 2){
                // TODO Add this
            }
        }
    },

    'testFixtures.writeUnitTestResults_MeteorMocha'(locationName, results){

        const location = TestDataHelpers.getTestOutputLocation(locationName);
        const filesExpected = TestDataHelpers.getUnitResultsOutputFiles_MeteorMocha(locationName);

        if(filesExpected.length === 1) {
            // Single output file test case
            const fileName = location.locationPath + filesExpected[0].fileName;

            // Expected test input is:
            // results
            //   scenarios[
            //      scenario{
            //          scenarioName
            //          scenarioGroup
            //          unitResults[
            //              result{
            //                  resultName
            //                  resultOutcome
            //              }
            //          ]
            //      }
            //  ]

            let outputTests = [];
            let outputPending = [];
            let outputFailures = [];
            let outputPasses = [];

            let fullTitle = '';
            let resultData = {};
            let errorData = {};

            results.scenarios.forEach((scenario) => {

                fullTitle = scenario.scenarioGroup + ' ' + scenario.scenarioName;

                scenario.unitResults.forEach((result) => {

                    // Make error data if a failure
                    if(result.resultOutcome === MashTestStatus.MASH_FAIL){
                        errorData = {
                            message: 'ERROR',
                            expected: 'this',
                            actual: 'that',
                            stack: 'Stack Trace'
                        }
                    } else {
                        errorData = {};
                    }

                    resultData = {
                        title: result.resultName,
                        fullTitle: fullTitle,
                        duration: 5,
                        currentRetry: 0,
                        err: errorData
                    };

                    // Everything is added to tests group unless not tested...
                    if(result.resultOutcome !== MashTestStatus.MASH_NOT_LINKED) {
                        outputTests.push(resultData);
                    }

                    // Divvy up rest as expected
                    switch(result.resultOutcome){
                        case MashTestStatus.MASH_PENDING:
                            outputPending.push(resultData);
                            break;
                        case MashTestStatus.MASH_FAIL:
                            outputFailures.push(resultData);
                            break;
                        case MashTestStatus.MASH_PASS:
                            outputPasses.push(resultData);
                            break;
                    }

                });

            });

            let outputData = {
                stats: {
                    suites: 4,
                    tests: 10,
                    passes: 6,
                    failures: 2,
                    start: "2017-01-27T12:38:02.415Z",
                    end: "2017-01-27T12:38:08.588Z",
                    duration: 1000
                },
                tests: outputTests,
                pending: outputPending,
                failures: outputFailures,
                passes: outputPasses,
            };

            const jsonData = JSON.stringify(outputData, null, 2);

            fs.writeFileSync(fileName, jsonData);

        } else {
            // Support for multipe files here
        }
    },



});

