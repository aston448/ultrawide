import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import { DesignVersionValidationServices } from '../../service_modules/validation/design_version_validation_services.js';

import { RoleType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation, DesignVersionValidationErrors }   from '../../constants/validation_errors.js';

//import StubCollections from 'meteor/hwillson:stub-collections';
import { chai } from 'meteor/practicalmeteor:chai';

// beforeEach(function(){
//
//     StubCollections.add([DesignVersions]);
//     StubCollections.add([DesignUpdates]);
//     StubCollections.stub();
//
//     const dv001 = DesignVersions.insert({
//         designId:               '001',
//         designVersionName:      'New',
//         designVersionNumber:    '0.1',
//         designVersionStatus:    DesignVersionStatus.VERSION_NEW
//     });
//
//     const dv002 = DesignVersions.insert({
//         designId:               '001',
//         designVersionName:      'Draft',
//         designVersionNumber:    '0.1',
//         designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
//     });
//
//     const dv003 = DesignVersions.insert({
//         designId:               '001',
//         designVersionName:      'Complete',
//         designVersionNumber:    '0.1',
//         designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
//     });
//
//     const dv004 = DesignVersions.insert({
//         designId:               '001',
//         designVersionName:      'Updatable',
//         designVersionNumber:    '0.1',
//         designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
//     });
//
//     const dv005 = DesignVersions.insert({
//         designId:               '001',
//         designVersionName:      'Updatable Complete',
//         designVersionNumber:    '0.1',
//         designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
//     });
//
// });
//
// afterEach(function(){
//
//     StubCollections.restore();
//
// });

describe('VAL: Design Version', function () {

    const newDesignVersion = {
        designId:               '001',
        designVersionName:      'New',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_NEW
    };

    const draftDesignVersion = {
        designId:               '001',
        designVersionName:      'Draft',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
    };

    const completeDesignVersion = {
        designId:               '001',
        designVersionName:      'Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
    };

    const updatableDesignVersion = {
        designId:               '001',
        designVersionName:      'Updatable',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
    };

    const updatableCompleteDesignVersion = {
        designId:               '001',
        designVersionName:      'Updatable Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    };


    // Edit Details ----------------------------------------------------------------------------------------------------

    describe('A Designer may update the name of a Design Version', () => {

        it('returns VALID for a designer with a valid name', () => {

            const role = RoleType.DESIGNER;
            const newName = 'New Name';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionName(role, newName, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer may update the number of a Design Version', () => {

        it('returns VALID for a designer with a valid number', () => {

            const role = RoleType.DESIGNER;
            const newNumber = '0.2';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionNumber(role, newNumber, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer may update a Design Version name', () => {

        it('returns INVALID for a developer', () => {

            const role = RoleType.DEVELOPER;
            const newName = 'New Name';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionName(role, newName, otherVersions);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a manager', () => {

            const role = RoleType.MANAGER;
            const newName = 'New Name';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionName(role, newName, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a Designer may update a Design Version number', () => {

        it('returns INVALID for a developer', () => {

            const role = RoleType.DEVELOPER;
            const newNumber = '0.2';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionNumber(role, newNumber, otherVersions);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a manager', () => {

            const role = RoleType.MANAGER;
            const newNumber = '0.2';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionNumber(role, newNumber, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design Version may not be renamed to the same name as another version in the Design', () => {

        it('returns VALID for a designer with a valid name', () => {

            const role = RoleType.DESIGNER;
            const newName = 'DesignVersion1';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NAME_DUPLICATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionName(role, newName, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design Version may not be renumbered to the same number as another version in the Design', () => {

        it('returns VALID for a designer with a valid number', () => {

            const role = RoleType.DESIGNER;
            const newNumber = '0.1';
            const otherVersions = [
                {
                    _id: 'DV001',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '0.1'
                }
            ];
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NUMBER_DUPLICATE;

            const result = DesignVersionValidationServices.validateUpdateDesignVersionNumber(role, newNumber, otherVersions);

            chai.assert.equal(result, expectation);
        });
    });

    // Publish ---------------------------------------------------------------------------------------------------------

    describe('Only a Designer can publish a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = newDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Only a New Design Version can be published', function () {

        it('returns VALID for New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = newDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = draftDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = completeDesignVersion;

            chai.assert.notEqual(DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion), Validation.VALID, 'Attempt to publish a Complete Design Version by a Designer returned VALID!');

        });

        it('returns INVALID for Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableCompleteDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;

            const result = DesignVersionValidationServices.validatePublishDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    // Withdraw --------------------------------------------------------------------------------------------------------

    describe('Only a Draft Design Version can be withdrawn', function () {

        it('returns VALID for Draft Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = draftDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for New Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = completeDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for Updatable Complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableCompleteDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

    });

    describe('Only a Designer can withdraw a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = draftDesignVersion;
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = draftDesignVersion;
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = draftDesignVersion;
            const designUpdates = DesignUpdates.find({designVersionId: designVersion._id}).fetch();
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_WITHDRAW;

            const result = DesignVersionValidationServices.validateWithdrawDesignVersion(role, designVersion, designUpdates);

            chai.assert.equal(result, expectation);
        });
    });

    // Create Next -----------------------------------------------------------------------------------------------------

    describe('Only a Designer can create a new Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = draftDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = draftDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = draftDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A new Design Version may not be created from a New Design Version', () => {

        it('returns INVALID if designer tries with new version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A new Design Version may not be created from a Complete Design Version', () => {

        it('returns INVALID if designer tries with draft complete version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = completeDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID if designer tries with updatable complete version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableCompleteDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 1);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A new Design Version may not be created from an Updatable Design Version if no Design Updates are selected for inclusion', function () {

        it('returns INVALID for a Designer if no updates selected', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_UPDATE_NEXT;

            const result = DesignVersionValidationServices.validateCreateNextDesignVersion(role, designVersion, 0);

            chai.assert.equal(result, expectation);
        });
    });

    // Edit ------------------------------------------------------------------------------------------------------------

    describe('Only a Designer can edit a Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = draftDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = draftDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = draftDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Complete Design Version cannot be edited', function() {

        it('returns INVALID for a draft complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = completeDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for an updatable complete Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableCompleteDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    describe('An Updatable Design Version cannot be edited', function() {

        it('returns INVALID for updatable Design Version', function () {

            const role = RoleType.DESIGNER;
            const designVersion = updatableDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;

            const result = DesignVersionValidationServices.validateEditDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    // View ------------------------------------------------------------------------------------------------------------

    describe('Only a Designer can view a New Design Version', function () {

        it('returns VALID for a Designer', function () {

            const role = RoleType.DESIGNER;
            const designVersion = newDesignVersion;
            const expectation = Validation.VALID;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer', function () {

            const role = RoleType.DEVELOPER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_VIEW_NEW;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Manager', function () {

            const role = RoleType.MANAGER;
            const designVersion = newDesignVersion;
            const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_VIEW_NEW;

            const result = DesignVersionValidationServices.validateViewDesignVersion(role, designVersion);

            chai.assert.equal(result, expectation);
        });
    });

    // Update ----------------------------------------------------------------------------------------------------------

    // describe('A Manager may not update an Updatable Design Version', function() {
    //
    //     it('returns VALID for a Designer', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = updatableDesignVersion;
    //         const updatesToMerge = 1;
    //         const expectation = Validation.VALID;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns VALID for a Developer', function () {
    //
    //         const role = RoleType.DEVELOPER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
    //         const updatesToMerge = 1;
    //         const expectation = Validation.VALID;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns INVALID for a Manager', function () {
    //
    //         const role = RoleType.MANAGER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
    //         const updatesToMerge = 1;
    //         const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE_WORKING;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    // });

    // describe('Only an Updatable Design Version may be updated', function() {
    //
    //     it('returns VALID for Updatable', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Updatable'});
    //         const updatesToMerge = 1;
    //         const expectation = Validation.VALID;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns INVALID for New', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'New'});
    //         const updatesToMerge = 1;
    //         const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns INVALID for Draft', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Draft'});
    //         const updatesToMerge = 1;
    //         const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns INVALID for Complete', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Complete'});
    //         const updatesToMerge = 1;
    //         const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //
    //     it('returns INVALID for Updatable Complete', function () {
    //
    //         const role = RoleType.DESIGNER;
    //         const designVersion = DesignVersions.findOne({designVersionName: 'Updatable Complete'});
    //         const updatesToMerge = 1;
    //         const expectation = DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING;
    //
    //         const result = DesignVersionValidationServices.validateUpdateWorkingDesignVersion(role, designVersion, updatesToMerge);
    //
    //         chai.assert.equal(result, expectation);
    //     });
    //});

});


