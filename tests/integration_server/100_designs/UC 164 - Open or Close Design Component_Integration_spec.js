
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';

import {ComponentType} from '../../../imports/constants/constants.js'

describe('UC 164 - Open or Close Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 164 - Open or Close Design Component');
        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
    });

    afterEach(function(){

    });


    describe('Actions', function(){


        describe('A closed Design Component may be opened', function(){

            it('Component Type - Application', function(){
                // Setup
                DesignComponentActions.designerSelectsApplication('Application1');

                // Execute and Verify
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.APPLICATION,
                        parentName:     'NONE',
                        componentNameNew:  'Application1'
                    }
                ];

                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);
            });


            it('Component Type - Design Section', function(){
                // Setup
                DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');

                // Execute and Verify
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.DESIGN_SECTION,
                        parentName:     'Application1',
                        componentNameNew:  'Section1'
                    }
                ];

                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);
            });


            it('Component Type - Feature', function(){
                // Setup
                DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');

                // Execute and Verify
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.FEATURE,
                        parentName:     'Section1',
                        componentNameNew:  'Feature1'
                    }
                ];

                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);
            });


            it('Component Type - Aspect', function(){
                // Setup
                DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');

                // Execute and Verify
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.FEATURE_ASPECT,
                        parentName:     'Feature1',
                        componentNameNew:  'Actions'
                    }
                ];

                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);
            });

        });

        describe('An open Design Component may be closed', function(){

            it('Component Type - Application', function(){
                // Setup - open it and confirm open
                DesignComponentActions.designerSelectsApplication('Application1');
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.APPLICATION,
                        parentName:     'None',
                        componentNameNew:  'Application1'
                    }
                ];
                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);

                // Execute and Verify - this call also checks that the specified component is closed
                DesignComponentActions.designerClosesSelectedComponent();
            });


            it('Component Type - Design Section', function(){
                // Setup - open it and confirm open
                DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.DESIGN_SECTION,
                        parentName:     'Application1',
                        componentNameNew:  'Section1'
                    }
                ];
                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);

                // Execute and Verify - this call also checks that the specified component is closed
                DesignComponentActions.designerClosesSelectedComponent();
            });


            it('Component Type - Feature', function(){
                // Setup - open it and confirm open
                DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.FEATURE,
                        parentName:     'Section1',
                        componentNameNew:  'Feature1'
                    }
                ];
                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);

                // Execute and Verify - this call also checks that the specified component is closed
                DesignComponentActions.designerClosesSelectedComponent();
            });


            it('Component Type - Aspect', function(){
                // Setup - open it and confirm open
                DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');
                const expectedOpenComponents = [
                    {
                        componentType:  ComponentType.FEATURE_ASPECT,
                        parentName:     'Feature1',
                        componentNameNew:  'Actions'
                    }
                ];
                DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);

                // Execute and Verify - this call also checks that the specified component is closed
                DesignComponentActions.designerClosesSelectedComponent();
            });

        });
    });

    describe('Consequences', function(){

        it('Opening a Feature opens all Design Components in that Feature', function(){

            // Setup
            DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');

            // Execute and Verify
            const expectedOpenComponents = [
                {
                    componentType: ComponentType.FEATURE,
                    parentName: 'Section1',
                    componentNameNew: 'Feature1'
                },
                {
                    componentType: ComponentType.FEATURE_ASPECT,
                    parentName: 'Feature1',
                    componentNameNew: 'Interface'
                },
                {
                    componentType: ComponentType.FEATURE_ASPECT,
                    parentName: 'Feature1',
                    componentNameNew: 'Actions'
                },
                {
                    componentType: ComponentType.FEATURE_ASPECT,
                    parentName: 'Feature1',
                    componentNameNew: 'Conditions'
                },
                {
                    componentType: ComponentType.FEATURE_ASPECT,
                    parentName: 'Feature1',
                    componentNameNew: 'Consequences'
                }
            ];

            DesignComponentActions.designerOpensSelectedComponentWithExpectation(expectedOpenComponents);

        });

    });
});
