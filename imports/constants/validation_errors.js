/**
 * Created by aston on 06/11/2016.
 */

export const Validation = {
    VALID:                  'VALID',
    INVALID:                'INVALID'
};

export const BackupValidationErrors = {
    BACKUP_DESIGN_INVALID_ROLE:     'Only a Manager or Designer can backup a Design'
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
    DESIGN_VERSION_INVALID_NAME_DUPLICATE:      'Design Version name already exists for another version in this Design',
    DESIGN_VERSION_INVALID_NUMBER_DUPLICATE:    'Design Version number already exists for another version in this Design',
    DESIGN_VERSION_INVALID_STATE_EDIT:          'Only new or draft Design Versions can be edited',
    DESIGN_VERSION_INVALID_STATE_PUBLISH:       'Only new Design Versions can be published',
    DESIGN_VERSION_INVALID_STATE_UNPUBLISH:     'Only draft Design Versions can be un-published',
    DESIGN_VERSION_UPDATES_UNPUBLISH:           'A Design Version with Design Updates cannot be un-published',
    DESIGN_VERSION_INVALID_ROLE_NEXT:           'Only a Designer can create a new Design Version',
    DESIGN_VERSION_INVALID_STATE_NEXT:          'Only a draft Design Version can be used to create a new Design Version'
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
    DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW:        'New Design Updates can only be viewed by a Designer',
    DESIGN_UPDATE_INVALID_NAME_DUPLICATE:       'Design Update name already exists for another update in this Design Version',
    DESIGN_UPDATE_INVALID_VERSION_DUPLICATE:    'Design Update version already exists for another update in this Design Version',
    DESIGN_UPDATE_INVALID_ROLE_REMOVE:          'Only a Designer can remove Design Updates',
    DESIGN_UPDATE_NOT_REMOVABLE:                'Only new or unused Design Updates can be removed'
};

export const WorkPackageValidationErrors = {
    WORK_PACKAGE_NOT_EXIST:                     'Work Package does not exist',
    WORK_PACKAGE_INVALID_ROLE_ADD:              'Only a Manager can add Work Packages',
    WORK_PACKAGE_INVALID_STATE_ADD:             'Work Packages can only be added to draft Design Versions or Updates',
    WORK_PACKAGE_INVALID_ROLE_UPDATE:           'Only a Manager can update Work Package details',
    WORK_PACKAGE_INVALID_ROLE_EDIT:             'Only a Manager can edit a Work package scope',
    WORK_PACKAGE_INVALID_STATE_EDIT:            'Completed Work Packages cannot be edited',
    WORK_PACKAGE_INVALID_ROLE_PUBLISH:          'Only a Designer can publish a Design Update',
    WORK_PACKAGE_INVALID_STATE_PUBLISH:         'Only new Work Packages can be published',
    WORK_PACKAGE_INVALID_ROLE_VIEW_NEW:         'New Work Packages can only be viewed by a Manager',
    WORK_PACKAGE_INVALID_NAME_DUPLICATE:        'Work Package name already exists for another Work Package in this Design Version',
    WORK_PACKAGE_INVALID_ROLE_REMOVE:           'Only a Manager can remove Work Packages',
    WORK_PACKAGE_NOT_REMOVABLE:                 'Only new or unadopted Work Packages can be removed',
    WORK_PACKAGE_INVALID_ROLE_DEVELOP:          'Only a Developer can develop Work Packages',
    WORK_PACKAGE_INVALID_STATE_DEVELOP:         'Only Adopted Work Packages can be developed',
    WORK_PACKAGE_INVALID_TYPE:                  'Unknown type for Work Package'
};

export const DesignComponentValidationErrors = {
    DESIGN_COMPONENT_INVALID_VIEW_ADD:          'A Design Component can only be added in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_ADD:          'A Design Component cannot be added in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_EDIT:         'A Design Component can only be edited in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_EDIT:         'A Design Component cannot be edited in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_REMOVE:       'A Design Component can only be removed in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_REMOVE:       'A Design Component cannot be removed in View Only mode',
    DESIGN_COMPONENT_INVALID_VIEW_MOVE:         'A Design Component can only be moved in the Base Design Editor',
    DESIGN_COMPONENT_INVALID_MODE_MOVE:         'A Design Component cannot be moved in View Only mode',
    DESIGN_COMPONENT_INVALID_CONTEXT_MOVE:      'A Design Component can only be moved within the Design Editor',
    DESIGN_COMPONENT_INVALID_MOVE:              'This Design Component cannot be moved to the location where it was dropped',
    DESIGN_COMPONENT_INVALID_REORDER:           'This Design Component cannot be moved to the location where it was dropped',
    DESIGN_COMPONENT_INVALID_NAME_DUPLICATE:    'This Design Component cannot have the same name as another component of the same type in this Design Version',
    DESIGN_COMPONENT_NOT_REMOVABLE:             'A Design Component containing other components is not removable.  Delete from bottom up to remove.'
};

export const DesignUpdateComponentValidationErrors = {
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD:          'A Design Update Component can only be added in the Design Update Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD:          'A Design Update Component cannot be added in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT:         'A Design Update Component can only be edited in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT:         'A Design Update Component cannot be edited in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_REMOVE:       'A Design Update Component can only be removed in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_REMOVE:       'A Design Update Component cannot be removed in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_RESTORE:      'A Design Update Component can only be restored in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_RESTORE:      'A Design Update Component cannot be restored in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_SCOPE:        'A Design Update Component can only be scoped in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_SCOPE:        'A Design Update Component cannot be scoped in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_SCOPE:     'A Design Update Component cannot be scoped outside the scope pane',
    DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE:         'A Design Update Component can only be moved in the Design Update Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE:         'A Design Update Component cannot be moved in View Only mode',
    DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_MOVE:      'A Design Update Component can only be moved within the Design Editor',
    DESIGN_UPDATE_COMPONENT_INVALID_MOVE:              'This Design Update Component cannot be moved to the location where it was dropped',
    DESIGN_UPDATE_COMPONENT_INVALID_REORDER:           'This Design Update Component cannot be moved to the location where it was dropped',
    DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE:    'This Design Update Component cannot have the same name as another component of the same type in this Design Version',
    DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE:             'A Design Update Component containing other components is not removable.  Delete from bottom up to remove.',
    DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE:            'A Design Update Component that is not removed is not restorable'
};

export const WorkPackageComponentValidationErrors = {
    WORK_PACKAGE_COMPONENT_INVALID_VIEW_SCOPE:          'Work Package scope can only be changed in the Work Package editor',
    WORK_PACKAGE_COMPONENT_INVALID_CONTEXT_SCOPE:       'Work Package scope can only be changed in the Work Package scope editor',
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


