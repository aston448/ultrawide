import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { TestOutputFile } from '../TestOutputFile' // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'
import {
    RoleType,
    TestLocationFileStatus,
    TestLocationFileType,
    TestRunner,
    UserSettingValue
} from "../../../../constants/constants";

describe('JSX: TestOutputFile', () => {

    function testTestOutputFile(file, currentLocationId, userContext, userRole){

        return shallow(
            <TestOutputFile
                locationFile={file}
                currentLocationId={currentLocationId}
                userContext={userContext}
                userRole={userRole}
            />
        );
    }

    const defaultUserContext = {
        designId:           'DESIGN_1',
        designVersionId:    'DESIGN_VERSION_1',
    };


    describe('UC 844', () => {

        describe('A Test Output File has an option to edit it', () => {

            it('has edit when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_EDIT, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no edit when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_EDIT, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output File being edited has a field to edit the file alias', () => {

            it('has alias input when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_FILE_ALIAS, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no alias input when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_FILE_ALIAS, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output File being edited has a field to edit the file name', () => {

            it('has name input when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_FILE_NAME, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no name input when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_FILE_NAME, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output File being edited has a list to select the file test type', () => {

            it('has test type select when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_FILE_TYPE, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no test type select when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_FILE_TYPE, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output File being edited has a list to select the file test runner type', () => {

            it('has runner type select when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_FILE_TEST_RUNNER, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no runner type select when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_FILE_TEST_RUNNER, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

    });

    describe('UC 846', () => {

        describe('Each Test Output File has an option to remove it', () => {

            it('has remove when not editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_REMOVE, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has no remove when editing', () => {

                const userRole = RoleType.DESIGNER;

                const file = {
                    _id:                    'FILE_1',
                    locationId:             'LOCATION_1',
                    fileAlias:              'File1',
                    fileType:               TestLocationFileType.UNIT,
                    testRunner:             TestRunner.METEOR_MOCHA,
                    fileName:               'file_1',
                    allFilesOfType:         'NONE',
                    fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
                };

                const item = testTestOutputFile(file, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_REMOVE, file.fileAlias);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });
    });

});