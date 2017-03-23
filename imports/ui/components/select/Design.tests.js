
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { Design } from './Design.jsx';  // Non Redux wrapped

import { DesignStatus, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'

describe('JSX: Design', () => {

    Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
    const design = Factory.create('design');

    Factory.define('designNr', Designs, { designName: 'Design2', isRemovable: false, designStatus: DesignStatus.DESIGN_LIVE});
    const designNonRemovable = Factory.create('designNr');

    Factory.define('designArchived', Designs, { designName: 'Design3', isRemovable: true, designStatus: DesignStatus.DESIGN_ARCHIVED});
    const designArchived = Factory.create('designArchived');


    describe('Each Design in the list has its current status visible', () => {

        it('has status LIVE if live', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            chai.assert.equal(item.find('#designStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designStatus').text(), DesignStatus.DESIGN_LIVE);
        });

        it('has status ARCHIVED if archived', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designArchived} userContext={userContext} userRole={userRole}/>
            );

            chai.assert.equal(item.find('#designStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designStatus').text(), DesignStatus.DESIGN_ARCHIVED);
        });
    });

    describe('If a Design is removable, the Design has an option to remove the Design', () => {

        it('has a Remove button if the Design is removable', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butRemove')).to.have.length(1);
            chai.assert.equal(item.find('#butRemove').children().text(), 'Remove Design');

        });

        it('does not have a Remove button if the Design is not removable', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designNonRemovable} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

    });

    describe('An option to remove a Design is only visible to a Designer', () => {

        it('does not have a remove button for a Developer', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

        it('does not have a remove button for a Manager', () => {

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

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designNonRemovable} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(1);

        });

        it('does not have a Backup button if the Design is removable', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

        it('does not have a Backup button if the Design is archived', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designArchived} userContext={userContext} userRole={userRole}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

    });

    describe('The current working Design for the user is highlighted', () => {

        it('is highlighted if is the User Context Design', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Should find the active design class
            chai.expect(item.find('.di-active')).to.have.length(1);

        });

        it('is not highlighted if is not the User Context Design', () => {

            const userContext = {designId: 'AAA'};  // Bollox ID
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Should NOT find the active design class
            chai.expect(item.find('.di-active')).to.have.length(0);

        });

    });

    describe('Each Design has an option to select it as the current working Design', () => {

        it('has a Work on this Design button if the Design is selected for Designer', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for selected Design
            chai.expect(item.find('.di-active')).to.have.length(1);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });

        it('has a Work on this Design button if the Design is not selected for Designer', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for non-selected Design
            chai.expect(item.find('.di-active')).to.have.length(0);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });

        it('has a Work on this Design button if the Design is selected for Manager', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for selected Design
            chai.expect(item.find('.di-active')).to.have.length(1);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });

        it('has a Work on this Design button if the Design is not selected for Manager', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for non-selected Design
            chai.expect(item.find('.di-active')).to.have.length(0);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });

        it('has a Work on this Design button if the Design is selected for Developer', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for selected Design
            chai.expect(item.find('.di-active')).to.have.length(1);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });

        it('has a Work on this Design button if the Design is not selected for Developer', () => {

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole}/>
            );

            // Work Design button should be there for non-selected Design
            chai.expect(item.find('.di-active')).to.have.length(0);
            chai.expect(item.find('#butWork')).to.have.length(1);

        });
    });
});