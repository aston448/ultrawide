import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignsList } from './DesignsContainer.jsx';  // Non container wrapped
//import { Design } from '../../components/select/Design.jsx'; // Non Redux

import { DesignStatus, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'


describe('JSX: DesignsList', () => {

    describe('The Designs list has an "Add Design" option at the end of the list', () => {

        it('the Add Design component exists when a Design exists', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');
            let designs = [];
            designs.push(design);

            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId: design._id
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');
            chai.assert(item.find('ItemContainer').props().hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('ItemContainer').props().footerAction, 'Add Design', 'Expecting Add Design footer action');

        });

    });

    describe('The "Add Design" option is visible when no Designs exist', () => {

        it('the Add Design component exists when no Designs', () => {

            let designs = [];

            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId: 'NONE'
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');
            chai.assert(item.find('ItemContainer').props().hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('ItemContainer').props().footerAction, 'Add Design', 'Expecting Add Design footer action');

        });

    });

    describe('The "Add Design" option is only visible to a Designer', () => {

        it('Add Design not visible to Manager', () => {

            let designs = [];

            const userRole = RoleType.MANAGER;
            const userContext = {
                designId: 'NONE'
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');
            chai.assert.isFalse(item.find('ItemContainer').props().hasFooterAction, 'Expecting no footer action');

        });

        it('Add Design not visible to Developer', () => {

            let designs = [];

            const userRole = RoleType.DEVELOPER;
            const userContext = {
                designId: 'NONE'
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');
            chai.assert.isFalse(item.find('ItemContainer').props().hasFooterAction, 'Expecting no footer action');

        });

    });

    describe('A list of all Designs is visible to all users', () => {


        it('is also visible to Manager', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');
            let designs = [];
            designs.push(design);

            const userRole = RoleType.MANAGER;
            const userContext = {
                designId: design._id
            };


            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');

        });

        it('is also visible to Developer', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');
            let designs = [];
            designs.push(design);

            const userRole = RoleType.DEVELOPER;
            const userContext = {
                designId: design._id
            };


            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemContainer').length, 1, 'Item Container not found');

        });

    });

});
