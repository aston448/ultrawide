
export const LoginMessages = {
    MSG_LOGIN_OK:                   'Logged in',
    MSG_LOGIN_FAIL:                 'Invalid login credentials',
    MSG_LOGIN_NOT_ACTIVE:           'This user is no longer active',
    MSG_LOGIN_NOT_RECOGNISED:       'User not recognised'
};

export const ImpexMessages = {

    MSG_DESIGN_BACKUP:              'Design backup saved',
    MSG_DESIGN_RESTORE:             'Design restored from backup',
    MSG_DESIGN_ARCHIVE:             'Design archived',
    MSG_DESIGN_REBASE:              'Latest DV saved as new Design'
};

export const UserSettingMessages = {

    MSG_USER_SETTING_SAVED:         'Setting saved'
};

export const UserManagementMessages = {

    MSG_USER_ADDED:                 'New User added',
    MSG_USER_UPDATED:               'User details saved',
    MSG_USER_PASSWORD_RESET:        'User password reset to default',
    MSG_USER_ACTIVATED:             'User made active',
    MSG_USER_DEACTIVATED:           'User made inactive',
    MSG_USER_API_KEY_SAVED:         'API key saved',
    MSG_AMIN_PASSWORD_CHANGED:      'Admin password changed',
    MSG_INVALID_ROLE_FOR_GUEST:     'This role cannot be assigned to a Guest Viewer'
};

export const DesignMessages = {

    MSG_DESIGN_ADDED:               'New Design added',
    MSG_DESIGN_REMOVED:             'Design removed',
    MSG_DESIGN_NAME_UPDATED:        'Design name updated',
    MSG_DEFAULT_ASPECT_UPDATED:     'Default aspect name updated',
    MSG_DEFAULT_ASPECT_INCLUDED:    'Default aspect now included',
    MSG_DEFAULT_ASPECT_EXCLUDED:    'Default aspect now excluded',
};

export const DesignVersionMessages = {

    MSG_DESIGN_VERSION_NAME_UPDATED:    'Design Version name updated',
    MSG_DESIGN_VERSION_NUMBER_UPDATED:  'Design Version number updated',
    MSG_DESIGN_VERSION_PUBLISHED:       'Design Version now Published Draft',
    MSG_DESIGN_VERSION_CREATED:         'Next Design Version created',
    MSG_DESIGN_VERSION_UPDATED:         'Working Design Version updated with latest Merge Updates'
};

export const DesignUpdateMessages = {

    MSG_DESIGN_UPDATE_ADDED:            'New Design Update added',
    MSG_DESIGN_UPDATE_NAME_UPDATED:     'Design Update name updated',
    MSG_DESIGN_UPDATE_VERSION_UPDATED:  'Design Update version updated',
    MSG_DESIGN_UPDATE_PUBLISHED:        'Design Update now Published Draft',
    MSG_DESIGN_UPDATE_WITHDRAWN:        'Design Update reverted to New',
    MSG_DESIGN_UPDATE_REMOVED:          'Design Update removed',
    MSG_DESIGN_UPDATE_MERGE_ACTION_SET: 'Design update merge action set',
    MSG_DESIGN_UPDATE_STATUS_REFRESHED: 'Design Update statuses refreshed'
};

export const WorkPackageMessages = {

    MSG_WORK_PACKAGE_ADDED:             'New Work Package added',
    MSG_WORK_PACKAGE_NAME_UPDATED:      'Work Package name updated',
    MSG_WORK_PACKAGE_LINK_UPDATED:      'Work Package link updated',
    MSG_WORK_PACKAGE_PUBLISHED:         'Work Package now available for adoption',
    MSG_WORK_PACKAGE_WITHDRAWN:         'Work Package no longer available',
    MSG_WORK_PACKAGE_ADOPTED:           'Work Package now adopted by you',
    MSG_WORK_PACKAGE_RELEASED:          'Work Package available for adoption again',
    MSG_WORK_PACKAGE_REMOVED:           'Work Package removed',
};

export const DesignComponentMessages = {

    MSG_NEW_APPLICATION_ADDED:      'New Application added',
    MSG_NEW_DESIGN_SECTION_ADDED:   'New Design Section added',
    MSG_NEW_FEATURE_ADDED:          'New Feature added',
    MSG_NEW_FEATURE_ASPECT_ADDED:   'New Feature Aspect added',
    MSG_NEW_SCENARIO_ADDED:         'New Scenario added',
    MSG_COMPONENT_NAME_UPDATED:     'Component name updated',
    MSG_FEATURE_NARRATIVE_UPDATED:  'Feature narrative updated',
    MSG_DESIGN_COMPONENT_REMOVED:   'Design Component removed',
    MSG_DESIGN_COMPONENT_MOVED:     'Design Component moved',
    MSG_DESIGN_COMPONENT_REORDERED: 'Design Component re-ordered',
    MSG_SCENARIO_EXPECTATIONS_UPDATED:  'Scenario test expectations updated'
};

export const DesignUpdateComponentMessages = {

    MSG_NEW_APPLICATION_ADDED:      'New Application added to Update',
    MSG_NEW_DESIGN_SECTION_ADDED:   'New Design Section added to Update',
    MSG_NEW_FEATURE_ADDED:          'New Feature added to Update',
    MSG_NEW_FEATURE_ASPECT_ADDED:   'New Feature Aspect added to Update',
    MSG_NEW_SCENARIO_ADDED:         'New Scenario added to Update',
    MSG_COMPONENT_NAME_UPDATED:     'Component name updated',
    MSG_FEATURE_NARRATIVE_UPDATED:  'Feature narrative updated',
    MSG_DESIGN_COMPONENT_REMOVED:   'Design Update Component removed',
    MSG_DESIGN_COMPONENT_RESTORED:  'Design Update Component restored',
    MSG_DESIGN_COMPONENT_MOVED:     'Design Update Component moved',
    MSG_DESIGN_COMPONENT_REORDERED: 'Design Update Component re-ordered',
    MSG_DESIGN_COMPONENT_IN_SCOPE:  'Design Update Component in scope',
    MSG_DESIGN_COMPONENT_OUT_SCOPE: 'Design Update Component out of scope',
    MSG_SCENARIO_EXPECTATIONS_UPDATED: 'Scenario test expectations updated'
};

export const WorkPackageComponentMessages = {
    MSG_WP_COMPONENT_IN_SCOPE:      'Work Package Component in scope',
    MSG_WP_COMPONENT_OUT_SCOPE:     'Work Package Component out of scope'
};

export const DomainDictionaryMessages = {

    MSG_DICTIONARY_ENTRY_CREATED:   'New Domain Dictionary entry created',
    MSG_DICTIONARY_TERM_UPDATED:    'Domain Dictionary term name updated',
    MSG_DICTIONARY_DEF_UPDATED:     'Domain Dictionary definition updated',
    MSG_DICTIONARY_TERM_REMOVED:    'Domain Dictionary term removed'
};

export const TextEditorMessages = {

    MSG_TEXT_EDITOR_DETAILS_UPDATED:    'Design Component Details updated'
};

export const TestIntegrationMessages = {

    MSG_INT_TEST_EXPORTED:              'Integration tests exported for Feature'
};

export const TestOutputLocationMessages = {

    MSG_LOCATION_ADDED:                 'Test output location added',
    MSG_LOCATION_SAVED:                 'Test output location saved',
    MSG_LOCATION_REMOVED:               'Test output location removed',
    MSG_LOCATION_FILE_ADDED:            'Test output location file added',
    MSG_LOCATION_FILE_SAVED:            'Test output location file saved',
    MSG_LOCATION_FILE_REMOVED:          'Test output location file removed',
    MSG_USER_CONFIGURATION_SAVED:       'Configuration for test output locations updated'
};

export const DesignPermutationMessages = {

    MSG_PERMUTATION_ADDED:              'Design permutation added',
    MSG_PERMUTATION_SAVED:              'Design permutation name updated',
    MSG_PERMUTATION_VALUE_ADDED:        'Design permutation value added',
    MSG_PERMUTATION_VALUE_SAVED:        'Design permutation value saved'
};

export const TestExpectationMessages = {

    MSG_TYPE_ADDED:                     'Test expectation for test type added',
    MSG_TYPE_REMOVED:                   'All test expectations for test type removed',
    MSG_PERM_REMOVED:                   'All test expectations for design permutation removed',
    MSG_VALUE_ADDED:                    'Test expectation for permutation value added',
    MSG_VALUE_REMOVED:                  'Test expectation for permutation value removed'
};