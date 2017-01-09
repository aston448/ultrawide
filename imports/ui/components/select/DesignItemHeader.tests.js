import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignItemHeader } from './DesignItemHeader.jsx';  // Non Redux wrapped

import { DesignStatus, RoleType } from '../../../constants/constants.js'
import { getBootstrapText } from '../../../common/utils.js';

import { Designs } from '../../../collections/design/designs.js'

describe('JSX: DesignItemHeader', () => {

    // Global data for all tests
    Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
    const design = Factory.create('design');

    const currentItemId = design._id;
    const currentItemName = design.designName;
    const currentItemRef = '';
    const currentItemStatus = design.designStatus;
    const onSelectItem = () => {return true};



    describe('Each Design in the list is identified by its name', () => {

        it('has the design name', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#nameLabel').html())).to.equal(currentItemName + ' (' + currentItemStatus + ')');

        });

    });

    describe('Each Design in the list has its current status visible', () => {

        it('has status LIVE if live', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#nameLabel').html())).to.equal(currentItemName + ' (' + currentItemStatus + ')');

        });

        it('has status ARCHIVED if archived', () => {

            Factory.define('designArchived', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_ARCHIVED});
            const designArchived = Factory.create('designArchived');

            const userContext = {designId: 'AAA'};
            const userRole = RoleType.DESIGNER;

            const currentItemId = designArchived._id;
            const currentItemName = designArchived.designName;
            const currentItemRef = '';
            const currentItemStatus = designArchived.designStatus;
            const onSelectItem = () => {return true};

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#nameLabel').html())).to.equal(currentItemName + ' (' + currentItemStatus + ')');

        });

    });

    describe('Each Design in the Designs list has an Edit option against the Design name', () => {

        it('has an edit option for a Designer', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('The Edit option for a Design name is only visible for a Designer', () => {

        it('has no edit option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('has no edit option for a Manager', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

    });

    describe('When a Design name is being edited there is a Save option', () => {

        it('save option visible', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            chai.expect(item.find('#editOk')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true}, done => {
                // Edit Save Item is visible
                chai.expect(item.find('#editOk')).to.have.length(1);
            });
        });

    });

    describe('When a Design name is being edited there is an Undo option', () => {

        it('undo option visible', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            chai.expect(item.find('#editCancel')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true}, done => {
                // Edit Save Item is visible
                chai.expect(item.find('#editCancel')).to.have.length(1);
            });
        });

    });


});
