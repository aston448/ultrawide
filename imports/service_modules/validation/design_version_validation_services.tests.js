import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import DesignVersionValidationServices from '../../service_modules/validation/design_version_validation_services.js';

import { RoleType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation, DesignVersionValidationErrors }   from '../../constants/validation_errors.js';

import StubCollections from 'meteor/hwillson:stub-collections';
import { chai } from 'meteor/practicalmeteor:chai';

beforeEach(function(){

    StubCollections.add([DesignVersions]);
    StubCollections.add([DesignUpdates]);
    StubCollections.stub();

    const dv001 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'New',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_NEW
    });

    const dv002 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'Draft',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
    });

    const dv003 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });

    const dv004 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'Updatable',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
    });

    const dv005 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'Updatable Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    });

    const dv006 = DesignVersions.insert({
        designId:               '001',
        designVersionName:      'Draft Updates',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
    });

    DesignUpdates.insert({
        designVersionId:            dv006,
        updateName:                 'Update1',
        updateReference:            'CR001'
    });

});

afterEach(function(){

    StubCollections.restore();

});

describe('VAL: Design Version', function () {

    describe('Only a Designer can publish a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a New Design Version can be published', function () {

        it('returns VALID for New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID for Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Draft Design Version can be withdrawn', function () {

        it('returns VALID for Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

    });

    describe('Only a Designer can withdraw a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design Version that has Design Updates cannot be withdrawn', function () {

        it('returns INVALID when a Designer withdraws a Draft Design Version with Updates', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_UPDATES_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can create a new Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can edit a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Complete Design Version cannot be edited', function() {

        it('returns INVALID for a draft complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for an updatable complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('An Updatable Design Version cannot be edited', function() {

        it('returns INVALID for updatable Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer can view a New Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_VIEW_NEW;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_VIEW_NEW;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Manager may not update an Updatable Design Version', function() {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const updatesToMerge = 1;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns VALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const updatesToMerge = 1;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const updatesToMerge = 1;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE_WORKING;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only an Updatable Design Version may be updated', function() {

        it('returns VALID for Updatable', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const updatesToMerge = 1;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for New', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const updatesToMerge = 1;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Draft', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const updatesToMerge = 1;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});
            const updatesToMerge = 1;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
            const updatesToMerge = 1;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;

            const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);

            chai.assert.equal(result, expectation);
        });
    });

});


