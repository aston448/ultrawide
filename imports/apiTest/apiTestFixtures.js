import { Meteor } from 'meteor/meteor';

import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
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
import { DesignDevFeatureMash }     from '../collections/dev/design_dev_feature_mash.js';
import { DesignDevScenarioMash }    from '../collections/dev/design_dev_scenario_mash.js';
import { DesignDevScenarioStepMash }from '../collections/dev/design_dev_scenario_step_mash.js';
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
        UserCurrentEditContext.remove({});
        UserRoles.remove({});

        console.log('Inserting data...');


        // Make up a temporary user until login implemented

        // Create a new account - note need different user names than in "live"
        let designerUserId = Accounts.createUser(
            {
                username: 'test-user1',
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
                username: 'test-user2',
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
                username: 'test-user3',
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

        // Start that user at the beginning.  Assume no settings yet
        UserCurrentEditContext.insert({
            userId: designerUserId
        });

        UserCurrentEditContext.insert({
            userId: developerUserId
        });

        UserCurrentEditContext.insert({
            userId: managerUserId
        });


    }

});

