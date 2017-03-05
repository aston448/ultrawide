import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import DesignVersionValidationServices from '../../service_modules/validation/design_version_validation_services.js';

import { RoleType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation }   from '../../constants/validation_errors.js';

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

describe('Design Version Validation Services', function () {

    describe('Only a Designer can publish a Design Version', function () {

        it('returns VALID when a Designer publishes a Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.equal(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a New Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer publishes a Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Design Version by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager publishes a Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Design Version by a Developer returned VALID!');

        });
    });

    describe('Only a New Design Version can be published', function () {

        it('returns VALID when a Designer publishes a New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.equal(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a New Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Designer publishes a Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Draft Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer publishes a Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer publishes an Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish an Updatable Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer publishes an Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish an Updatable Complete Design Version by a Designer returned VALID!');

        });
    });

    describe('Only a Draft Design Version can be withdrawn', function () {

        it('returns VALID when a Designer withdraws a Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.equal(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Designer withdraws a New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a New Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer withdraws a Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer withdraws an Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Designer withdraws an Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Complete Design Version by a Designer returned VALID!');

        });

    });

    describe('Only a Designer can withdraw a Design Version', function () {

        it('returns VALID when a Designer withdraws a Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.equal(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer withdraws a Draft Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager withdraws a Draft Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Manager returned VALID!');

        });
    });

    describe('A Design Version that has Design Updates cannot be withdrawn', function () {

        it('returns INVALID when a Designer withdraws a Draft Design Version with Updates', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates), Validation.VALID, 'Attempt to withdraw a Draft Design Version with Updates by a Designer returned VALID!');

        });
    });

    describe('Only a Designer can create a new Design Version', function () {

        it('returns VALID when a Designer creates a new Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.equal(DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer creates a new Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager creates a new Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft Updates'});
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();

            chai.assert.notEqual(DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1), Validation.VALID, 'Attempt to withdraw a Draft Design Version by a Manager returned VALID!');

        });
    });

    describe('Only a Designer can edit a Design Version', function () {

        it('returns VALID when a Designer edits a draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});

            chai.assert.equal(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a Draft Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer edits a draft Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});

            chai.assert.notEqual(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a Draft Design Version by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager edits a draft Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});

            chai.assert.notEqual(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a Draft Design Version by a Manager returned VALID!');

        });
    });

    describe('A Complete Design Version cannot be edited', function() {

        it('returns INVALID when a Designer edits a draft complete Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});

            chai.assert.notEqual(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a Draft Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID when a Manager edits an updatable complete Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});

            chai.assert.notEqual(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit an Updatable Complete Design Version by a Designer returned VALID!');

        });

    });

    describe('An Updatable Design Version cannot be edited', function() {

        it('returns INVALID when a Designer edits an updatable Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});

            chai.assert.notEqual(DesignVersionValidationServices.validateEditDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit an Updatable Design Version by a Designer returned VALID!');

        });


    });

    describe('Only a Designer can view a New Design Version', function () {

        it('returns VALID when a Designer views a new Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.equal(DesignVersionValidationServices.validateViewDesignVersion(role, designVersion), Validation.VALID, 'Attempt to view a New Design Version by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer views a new Design Version', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.notEqual(DesignVersionValidationServices.validateViewDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a New Design Version by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager views a new Design Version', function () {

            const role = RoleType.MANAGER;
            const designVersion = DesignVersions.findOne({designVersionName: 'New'});

            chai.assert.notEqual(DesignVersionValidationServices.validateViewDesignVersion(role, designVersion), Validation.VALID, 'Attempt to edit a New Design Version by a Manager returned VALID!');

        });

    });

});


