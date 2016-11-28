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
    DESIGN_VERSION_INVALID_ROLE_UPDATE:     'Only a Designer can update Design Version details',
    DESIGN_VERSION_INVALID_ROLE_EDIT:       'Only a Designer can edit a Design Version',
    DESIGN_VERSION_INVALID_ROLE_VIEW_NEW:   'Only a Designer can view an unpublished Design Version',
    DESIGN_VERSION_INVALID_ROLE_PUBLISH:    'Only a Designer can publish a Design Version',
    DESIGN_VERSION_INVALID_NAME_DUPLICATE:  'Design Version name already exists for another version in this Design',
    DESIGN_VERSION_INVALID_NUMBER_DUPLICATE:'Design Version number already exists for another version in this Design',
    DESIGN_VERSION_INVALID_STATUS_EDIT:     'Only New or Draft Design Versions can be edited',
    DESIGN_VERSION_INVALID_STATUS_PUBLISH:  'Only New Design Versions can be published',
    DESIGN_VERSION_INVALID_STATUS_UNPUBLISH:'Only Draft Design Versions can be un-published',
    DESIGN_VERSION_UPDATES_UNPUBLISH        :'A Design Version with Design Updates cannot be un-published'
}

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