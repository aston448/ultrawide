
import React from 'react';


import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { Design } from './Design.jsx';  // Non Redux wrapped

import { DesignStatus, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'

describe('Component: Design', () => {

    describe('If a Design is removable, the Design has an option to remove the Design', () => {

        it('has a Remove button if the Design is removable', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butRemove')).to.have.length(1);

        });

        it('does not have a Remove button if the Design is not removable', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

    });

    describe('An option to remove a Design is only visible to a Designer', () => {

        it('does not have a remove button for a Developer', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

        it('does not have a remove button for a Manager', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

    });

    describe('Each non-archived Design in the data management Designs list has an option to take a backup of the Design', () => {

        it('has a Backup button if the Design is not removable and not archived', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(1);

        });

        it('does not have a Backup button if the Design is removable', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

        it('does not have a Backup button if the Design is archived', () => {

            Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_ARCHIVED});
            const design = Factory.create('design');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

    });
});