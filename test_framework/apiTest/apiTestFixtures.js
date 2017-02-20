import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions}    from '../../imports/collections/context/user_current_view_options.js';
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
import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType, MashTestStatus} from '../../imports/constants/constants.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import ClientIdentityServices from '../../imports/apiClient/apiIdentity.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testFixtures.clearAllData'(){

        //console.log('Test Fixtures: CLEAR DB!');

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
            UserTestTypeLocations.remove({});
            TestOutputLocationFiles.remove({});
            TestOutputLocations.remove({});


            // Clear current edit context for all users
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
                    }
                },
                {multi: true}
            );

            // Recreate users only needed after a reset - NOTE:  Make sure there is no backup data to restore or it will confuse this
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

                let anotherDeveloperUserId = Accounts.createUser(
                    {
                        username: 'davey',
                        password: 'davey'
                    }
                );

                UserRoles.insert({
                    userId: anotherDeveloperUserId,
                    userName: 'davey',
                    displayName: 'Davey Rocket',
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

        }

    },

    'textFixtures.clearDesignUpdates'(){
        DesignUpdateComponents.remove({});
        DesignUpdates.remove({});
    },

    'textFixtures.clearWorkPackages'(){
        WorkPackageComponents.remove({});
        WorkPackages.remove({});
    },

    'testFixtures.AddBasicDesignData'(designName, designVersionName){

        // Add an Application, Design Sections, Features and Scenarios as basic data for a Design
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;
        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
        let rawName = null;

        // Data Available:
        //
        //  Application1
        //      Section1
        //          Feature1
        //              Interface
        //              Actions
        //                  Scenario1
        //                  Scenario444
        //              Conditions
        //                  Scenario2
        //              Consequences
        //              ExtraAspect
        //          Feature444
        //              Interface
        //              Actions
        //              Conditions
        //              Consequences
        //          SubSection1
        //      Section2
        //          Feature2
        //              Interface
        //              Actions
        //                  Scenario3
        //              Conditions
        //                  Scenario4
        //              Consequences
        //          SubSection2
        //  Application99
        //      Section99

        // Add Application1
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentName: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application1');
        ClientDesignComponentServices.updateComponentName(view, mode, application1Component._id, 'Application1', rawName);

        // Add Application99 in case a second Base App needed
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersion._id);
        const application99Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.APPLICATION, componentName: DefaultComponentNames.NEW_APPLICATION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Application99');
        ClientDesignComponentServices.updateComponentName(view, mode, application99Component._id, 'Application99', rawName);

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

        // Add Section99
        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, application99Component);
        const section99Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentName: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('Section99');
        ClientDesignComponentServices.updateComponentName(view, mode, section99Component._id, 'Section99', rawName);

        // Add Feature1 to Section 1
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section1Component);
        const feature1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentName: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature1');
        ClientDesignComponentServices.updateComponentName(view, mode, feature1Component._id, 'Feature1', rawName);

        // Add ExtraAspect to Feature1
        ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, feature1Component);
        const extraAspectComponent = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE_ASPECT, componentName: DefaultComponentNames.NEW_FEATURE_ASPECT_NAME});
        rawName = DesignComponentModules.getRawTextFor('ExtraAspect');
        ClientDesignComponentServices.updateComponentName(view, mode, extraAspectComponent._id, 'ExtraAspect', rawName);

        // Add Feature444 to Section 1
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section1Component);
        const feature444Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentName: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature444');
        ClientDesignComponentServices.updateComponentName(view, mode, feature444Component._id, 'Feature444', rawName);

        // Add Feature2 to Section 2
        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, section2Component);
        const feature2Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.FEATURE, componentName: DefaultComponentNames.NEW_FEATURE_NAME});
        rawName = DesignComponentModules.getRawTextFor('Feature2');
        ClientDesignComponentServices.updateComponentName(view, mode, feature2Component._id, 'Feature2', rawName);

        // Add SubSection1 to Section1
        ClientDesignComponentServices.addDesignSectionToDesignSection(view, mode, section1Component);
        const subSection1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentName: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('SubSection1');
        ClientDesignComponentServices.updateComponentName(view, mode, subSection1Component._id, 'SubSection1', rawName);

        // Add SubSection2 to Section2
        ClientDesignComponentServices.addDesignSectionToDesignSection(view, mode, section2Component);
        const subSection2Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.DESIGN_SECTION, componentName: DefaultComponentNames.NEW_DESIGN_SECTION_NAME});
        rawName = DesignComponentModules.getRawTextFor('SubSection2');
        ClientDesignComponentServices.updateComponentName(view, mode, subSection2Component._id, 'SubSection2', rawName);

        // Add Scenario1 to Feature1 Actions
        const featureAspect1Component = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: 'Actions', componentParentId: feature1Component._id});
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component);
        const scenario1Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario1');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario1Component._id, 'Scenario1', rawName);

        // Add Scenario444 to Feature1 Actions
        ClientDesignComponentServices.addScenario(view, mode, featureAspect1Component);
        const scenario444Component = DesignComponents.findOne({designVersionId: designVersion._id, componentType: ComponentType.SCENARIO, componentName: DefaultComponentNames.NEW_SCENARIO_NAME});
        rawName = DesignComponentModules.getRawTextFor('Scenario444');
        ClientDesignComponentServices.updateComponentName(view, mode, scenario444Component._id, 'Scenario444', rawName);

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
    },

    'testFixtures.writeIntegrationTestResults_ChimpMocha'(locationName, results){

        const scenario1Result = results.scenario1Result;
        const scenario2Result = results.scenario2Result;
        const scenario3Result = results.scenario3Result;
        const scenario4Result = results.scenario4Result;

        const location = TestDataHelpers.getTestOutputLocation(locationName);
        const filesExpected = TestDataHelpers.getIntegrationResultsOutputFiles_ChimpMocha(locationName);

        if(filesExpected.length === 1) {
            // Single output file test case
            const fileName = location.locationPath + filesExpected[0].fileName;

            const headerBollox = '[32m Master Chimp and become a testing Ninja! Check out our course: [39m[4m[34mhttp://bit.ly/2btQaFu [39m[24m [33m [chimp] Running...[39m\n';

            let fileText = '';

            fileText += headerBollox;

            // Proper start of file
            fileText += '{\n';

            let passCount = 0;
            let failCount = 0;
            let pendingCount = 0;

            switch (scenario1Result) {
                case MashTestStatus.MASH_PASS:
                    passCount++;
                    break;
                case MashTestStatus.MASH_FAIL:
                    failCount++;
                    break;
                case MashTestStatus.MASH_PENDING:
                    pendingCount++;
                    break
            }

            switch (scenario2Result) {
                case MashTestStatus.MASH_PASS:
                    passCount++;
                    break;
                case MashTestStatus.MASH_FAIL:
                    failCount++;
                    break;
                case MashTestStatus.MASH_PENDING:
                    pendingCount++;
                    break
            }

            switch (scenario3Result) {
                case MashTestStatus.MASH_PASS:
                    passCount++;
                    break;
                case MashTestStatus.MASH_FAIL:
                    failCount++;
                    break;
                case MashTestStatus.MASH_PENDING:
                    pendingCount++;
                    break
            }

            switch (scenario4Result) {
                case MashTestStatus.MASH_PASS:
                    passCount++;
                    break;
                case MashTestStatus.MASH_FAIL:
                    failCount++;
                    break;
                case MashTestStatus.MASH_PENDING:
                    pendingCount++;
                    break
            }

            const stats = '\"stats\": {\n  \"suites\": 2,\n  \"tests\": 4,\n  \"passes\": ' + passCount + ',\n  \"pending\": ' + pendingCount + ',\n  \"failures\": ' + failCount + ',\n  \"start\": \"2017-02-20T12:21:26.237Z\",\n  \"end\": \"2017-02-20T12:21:28.411Z\",\n  \"duration\": 1000\n },\n'

            fileText += stats;

            fileText += '\"pending\": [';
            // Add in pending
            let pendingText = '';
            if (scenario1Result === MashTestStatus.MASH_PENDING) {
                pendingText = '\n  {\n  \"title\": \"Scenario1",\n  \"fullTitle\": \"Feature1 Scenario1\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += pendingText;
            }
            if (scenario2Result === MashTestStatus.MASH_PENDING) {
                pendingText = '\n  {\n  \"title\": \"Scenario2",\n  \"fullTitle\": \"Feature1 Scenario2\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += pendingText;
            }
            if (scenario3Result === MashTestStatus.MASH_PENDING) {
                pendingText = '\n  {\n  \"title\": \"Scenario3",\n  \"fullTitle\": \"Feature2 Scenario3\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += pendingText;
            }
            if (scenario4Result === MashTestStatus.MASH_PENDING) {
                pendingText = '\n  {\n  \"title\": \"Scenario4",\n  \"fullTitle\": \"Feature2 Scenario4\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += pendingText;
            }
            fileText += '],\n';

            fileText += '\"failures\": [\n';
            // Add in failed
            let failedText = '';
            if (scenario1Result === MashTestStatus.MASH_FAIL) {
                failedText = '\n  {\n  \"title\": \"Scenario1",\n  \"fullTitle\": \"Feature1 Scenario1\",\n  \"currentRetry": 0,\n  \"err\": {\n      \"message\": \"[FAIL] Failure Message\"\n      \"reason\": \"Failure Message\"\n}\n },';
                fileText += failedText;
            }
            if (scenario2Result === MashTestStatus.MASH_FAIL) {
                failedText = '\n  {\n  \"title\": \"Scenario2",\n  \"fullTitle\": \"Feature1 Scenario2\",\n  \"currentRetry": 0,\n  \"err\": {\n      \"message\": \"[FAIL] Failure Message\"\n      \"reason\": \"Failure Message\"\n}\n },';
                fileText += failedText;
            }
            if (scenario3Result === MashTestStatus.MASH_FAIL) {
                failedText = '\n  {\n  \"title\": \"Scenario3",\n  \"fullTitle\": \"Feature2 Scenario3\",\n  \"currentRetry": 0,\n  \"err\": {\n      \"message\": \"[FAIL] Failure Message\"\n      \"reason\": \"Failure Message\"\n}\n },';
                fileText += failedText;
            }
            if (scenario4Result === MashTestStatus.MASH_FAIL) {
                failedText = '\n  {\n  \"title\": \"Scenario4",\n  \"fullTitle\": \"Feature2 Scenario4\",\n  \"currentRetry": 0,\n  \"err\": {\n      \"message\": \"[FAIL] Failure Message\"\n      \"reason\": \"Failure Message\"\n    }\n  },';
                fileText += failedText;
            }
            fileText += '],\n';

            fileText += '\"passes\": [\n';
            // Add in passed
            let passingText = '';
            if (scenario1Result === MashTestStatus.MASH_PASS) {
                passingText = '\n  {\n  \"title\": \"Scenario1",\n  \"fullTitle\": \"Feature1 Scenario1\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += passingText;
            }
            if (scenario2Result === MashTestStatus.MASH_PASS) {
                passingText = '\n  {\n  \"title\": \"Scenario2",\n  \"fullTitle\": \"Feature1 Scenario2\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += passingText;
            }
            if (scenario3Result === MashTestStatus.MASH_PASS) {
                passingText = '\n  {\n  \"title\": \"Scenario3",\n  \"fullTitle\": \"Feature2 Scenario3\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += passingText;
            }
            if (scenario4Result === MashTestStatus.MASH_PASS) {
                passingText = '\n  {\n  \"title\": \"Scenario4",\n  \"fullTitle\": \"Feature2 Scenario4\",\n  \"currentRetry": 0,\n  \"err\": {}\n },';
                fileText += passingText;
            }
            fileText += ']\n}\n';

            // Write the file
            fs.writeFileSync(fileName, fileText);
        } else {

            // Support for testing 2 outputs
            if(filesExpected.length === 2){
                // TODO Add this
            }
        }
    }



});

