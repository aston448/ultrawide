import {DesignVersions} from '../../../collections/design/design_versions.js';
import {DesignUpdates} from '../../../collections/design_update/design_updates.js';

import { DesignUpdateValidationServices } from '../design_update_validation_services.js';

import { RoleType, DesignVersionStatus, DesignUpdateStatus }     from '../../../constants/constants.js';
import { Validation, DesignUpdateValidationErrors }   from '../../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';

describe('VAL: Design Update', function () {

    // Add -------------------------------------------------------------------------------------------------------------
    describe('Only a Designer may add Design Updates', () => {

        it('returns VALID for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design Update can only be added to an Updatable Design Version', () => {

        it('returns VALID for Updatable', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for New', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Draft', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete', () => {

            const userRole = RoleType.DESIGNER;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_ADD;

            const result = DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersionStatus);

            chai.assert.equal(result, expectation);
        });
    });

    // Edit Name / Ref -------------------------------------------------------------------------------------------------
    describe('Only a Designer may edit a Design Update name', () => {

        it('returns VALID for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const newName = 'New Name';
            const otherDesignUpdates = [];
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const newName = 'New Name';
            const otherDesignUpdates = [];
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const newName = 'New Name';
            const otherDesignUpdates = [];
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer may edit a Design Update reference', () => {

        it('returns VALID for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateReference(userRole);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateReference(userRole);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateReference(userRole);

            chai.assert.equal(result, expectation);
        });
    });


    describe('A Design Update name must be unique for the Base Design Version', () => {

        it('returns VALID for unused name', () => {

            const userRole = RoleType.DESIGNER;
            const newName = 'Update2';
            const otherDesignUpdates = [{_id: 'DU1', updateName: 'Update1'}];
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a used name', () => {

            const userRole = RoleType.DESIGNER;
            const newName = 'Update2';
            const otherDesignUpdates = [
                {_id: 'DU1', updateName: 'Update1'},
                {_id: 'DU2', updateName: 'Update2'},
            ];
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_NAME_DUPLICATE;

            const result = DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

            chai.assert.equal(result, expectation);
        });
    });

    // View ------------------------------------------------------------------------------------------------------------
    describe('A Developer can view a Published Design Update', () => {

        it('returns VALID for draft', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns VALID for merged', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Manager can view a Published Design Update', () => {

        it('returns VALID for draft', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns VALID for merged', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can view a New Design Update', () => {

        it('returns VALID for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW;

            const result = DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    // Edit ------------------------------------------------------------------------------------------------------------
    describe('A Designer may edit a New Design Update', () => {

        it('returns VALID for new', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer may edit a Draft Design Update', () => {

        it('returns VALID for draft', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can edit a Design Update', () => {

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_EDIT;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_EDIT;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot edit a Complete Design Update', () => {

        it('returns INVALID for complete', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_EDIT;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot edit a Design Update at status Ignore', () => {

        it('returns INVALID for ignored', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_IGNORED;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_EDIT;

            const result = DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    // Publish ---------------------------------------------------------------------------------------------------------
    describe('A Designer can publish a New Design Update', () => {

        it('returns VALID for new', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can publish a Design Update', () => {

        it('returns INVALID for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_PUBLISH;

            const result = DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_PUBLISH;

            const result = DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot publish a Draft Design Update', () => {

        it('returns INVALID for draft', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_PUBLISH;

            const result = DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot publish a Complete Design Update', () => {

        it('returns INVALID for complete', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_PUBLISH;

            const result = DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    // Withdraw --------------------------------------------------------------------------------------------------------
    describe('A Designer can withdraw a Draft Design Update with no Work Packages', () => {

        it('returns VALID for draft with 0 WPs', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const workPackageCount = 0;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A New Design Update cannot be withdrawn', () => {

        it('returns INVALID state for designer', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const workPackageCount = 0;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_WITHDRAW;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Complete Design Update cannot be withdrawn', () => {

        it('returns INVALID state for designer', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const workPackageCount = 0;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_WITHDRAW;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Draft Design Update cannot be withdrawn if it has Design Update Work Packages based on it', () => {

        it('returns INVALID for designer', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const workPackageCount = 1;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_WPS_WITHDRAW;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can withdraw a Draft Design Update', () => {

        it('returns INVALID role for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const workPackageCount = 0;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_WITHDRAW;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID role for manager', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const workPackageCount = 0;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_WITHDRAW;

            const result = DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount);

            chai.assert.equal(result, expectation);
        });
    });

    // Remove ----------------------------------------------------------------------------------------------------------
    describe('A Designer can remove a New Design Update', () => {

        it('returns VALID for new', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = Validation.VALID;

            const result = DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot remove a Draft Design Update', () => {

        it('returns INVALID for draft', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_REMOVE;

            const result = DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer cannot remove a Complete Design Update', () => {

        it('returns INVALID for draft', () => {

            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_REMOVE;

            const result = DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can remove a Design Update', () => {

        it('returns INVALID for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_REMOVE;

            const result = DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for manager', () => {

            const userRole = RoleType.MANAGER;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const expectation = DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_REMOVE;

            const result = DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdateStatus);

            chai.assert.equal(result, expectation);
        });
    });
});
