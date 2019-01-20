import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UserDetails } from '../UserDetails.jsx';  // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'

function testUserDetails(user, currentUserId, userContext){

    return shallow(
        <UserDetails
            user={user}
            currentUserId={currentUserId}
            userContext={userContext}
        />
    );
}


describe('JSX: UserDetails', () => {

    // DESIGNS ---------------------------------------------------------------------------------------------------------

    describe('Interface', () => {

        describe('A user in the users list has an option to edit it', () => {

            it('has an edit button when being viewed', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // Make sure view
                item.setState({editing: false});

                const expectedItem = hashID(UI.OPTION_EDIT, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('An active user in the users list has an option to deactivate it', () => {

            it('has a deactivate button', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // Make sure view
                item.setState({editing: false});

                const expectedItem = hashID(UI.OPTION_TOGGLE_ACTIVE, user.userName);
                const expectedText = 'De-Activate';

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                chai.assert.equal(item.find(expectedItem).children().text(), expectedText, expectedItem + ' not found');
            });
        });

        describe('An inactive user in the users list has an option to activate it', () => {

            it('has an activate button', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           false,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // Make sure view
                item.setState({editing: false});

                const expectedItem = hashID(UI.OPTION_TOGGLE_ACTIVE, user.userName);
                const expectedText = 'Activate';

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                chai.assert.equal(item.find(expectedItem).children().text(), expectedText, expectedItem + ' not found');
            });
        });

        describe('An inactive user is greyed out', () => {

            it('greyed out when inactive', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           false,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // Make sure view
                item.setState({editing: false});

                const expectedItem = hashID(UI.OPTION_TOGGLE_ACTIVE, user.userName);
                const expectedClass = '.user-inactive';

                chai.assert.equal(item.find(expectedClass).length, 1, expectedClass + ' not found');
            });

            it('not greyed out when active', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // Make sure view
                item.setState({editing: false});

                const expectedItem = hashID(UI.OPTION_TOGGLE_ACTIVE, user.userName);
                const expectedClass = '.user-active';

                chai.assert.equal(item.find(expectedClass).length, 1, expectedClass + ' not found');
            });
        });

        describe('A user being edited has an option to save changes', () => {

            it('has a save button when being edited', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.OPTION_SAVE, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('A user being edited has an option to cancel editing', () => {

            it('has a cancel button when being edited', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.OPTION_UNDO, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('A user being edited has an option to reset password', () => {

            it('has a reset button when being edited', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.OPTION_RESET, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an option to set a user display name', () => {

            it('has a display name field', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_DISPLAY_NAME, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an option to set a user login name', () => {

            it('has a display name field', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_USER_NAME, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('A user has options to be one or more of a Designer, Developer and Manager', () => {

            it('has Designer option', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_ROLE_DESIGNER, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has Developer option', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_ROLE_DEVELOPER, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('has Manager option', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_ROLE_MANAGER, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

        });

        describe('A user has an option to be set as a Guest Viewer', () => {

            it('has Guest Viewer option', () => {

                const user = {
                    userId:             'USER001',
                    userName:           'miles',
                    displayName:        'Miles Behind',
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isGuestViewer:      false,
                    isAdmin:            false,
                    isActive:           true,
                    currentRole:        'NONE',
                    apiKey:             'NONE'
                };
                const currentUserId = 'USER999';
                const userContext = {

                };

                let item = testUserDetails(user, currentUserId, userContext);

                // And now edit...
                item.setState({editing: true});

                const expectedItem = hashID(UI.INPUT_ROLE_GUEST, user.userName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });
    });
});