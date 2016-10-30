/**
 * Created by aston on 02/09/2016.
 */

export const RoleType = {
    NONE:       'NONE',
    DESIGNER:   'DESIGNER',
    DEVELOPER:  'DEVELOPER',
    MANAGER:    'MANAGER'
};

// Determines what we are looking at
export const ViewType = {
    AUTHORISE:                  'AUTHORISE',                // Login screen
    DESIGNS:                    'DESIGNS',                  // Designs screen
    SELECT:                     'SELECT',                   // Main Selection Screen
    DESIGN_NEW_EDIT:            'DESIGN_NEW_EDIT',                 // Edit an unpublished design version
    DESIGN_PUBLISHED_VIEW:      'DESIGN_PUBLISHED_VIEW',           // View a published Design Version
    DESIGN_UPDATE_EDIT:         'DESIGN_UPDATE_EDIT',              // Edit a Design Update
    DESIGN_UPDATE_VIEW:         'DESIGN_UPDATE_VIEW',              // View a Design Update
    WORK_PACKAGE_BASE_EDIT:     'WORK_PACKAGE_BASE_EDIT',   // Edit a Work Package content for a Design Version
    WORK_PACKAGE_UPDATE_EDIT:   'WORK_PACKAGE_UPDATE_EDIT', // Edit a Work Package content for a Design Update
    WORK_PACKAGE_BASE_VIEW:     'WORK_PACKAGE_BASE_VIEW',   // View a Work Package content for a Design Version
    WORK_PACKAGE_UPDATE_VIEW:   'WORK_PACKAGE_UPDATE_VIEW', // View a Work Package content for a Design Update
    WORK_PACKAGE_BASE_WORK:     'WORK_PACKAGE_BASE_WORK',   // Work with adopted base work package as a developer
    WORK_PACKAGE_UPDATE_WORK:   'WORK_PACKAGE_UPDATE_WORK'  // Work with adopted update work package as a developer

};

// In some views there is an option of seeing everything read-only (no controls visible)
export const ViewMode = {
    MODE_EDIT: 'MODE_EDIT',
    MODE_VIEW: 'MODE_VIEW'
};

// Context specifies how and what information is displayed in common components
export const DisplayContext = {
    BASE_EDIT:              'BASE_EDIT',            // Editable new design
    BASE_VIEW:              'BASE_VIEW',            // Base design version window for design update
    UPDATE_SCOPE:           'UPDATE_SCOPE',         // Update Scope window
    UPDATE_EDIT:            'UPDATE_EDIT',          // Update Edit window
    UPDATE_VIEW:            'UPDATE_VIEW',          // Update when viewing it
    WP_SCOPE:               'WP_SCOPE',             // Work Package Scope window
    WP_VIEW:                'WP_VIEW',              // Work Package View window
    DEV_DESIGN:             'DEV_DESIGN',           // Developer view of design (or part of it)
    DEV_FEATURE_DESIGN:     'DEV_FEATURE_DESIGN',   // Developer view of a design Feature and its Scenarios
    DEV_FEATURE_CODE:       'DEV_FEATURE_CODE',     // Developer view of a Feature implementation in code tests
    DEV_SCENARIO_DESIGN:    'DEV_SCENARIO_DESIGN',  // Developer view of a design Scenario
    DEV_SCENARIO_CODE:      'DEV_SCENARIO_CODE'     // Developer view of a Scenario implementation in code tests
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

export const DesignVersionStatus = {
    VERSION_NEW:                'NEW',          // Not available to users - may be freely updated.  Only for completely new designs.
    VERSION_PUBLISHED_DRAFT:    'DRAFT',        // Base version and design updates available to users.  Changes only via design updates
    VERSION_PUBLISHED_FINAL:    'FINAL'         // Fixed - no more changes
};

export const DesignUpdateStatus = {
    UPDATE_NEW:             'NEW',              // Designer can edit this update.  Cannot be adopted yet
    UPDATE_PUBLISHED_DRAFT: 'DRAFT',            // Can be adopted.  Can still be edited...
    UPDATE_MERGED:          'MERGED',           // Merged into a new design version
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
    MERGE_INCLUDE:          'Include change',
    MERGE_ROLL:             'Roll change forward',
    MERGE_IGNORE:           'Ignore change'
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
    STEP_FROM_DESIGN:       'STEP_FROM_DESIGN',
    STEP_FROM_DEV:          'STEP_FROM_DEV',
    STEP_MODIFIED_DESIGN:   'STEP_MODIFIED_DESIGN',
    STEP_MODIFIED_DEV:      'STEP_MODIFIED_DEV',
    STEP_INVALID:           'STEP_INVALID'
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

export const MessageType = {
    INFO:       'info',
    SUCCESS:    'success',
    WARNING:    'warning',
    ERROR:      'danger'
};

export const LogLevel = {
    TRACE:  'TRACE: ',
    DEBUG:  'DEBUG: ',
    INFO:   'INFO:  ',
    NONE:   'NONE'
};