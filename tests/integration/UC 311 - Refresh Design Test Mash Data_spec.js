
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
import {ComponentType, TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, ViewOptionType} from '../../imports/constants/constants.js';

describe('UC 311 - Refresh Design Test Mash Data', function(){

    before(function(){

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
        // But make sure Scenario444 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentBaseWp('Actions', 'Scenario444');
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
    it('Design changes by other users and test data from a new test run can be updated for the acceptance test view for a Work Package');

    it('Design changes by other users and test data from a new test run can be updated for the integration test view for a Work Package', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackage();

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

        // Designer adds Scenario5 to Feature1 Actions and Manager puts it in WP scope
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerAddsScenarioToFeatureAspect_Called('Feature1', 'Actions', 'Scenario5');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario5');

        // WP contains Scenario5 for Developer
        expect(WpComponentVerifications.componentIsInDeveloperCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario5'));
        // But Mash does not
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainScenario('Scenario5'));

        // Run the Tests outside ULTRAWIDE
        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_NOT_LINKED,
            scenario5Result: MashTestStatus.MASH_PASS
        };
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Try an ordinary results refresh
        TestResultActions.developerRefreshesTestResults();

        // Still no Scenario5
        expect(TestResultVerifications.developerIntegrationTestsWindowDoesNotContainScenario('Scenario5'));


        // Execute
        TestResultActions.developerRefreshesTestData();

        // Verify - Scenario5 now visible in test data
        expect(TestResultVerifications.developerIntegrationTestsWindowContainsScenario('Scenario5'));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario5', MashTestStatus.MASH_PASS));

    });

    it('Design changes by other users and test data from a new test run can be updated for the unit test view for a Work Package');


    // Conditions
    it('Design changes are not updated if no test view is visible');

});
