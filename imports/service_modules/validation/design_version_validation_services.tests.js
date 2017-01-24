import {DesignVersions} from '../../collections/design/design_versions.js';

import DesignVersionValidationServices from '../../service_modules/validation/design_version_validation_services.js';

import { RoleType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation }   from '../../constants/validation_errors.js';

import StubCollections from 'meteor/hwillson:stub-collections';
import { chai } from 'meteor/practicalmeteor:chai';


beforeEach(function(){

    StubCollections.add([DesignVersions]);
    StubCollections.stub();

    DesignVersions.insert({
        designId:               'ABC',
        designVersionName:      'New',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_NEW
    });

    DesignVersions.insert({
        designId:               'ABC',
        designVersionName:      'Draft',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
    });

    DesignVersions.insert({
        designId:               'ABC',
        designVersionName:      'Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });

    DesignVersions.insert({
        designId:               'ABC',
        designVersionName:      'Updatable',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
    });

    DesignVersions.insert({
        designId:               'ABC',
        designVersionName:      'Updatable Complete',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    });



});

afterEach(function(){

    StubCollections.restore();

});

describe('Only a Designer can publish a Design Version', function () {

    describe('Design Version Validation Services', function () {

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
});

describe('Only a New Design Version can be published', function () {

    describe('Design Version Validation Services', function () {

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
});
