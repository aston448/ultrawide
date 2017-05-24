import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UserLogin } from './UserLogin.jsx';  // Non Redux wrapped

import {} from '../../../constants/constants.js'


describe('JSX: UserLogin', () => {

    describe('A username may be entered', () => {

        it('has a username entry field', () => {

            let item = shallow(<UserLogin/>);

            chai.assert.equal(item.find('#loginUserName').length, 1, 'User name entry not found');
        });
    });

    describe('A password may be entered', () => {

        it('has a password entry field', () => {

            let item = shallow(<UserLogin/>);

            chai.assert.equal(item.find('#loginPassword').length, 1, 'Password entry not found');
        });
    });

    describe('There is an option to log in', () => {

        it('has a password entry field', () => {

            let item = shallow(<UserLogin/>);

            chai.assert.equal(item.find('#loginSubmit').length, 1, 'Login submit not found');
        });
    });
});
