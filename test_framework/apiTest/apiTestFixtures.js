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

import ClientIdentityServices from '../../imports/apiClient/apiIdentity.js';

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
            const modTestResults = '/Users/aston/WebstormProjects/ultrawide-test/mocha-unit-output.json'

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

            // Make up a temporary user until login implemented
            // Recreate users only needed after a reset (may be recreated by normal fixtures anyway)
            if (UserRoles.find({}).count() === 0) {

                console.log('Inserting data...');
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
                    isDeveloper: true,
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

    }

});

