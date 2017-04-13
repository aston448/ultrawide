/**
 * Created by aston on 02/09/2016.
 */

export const RoleType = {
    NONE:       'NONE',
    DESIGNER:   'DESIGNER',
    DEVELOPER:  'DEVELOPER',
    MANAGER:    'MANAGER'
};

export const UltrawideAction = {
    ACTION_DESIGNS:             'DESIGNS MENU',
    ACTION_LAST_DESIGNER:       'RESUME CURRENT WORK',
    ACTION_LAST_DEVELOPER:      'RESUME CURRENT WORK',
    ACTION_LAST_MANAGER:        'RESUME CURRENT WORK',
    ACTION_TEST_CONFIGURE:      'LOCAL CONFIGURATION'
};

// Determines what we are looking at
export const ViewType = {
    ADMIN:                      'ADMIN',                    // User Management Screen
    AUTHORISE:                  'AUTHORISE',                // Login screen
    HOME:                       'HOME',                     // Home Screen - available user roles / actions
    CONFIGURE:                  'CONFIGURE',                // Change user settings
    TEST_OUTPUTS:               'TEST_OUTPUTS',             // Configure Test Outputs
    DESIGNS:                    'DESIGNS',                  // Designs screen - pick a Design
    SELECT:                     'SELECT',                   // Main Selection Screen once in a Design
    DESIGN_NEW_EDIT:            'DESIGN_NEW_EDIT',          // Edit an unpublished design version
    DESIGN_PUBLISHED_VIEW:      'DESIGN_PUBLISHED_VIEW',    // View a published Initial Design Version
    DESIGN_UPDATABLE_VIEW:      'DESIGN_UPDATABLE_VIEW',    // View progress on an Updatable Design Version
    DESIGN_UPDATE_EDIT:         'DESIGN_UPDATE_EDIT',       // Edit a Design Update
    DESIGN_UPDATE_VIEW:         'DESIGN_UPDATE_VIEW',       // View a Design Update
    WORK_PACKAGE_BASE_EDIT:     'WORK_PACKAGE_BASE_EDIT',   // Edit a Work Package content for a Design Version
    WORK_PACKAGE_UPDATE_EDIT:   'WORK_PACKAGE_UPDATE_EDIT', // Edit a Work Package content for a Design Update
    WORK_PACKAGE_BASE_VIEW:     'WORK_PACKAGE_BASE_VIEW',   // View a Work Package content for a Design Version
    WORK_PACKAGE_UPDATE_VIEW:   'WORK_PACKAGE_UPDATE_VIEW', // View a Work Package content for a Design Update
    DEVELOP_BASE_WP:            'DEVELOP_BASE_WP',          // Work with adopted base work package as a developer
    DEVELOP_UPDATE_WP:          'DEVELOP_UPDATE_WP',        // Work with adopted update work package as a developer
    WAIT:                       'WAIT'                      // While Data loading

};

export const DetailsViewType = {
    VIEW_DETAILS_NEW:           'VIEW_DETAILS_NEW',
    VIEW_STEPS_NEW:             'VIEW_STEPS_NEW',
    VIEW_DETAILS_OLD:           'VIEW_DETAILS_OLD',
    VIEW_STEPS_OLD:             'VIEW_STEPS_OLD',
    VIEW_ACC_TESTS:             'VIEW_ACC_TESTS',
    VIEW_INT_TESTS:             'VIEW_INT_TESTS',
    VIEW_UNIT_TESTS:            'VIEW_UNIT_TESTS',
    VIEW_ACC_FILES:             'VIEW_ACC_FILES',
    VIEW_UPD_SUMM:              'VIEW_UPD_SUMM',
    VIEW_DOM_DICT:              'VIEW_DOM_DICT',
    VIEW_VERSION_PROGRESS:      'VIEW_VERSION_PROGRESS'
};

export const MenuType = {
    MENU_TOP:                       'MENU_TOP',
    MENU_EDITOR:                    'MENU_EDITOR'
};

export const MenuDropdown = {
    MENU_DROPDOWN_GOTO:             'MENU_DROPDOWN_GOTO',
    MENU_DROPDOWN_VIEW:             'MENU_DROPDOWN_VIEW',
    MENU_DROPDOWN_REFRESH:          'MENU_DROPDOWN_REFRESH'
};

export const MenuAction = {
    MENU_ACTION_GOTO_SELECTION:     'MENU_ACTION_GOTO_SELECTION',
    MENU_ACTION_GOTO_DESIGNS:       'MENU_ACTION_GOTO_DESIGNS',
    MENU_ACTION_GOTO_CONFIG:        'MENU_ACTION_GOTO_CONFIG',
    MENU_ACTION_GOTO_TEST_CONFIG:   'MENU_ACTION_GOTO_TEST_CONFIG',
    MENU_ACTION_VIEW_DETAILS:       'MENU_ACTION_VIEW_DETAILS',
    MENU_ACTION_VIEW_PROGRESS:      'MENU_ACTION_VIEW_PROGRESS',
    MENU_ACTION_VIEW_UPD_SUMM:      'MENU_ACTION_VIEW_UPD_SUMM',
    MENU_ACTION_VIEW_DICT:          'MENU_ACTION_VIEW_DICT',
    MENU_ACTION_VIEW_ACC_TESTS:     'MENU_ACTION_VIEW_ACC_TESTS',
    MENU_ACTION_VIEW_INT_TESTS:     'MENU_ACTION_VIEW_INT_TESTS',
    MENU_ACTION_VIEW_UNIT_TESTS:    'MENU_ACTION_VIEW_UNIT_TESTS',
    MENU_ACTION_VIEW_ACC_FILES:     'MENU_ACTION_VIEW_ACC_FILES',
    MENU_ACTION_VIEW_TEST_SUMM:     'MENU_ACTION_VIEW_TEST_SUMM',
    MENU_ACTION_REFRESH_TESTS:      'MENU_ACTION_REFRESH_TESTS',
    MENU_ACTION_REFRESH_DATA:       'MENU_ACTION_REFRESH_DATA',
};

// In some views there is an option of seeing everything read-only (no controls visible)
export const ViewMode = {
    MODE_EDIT: 'MODE_EDIT',
    MODE_VIEW: 'MODE_VIEW'
};

export const ViewOptionType = {
    DESIGN_DETAILS:     'designDetailsVisible',
    DESIGN_TEST_SUMMARY:'designTestSummaryVisible',
    DESIGN_DICT:        'designDomainDictVisible',
    UPDATE_DETAILS:     'updateDetailsVisible',
    UPDATE_PROGRESS:    'updateProgressVisible',
    UPDATE_DICT:        'updateDomainDictVisible',
    UPDATE_SUMMARY:     'updateSummaryVisible',
    UPDATE_TEST_SUMMARY:'updateTestSummaryVisible',
    WP_DETAILS:         'wpDetailsVisible',
    WP_DICT:            'wpDomainDictVisible',
    DEV_DETAILS:        'devDetailsVisible',
    DEV_ACC_TESTS:      'devAccTestsVisible',
    DEV_INT_TESTS:      'devIntTestsVisible',
    DEV_UNIT_TESTS:     'devUnitTestsVisible',
    DEV_FILES:          'devFeatureFilesVisible',
    DEV_DICT:           'devDomainDictVisible',
    DEV_TEST_SUMMARY:   'devTestSummaryVisible',
    NONE:               ''
};

export const WindowSize = {
    WINDOW_LARGE:       'WINDOW_LARGE',
    WINDOW_SMALL:       'WINDOW_SMALL'
};

// Context specifies how and what information is displayed in common components
export const DisplayContext = {
    BASE_EDIT:              'BASE_EDIT',            // Editable new design
    BASE_VIEW:              'BASE_VIEW',            // Base design version window for design update
    WORKING_VIEW:           'WORKING_VIEW',         // Updatable Design Version progress view
    UPDATE_SCOPE:           'UPDATE_SCOPE',         // Update Scope window
    UPDATE_EDIT:            'UPDATE_EDIT',          // Update Edit window
    UPDATE_VIEW:            'UPDATE_VIEW',          // Update when viewing it
    WP_SCOPE:               'WP_SCOPE',             // Work Package Scope window
    WP_VIEW:                'WP_VIEW',              // Work Package View window
    DEV_DESIGN:             'DEV_DESIGN',           // Developer view of design (or part of it)
    DEV_FEATURE_DESIGN:     'DEV_FEATURE_DESIGN',   // Developer view of a design Feature and its Scenarios
    DEV_FEATURE_CODE:       'DEV_FEATURE_CODE',     // Developer view of a Feature implementation in code tests
    DEV_SCENARIO_DESIGN:    'DEV_SCENARIO_DESIGN',  // Developer view of a design Scenario
    DEV_SCENARIO_CODE:      'DEV_SCENARIO_CODE',    // Developer view of a Scenario implementation in code tests
    EDIT_STEP_WP_DEV:       'EDIT_STEP_WP_DEV',     // Step Editor in a Work Package Dev context
    EDIT_STEP_DESIGN:       'EDIT_STEP_DESIGN',     // Step editor for Design-Dev Mash: Steps only in Design
    EDIT_STEP_LINKED:       'EDIT_STEP_LINKED',     // Step editor for Design-Dev Mash: Steps linked across Design and Dev
    EDIT_STEP_DEV:          'EDIT_STEP_DEV',        // Step editor for Design-Dev Mash: Steps only in Dev
    VIEW_ACCEPTANCE_MASH:   'VIEW_ACCEPTANCE_MASH', // View of Scenarios in a Feature related to Acceptance tests
    VIEW_UNIT_MASH:         'VIEW_UNIT_MASH',       // View of related Unit Tests in the Design-Dev Mash
    VIEW_UNIT_UNLINKED:     'VIEW_UNIT_UNLINKED',   // View of all unlinked unit tests
    MASH_DATA:              'MASH_DATA',            // Test results window
    MASH_ACC_TESTS:         'MASH_ACC_TESTS',
    MASH_INT_TESTS:         'MASH_INT_TESTS',
    MASH_UNIT_TESTS:        'MASH_UNIT_TESTS',
    INT_TEST_FEATURE:       'INT_TEST_FEATURE',
    INT_TEST_FEATURE_ASPECT:'INT_TEST_FEATURE_ASPECT',
    INT_TEST_SCENARIO:      'INT_TEST_SCENARIO',
    UPDATE_SUMMARY:         'UPDATE_SUMMARY',
    EDITOR_FOOTER:          'EDITOR_FOOTER',
    EDITOR_HEADER:          'EDITOR_HEADER',
    DETAILS_HEADER:         'DETAILS_HEADER'
};

export const StepContext = {
    STEP_FEATURE:           'STEP_FEATURE',             // A feature background step
    STEP_FEATURE_SCENARIO:  'STEP_FEATURE_SCENARIO',    // The background steps reproduced for a scenario
    STEP_SCENARIO:          'STEP_SCENARIO'             // A scenario step
};

// Types of items that can be selected
export const ItemType = {
    DESIGN:         'DESIGN',
    DESIGN_VERSION: 'DESIGN_VERSION',
    DESIGN_UPDATE:  'DESIGN_UPDATE',
    WORK_PACKAGE:   'WORK_PACKAGE'
};

// Types of components in a design
export const ComponentType = {
    APPLICATION:        'APPLICATION',
    DESIGN_SECTION:     'DESIGN_SECTION',
    FEATURE:            'FEATURE',
    FEATURE_ASPECT:     'FEATURE_ASPECT',
    SCENARIO:           'SCENARIO',
    SCENARIO_STEP:      'SCENARIO_STEP',
    BACKGROUND_STEP:    'BACKGROUND_STEP',
    DRAGGABLE_ITEM:     'DRAGGABLE'
};

export const DesignStatus = {
    DESIGN_LIVE:                'Live',
    DESIGN_ARCHIVED:            'Archived'
};

export const DesignVersionStatus = {
    VERSION_NEW:                    'NEW',              // Not available to users - may be freely updated.  Only for completely new designs.
    VERSION_DRAFT:                  'DRAFT',            // Base version available to users.  Remains editable by Designer.  Only for new designs.
    VERSION_DRAFT_COMPLETE:         'COMPLETE',         // Draft Design Version now Completed
    VERSION_UPDATABLE:              'UPDATABLE',        // Available to users. Changes only via design updates.
    VERSION_UPDATABLE_COMPLETE:     'UPDATES_COMPLETE'  // Updatable Design Version now complete
};

export const UpdateMergeStatus = {
    COMPONENT_BASE:                 'component-base',             // Component is unchanged from base design
    COMPONENT_BASE_PARENT:          'component-base-parent',      // Component is unchanged but is the parent of a changed component
    COMPONENT_SCENARIO_QUERIED:     'component-scenario-queried', // Scenario is unchanged but added to update perhaps to check tests...
    COMPONENT_ADDED:                'component-added',            // Component added in an Update
    COMPONENT_MODIFIED:             'component-modified',         // Component name was changed by an Update
    COMPONENT_DETAILS_MODIFIED:     'component-details-modified', // Component details text only changed by an update
    COMPONENT_REMOVED:              'component-removed',          // Component removed by an Update
    COMPONENT_MOVED:                'component-moved'             // Component moved in an update

};

export const DesignUpdateStatus = {
    UPDATE_NEW:             'NEW',              // Designer can edit this update.  Cannot be adopted yet
    UPDATE_PUBLISHED_DRAFT: 'DRAFT',            // Can be adopted.  Can still be edited...
    UPDATE_MERGED:          'MERGED',           // Merged into a new design version
    UPDATE_IGNORED:         'IGNORED'           // Neither merged nor carried forward in a change to the next design version
};

export const UpdateScopeType = {
    SCOPE_IN_SCOPE:         'SCOPE_IN_SCOPE',
    SCOPE_PARENT_SCOPE:     'SCOPE_PARENT_SCOPE',
    SCOPE_PEER_SCOPE:       'SCOPE_PEER_SCOPE',
    SCOPE_OUT_SCOPE:        'SCOPE_OUT_SCOPE'
};

export const WorkPackageScopeType = {
    SCOPE_ACTIVE:           'SCOPE_ACTIVE',
    SCOPE_PARENT:           'SCOPE_PARENT',
    SCOPE_NONE:             'SCOPE_NONE'
};

export const WorkPackageStatus = {
    WP_NEW:                 'NEW',
    WP_AVAILABLE:           'AVAILABLE',
    WP_ADOPTED:             'ADOPTED',
    WP_COMPLETE:            'COMPLETE'
};

export const WorkPackageType = {
    WP_BASE:                'BASE',             // Relates to a base design version
    WP_UPDATE:              'UPDATE'            // Relates to a design update
};

export const DesignUpdateMergeAction = {
    MERGE_INCLUDE:          'MERGE_INCLUDE',
    MERGE_ROLL:             'MERGE_ROLL',
    MERGE_IGNORE:           'MERGE_IGNORE'
};

export const DesignUpdateSummaryType = {
    SUMMARY_ADD:                    'Add',
    SUMMARY_ADD_TO:                 'Add To',
    SUMMARY_REMOVE:                 'Remove',
    SUMMARY_REMOVE_FROM:            'Remove From',
    SUMMARY_CHANGE:                 'Change',
    SUMMARY_CHANGE_IN:              'Change In'
};

export const DesignUpdateSummaryItem = {
    SUMMARY_FEATURE:                'Feature',
    SUMMARY_SCENARIO_IN_FEATURE:    'Scenario',
    SUMMARY_SCENARIO_IN_ASPECT:     'Scenario in Aspect',
    SUMMARY_SECTION:                'Section',
    SUMMARY_APPLICATION:            'Application'
};

export const ScenarioStepType = {
    STEP_GIVEN:         'Given',
    STEP_WHEN:          'When',
    STEP_THEN:          'Then',
    STEP_AND:           'And',
    STEP_NEW:           'STEP'
};

export const ScenarioStepStatus = {
    STEP_STATUS_UNLINKED:   'Unlinked',
    STEP_STATUS_PASS:       'Pass',
    STEP_STATUS_FAIL:       'Fail'
};


export const ExportFileName = {
    USERS:                      'USERS.EXP',
    USER_CONTEXT:               'USER_CONTEXT.EXP',
    TEST_OUTPUT_LOCATIONS:      'TEST_OUTPUT_LOCATIONS.EXP',
    TEST_OUTPUT_LOCATION_FILES: 'TEST_OUTPUT_LOCATION_FILES.EXP',
    USER_TEST_TYPE_LOCATIONS:   'USER_TEST_TYPE_LOCATIONS.EXP',
    DESIGNS:                    'DESIGNS.EXP',
    DESIGN_VERSIONS:            'DESIGN_VERSIONS.EXP',
    DESIGN_UPDATES:             'DESIGN_UPDATES.EXP',
    DESIGN_UPDATE_SUMMARIES:    'DESIGN_UPDATE_SUMMARIES.EXP',
    WORK_PACKAGES:              'WORK_PACKAGES.EXP',
    DOMAIN_DICTIONARY:          'DOMAIN_DICTIONARY.EXP',
    DESIGN_VERSION_COMPONENTS:  'DESIGN_VERSION_COMPONENTS.EXP',
    DESIGN_UPDATE_COMPONENTS:   'DESIGN_UPDATE_COMPONENTS.EXP',
    WORK_PACKAGE_COMPONENTS:    'WORK_PACKAGE_COMPONENTS.EXP',
    FEATURE_BACKGROUND_STEPS:   'FEATURE_BACKGROUND_STEPS.EXP',
    SCENARIO_STEPS:             'SCENARIO_STEPS.EXP'
};

export const UserDevFeatureFileStatus = {
    FILE_VALID:             'FILE_VALID',               // File OK as Feature
    FILE_INVALID:           'FILE_INVALID'              // Not able to parse as a Feature
};

export const UserDevFeatureStatus = {
    FEATURE_IN_DESIGN:      'FEATURE_IN_DESIGN',
    FEATURE_IN_WP:          'FEATURE_IN_WP',
    FEATURE_UNKNOWN:        'FEATURE_UNKNOWN'
};


export const UserDevScenarioStatus = {
    SCENARIO_IN_DESIGN:         'SCENARIO_IN_DESIGN',
    SCENARIO_IN_WP:             'SCENARIO_IN_WP',
    SCENARIO_UNKNOWN:           'SCENARIO_UNKNOWN',
    SCENARIO_ADDED_DEV:         'SCENARIO_ADDED_DEV',
    SCENARIO_INVALID:           'SCENARIO_INVALID'
};

export const UserDevScenarioStepStatus = {
    STEP_DEV_ONLY:              'STEP_DEV_ONLY',        // Step implemented but not in design
    STEP_LINKED:                'STEP_LINKED',          // We have decided this step is present in the Design too
    STEP_INVALID:               'STEP_INVALID'
};

export const LocationType = {
    LOCATION_FEATURE_FILES:             'Feature Files Location:',
    LOCATION_ACCEPTANCE_TEST_OUTPUT:    'Acceptance Test Output File:',
    LOCATION_INTEGRATION_TEST_OUTPUT:   'Integration Test Output File:',
    LOCATION_MODULE_TEST_OUTPUT:        'Module Test Output File:'
};

export const DevTestTag = {
    TEST_TEST:              '@test',
    TEST_WATCH:             '@watch',
    TEST_IGNORE:            '@ignore'
};

export const MashStatus = {
    MASH_LINKED:            'mash-linked',              // This feature is recognised both in the Design and Dev Build
    MASH_NOT_IMPLEMENTED:   'mash-not-implemented',     // This is a Design feature not in Dev
    MASH_NOT_DESIGNED:      'mash-not-designed',        // This is a Dev feature not in Design
};

export const MashTestStatus = {
    MASH_NOT_LINKED:        'mash-not-linked',
    MASH_PENDING:           'mash-pending',
    MASH_PASS:              'mash-pass',
    MASH_FAIL:              'mash-fail',
};

export const FeatureTestSummaryStatus = {
    FEATURE_FAILING_TESTS:      'feature-failing-tests',
    FEATURE_PASSING_TESTS:      'feature-passing-tests',
    FEATURE_NO_TESTS:           'feature-no_tests',
    FEATURE_NO_HIGHLIGHT:       'feature-no-highlight',
    FEATURE_HIGHLIGHT_FAIL:     'feature-highlight-fail',
    FEATURE_HIGHLIGHT_PASS:     'feature-highlight-pass',
    FEATURE_HIGHLIGHT_NO_TEST:  'feature-highlight-no-test'
}

export const MessageType = {
    INFO:       'info',
    SUCCESS:    'success',
    WARNING:    'warning',
    ERROR:      'danger'
};

export const LogLevel = {
    TRACE:      'TRACE:   ',
    DEBUG:      'DEBUG:   ',
    INFO:       'INFO:    ',
    WARNING:    'WARNING: ',
    ERROR:      'ERROR:   ',
    NONE:       'NONE:    '
};

export const TestType = {
    NONE:           'NONE',
    ACCEPTANCE:     'Acceptance',
    INTEGRATION:    'Integration',
    UNIT:           'Unit'
};

export const TestRunner = {
    NONE:           'NONE',
    CHIMP_MOCHA:    'Chimp Mocha',
    CHIMP_CUCUMBER: 'Chimp Cucumber',
    METEOR_MOCHA:   'Meteor Mocha'
};
// Array for Display lists
export const TestRunners = [TestRunner.NONE, TestRunner.CHIMP_MOCHA, TestRunner.CHIMP_CUCUMBER, TestRunner.METEOR_MOCHA];

export const TestLocationType = {
    NONE:           'NONE',
    REMOTE:         'REMOTE',
    LOCAL:          'LOCAL'
};
// Array for Display lists
export const TestLocationTypes = [TestLocationType.NONE, TestLocationType.REMOTE, TestLocationType.LOCAL];


export const TestLocationAccessType = {
    NONE:           'NONE',
    FILE:           'FILE',
    RLOGIN:         'RLOGIN',
    FTP:            'FTP'
};
// Array for Display lists
export const TestLocationAccessTypes = [TestLocationAccessType.NONE, TestLocationAccessType.FILE, TestLocationAccessType.RLOGIN, TestLocationAccessType.FTP];


export const TestLocationFileType = {
    NONE:           'NONE',
    UNIT:           'UNIT',
    INTEGRATION:    'INTEGRATION',
    ACCEPTANCE:     'ACCEPTANCE'
};
// Array for Display lists
export const TestLocationFileTypes = [TestLocationFileType.NONE, TestLocationFileType.UNIT, TestLocationFileType.INTEGRATION, TestLocationFileType.ACCEPTANCE]