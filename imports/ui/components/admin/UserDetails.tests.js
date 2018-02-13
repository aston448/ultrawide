import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UserDetails } from './UserDetails.jsx';  // Non Redux wrapped

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

                chai.expect(item.find('#butEdit')).to.have.length(1);
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

                chai.expect(item.find('#butSave')).to.have.length(1);
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

                chai.expect(item.find('#butCancel')).to.have.length(1);
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

                chai.expect(item.find('#butReset')).to.have.length(1);
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

                chai.expect(item.find('#user-designer-edit')).to.have.length(1);
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

                chai.expect(item.find('#user-developer-edit')).to.have.length(1);
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

                chai.expect(item.find('#user-manager-edit')).to.have.length(1);
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

                chai.expect(item.find('#user-guest-edit')).to.have.length(1);
            });
        });
    });
});