import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import ChangePassword       from '../ChangePassword.jsx'

import { hashID }           from "../../../../common/utils";
import { UI }               from '../../../../constants/ui_context_ids.js'

import {DisplayContext, RoleType, UserSettingValue} from "../../../../constants/constants";


describe('JSX: ConfigSettings', () => {

    function testChangePassword(displayContext){

        return shallow(
            <ChangePassword
                displayContext={displayContext}
            />
        );
    }

    describe('UC 805', () => {

        describe('There is an input for the current password', () => {

            it('has current password for user password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_USER_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_OLD, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an input for the new password', () => {

            it('has current password for user password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_USER_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_NEW1, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an input to confirm the new password', () => {

            it('has current password for user password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_USER_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_NEW2, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an option to action the password change', () => {

            it('has change password button for user password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_USER_PASSWORD);

                const expectedItem = hashID(UI.BUTTON_CHANGE_PASSWORD, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });
    });

    describe('UC 806', () => {

        describe('There is an input for the current admin password', () => {

            it('has current password for admin password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_ADMIN_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_OLD, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an input for the new admin password', () => {

            it('has current password for admin password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_ADMIN_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_NEW1, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an input to confirm the new admin password', () => {

            it('has current password for admin password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_ADMIN_PASSWORD);

                const expectedItem = hashID(UI.INPUT_PASSWORD_NEW2, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

        describe('There is an option to action the admin password change', () => {

            it('has change password button for admin password update', () => {

                const item = testChangePassword(DisplayContext.CONFIG_ADMIN_PASSWORD);

                const expectedItem = hashID(UI.BUTTON_CHANGE_PASSWORD, '');

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });

    });
});