/**
 * Created by aston on 02/09/2016.
 */

export const UltrawideDirectory = {
    BACKUP_DIR:         'design_backups/',
    TEST_OUTPUT_DIR:    'test_outputs/',
    EXPORT_DIR:         'file_exports/'
};

export const RoleType = {
    NONE:           'NONE',
    DESIGNER:       'DESIGNER',
    DEVELOPER:      'DEVELOPER',
    MANAGER:        'MANAGER',
    ADMIN:          'ADMIN',
    GUEST_VIEWER:   'GUEST_VIEWER'
};

export const UltrawideAction = {
    ACTION_HOME:                'ACTION_HOME',
    ACTION_DESIGNS:             'ACTION_DESIGNS',
    ACTION_LAST_DESIGNER:       'ACTION_LAST_DESIGNER',
    ACTION_LAST_DEVELOPER:      'ACTION_LAST_DEVELOPER',
    ACTION_LAST_MANAGER:        'ACTION_LAST_MANAGER',
    ACTION_CONFIGURE:           'ACTION_CONFIGURE'
};

// Determines what we are looking at
export const ViewType = {
    ADMIN:                      'ADMIN',                    // Admin Management Screen
    AUTHORISE:                  'AUTHORISE',                // Login screen
    CONFIGURE:                  'CONFIGURE',                // Change user settings
    SELECT:                     'SELECT',                   // Home Selection Screen
    DESIGN_NEW:                 'DESIGN_NEW',               // An unpublished design version
    DESIGN_PUBLISHED:           'DESIGN_PUBLISHED',         // A published Initial Design Version
    DESIGN_UPDATABLE:           'DESIGN_UPDATABLE',         // An Updatable Design Version - not directly editable
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
    VIEW_VERSION_PROGRESS:      'VIEW_VERSION_PROGRESS',
    VIEW_TEST_EXPECTATIONS:     'VIEW_TEST_EXPECTATIONS',
    VIEW_ALL_AS_TABS:           'VIEW_ALL_AS_TABS'
};


export const MenuType = {
    MENU_TOP_TEXT:                  'MENU_TOP_TEXT',
    MENU_TOP_ICON:                  'MENU_TOP_ICON',
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
    MENU_ACTION_VIEW_ALL_TABS:      'MENU_ACTION_VIEW_ALL_TABS',
    MENU_ACTION_REFRESH_TESTS:      'MENU_ACTION_REFRESH_TESTS',
    MENU_ACTION_REFRESH_PROGRESS:   'MENU_ACTION_REFRESH_PROGRESS',
    MENU_ACTION_REFRESH_DATA:       'MENU_ACTION_REFRESH_DATA',
    MENU_ACTION_LOGOUT:             'MENU_ACTION_LOGOUT'
};

// In some views there is an option of seeing everything read-only (no controls visible)
export const ViewMode = {
    MODE_EDIT: 'MODE_EDIT',
    MODE_VIEW: 'MODE_VIEW'
};

export const ViewOptionType = {
    DESIGN_DETAILS:     'designDetailsVisible',
    DESIGN_TEST_SUMMARY:'testSummaryVisible',
    DESIGN_DICT:        'designDomainDictVisible',
    UPDATE_DETAILS:     'designDetailsVisible',
    UPDATE_PROGRESS:    'updateProgressVisible',
    UPDATE_DICT:        'designDomainDictVisible',
    UPDATE_SUMMARY:     'updateSummaryVisible',
    UPDATE_TEST_SUMMARY:'testSummaryVisible',
    WP_DETAILS:         'designDetailsVisible',
    WP_DICT:            'designDomainDictVisible',
    DEV_DETAILS:        'designDetailsVisible',
    DEV_ACC_TESTS:      'devAccTestsVisible',
    DEV_INT_TESTS:      'devIntTestsVisible',
    DEV_UNIT_TESTS:     'devUnitTestsVisible',
    DEV_FILES:          'devFeatureFilesVisible',
    DEV_DICT:           'designDomainDictVisible',
    DEV_TEST_SUMMARY:   'testSummaryVisible',
    DESIGN_ALL_AS_TABS: 'designShowAllAsTabs',
    UPDATE_ALL_AS_TABS: 'updateShowAllAsTabs',
    WORK_ALL_AS_TABS:   'workShowAllAsTabs',
    NONE:               ''
};


// Context specifies how and what information is displayed in common components
export const DisplayContext = {
    NONE:                   'NONE',
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
    TEST_EXPECTATIONS:      'TEST_EXPECTATIONS',
    MASH_DATA:              'MASH_DATA',            // Test results window
    MASH_ACC_TESTS:         'MASH_ACC_TESTS',
    MASH_INT_TESTS:         'MASH_INT_TESTS',
    MASH_UNIT_TESTS:        'MASH_UNIT_TESTS',
    INT_TEST_FEATURE:       'INT_TEST_FEATURE',
    INT_TEST_FEATURE_ASPECT:'INT_TEST_FEATURE_ASPECT',
    INT_TEST_SCENARIO:      'INT_TEST_SCENARIO',
    UPDATE_SUMMARY:         'UPDATE_SUMMARY',
    WP_SUMMARY:             'WP_SUMMARY',
    PROGRESS_SUMMARY:       'PROGRESS_SUMMARY',
    EDITOR_FOOTER:          'EDITOR_FOOTER',
    EDITOR_HEADER:          'EDITOR_HEADER',
    DETAILS_HEADER:         'DETAILS_HEADER',
    PROJECT_SUMMARY_NONE:   'PROJECT_SUMMARY_NONE',
    PROJECT_SUMMARY_MISSING:'PROJECT_SUMMARY_MISSING',
    PROJECT_SUMMARY_FAIL:   'PROJECT_SUMMARY_FAIL',
    PROJECT_SUMMARY_SOME:   'PROJECT_SUMMARY_SOME',
    PROJECT_SUMMARY_ALL:    'PROJECT_SUMMARY_ALL',
    WORK_ITEM_EDIT_BASE:    'WORK_ITEM_EDIT_BASE',  // Work Item List when editing / viewing in WORK tab for base design
    WORK_ITEM_EDIT_UPD:     'WORK_ITEM_EDIT_UPD',   // Work Item List when editing / viewing in WORK tab for updatable design
    WORK_ITEM_SUMMARY:      'WORK_ITEM_SUMMARY',    // Work Item List when on Project Summary page
    WORK_ITEM_DU_LIST:      'WORK_ITEM_DU_LIST',    // List of available Design Updates for DV
    DV_BACKLOG_NONE:        'DV_BACKLOG_NONE',
    DV_BACKLOG_DESIGN:      'DV_BACKLOG_DESIGN',
    DV_BACKLOG_WORK:        'DV_BACKLOG_WORK',
    DV_BACKLOG_NO_EXP:      'DV_BACKLOG_NO_EXP',
    DV_BACKLOG_TEST_MISSING:'DV_BACKLOG_TEST_MISSING',
    DV_BACKLOG_TEST_FAIL:   'DV_BACKLOG_TEST_FAIL',
    CONFIG_USER_PASSWORD:   'CONFIG_USER_PASSWORD',
    CONFIG_ADMIN_PASSWORD:  'CONFIG_ADMIN_PASSWORD'
};

export const SummaryType = {
    SUMMARY_DV:             'SUMMARY_DV',
    SUMMARY_DV_ASSIGNED:    'SUMMARY_DV_ASSIGNED',
    SUMMARY_DV_UNASSIGNED:  'SUMMARY_DV_UNASSIGNED',
    SUMMARY_IN:             'SUMMARY_IN',
    SUMMARY_IT:             'SUMMARY_IT',
    SUMMARY_DU:             'SUMMARY_DU',
    SUMMARY_WP:             'SUMMARY_WP'
};

export const BacklogType = {
    BACKLOG_DESIGN:         'BACKLOG_DESIGN',
    BACKLOG_WP_ASSIGN:      'BACKLOG_WP_ASSIGN',
    BACKLOG_TEST_EXP:       'BACKLOG_TEST_EXP',
    BACKLOG_TEST_MISSING:   'BACKLOG_TEST_MISSING',
    BACKLOG_TEST_FAIL:      'BACKLOG_TEST_FAIL',
};

export const StepContext = {
    STEP_FEATURE:           'STEP_FEATURE',             // A feature background step
    STEP_FEATURE_SCENARIO:  'STEP_FEATURE_SCENARIO',    // The background steps reproduced for a scenario
    STEP_SCENARIO:          'STEP_SCENARIO'             // A scenario step
};

// Types of items that can be selected
export const ItemType = {
    DESIGN:             'DESIGN',
    DESIGN_VERSION:     'DV_ASSIGNED',
    DESIGN_UPDATE:      'DESIGN_UPDATE',
    WORK_PACKAGE:       'WORK_PACKAGE',
    USER:               'USER',
    TEST_LOCATION:      'TEST_LOCATION',
    TEST_LOCATION_FILE: 'TEST_LOCATION_FILE',
    TEST_TYPE:          'TEST_TYPE',
    DESIGN_PERMUTATION: 'DESIGN_PERMUTATION',
    PERMUTATION_VALUE:  'PERMUTATION_VALUE'
};

export const ItemListType = {
    ULTRAWIDE_ITEM:     'UW_ITEM',
    BACKLOG_ITEM:       'BL_ITEM',
    WORK_ITEM_IN:       'WI_IN',
    WORK_ITEM_IT:       'WI_IT',
    WORK_ITEM_DU:       'WI_DU',
    WORK_ITEM_WP:       'WI_WP',
    WORK_ITEM_DU_WP:    'WI_DU_WP',
    WORK_ITEM_SUMM:     'WI_SUMM'
};

export const WorkItemType = {
    DESIGN_VERSION:     'DV',
    DV_ASSIGNED:        'DA',
    INCREMENT:          'IN',
    ITERATION:          'IT',
    DESIGN_UPDATE:      'DU',
    BASE_WORK_PACKAGE:  'WP',
    UPDATE_WORK_PACKAGE:'UP',
    DV_UNASSIGNED:      'UU'
};

export const WorkItemStatus = {
    WI_NEW:                 'NEW',
    WI_IN_PROGRESS:         'IN_PROGRESS',
    WI_COMPLETE:            'COMPLETE'
};

export const FieldType = {
    NAME:           'NAME',
    VERSION:        'VERSION',
    REFERENCE:      'REFERENCE',
    LINK:           'LINK'
};

// Types of components in a design
export const ComponentType = {
    DESIGN:             'AAAA',
    APPLICATION:        'APPLICATION',
    DESIGN_SECTION:     'DESIGN_SECTION',
    FEATURE:            'FEATURE',
    FEATURE_ASPECT:     'FEATURE_ASPECT',
    SCENARIO:           'SCENARIO',
    TEST:               'TEST',
    TEST_EXPECTATION:   'TEST_EXPECTATION',
    SCENARIO_STEP:      'SCENARIO_STEP',
    BACKGROUND_STEP:    'BACKGROUND_STEP',
    DRAGGABLE_ITEM:     'DRAGGABLE'
};

export const DetailsType = {
    DETAILS_NAME:       'DETAILS_NAME',
    DETAILS_NAME_NEW:   'DETAILS_NAME_NEW',
    DETAILS_NAME_OLD:   'DETAILS_NAME_OLD',
    DETAILS_TEXT:       'DETAILS_TEXT',
    DETAILS_TEXT_NEW:   'DETAILS_TEXT_NEW',
    DETAILS_TEXT_OLD:   'DETAILS_TEXT_OLD',
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
    UPDATE_MERGED:          'MERGED',           // Merged into a new design version (aka Complete)
    UPDATE_IGNORED:         'IGNORED',          // Neither merged nor carried forward in a change to the next design version
};

export const DesignUpdateWpStatus = {
    DU_NO_WP_SCENARIOS:     'du-no-wp-scenarios',
    DU_SOME_WP_SCENARIOS:   'du-some-wp-scenarios',
    DU_ALL_WP_SCENARIOS:    'du-all-wp-scenarios'
};

export const DesignUpdateTestStatus = {
    DU_SCENARIOS_FAILING:       'du-scenarios-failing',
    DU_NO_SCENARIOS_PASSING:    'du-no-scenarios-passing',
    DU_SOME_SCENARIOS_PASSING:  'du-some-scenarios-passing',
    DU_ALL_SCENARIOS_PASSING:   'du-all-scenarios-passing'
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

export const WorkPackageReviewType = {
    REVIEW_NONE:            'REVIEW_NONE',
    REVIEW_OK:              'REVIEW_OK',
    REVIEW_IGNORE:          'REVIEW_IGNORE',
    REVIEW_NOT_OK:          'REVIEW_NOT_OK'
};

export const IterationStatus = {
    IT_NEW:                 'NEW',
    IT_IN_PROGRESS:         'IN_PROGRESS',
    IT_COMPLETE:            'COMPLETE'
};

export const WorkPackageStatus = {
    WP_NEW:                 'NEW',
    WP_AVAILABLE:           'AVAILABLE',
    WP_ADOPTED:             'ADOPTED'
};

export const DuWorkPackageTestStatus = {
    DU_WPS_COMPLETE:        'DU_WPS_COMPLETE',
    DU_WPS_NOT_COMPLETE:    'DU_WPS_NOT_COMPLETE'
};

export const WorkPackageTestStatus = {
    WP_TESTS_COMPLETE:      'WP_TESTS_COMPLETE',
    WP_TESTS_NOT_COMPLETE:  'WP_TESTS_NOT_COMPLETE'
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

export const DesignUpdateSummaryCategory = {
    SUMMARY_UPDATE_HEADER:          'SUMMARY_UPDATE_HEADER',
    SUMMARY_UPDATE_FUNCTIONAL:      'SUMMARY_UPDATE_FUNCTIONAL',
    SUMMARY_UPDATE_ORGANISATIONAL:  'SUMMARY_UPDATE_ORGANISATIONAL',
};

export const WorkSummaryType = {
    WORK_SUMMARY_BASE_DV:           'WORK_SUMMARY_BASE_DV',
    WORK_SUMMARY_UPDATE_DV:         'WORK_SUMMARY_UPDATE_DV',
    WORK_SUMMARY_UPDATE_DV_ALL:     'WORK_SUMMARY_UPDATE_DV_ALL',
    WORK_SUMMARY_BASE_WP:           'WORK_SUMMARY_BASE_WP',
    WORK_SUMMARY_UPDATE:            'WORK_SUMMARY_UPDATE',
    WORK_SUMMARY_UPDATE_WP:         'WORK_SUMMARY_UPDATE_WP'
};

export const DesignUpdateSummaryType = {
    SUMMARY_ADD:                    'SUMMARY_ADD',
    SUMMARY_ADD_TO:                 'SUMMARY_ADD_TO',
    SUMMARY_REMOVE:                 'SUMMARY_REMOVE',
    SUMMARY_REMOVE_FROM:            'SUMMARY_REMOVE_FROM',
    SUMMARY_CHANGE:                 'SUMMARY_CHANGE',
    SUMMARY_DETAILS_CHANGE:         'SUMMARY_DETAILS_CHANGE',
    SUMMARY_CHANGE_IN:              'SUMMARY_CHANGE_IN',
    SUMMARY_MOVE:                   'SUMMARY_MOVE',
    SUMMARY_MOVE_FROM:              'SUMMARY_MOVE_FROM',
    SUMMARY_QUERY:                  'SUMMARY_QUERY',
    SUMMARY_QUERY_IN:               'SUMMARY_QUERY_IN',
};

export const DesignUpdateSummaryItem = {
    SUMMARY_FEATURE:                'Feature',
    SUMMARY_SCENARIO_IN_FEATURE:    'Scenario',
    SUMMARY_SCENARIO_IN_ASPECT:     'Scenario in Aspect',
    SUMMARY_SECTION:                'Section',
    SUMMARY_APPLICATION:            'Application'
};

export const HomePageTab = {
    TAB_SUMMARY:                    '0',
    TAB_DESIGNS:                    '1',
    TAB_UPDATES:                    '2',
    TAB_WORK:                       '3',
    TAB_PROGRESS:                   '4',
    TAB_NOT_SET:                    '99'
};

export const WorkPackageTab = {
    TAB_AVAILABLE:                  '1',
    TAB_ADOPTED:                    '2',
    TAB_COMPLETE:                   '3'
};

export const DesignUpdateTab = {
    TAB_NEW:                        '1',
    TAB_ASSIGNED:                   '2',
    TAB_COMPLETE:                   '3'
};

export const EditorTab = {
    TAB_NOT_SET:                    '0',
    TAB_DETAILS:                    '1',
    TAB_DOMAIN_DICT:                '2',
    TAB_ACC_TESTS:                  '3',
    TAB_INT_TESTS:                  '4',
    TAB_UNIT_TESTS:                 '5',
    TAB_SCENARIO_SEARCH:            '6',
    TAB_UPDATE_SUMMARY:             '7',
    TAB_WORKING_VIEW:               '8',
    TAB_TEST_EXPECTATIONS:          '9'
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

export const UserSetting = {
    SETTING_SCREEN_SIZE:            'SETTING_SCREEN_SIZE',
    SETTING_INCLUDE_NARRATIVES:     'SETTING_INCLUDE_NARRATIVES',
    SETTING_INT_OUTPUT_LOCATION:    'SETTING_INT_OUTPUT_LOCATION',
    SETTING_DOC_TEXT_SECTION:       'SETTING_DOC_TEXT_SECTION',
    SETTING_DOC_TEXT_FEATURE:       'SETTING_DOC_TEXT_FEATURE',
    SETTING_DOC_TEXT_NARRATIVE:     'SETTING_DOC_TEXT_NARRATIVE',
    SETTING_DOC_TEXT_SCENARIO:      'SETTING_DOC_TEXT_SCENARIO',
};

export const UserSettingValue = {
    SCREEN_SIZE_SMALL:      'SCREEN_SIZE_SMALL',
    SCREEN_SIZE_LARGE:      'SCREEN_SIZE_LARGE',
    SETTING_INCLUDE:        'INCLUDE',
    SETTING_EXCLUDE:        'EXCLUDE'
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
    MASH_NOT_DESIGNED:      'mash-not-designed',        // This item is not in the Design
    MASH_IN_DESIGN:         'mash-in-design',           // This item is in the design
};

export const MashTestStatus = {
    MASH_NOT_LINKED:        'mash-not-linked',
    MASH_PENDING:           'mash-pending',
    MASH_PASS:              'mash-pass',
    MASH_FAIL:              'mash-fail',
    MASH_PARTIAL:           'mash-partial',
    MASH_NO_TESTS:          'mash-no-tests',
    MASH_INCOMPLETE:        'mash-incomplete',
    MASH_NO_EXPECTATIONS:   'mash-no-expectations',
    MASH_HAS_EXPECTATIONS:  'mash-has-expectations'
};

export const TestDataStatus = {
    TEST_DATA_NEW_TEST:     'TEST_DATA_NEW_TEST',
    TEST_DATA_NO_TEST:      'TEST_DATA_NO_TEST',
    TEST_DATA_UNCHANGED:    'TEST_DATA_UNCHANGED',
    TEST_DATA_NEW_RESULT:   'TEST_DATA_NEW_RESULT'
};

export const FeatureTestSummaryStatus = {
    FEATURE_FAILING_TESTS:      'feature-failing-tests',
    FEATURE_PASSING_TESTS:      'feature-passing-tests',
    FEATURE_NO_TESTS:           'feature-no-tests',
    FEATURE_NO_HIGHLIGHT:       'feature-no-highlight',
    FEATURE_HIGHLIGHT_FAIL:     'feature-highlight-fail',
    FEATURE_HIGHLIGHT_PASS:     'feature-highlight-pass',
    FEATURE_HIGHLIGHT_NO_TEST:  'feature-highlight-no-test',
    FEATURE_HIGLIGHT_REQUIRED:  'feature-highlight-required'
};

export const MessageType = {
    INFO:       'info',
    SUCCESS:    'success',
    WARNING:    'warning',
    ERROR:      'danger'
};

export const LogLevel = {
    UI:         'UI',
    TRACE:      'TRACE',
    PERF:       'PERF',
    DEBUG:      'DEBUG',
    INFO:       'INFO',
    WARNING:    'WARNING',
    ERROR:      'ERROR',
    NONE:       'NONE'
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

export const TestLocationFileStatus = {
    FILE_UPLOADED:      'FILE_UPLOADED',
    FILE_NOT_UPLOADED:  'FILE_NOT_UPLOADED'
};

// Array for Display lists
export const TestLocationFileTypes = [TestLocationFileType.NONE, TestLocationFileType.UNIT, TestLocationFileType.INTEGRATION, TestLocationFileType.ACCEPTANCE]

export const WordFonts = {
    MAIN_TITLE:     {font: 'Arial', size: 30},
    SUB_TITLE:      {font: 'Arial', size: 14},
    APPLICATION:    {font: 'Arial', size: 24},
    SECTION_1:      {font: 'Arial', size: 20, colour: '5F9EA0'},
    SECTION_N:      {font: 'Arial', size: 18, colour: '8FBC8F'},
    FEATURE:        {font: 'Arial', size: 16, colour: '990000'},
    NARRATIVE:      {font: 'Arial', size: 11, colour: '000000'},
    ASPECT:         {font: 'Arial', size: 12, colour: '5F9EA0'},
    SCENARIO:       {font: 'Arial', size: 11, colour: '000000'},
    DICT_TERM:      {font: 'Arial', size: 14, colour: '000000'},
    DICT_DEF:       {font: 'Arial', size: 11, colour: '000000'},
    DETAILS:        {font: 'Garamond', size: 12, colour: '000000'}
};