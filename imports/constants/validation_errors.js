/**
 * Created by aston on 06/11/2016.
 */

export const Validation = {
    VALID:                  'VALID',
    INVALID:                'INVALID'
};

export const ImpExValidationErrors = {
    BACKUP_DESIGN_INVALID_ROLE_RESTORE:     'Only the admin user can restore a Design',
    BACKUP_DESIGN_INVALID_ROLE_ARCHIVE:     'Only the admin user can archive a Design'
};

export const UserManagementValidationErrors = {
    USER_MANAGEMENT_NO_ADMIN_USER:              'No admin user found!',
    USER_MANAGEMENT_INVALID_USER_ADD:           'Only the Admin user can add new users',
    USER_MANAGEMENT_INVALID_USER_SAVE:          'Only the Admin user can save changes to users',
    USER_MANAGEMENT_INVALID_USER_ACTIVATE:      'Only the Admin user can activate users',
    USER_MANAGEMENT_INVALID_USER_DEACTIVATE:    'Only the Admin user can deactivate users',
    USER_MANAGEMENT_INVALID_USER_NAME_ADMIN:    'The user name \"admin\" is reserved',
    USER_MANAGEMENT_INVALID_USER_NAME_DUPLICATE:'A user already exists with this user name',
    USER_MANAGEMENT_INVALID_USER_NAME_BLANK:    'A user cannot have no user name',
    USER_MANAGEMENT_INVALID_USER_NAME_ALPHANUM: 'A user name should be alphanumeric with no spaces',
    USER_MANAGEMENT_INVALID_PASSWORD_BLANK:     'A user cannot have no password',

};

export const UserRolesValidationErrors = {
    INVALID_ROLE_FOR_USER:                      'This role is not assigned to the current user'
};

export const DesignValidationErrors = {
    DESIGN_NOT_EXIST:               'Design does not exist!',
    DESIGN_INVALID_ROLE_REMOVE:     'Only a Designer can remove Designs',
    DESIGN_INVALID_ROLE_ADD:        'Only a Designer can add Designs',
    DESIGN_INVALID_ROLE_UPDATE:     'Only a Designer can update Design details',
    DESIGN_INVALID_NAME_DUPLICATE:  'Design name already exists for another Design',
    DESIGN_NOT_REMOVABLE:           'A Design containing Features is not removable'
};

export const DesignVersionValidationErrors = {
    DESIGN_VERSION_INVALID_ROLE_UPDATE:         'Only a Designer can update Design Version details',
    DESIGN_VERSION_INVALID_ROLE_EDIT:           'Only a Designer can edit a Design Version',
    DESIGN_VERSION_INVALID_ROLE_VIEW_NEW:       'Only a Designer can view an unpublished Design Version',
    DESIGN_VERSION_INVALID_ROLE_PUBLISH:        'Only a Designer can publish a Design Version',
    DESIGN_VERSION_INVALID_ROLE_WITHDRAW:       'Only a Designer can withdraw a Design Version',
    DESIGN_VERSION_INVALID_NAME_DUPLICATE:      'Design Version name already exists for another version in this Design',
    DESIGN_VERSION_INVALID_NUMBER_DUPLICATE:    'Design Version number already exists for another version in this Design',
    DESIGN_VERSION_INVALID_STATE_EDIT:          'Only new or draft Design Versions can be edited',
    DESIGN_VERSION_INVALID_STATE_PUBLISH:       'Only new Design Versions can be published',
    DESIGN_VERSION_INVALID_STATE_WITHDRAW:      'Only draft Design Versions can be withdrawn',
    DESIGN_VERSION_UPDATES_WITHDRAW:            'A Design Version with Design Updates cannot be withdrawn',
    DESIGN_VERSION_INVALID_ROLE_NEXT:           'Only a Designer can create a new Design Version',
    DESIGN_VERSION_INVALID_STATE_NEXT:          'Only a draft Design Version can be used to create a new Design Version',
    DESIGN_VERSION_INVALID_UPDATE_NEXT:         'You must include at least one Design Update to create a new Design Version',
    DESIGN_VERSION_INVALID_ROLE_UPDATE_WORKING: 'Only a Designer or Developer can update the working Design Version',
    DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING:'Only an Updatable Design Version can be updated with the latest Design Updates',
    DESIGN_VERSION_INVALID_UPDATE_WORKING:      'There must be at least one Design Update set for inclusion to update the working Design Version'
};

export const DesignUpdateValidationErrors = {
    DESIGN_UPDATE_NOT_EXIST:                    'Design Update does not exist',
    DESIGN_UPDATE_INVALID_ROLE_ADD:             'Only a Designer can add Design Updates',
    DESIGN_UPDATE_INVALID_STATE_ADD:            'Design Updates can only be added to an Updatable Design Version',
    DESIGN_UPDATE_INVALID_ROLE_UPDATE:          'Only a Designer can update Design Update details',
    DESIGN_UPDATE_INVALID_ROLE_EDIT:            'Only a Designer can edit a Design Update',
    DESIGN_UPDATE_INVALID_STATE_EDIT:           'Completed design Updates cannot be edited',
    DESIGN_UPDATE_INVALID_ROLE_PUBLISH:         'Only a Designer can publish a Design Update',
    DESIGN_UPDATE_INVALID_STATE_PUBLISH:        'Only new Design Updates can be published',
    DESIGN_UPDATE_INVALID_ROLE_WITHDRAW:        'Only a Designer can withdraw a Design Update',
    DESIGN_UPDATE_INVALID_STATE_WITHDRAW:       'Only draft Design Updates can be withdrawn',
    DESIGN_UPDATE_INVALID_WPS_WITHDRAW:         'A Design Update that has Work Packages based on it cannot be withdrawn',
    DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW:        'New Design Updates can only be viewed by a Designer',
    DESIGN_UPDATE_INVALID_NAME_DUPLICATE:       'Design Update name already exists for another update in this Design Version',
    DESIGN_UPDATE_INVALID_ROLE_REMOVE:          'Only a Designer can remove Design Updates',
    DESIGN_UPDATE_INVALID_STATE_REMOVE:         'Only new Design Updates can be removed',
    DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION:    'Only a Designer can set merge actions for a Design Update',
    DESIGN_UPDATE_INVALID_STATE_MERGE_ACTION:   'Only a Draft Design Update can have merge actions set'
};

export const WorkPackageValidationErrors = {
    WORK_PACKAGE_NOT_EXIST:                     'Work Package does not exist',
    WORK_PACKAGE_INVALID_ROLE_ADD:              'Only a Manager can add Work Packages',
    WORK_PACKAGE_INVALID_STATE_ADD:             'Work Packages can only be added to draft Design Versions or Updates',
    WORK_PACKAGE_INVALID_ROLE_UPDATE:           'Only a Manager can update Work Package details',
    WORK_PACKAGE_INVALID_ROLE_EDIT:             'Only a Manager can edit a Work package scope',
    WORK_PACKAGE_INVALID_STATE_EDIT:            'Completed Work Packages cannot be edited',
    WORK_PACKAGE_INVALID_ROLE_PUBLISH:          'Only a Designer can publish a Work Package',
    WORK_PACKAGE_INVALID_STATE_PUBLISH:         'Only new Work Packages can be published',
    WORK_PACKAGE_INVALID_ROLE_WITHDRAW:         'Only a Designer can withdraw a Work Package',
    WORK_PACKAGE_INVALID_STATE_WITHDRAW:        'Only available Work Packages can be withdrawn',
    WORK_PACKAGE_INVALID_ROLE_ADOPT:            'Only a Developer can adopt a Work Package',
    WORK_PACKAGE_INVALID_STATE_ADOPT:           'Only an Available Work Package can be adopted',
    WORK_PACKAGE_INVALID_ROLE_RELEASE:          'Only a Developer or a Manager can release a Work Package',
    WORK_PACKAGE_INVALID_STATE_RELEASE:         'Only an Adopted Work Package can be released',
    WORK_PACKAGE_INVALID_USER_RELEASE:          'A Developer may only release a Work Package they have adopted',
    WORK_PACKAGE_INVALID_ROLE_VIEW_NEW:         'New Work Packages can only be viewed by a Manager',
    WORK_PACKAGE_INVALID_NAME_DUPLICATE:        'Work Package name already exists for another Work Package in this Design Version',
    WORK_PACKAGE_INVALID_ROLE_REMOVE:           'Only a Manager can remove Work Packages',
    WORK_PACKAGE_INVALID_STATE_REMOVE:          'Only new Work Packages can be removed',
    WORK_PACKAGE_INVALID_ROLE_DEVELOP:          'Only a Developer can develop Work Packages',
    WORK_PACKAGE_INVALID_STATE_DEVELOP:         'Only Adopted Work Packages can be developed',
    WORK_PACKAGE_INVALID_USER_DEVELOP:          'Only the adopting user may develop a work package',
    WORK_PACKAGE_INVALID_TYPE:                  'Unknown type for Work Package'
};

export const DesignComponentValidationErrors = {
    DESIGN_COMPONENT_INVALID_VIEW_ADD:                      'A Design Component can only be added in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_ADD:                      'A Design Component cannot be added in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_EDIT:                     'A Design Component can only be edited in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_EDIT:                     'A Design Component cannot be edited in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_REMOVE:                   'A Design Component can only be removed in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_REMOVE:                   'A Design Component cannot be removed in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_MOVE:                     'A Design Component can only be moved in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_MOVE:                     'A Design Component cannot be moved in View Only mode',
    DESIGN_COMPONENT_INVALID_CONTEXT_MOVE:                  'A Design Component can only be moved within the Design Editor',
    DESIGN_COMPONENT_INVALID_MOVE:                          'This Design Component cannot be moved to the location where it was dropped',
    DESIGN_COMPONENT_INVALID_REORDER:                       'This Design Component cannot be moved to the location where it was dropped',
    DESIGN_COMPONENT_INVALID_NAME_DUPLICATE:                'This Design Component cannot have the same name as another component of the same type in this Design Version',
    DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT:     'This Design Component cannot have the same name as another component of the same type under the same parent',
    DESIGN_COMPONENT_INVALID_NAME_SUBSET:                   'This Scenario cannot have a name that is a part of an existing Scenario name',
    DESIGN_COMPONENT_INVALID_NAME_SUPERSET:                 'This Scenario cannot have a name that contains an existing Scenario name',
    DESIGN_COMPONENT_NOT_REMOVABLE:                         'A Design Component containing other components is not removable.  Delete from bottom up to remove.',
    DESIGN_COMPONENT_NOT_REMOVABLE_DEV:                     'Only Scenarios or Feature Aspects added by a Developer may be removed in a Work Package',
    DESIGN_COMPONENT_NOT_WP_UPDATABLE:                      'A Design Component is only updatable from a WP if it is a Scenario or is a Feature Aspect added by the Developer',
    DESIGN_COMPONENT_NOT_WP_ADDABLE:                        'Only Feature Aspects and Scenarios can be added to a Work Package by a Developer'
};

export const DesignUpdateComponentValidationErrors = {
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD:                   'A Design Update Component can only be added in the Design Update Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD:                   'A Design Update Component cannot be added in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_ADD:              'A Design Update Component cannot be added to a Feature or Feature Aspect if it is not in scope',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT:                  'A Design Update Component can only be edited in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT:                  'A Design Update Component cannot be edited in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_EDIT_REMOVED:               'A Design Update Component cannot be edited if removed in this or another update',
    DESIGN_UPDATE_COMPONENT_INVALID_SCOPE_EDIT:                 'This Design Update Component must be in the Update scope to be edited',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_REMOVE:                'A Design Update Component can only be removed in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_REMOVE:                'A Design Update Component cannot be removed in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_RESTORE:               'A Design Update Component can only be restored in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_RESTORE:               'A Design Update Component cannot be restored in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_SCOPE:                 'A Design Update Component can only be scoped in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_SCOPE:                 'A Design Update Component cannot be scoped in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_SCOPE:              'A Design Update Component cannot be scoped outside the scope pane',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE:                  'A Design Update Component can only be moved in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE:                  'A Design Update Component cannot be moved in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_MOVE:               'A Design Update Component can only be moved within the Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE:             'Only new additions to the Design can be moved in a Design Update',
    DESIGN_UPDATE_COMPONENT_INVALID_MOVE:                       'This Design Update Component cannot be moved to the location where it was dropped',
    DESIGN_UPDATE_COMPONENT_INVALID_REORDER:                    'This Design Update Component cannot be moved to the location where it was dropped',
    DESIGN_UPDATE_COMPONENT_INVALID_REORDER_EXISTING:           'Existing Design Components cannot be reordered in a Design Update',
    DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE:             'This name is already being used in this Design Version or in another Design Update to this Version',
    DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT:  'This name is already being used under this parent in this or a parallel Design Update',
    DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUBSET:                'This Scenario cannot have a name that is a part of an existing Scenario name',
    DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUPERSET:              'This Scenario cannot have a name that contains an existing Scenario name',
    DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE:                      'A Design Update Component containing other components is not removable.  Delete from bottom up to remove',
    DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_NEW:                  'A Design Update Component containing NEW components added in this or another update is not removable',
    DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_SCOPE:                'A Design Update Component containing IN SCOPE components in another update is not removable',
    DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_REMOVED_ELSEWHERE:    'This component cannot be removed because it is already removed in another update',
    DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE:                     'A Design Update Component that is not removed is not restorable',
    DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE_PARENT:              'A Design Update Component whose parent is removed is not restorable',
    DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_IN_SCOPE:              'This Scenario is already in specific scope for another Design Update so cannot be added here',
    DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_CHANGED:               'This Feature cannot be put in scope here as its text is being modified in another update',
    DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED:               'This component cannot be scoped as it has been removed by another update',
    DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW:                 'This component cannot be removed from scope as it is new in this update',
    DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN:        'This component cannot be removed from scope as it has new children in this update',
    DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_REMOVED_CHILDREN:    'This component cannot be removed from scope as it has children removed in this update',
    DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_REMOVED:             'You cannot remove deleted items from scope except by undoing the delete',
    DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_CHANGED:             'This component cannot be removed from scope as it has been changed in this update',
    DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_OUT_SCOPE:       'A component cannot be added to this item because the item is not in the update scope',
    DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED:         'A component cannot be added to this item because it has been removed in this update',
    DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED_OTHER:   'A component cannot be added to this item because it has been removed in another update',
    DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE_DEV:                  'Only Scenarios or Feature Aspects added by a Developer may be removed in a Work Package',
    DESIGN_UPDATE_COMPONENT_NOT_UPDATABLE_SCOPE:                'This component cannot be renamed as it is not in direct scope for this Design Update',
    DESIGN_UPDATE_COMPONENT_NOT_UPDATABLE_OTHER_DU:             'This component cannot be renamed as it has been renamed in another published Design Update',
    DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE:                   'A Design Component is only updatable from a WP if it is a Scenario or is a Feature Aspect added by the Developer',
    DESIGN_UPDATE_COMPONENT_NOT_WP_ADDABLE:                     'Only Feature Aspects and Scenarios can be added to a Work Package by a Developer',
    DESIGN_UPDATE_COMPONENT_NOT_IN_SCOPE:                       'Only specifically scoped components can be removed from scope'
};

export const WorkPackageComponentValidationErrors = {
    WORK_PACKAGE_COMPONENT_INVALID_VIEW_SCOPE:          'Work Package scope can only be changed in the Work Package editor',
    WORK_PACKAGE_COMPONENT_INVALID_CONTEXT_SCOPE:       'Work Package scope can only be changed in the Work Package scope editor',
    WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE:            'This Scenario is already in Scope for another Work Package',
    WORK_PACKAGE_COMPONENT_NOT_SCOPABLE:                'This component cannot be added to the Work Package scope because it is not in the Update scope'
};

export const DomainDictionaryValidationErrors = {
    DICTIONARY_INVALID_ROLE_ADD:                        'Only a Designer can add a Domain Dictionary entry',
    DICTIONARY_INVALID_VIEW_ADD:                        'A Domain Dictionary entry cannot be added in this view',
    DICTIONARY_INVALID_MODE_ADD:                        'A Domain Dictionary entry cannot be added in View Only mode',
    DICTIONARY_INVALID_ROLE_EDIT:                       'Only a Designer may edit the Domain Dictionary',
    DICTIONARY_INVALID_VIEW_EDIT:                       'A Domain Dictionary entry cannot be edited in this view',
    DICTIONARY_INVALID_MODE_EDIT:                       'A Domain Dictionary entry cannot be edited in View Only mode',
    DICTIONARY_INVALID_TERM_DUPLICATE:                  'A dictionary entry already exists with the same name'
};

export const TextEditorValidationErrors = {
    TEXT_EDITOR_INVALID_ROLE_SAVE:                      'Only a Designer can update Details for a Design Component'
};

export const TestIntegrationValidationErrors = {
    EXPORT_INT_INVALID_ROLE:                            'Only a Developer may export integration tests',
    EXPORT_INT_NO_COMPONENT:                            'A component must be selected to export an integration test',
    EXPORT_INT_NOT_FEATURE:                             'Only Features canbe exported as integration tests'
};

export const TestOutputLocationValidationErrors = {
    LOCATION_INVALID_NAME_DUPLICATE:                    'A test output location cannot be given the same name as an existing location',
    LOCATION_INVALID_PATH_DUPLICATE:                    'A test output location cannot be given the same path as an existing location',
    LOCATION_ACCESS_TYPE_NOT_SET:                       'The access type must be set for a remote location'
};

export const TestOutputLocationFileValidationErrors = {
    LOCATION_FILE_INVALID_ALIAS_DUPLICATE:              'A test output location file cannot be given the same alias as an existing file for the location',
    LOCATION_FILE_INVALID_NAME_DUPLICATE:               'A test output location file cannot be given the same name as an existing file for the location'
};

