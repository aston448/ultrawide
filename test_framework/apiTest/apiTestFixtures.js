import { Meteor } from 'meteor/meteor';

import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }   from '../../imports/collections/design/feature_background_steps.js';
import { ScenarioSteps }            from '../../imports/collections/design/scenario_steps.js';
import { DomainDictionary }         from '../../imports/collections/design/domain_dictionary.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import ClientIdentityServices from '../../imports/apiClient/apiIdentity.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testFixtures.clearAllData'(){

        console.log('Test Fixtures: CLEAR DB!');

        // Abort reset if not the test instance of Ultrawide
        if(ClientIdentityServices.getApplicationName() != 'ULTRAWIDE TEST'){

            console.log('Test Fixtures: NOT TEST INSTANCE!!!');

        } else {

            // For testing we clear the DB and start from scratch

            DomainDictionary.remove({});
            ScenarioSteps.remove({});
            FeatureBackgroundSteps.remove({});
            DesignUpdateComponents.remove({});
            DesignComponents.remove({});
            WorkPackageComponents.remove({});
            WorkPackages.remove({});
            DesignUpdates.remove({});
            DesignVersions.remove({});
            Designs.remove({});

            const featureFilesDir = '/Users/aston/WebstormProjects/ultrawide-test/tests/features/';
            const accTestResults = '/Users/aston/WebstormProjects/shared/test/test_results.json';
            const intTestResults = '/Users/aston/WebstormProjects/shared/test/mocha_results.json';
            const modTestResults = '/Users/aston/WebstormProjects/ultrawide-test/mocha-unit-output.json';

            // Clear current edit context for all users - but not the file locations
            UserCurrentEditContext.update(
                {},
                {
                    $set: {
                        designId: 'NONE',
                        designVersionId: 'NONE',
                        designUpdateId: 'NONE',
                        workPackageId: 'NONE',
                        designComponentId: 'NONE',
                        designComponentType: 'NONE',
                        featureReferenceId: 'NONE',
                        featureAspectReferenceId: 'NONE',
                        scenarioReferenceId: 'NONE',
                        scenarioStepId: 'NONE',

                        featureFilesLocation:           featureFilesDir,
                        acceptanceTestResultsLocation:  accTestResults,
                        integrationTestResultsLocation: intTestResults,
                        moduleTestResultsLocation:      modTestResults
                    }
                },
                {multi: true}
            );

            // Recreate users only needed after a reset
            if (UserRoles.find({}).count() === 0) {

                console.log('Inserting user data...');
                // Create a new accounts
                let designerUserId = Accounts.createUser(
                    {
                        username: 'gloria',
                        password: 'gloria'
                    }
                );

                UserRoles.insert({
                    userId: designerUserId,
                    userName: 'gloria',
                    displayName: 'Gloria Slap',
                    isDesigner: true,
                    isDeveloper: false,
                    isManager: false
                });

                let developerUserId = Accounts.createUser(
                    {
                        username: 'hugh',
                        password: 'hugh'
                    }
                );

                UserRoles.insert({
                    userId: developerUserId,
                    userName: 'hugh',
                    displayName: 'Hugh Gengin',
                    isDesigner: false,
                    isDeveloper: true,
                    isManager: false
                });

                let managerUserId = Accounts.createUser(
                    {
                        username: 'miles',
                        password: 'miles'
                    }
                );

                UserRoles.insert({
                    userId: managerUserId,
                    userName: 'miles',
                    displayName: 'Miles Behind',
                    isDesigner: false,
                    isDeveloper: false,
                    isManager: true
                });


                // Start new users with default context

                UserCurrentEditContext.insert({
                    userId: designerUserId,
                    featureFilesLocation:           featureFilesDir,
                    acceptanceTestResultsLocation:  accTestResults,
                    integrationTestResultsLocation: intTestResults,
                    moduleTestResultsLocation:      modTestResults
                });

                UserCurrentEditContext.insert({
                    userId: developerUserId,
                    featureFilesLocation:           featureFilesDir,
                    acceptanceTestResultsLocation:  accTestResults,
                    integrationTestResultsLocation: intTestResults,
                    moduleTestResultsLocation:      modTestResults
                });


                UserCurrentEditContext.insert({
                    userId: managerUserId,
                    featureFilesLocation:           featureFilesDir,
                    acceptanceTestResultsLocation:  accTestResults,
                    integrationTestResultsLocation: intTestResults,
                    moduleTestResultsLocation:      modTestResults
                });

            }

        }

    },

    'textFixtures.clearDesignUpdates'(){
        DesignUpdateComponents.remove({});
        DesignUpdates.remove({});
    },

    'testFixtures.AddBasicDesignData'(designName, designVersionName){

        // Add an Application, Design Sections, Features and Scenarios as basic data for a Design
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;
        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
        let rawName = null;

        // Add Application1
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentName: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application1');
        ClientDesignComponentServices.updateComponentName(view, mode, application1Component._id, 'Application1', rawName);

        // Add Section1
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application1Component);
        const section1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentName: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section1');
        ClientDesignComponentServices.updateComponentName(view, mode, section1Component._id, 'Section1', rawName);

        // Add Section2
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application1Component);
        const section2Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentName: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section2');
        ClientDesignComponentServices.updateComponentName(view, mode, section2Component._id, 'Section2', rawName);

        // Add Feature1 to Section 1
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section1Component);
        const feature1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentName: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature1');
        ClientDesignComponentServices.updateComponentName(view, mode, feature1Component._id, 'Feature1', rawName);

        // Add Feature2 to Section 2
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section2Component);
        const feature2Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentName: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature2');
        ClientDesignComponentServices.updateComponentName(view, mode, feature2Component._id, 'Feature2', rawName);

        // Add Scenario1 to Feature1 Actions
        const featureAspect1Component = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: 'Actions', componentParentId: feature1Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component);
        const scenario1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario1');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario1Component._id, 'Scenario1', rawName);

        // Add Scenario2 to Feature1 Conditions
        const featureAspect2Component = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: 'Conditions', componentParentId: feature1Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect2Component);
        const scenario2Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario2');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario2Component._id, 'Scenario2', rawName);

        // Add Scenario3 to Feature2 Actions
        const featureAspect3Component = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: 'Actions', componentParentId: feature2Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect3Component);
        const scenario3Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario3');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario3Component._id, 'Scenario3', rawName);

        // Add Scenario4 to Feature2 Conditions
        const featureAspect4Component = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: 'Conditions', componentParentId: feature2Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect4Component);
        const scenario4Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario4');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario4Component._id, 'Scenario4', rawName);
    }

});

