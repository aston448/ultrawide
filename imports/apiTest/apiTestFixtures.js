import { Meteor } from 'meteor/meteor';

import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }   from '../collections/design/feature_background_steps.js';
import { ScenarioSteps }            from '../collections/design/scenario_steps.js';
import { DomainDictionary }         from '../collections/design/domain_dictionary.js';
import { DesignDevFeatureMash }     from '../collections/tmp/design_dev_feature_mash.js';
import { DesignDevScenarioMash }    from '../collections/tmp/design_dev_scenario_mash.js';
import { DesignDevScenarioStepMash }from '../collections/tmp/design_dev_scenario_step_mash.js';
import { UserDevFeatures }          from '../collections/dev/user_dev_features.js';

import  ImpExServices     from '../servicers/import_export.js';

Meteor.methods({

    'testfixtures.startup'(){

        console.log('STARTUP...  Test Fixtures');

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

        // Clear current edit context
        UserCurrentEditContext.update(
            {},
            {
                $set:{
                    designId:               'NONE',
                    designVersionId:        'NONE',
                    designUpdateId:         'NONE',
                    workPackageId:          'NONE',
                    designComponentId:      'NONE',
                    designComponentType:    'NONE',
                    featureReferenceId:     'NONE',
                    scenarioReferenceId:    'NONE',
                    scenarioStepId:         'NONE',
                }
            },
            {multi: true}
        );

        // Keep Dev context as was...



        // Make up a temporary user until login implemented
        // Recreate users only needed after a reset (may be recreated by normal fixtures anyway)
        if(UserRoles.find({}).count() === 0) {

            console.log('Inserting data...');
            // Create a new accounts
            let designerUserId = Accounts.createUser(
                {
                    username: 'user1',
                    password: 'user1'
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
                    username: 'user2',
                    password: 'user2'
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
                    username: 'user3',
                    password: 'user3'
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

            //TODO get proper root
            const root =  '/Users/aston/WebstormProjects/ultrawide-test';    //Meteor.rootPath;

            console.log("Setting root path to " + root);

            // Start that user at the beginning.  Assume no settings yet
            UserCurrentEditContext.insert({
                userId: designerUserId,
            });
            UserCurrentDevContext.insert({
                userId: designerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });

            UserCurrentEditContext.insert({
                userId: developerUserId,
            });
            UserCurrentDevContext.insert({
                userId: developerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });

            UserCurrentEditContext.insert({
                userId: managerUserId,
            });
            UserCurrentDevContext.insert({
                userId: managerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });
        }




    }

});

