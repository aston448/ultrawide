
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, ViewOptionType} from '../../imports/constants/constants.js';

describe('UC 313 - View Integration Test Results', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 313 - View Integration Test Results');

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Create a Work Package with Feature1 and Feature2 in it
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section2', 'Feature2');
        // But make sure Scenario7 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentBaseWp('Actions', 'Scenario7');
        WorkPackageActions.managerPublishesSelectedWorkPackage();


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

        const newFile = {
            fileAlias:      'IntegrationOutput',
            fileType:       TestLocationFileType.INTEGRATION,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_integration_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile);

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation('Location1');

        // Make sure WP is adopted for Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
    });

    after(function(){

    });

    beforeEach(function(){

        // Ensure default view options before each test
        TestFixtures.resetUserViewOptions();
    });

    afterEach(function(){

    });


    // Actions
    it('The integration test results panel may be displayed for a Work Package that is being developed by a Developer', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
    });

    it('The integration test results panel may be hidden for a Work Package that is being developed by a Developer', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));

        // Execute
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
    });


    // Conditions
    it('Integration test results include all Features and Scenarios in the Work Package scope', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify - should contain Feature1, Feature2, Scenarios 1,2,3,4 and their parent Feature Aspects
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeature('Feature1'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeatureAspect('Feature1', 'Actions'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsScenario('Scenario1'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeatureAspect('Feature1', 'Conditions'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsScenario('Scenario2'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeature('Feature2'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeatureAspect('Feature2', 'Actions'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsScenario('Scenario3'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeatureAspect('Feature2', 'Conditions'));
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsScenario('Scenario4'));

    });

    it('Integration test results do not include Features or Scenarios outside the Work Package', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify - Feature444 and Scenario7 are not included
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainFeature('Feature444'));
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainScenario('Scenario7'));
    });

    it('A Feature Aspect is not shown in the test results if it contains no Scenarios', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify - Feature1 Interface, Consequences are not shown as no Scenarios
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsFeature('Feature1'));
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainFeatureAspect('Feature1', 'Interface'));
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainFeatureAspect('Feature1', 'Consequences'));
    });

    it('A Scenario not included in an integration test file results is shown as Not Tested', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Run Tests - outside of ULTRAWIDE
        const results = [
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
                result: MashTestStatus.MASH_PENDING
            },
            {
                featureName: 'Feature2',
                scenarioName: 'Scenario4',
                result: MashTestStatus.MASH_NOT_LINKED
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));
    });

    it('A Scenario included in pending integration test file results is shown as Pending', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Run Tests - outside of ULTRAWIDE
        const results = [
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
                result: MashTestStatus.MASH_PENDING
            },
            {
                featureName: 'Feature2',
                scenarioName: 'Scenario4',
                result: MashTestStatus.MASH_NOT_LINKED
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_PENDING));

    });

    it('A Scenario included in failure integration test file results is shown as Fail', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Run Tests - outside of ULTRAWIDE
        const results = [
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
                result: MashTestStatus.MASH_PENDING
            },
            {
                featureName: 'Feature2',
                scenarioName: 'Scenario4',
                result: MashTestStatus.MASH_NOT_LINKED
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));

    });

    it('A Scenario included in pass integration test file results is shown as Pass', function(){

        // Setup
        // Developer goes to WP
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Run Tests - outside of ULTRAWIDE
        const results = [
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
                result: MashTestStatus.MASH_PENDING
            },
            {
                featureName: 'Feature2',
                scenarioName: 'Scenario4',
                result: MashTestStatus.MASH_NOT_LINKED
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Open the Int Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsInNewWorkPackageDevelopmentView();

        // Verify
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
    });

});
