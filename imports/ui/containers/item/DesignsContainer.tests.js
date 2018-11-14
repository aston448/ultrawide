import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignsList } from './DesignsContainer.jsx';  // Non container wrapped
//import { Design } from '../../components/select/Design.jsx'; // Non Redux

import { DesignStatus, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'


describe('JSX: DesignsList', () => {

    function testDesignsList(designs, userRole){

        return shallow(
            <DesignsList designs={designs} userRole={userRole}/>
        );
    }

    describe('The Designs list has an "Add Design" option at the end of the list', () => {

        it('the Add Design component exists when a Design exists', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.DESIGNER;

            const item = testDesignsList(designs, userRole);

            chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add Design', 'Expecting Add Design footer action');

        });

    });

    describe('The "Add Design" option is visible when no Designs exist', () => {

        it('the Add Design component exists when no Designs', () => {

            let designs = [];
            const userRole = RoleType.DESIGNER;

            const item = testDesignsList(designs, userRole);

            chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add Design', 'Expecting Add Design footer action');

        });

    });

    describe('The "Add Design" option is only visible to a Designer', () => {

        it('Add Design not visible to Manager', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.MANAGER;

            const item = testDesignsList(designs, userRole);

            chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting no footer action');

        });

        it('Add Design not visible to Developer', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.DEVELOPER;

            const item = testDesignsList(designs, userRole);

            chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting no footer action');

        });

        it('Add Design not visible to Guest Viewer', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.GUEST_VIEWER;

            const item = testDesignsList(designs, userRole);

            chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting no footer action');

        });

    });

    describe('A list of all Designs is visible to all users', () => {


        it('is also visible to Manager', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.MANAGER;

            const item = testDesignsList(designs, userRole);

            chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

        });

        it('is also visible to Developer', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.DEVELOPER;

            const item = testDesignsList(designs, userRole);

            chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

        });

        it('is also visible to Guest Viewer', () => {

            const design1 = { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE};
            let designs = [];
            designs.push(design1);

            const userRole = RoleType.GUEST_VIEWER;

            const item = testDesignsList(designs, userRole);

            chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

        });

    });

});
