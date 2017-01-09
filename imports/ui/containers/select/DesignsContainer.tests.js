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

            // Add item should be there
            chai.expect(item.find('DesignComponentAdd')).to.have.length(1);

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

            // Add item should be there
            chai.expect(item.find('DesignComponentAdd')).to.have.length(1);

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

            // Add item should be there
            chai.expect(item.find('DesignComponentAdd')).to.have.length(0);

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

            // Add item should be there
            chai.expect(item.find('DesignComponentAdd')).to.have.length(0);

        });

    });

    describe('A list of all Designs is visible to all users', () => {

        it('no Designs - no list', () => {

            let designs = [];

            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId: 'NONE'
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            // Add item should be there
            chai.expect(item.find('Connect(Design)')).to.have.length(0);

        });

        it('one Design - one list item', () => {

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

            // Should be One Design
            // Note: Must use the redux wrapped name here - is this in the docs??? Don't think so!
            chai.expect(item.find('Connect(Design)')).to.have.length(1);

        });

        it('two Designs - two list items', () => {

            Factory.define('design1', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            Factory.define('design2', Designs, { designName: 'Design2', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design1 = Factory.create('design1');
            const design2 = Factory.create('design2');
            let designs = [];
            designs.push(design1);
            designs.push(design2);

            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId: design1._id
            };

            const item = shallow(
                <DesignsList designs={designs} userRole={userRole} userContext={userContext}/>
            );

            // Should be Two Designs
            // Note: Must use the redux wrapped name here - is this in the docs??? Don't think so!
            chai.expect(item.find('Connect(Design)')).to.have.length(2);

        });

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

            // Should be One Design
            // Note: Must use the redux wrapped name here - is this in the docs??? Don't think so!
            chai.expect(item.find('Connect(Design)')).to.have.length(1);

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

            // Should be One Design
            // Note: Must use the redux wrapped name here - is this in the docs??? Don't think so!
            chai.expect(item.find('Connect(Design)')).to.have.length(1);

        });

    });

});
