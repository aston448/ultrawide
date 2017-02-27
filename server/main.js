// Stuff to be used by the server

// Collections
import '../imports/collections/app/app_global_data.js';
import '../imports/collections/backup/design_backups.js';
import '../imports/collections/design/designs.js';
import '../imports/collections/design/design_versions.js';
import '../imports/collections/design_update/design_updates.js';
import '../imports/collections/design_update/design_update_summaries.js';
import '../imports/collections/design/design_components.js';
import '../imports/collections/design/feature_background_steps.js';
import '../imports/collections/design/scenario_steps.js';
import '../imports/collections/users/user_roles.js';
import '../imports/collections/context/user_current_edit_context.js';
import '../imports/collections/context/user_current_view_options.js';
import '../imports/collections/design_update/user_current_dev_updates.js';
import '../imports/collections/design/domain_dictionary.js';
import '../imports/collections/work/work_packages.js';
import '../imports/collections/work/work_package_components.js';

import '../imports/collections/dev/user_dev_features.js';
import '../imports/collections/dev/user_dev_feature_background_steps.js';
import '../imports/collections/dev/user_dev_feature_scenarios.js';
import '../imports/collections/dev/user_dev_feature_scenario_steps.js';

import '../imports/collections/dev/user_dev_test_summary_data.js';

import '../imports/collections/dev/user_work_package_mash_data.js';
import '../imports/collections/dev/user_work_package_feature_step_data.js';

import '../imports/collections/dev/user_acc_test_results.js';
import '../imports/collections/dev/user_int_test_results.js';
import '../imports/collections/dev/user_unit_test_results.js';

// Modules
import '../imports/startup/server/fixtures.js';

// Server API
import '../imports/apiServer/apiDesign.js';
import '../imports/apiServer/apiDesignVersion.js';
import '../imports/apiServer/apiDesignUpdate.js';
import '../imports/apiServer/apiDesignUpdateSummary.js';
import '../imports/apiServer/apiWorkPackage.js';
import '../imports/apiServer/apiWorkPackageComponent.js';
import '../imports/apiServer/apiScenario.js';
import '../imports/apiServer/apiTextEditor.js';
import '../imports/apiServer/apiUserContext.js';
import '../imports/apiServer/apiDomainDictionary.js';
import '../imports/apiServer/apiImpEx.js';
import '../imports/apiServer/apiFeatureFiles.js';
import '../imports/apiServer/apiTestIntegration.js';
import '../imports/apiServer/apiFixtures.js';
import '../imports/apiServer/apiTestOutputLocations.js';

// Meteor Validated Methods
import '../imports/apiValidatedMethods/design_methods.js';
import '../imports/apiValidatedMethods/design_version_methods.js';
import '../imports/apiValidatedMethods/design_update_methods.js';
import '../imports/apiValidatedMethods/design_update_summary_methods.js';
import '../imports/apiValidatedMethods/design_component_methods.js';
import '../imports/apiValidatedMethods/design_update_component_methods.js';
import '../imports/apiValidatedMethods/work_package_methods.js';
import '../imports/apiValidatedMethods/work_package_component_methods.js';
import '../imports/apiValidatedMethods/domain_dictionary_methods.js';


// Integration test Framework
import '../test_framework/apiTest/apiTestFixtures.js';

import '../test_framework/apiTest/apiClientTestUserContext'
import '../test_framework/apiTest/apiClientTestDesigns.js';
import '../test_framework/apiTest/apiClientTestDesignVersions.js';

import '../test_framework/apiTest/apiVerifyDesigns.js';
import '../test_framework/apiTest/apiVerifyDesignVersions.js';
import '../test_framework/apiTest/apiVerifyDesignComponents.js';
import '../test_framework/apiTest/apiVerifyUserContext'


