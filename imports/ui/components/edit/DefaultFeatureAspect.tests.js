import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DefaultFeatureAspect } from './DefaultFeatureAspect';  // Non Redux wrapped

import { RoleType } from '../../../constants/constants.js'


describe('JSX: DefaultFeatureAspect', () => {

    function testDefaultAspect(currentItem, userContext, userRole){

        return shallow(
            <DefaultFeatureAspect
                currentItem={currentItem}
                userContext={userContext}
                userRole={userRole}
            />
        );
    }

    describe('Each default aspect has an option to edit its text', () => {

        it('has edit button for Designer', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.DESIGNER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#actionEdit').length, 1, 'Edit option not found');
        });
    });

    describe('Each default aspect has an option to include or exclude that aspect', () => {

        it('has active checkbox for Designer', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.DESIGNER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#activeCheckbox').length, 1, 'Active checkbox not found');
        });

        it('has read only checkbox for Developer', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.DEVELOPER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#readOnlyCheckbox').length, 1, 'Read only checkbox not found');
        });

        it('has read only checkbox for Manager', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.MANAGER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#readOnlyCheckbox').length, 1, 'Read only checkbox not found');
        });
    });

    describe('The edit option is only visible for a Designer', () => {

        it('no edit button for Developer', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.DEVELOPER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#actionEdit').length, 0, 'Edit option was found');
        });

        it('no edit button for Manager', () => {

            const currentItem = {_id: 'DFA1', designId: 'DDD'};
            const userContext = {designId: 'DDD'};
            const userRole = RoleType.MANAGER;

            let item = testDefaultAspect(currentItem, userContext, userRole);

            chai.assert.equal(item.find('#actionEdit').length, 0, 'Edit option was found');
        });
    });

});