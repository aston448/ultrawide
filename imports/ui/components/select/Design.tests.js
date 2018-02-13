
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


    describe('If a Design is removable, the Design has an option to remove the Design', () => {

        it('has a Remove button if the Design is removable', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butRemove')).to.have.length(1);
            chai.assert.equal(item.find('#butRemove').children().text(), 'Remove Design');

        });

        it('does not have a Remove button if the Design is not removable', () => {

            const userContext = {designId: designNonRemovable._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designNonRemovable} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

    });

    describe('An option to remove a Design is only visible to a Designer', () => {

        it('does not have a remove button for a Developer', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

        it('does not have a remove button for a Manager', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should NOT be there
            chai.expect(item.find('#butRemove')).to.have.length(0);

        });

    });

    describe('Each non-archived Design in the data management Designs list has an option to take a backup of the Design', () => {

        it('has a Backup button if the Design is not removable and not archived', () => {

            const userContext = {designId: designNonRemovable._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designNonRemovable} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(1);

        });

        it('does not have a Backup button if the Design is removable', () => {

            const userContext = {designId: design._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={design} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

        it('does not have a Backup button if the Design is archived', () => {

            const userContext = {designId: designArchived._id};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <Design design={designArchived} userContext={userContext} userRole={userRole} statusClass={'dummy'}/>
            );

            // Remove Design button should be there
            chai.expect(item.find('#butBackup')).to.have.length(0);

        });

    });

});