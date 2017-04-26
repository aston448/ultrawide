
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                    from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions             from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions              from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions           from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions           from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications              from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications        from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignUpdateSummaryVerifications from '../../test_framework/test_wrappers/design_update_summary_verifications.js';
import DesignVersionVerifications       from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications     from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications         from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions               from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications         from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions               from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications         from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications     from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';

import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, DesignUpdateWpStatus, DesignUpdateTestStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames, DefaultLocationText} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 511 - View Design Update Status Summary', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 511 - View Design Update Status Summary');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

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


        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Interface
    it('The work package status indicates if no Scenarios in the Design Update are covered by Work Packages', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateWpStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateWpStatus.DU_NO_WP_SCENARIOS));
    });

    it('The work package status indicates if some Scenarios in the Design Update are covered by Work Packages', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Manager now adds one Scenario to a WP
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentWp('Actions', 'Scenario8');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Verify DU WP status - partial coverage
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateWpStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateWpStatus.DU_SOME_WP_SCENARIOS));
    });

    it('The work package status indicates if all Scenarios in the Design Update are covered by Work Packages', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Manager now adds one Scenario to a WP
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentWp('Actions', 'Scenario8');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // And the other to another WP
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage2');
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage2');
        WpComponentActions.managerAddsScenarioToScopeForCurrentWp('Actions', 'Scenario1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Verify DU WP status - full coverage
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateWpStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateWpStatus.DU_ALL_WP_SCENARIOS));
    });

    it('The test results status indicates if any Scenarios in the Design Update are failing tests', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Tests are run...
        const intResults = [
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario1',
                result: MashTestStatus.MASH_PASS
            },
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario8',
                result: MashTestStatus.MASH_FAIL
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        // Verify DU Test status - failing tests
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateTestStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateTestStatus.DU_SCENARIOS_FAILING));
    });

    it('The test results status indicates if some Scenarios in the Design Update are passing tests', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Tests are run...
        const intResults = [
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario1',
                result: MashTestStatus.MASH_PASS
            },
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario8',
                result: MashTestStatus.MASH_NOT_LINKED
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();


        // Verify DU Test status - failing tests
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateTestStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateTestStatus.DU_SOME_SCENARIOS_PASSING));
    });

    it('The test results status indicates if all Scenarios in the Design Update are passing tests', function(){

        // Setup - add some scenarios to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Also add an existing scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Tests are run...
        const intResults = [
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario1',
                result: MashTestStatus.MASH_PASS
            },
            {
                featureName: 'Feature1',
                scenarioName: 'Scenario8',
                result: MashTestStatus.MASH_PASS
            }
        ];

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestResultActions.designerRefreshesTestResultsForBaseDesignVersion();

        // Verify DU Test status - failing tests
        DesignUpdateActions.designerRefreshesUpdateStatuses();
        expect(DesignUpdateVerifications.updateTestStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateTestStatus.DU_ALL_SCENARIOS_PASSING));
    });


    // Actions
    it('The Design Update work package status is updated when the Design Update list is displayed');

    it('The Design Update test results status is updated when the Design Update list is displayed');

});
