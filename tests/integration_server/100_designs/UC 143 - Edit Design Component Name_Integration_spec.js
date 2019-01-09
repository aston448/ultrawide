
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { DesignComponentVerifications } from '../../../test_framework/test_wrappers/design_component_verifications.js';
import { WorkPackageActions }           from '../../../test_framework/test_wrappers/work_package_actions.js';
import { WpComponentActions }           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import { WpComponentVerifications }     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';

import {ComponentType} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {DesignComponentValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 143 - Edit Design Component Name', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 143 - Edit Design Component Name');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    describe('Actions', function(){


        describe('A Design Component name can be edited and saved', function(){

            it('Component Type - Application', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('My App');

                // Verify
                expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'My App', 'Design1', 'DesignVersion1'));
            });


            it('Component Type - Design Section', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('My Section');

                // Verify
                expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'My Section', 'Design1', 'DesignVersion1'));
            });


            it('Component Type - Feature', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('My Feature');

                // Verify
                expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'My Feature', 'Design1', 'DesignVersion1'));
            });


            it('Component Type - Aspect', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('GUI');

                // Verify
                expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'GUI', 'Design1', 'DesignVersion1'));
            });


            it('Component Type - Scenario', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('My Scenario');

                // Verify
                expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'My Scenario', 'Design1', 'DesignVersion1'));
            });

        });

        it('A Design Section name may be changed to the same name as a Design Section in a different parent', function(){

            // Setup - Section99 is in Application99
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            // Check both Sections are there
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 1));

            // Execute - update Section1 to Section99
            DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Section99');

            // Verify - now 2 Section99s
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 0));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 2));
        });

        it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

            // Add a new Feature Aspect to Feature 1
            DesignComponentActions.designerAddsFeatureAspectToFeature_('Feature1');
            DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Aspect1');

            // Add a new Feature Aspect to Feature 2
            DesignComponentActions.designerAddsFeatureAspectToFeature_('Feature2');

            // Execute - And call it the same name
            DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Aspect1');

            // Verify - now 2 Aspect1s
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Aspect1', 'Design1', 'DesignVersion1', 2));
        });

    });

    describe('Conditions', function(){


        describe('An Application, Feature or Scenario name must be unique to the Design', function(){

            it('Component Type - Application', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // Add another App
                DesignComponentActions.designerAddsApplication();
                // Should be one with the default name too now
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));

                // Execute
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME);
                const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('Application1', expectation);

                // Verify - not changed to Application1 - should still be the default
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));
            });


            it('Component Type - Scenario', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // Check both scenarios are there
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));

                // Execute - try to update Scenario2 to Scenario1
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
                const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('Scenario1', expectation);

                // Verify - not changed to Scenario1 - should still be Scenario2
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));
            });


            it('Component Type - Feature', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // Check both features are there (from default setup)
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));

                // Execute - try to update Feature2 to Feature1
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');
                const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('Feature1', expectation);

                // Verify - not changed to Feature1 - should still be Feature2
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
            });

        });

        describe('A Design Section or Feature Aspect name must be unique within the parent component of the Design Section or Feature Aspect', function(){

            it('Component Type - Design Section', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // Check both Sections are there
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));

                // Execute - try to update Section2 to Section1
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');
                const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('Section1', expectation);

                // Verify - not changed to Section1 - should still be Section2
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));
            });


            it('Component Type - Aspect', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // Check both feature aspects are there - note there are 3 of each in the default test data
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));

                // Execute - try to update Actions to Conditions
                DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
                const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
                DesignComponentActions.designerUpdatesSelectedComponentNameTo('Conditions', expectation);

                // Verify - not changed
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
                expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));
            });

        });
        it('A Scenario name may not be part of an existing Scenario name in the Design', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            // Check both scenarios are there
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));

            // Execute - try to update Scenario2 to Scenar
            DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
            const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_SUBSET};
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Scenar', expectation);

            // Verify - not changed to Scenar - should still be Scenario2
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));
        });

        it('A Scenario name may not include the name of an existing Scenario in the Design', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            // Check both scenarios are there
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));

            // Execute - try to update Scenario2 to Scenario1 Extra
            DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
            const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_SUPERSET};
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Scenario1 Extra', expectation);

            // Verify - not changed to Scenario1 Extra - should still be Scenario2
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));
        });

    });

    describe('Consequences', function(){

        it('Updating the name of a Design Component in a base Design Version updates it in any related Work Package', function(){

            // Setup
            // Publish DV1
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
            // Add 2 work packages
            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerAddsBaseDesignWorkPackage();
            WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
            WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
            WorkPackageActions.managerAddsBaseDesignWorkPackage();
            WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
            WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

            // Put Feature1 in scope in WP1
            WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
            WorkPackageActions.managerEditsSelectedBaseWorkPackage();
            WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature1');

            // Execute
            // Designer changes Feature1 to Feature11 in the base version
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
            DesignComponentActions.designerUpdatesSelectedComponentNameTo('Feature11');

            // Validate - both WPs have Feature11, neither has Feature1 and Feature11 in scope in WP1
            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
            WorkPackageActions.managerEditsSelectedBaseWorkPackage();
            expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
            expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));

            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
            WorkPackageActions.managerEditsSelectedBaseWorkPackage();
            expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
            expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));
            expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));
        });

    });
});
