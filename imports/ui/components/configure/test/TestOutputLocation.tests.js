import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { TestOutputLocation } from '../TestOutputLocation' // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'
import {RoleType, UserSettingValue} from "../../../../constants/constants";

describe('JSX: TestOutputLocation', () => {

    function testTestOutputLocation(location, currentLocationId, userContext, userRole){

        return shallow(
            <TestOutputLocation
                location={location}
                dataStore={'/data'}
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


    describe('UC 841', () => {

        describe('A shared Test Output Location has an option to set the location as private', () => {

            it('has checked item for shared location', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.OPTION_TOGGLE_LOCATION_SHARED, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                chai.assert.equal(item.find(expectedItem).props().checked, true, expectedItem + ' not checked');
            });
        });

        describe('A private Test Output Location has an option to set the location as shared', () => {

            it('has not checked item for non-shared location', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       false,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.OPTION_TOGGLE_LOCATION_SHARED, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                chai.assert.equal(item.find(expectedItem).props().checked, false, expectedItem + ' was checked');
            });
        });
    });

    describe('UC 842', () => {

        describe('A Test Output Location has an option to edit it', () => {

            it('edit option when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_EDIT, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no edit option when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_EDIT, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output Location being edited has a field to edit the location name', () => {

            it('name field when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_LOCATION_NAME, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no name field when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_LOCATION_NAME, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output Location being edited has a field to edit the file path', () => {

            it('path field when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_LOCATION_PATH, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no path field when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.INPUT_LOCATION_PATH, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output Location being edited has an option to cancel the edit', () => {

            it('cancel button when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_CANCEL, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no cancel button when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_CANCEL, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });

        describe('A Test Output Location being edited has an option to save the edit', () => {

            it('save button when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_SAVE, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no save button when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_SAVE, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });
    });

    describe('UC 845', () => {

        describe('Each Test Output Location has an option to remove it', () => {

            it('remove option when not editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: false});

                const expectedItem = hashID(UI.BUTTON_REMOVE, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('no remove option when editing', () => {

                const userRole = RoleType.DESIGNER;
                const location = {
                    _id:                    'LOCATION_1',
                    locationName:           'Location1',
                    locationIsShared:       true,
                    locationUserId:         'NONE',
                    locationPath:           'locations',
                    locationFullPath:       '/data/locations',
                    isGuestViewerLocation:  false
                };

                const item = testTestOutputLocation(location, 'LOCATION_1', defaultUserContext, userRole);

                // Item only available if not editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_REMOVE, location.locationName);

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
            });
        });
    });
});