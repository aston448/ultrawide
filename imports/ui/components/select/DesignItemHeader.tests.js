import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignItemHeader } from './DesignItemHeader.jsx';  // Non Redux wrapped

import { DesignStatus, DesignVersionStatus, RoleType, ItemType } from '../../../constants/constants.js'
import { getBootstrapText } from '../../../common/utils.js';

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignItemHeader', () => {

    // Global data for all tests
    Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
    const design = Factory.create('design');

    Factory.define('designVersion1', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion1',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });
    const designVersion1 = Factory.create('designVersion1');

    Factory.define('designVersion2', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion2',
        designVersionNumber:    '1.0',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
    });
    const designVersion2 = Factory.create('designVersion2');

    const currentItemId = design._id;
    const currentItemName = design.designName;
    const currentItemRef = '';
    const currentItemStatus = design.designStatus;
    const onSelectItem = () => {return true};


    // DESIGNS ---------------------------------------------------------------------------------------------------------

    describe('Each Design in the list is identified by its name', () => {

        it('has the design name', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN}
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
            chai.expect(getBootstrapText(item.find('#nameLabel').html())).to.equal(currentItemName);

        });

    });

    describe('Each Design in the list has its current status visible', () => {

        it('has status LIVE if live', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN}
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#statusLabel').html())).to.equal(currentItemStatus);

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
                    currentItemType={ItemType.DESIGN}
                    currentItemId={currentItemId}
                    currentItemName={currentItemName}
                    currentItemRef={currentItemRef}
                    currentItemStatus={currentItemStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#statusLabel').html())).to.equal(currentItemStatus);

        });

    });

    describe('Each Design in the Designs list has an Edit option against the Design name', () => {

        it('has an edit option for a Designer', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN}
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
                    currentItemType={ItemType.DESIGN}
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
                    currentItemType={ItemType.DESIGN}
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
                    currentItemType={ItemType.DESIGN}
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
                    currentItemType={ItemType.DESIGN}
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


    // DESIGN VERSIONS -------------------------------------------------------------------------------------------------

    describe('Each Design Version in the list is identified by its name and version number', () => {

        it('name visible', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Version Name should be visible and have the expected name
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#nameLabel').html())).to.equal(designVersion1.designVersionName);

        });

        it('version number visible', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Version Number should be visible and have the expected value
            chai.expect(item.find('#refLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#refLabel').html())).to.equal(designVersion1.designVersionNumber);

        });

    });

    describe('The state of each Design Version is shown', () => {

        it('status visible for Complete', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Version Name should be visible and have the expected name
            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#statusLabel').html())).to.equal(designVersion1.designVersionStatus);

        });

        it('status visible for Updatable', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion2._id}
                    currentItemName={designVersion2.designVersionName}
                    currentItemRef={designVersion2.designVersionNumber}
                    currentItemStatus={designVersion2.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Design Version Name should be visible and have the expected name
            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#statusLabel').html())).to.equal(designVersion2.designVersionStatus);

        });


    });

    describe('Each Design Version has a edit option against its name', () => {

        it('has an edit option for a Designer', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('Each Design Version has an edit option against its number', () => {

        it('has an edit option for a Designer', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is visible
            chai.expect(item.find('#editRef')).to.have.length(1);
        });

    });

    describe('The edit option for a Design Version name is only visible to a Designer', () => {

        it('has no edit option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
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
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

    });

    describe('The edit option for a Design Version number is only visible to a Designer', () => {

        it('has no edit option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#editRef')).to.have.length(0);
        });

        it('has no edit option for a Manager', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#editRef')).to.have.length(0);
        });

    });

    describe('When a Design Version name or number is being edited there is a save option', () => {

        it('save option visible for name', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
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

        it('save option visible for number', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            chai.expect(item.find('#editRefOk')).to.have.length(0);

            // And now edit...
            item.setState({refEditable: true}, done => {
                // Edit Save Item is visible
                chai.expect(item.find('#editRefOk')).to.have.length(1);
            });
        });

    });

    describe('When a Design Version name or number is being edited there is an undo option', () => {

        it('undo option visible for name', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
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

        it('undo option visible for number', () => {

            const userRole = RoleType.DESIGNER;

            let item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion1._id}
                    currentItemName={designVersion1.designVersionName}
                    currentItemRef={designVersion1.designVersionNumber}
                    currentItemStatus={designVersion1.designVersionStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            chai.expect(item.find('#editRefCancel')).to.have.length(0);

            // And now edit...
            item.setState({refEditable: true}, done => {
                // Edit Save Item is visible
                chai.expect(item.find('#editRefCancel')).to.have.length(1);
            });
        });

    });


});
