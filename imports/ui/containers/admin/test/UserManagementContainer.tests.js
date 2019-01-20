
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UserManagementScreen } from '../UserManagementContainer' // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'
import {RoleType, UserSettingValue} from "../../../../constants/constants";




describe('JSX: UserManagementContainer', () => {

    function testUserManagementContainer(userData){

        return shallow(<UserManagementScreen
            userData={userData}
        />)
    }

    describe('UC 806', () => {

        describe('The user admin screen has an option to change the admin password', () => {

            it('has change password pane for admin', () => {

                const userData = [
                    {
                        _id:        'USER1',
                        userName:   'user1'
                    }
                ];

                const item = testUserManagementContainer(userData);

                const expectedItem = hashID(UI.CONFIG_ADMIN_PASSWORD);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

        });
    });



});