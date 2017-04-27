import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';
import TestIntegrationActions       from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestSummaryVerifications     from '../../test_framework/test_wrappers/test_summary_verifications.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import WorkProgressSummaryActions   from '../../test_framework/test_wrappers/workProgressSummaryActions.js';
import WorkProgressSummaryVerifications from '../../test_framework/test_wrappers/workProgressSummaryVerifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, DesignUpdateMergeAction, RoleType, FeatureTestSummaryStatus} from '../../imports/constants/constants.js';

describe('UC 402 - View Work Progress Summary', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 402 - View Work Progress Summary');

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Create a Work Package with Feature1 and Feature2 in it
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Set up a location
        OutputLocationsActions.developerAddsNewLocation();

        const newDetails = {
            locationName:       'Location1',
            locationType:       TestLocationType.LOCAL,
            locationAccessType: TestLocationAccessType.FILE,
            locationIsShared:   true,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       '/Users/aston/WebstormProjects/shared/test_test/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // And an integration test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newIntFile = {
            fileAlias:      'IntegrationOutput',
            fileType:       TestLocationFileType.INTEGRATION,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_integration_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newIntFile);

        // Designer sets up location config
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.designerSelectsIntTestsInConfigForLocation('Location1');

        // Create WPs for the Initial design version
        // Manager selects DesignVersion1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Add Feature1 to WP1 and Feature2 to WP2
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature1');
        // But exclude ExtraScenario
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentWp('Actions', 'ExtraScenario');

        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section2', 'Feature2');


        // Create a second Design Version...
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a design update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario3');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Conditions', 'Scenario4');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature2', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature2', 'Actions', 'Scenario9');

        // Add a WP to the update to cover the Scenarios in Actions
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsFeatureAspectToScopeForCurrentWp('Feature2', 'Actions');

        // Add an unpublished Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add a published Design Update that is excluded from the DV
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate3');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate3');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_ROLL);

        // Add an unavailable Work Package
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage2');
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });

    const intResultsDV1 = [
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario1',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario2',
            result: MashTestStatus.MASH_FAIL
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario3',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario4',
            result: MashTestStatus.MASH_NOT_LINKED
        }
    ];

    const intResultsDV2 = [
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario1',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario2',
            result: MashTestStatus.MASH_FAIL
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario3',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario4',
            result: MashTestStatus.MASH_NOT_LINKED
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario9',
            result: MashTestStatus.MASH_FAIL
        }
    ];


    // Interface
    it('The number of scenarios in the current Design Version is displayed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify all Scenarios in DV1 are counted
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsInitialDesignVersion('DesignVersion1'));

        const summary = {
            totalScenarios:             6,
            scenariosInWp:              5,
            scenariosPassing:           0,
            scenariosFailing:           0,
            scenariosNoTests:           6
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForInitialDesignVersionIs('DesignVersion1', summary));
    });

    it('The number of Scenarios covered by Work Packages in a Base Design Version is displayed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify all Scenarios in DV1 WPs are counted
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsInitialDesignVersion('DesignVersion1'));

        const summary = {
            totalScenarios:             6,
            scenariosInWp:              5,
            scenariosPassing:           0,
            scenariosFailing:           0,
            scenariosNoTests:           6
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForInitialDesignVersionIs('DesignVersion1', summary));
    });

    it('The number of Scenarios with passing tests in the current Design Version is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify test pass count
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsInitialDesignVersion('DesignVersion1'));

        const summary = {
            totalScenarios:             6,
            scenariosInWp:              5,
            scenariosPassing:           2,
            scenariosFailing:           1,
            scenariosNoTests:           3
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForInitialDesignVersionIs('DesignVersion1', summary));

    });

    it('The number of Scenarios with failing tests in the current Design Version is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify test fail count
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsInitialDesignVersion('DesignVersion1'));

        const summary = {
            totalScenarios:             6,
            scenariosInWp:              5,
            scenariosPassing:           2,
            scenariosFailing:           1,
            scenariosNoTests:           3
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForInitialDesignVersionIs('DesignVersion1', summary));
    });

    it('The number of Scenarios with no tests in the current Design Version is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify test fail count
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsInitialDesignVersion('DesignVersion1'));

        const summary = {
            totalScenarios:             6,
            scenariosInWp:              5,
            scenariosPassing:           2,
            scenariosFailing:           1,
            scenariosNoTests:           3
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForInitialDesignVersionIs('DesignVersion1', summary));
    });

    it('Each Design Update to be included in an Updatable Design Version is listed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify Update is shown
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateableDesignVersion('DesignVersion2'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdate('DesignUpdate1'));

    });

    it('The number of Scenarios in a Design Update is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        const summary = {
            totalScenarios:             3,
            scenariosInWp:              2,
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateIs('DesignUpdate1', summary));
    });

    it('The number of Scenarios covered by Work Packages in a design Update is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        const summary = {
            totalScenarios:             3,
            scenariosInWp:              2,
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateIs('DesignUpdate1', summary));
    });

    it('The number of Scenarios with passing tests in a Design Update is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        const summary = {
            totalScenarios:             3,
            scenariosInWp:              2,
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateIs('DesignUpdate1', summary));
    });

    it('The number of Scenarios with failing tests in a Design Update is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        const summary = {
            totalScenarios:             3,
            scenariosInWp:              2,
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateIs('DesignUpdate1', summary));
    });

    it('The number of Scenarios with no tests in a Design Update is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        const summary = {
            totalScenarios:             3,
            scenariosInWp:              2,
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateIs('DesignUpdate1', summary));
    });

    it('Each Work Package in a Base Design Version is displayed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsBaseWp('WorkPackage1'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsBaseWp('WorkPackage2'));
    });

    it('Each Work Package in a Design Update is displayed', function() {

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify WP is shown
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateWp('UpdateWorkPackage1'));
    });

    it('The number of Scenarios in a Work Package is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        let summary = {
            totalScenarios:             3,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage1', summary));

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           0,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage2', summary));

        // Move to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           0
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateWorkPackageIs('UpdateWorkPackage1', summary));

    });

    it('The number of Scenarios with passing tests in a Work Package is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        let summary = {
            totalScenarios:             3,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage1', summary));

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           0,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage2', summary));

        // Move to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           0
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateWorkPackageIs('UpdateWorkPackage1', summary));
    });

    it('The number of Scenarios with failing tests in a Work Package is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        let summary = {
            totalScenarios:             3,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage1', summary));

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           0,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage2', summary));

        // Move to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           0
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateWorkPackageIs('UpdateWorkPackage1', summary));
    });

    it('The number of Scenarios with no tests in a Work Package is displayed', function(){

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV1);

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        let summary = {
            totalScenarios:             3,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage1', summary));

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           0,
            scenariosNoTests:           1
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForBaseWorkPackageIs('WorkPackage2', summary));

        // Move to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Run the tests
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResultsDV2);

        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();
        DesignVersionActions.workProgressIsUpdatedForDesigner();

        summary = {
            totalScenarios:             2,
            scenariosInWp:              0, // Not shown
            scenariosPassing:           1,
            scenariosFailing:           1,
            scenariosNoTests:           0
        };
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryForUpdateWorkPackageIs('UpdateWorkPackage1', summary));
    });


    // Actions
    it('Work progress summary data is refreshed when the summary is viewed');

    it('The user can navigate to the Design Version displayed in the work progress summary', function(){

        // This effectively means that if a DU / WP was selected you are back to the DV with no selection...
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.designerSelectsWorkPackage('UpdateWorkPackage1');

        // Check user Context
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextForRole_DesignUpdateIs(RoleType.DESIGNER, 'DesignUpdate1'));
        expect(UserContextVerifications.userContextForRole_WorkPackageIs(RoleType.DESIGNER, 'UpdateWorkPackage1'));

        // Execute
        WorkProgressSummaryActions.designerGoesToUpdatableDesignVersion('DesignVersion2');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextDesignUpdateNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextWorkPackageNotSetForRole(RoleType.DESIGNER));

    });

    it('The user can navigate to a Design Update displayed in the work progress summary', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        WorkProgressSummaryActions.designerGoesToUpdatableDesignVersion('DesignVersion2');

        // Check user Context
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextDesignUpdateNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextWorkPackageNotSetForRole(RoleType.DESIGNER));

        // Execute
        WorkProgressSummaryActions.designerGoesToDesignUpdate('DesignUpdate1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextForRole_DesignUpdateIs(RoleType.DESIGNER, 'DesignUpdate1'));
        expect(UserContextVerifications.userContextWorkPackageNotSetForRole(RoleType.DESIGNER));
    });

    it('The user can navigate to a Work Package displayed in the work progress summary', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        WorkProgressSummaryActions.designerGoesToUpdatableDesignVersion('DesignVersion2');

        // Check user Context
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextDesignUpdateNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextWorkPackageNotSetForRole(RoleType.DESIGNER));

        // Execute
        WorkProgressSummaryActions.designerGoesToUpdateWorkPackage('UpdateWorkPackage1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
        expect(UserContextVerifications.userContextForRole_DesignUpdateIs(RoleType.DESIGNER, 'DesignUpdate1'));
        expect(UserContextVerifications.userContextForRole_WorkPackageIs(RoleType.DESIGNER, 'UpdateWorkPackage1'));
    });

    it('The user can navigate to an item in the work progress summary as any role available to the user');


    // Conditions
    it('Design Updates that are not yet Published are not displayed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify Published Update is shown but unpublished is not
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateableDesignVersion('DesignVersion2'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdate('DesignUpdate1'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryDoesNotContainUpdate('DesignUpdate2'));

    });

    it('Design Updates that are not included in the Design Version are not displayed', function() {

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify Published Update is shown but unpublished is not
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateableDesignVersion('DesignVersion2'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdate('DesignUpdate1'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryDoesNotContainUpdate('DesignUpdate3'));
    });

    it('Work Packages that are not yet Available are not displayed', function(){

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        DesignVersionActions.workProgressIsUpdatedForDesigner();

        // Verify Published Update WP is shown but unpublished is not
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateableDesignVersion('DesignVersion2'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdate('DesignUpdate1'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryContainsUpdateWp('UpdateWorkPackage1'));
        expect(WorkProgressSummaryVerifications.designerWorkProgressSummaryDoesNotContainUpdateWp('UpdateWorkPackage2'));
    });

});
