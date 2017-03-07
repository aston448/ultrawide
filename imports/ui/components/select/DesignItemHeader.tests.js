import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignItemHeader } from './DesignItemHeader.jsx';  // Non Redux wrapped

import { DesignStatus, DesignVersionStatus, WorkPackageType, WorkPackageStatus, RoleType, ItemType } from '../../../constants/constants.js'

import { Designs }          from '../../../collections/design/designs.js'
import { DesignVersions }   from '../../../collections/design/design_versions.js'
import { WorkPackages }     from '../../../collections/work/work_packages.js'

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

    // Base WP
    Factory.define('workPackage1', WorkPackages, {
        designId:               design._id,
        designVersionId:        designVersion1._id,
        designUpdateId:         'NONE',
        workPackageType:        WorkPackageType.WP_BASE,
        workPackageName:        'WorkPackage1',
        workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
        adoptingUserId:         'NONE'
    });
    const workPackage1 = Factory.create('workPackage1');

    // Update WP
    Factory.define('workPackage2', WorkPackages, {
        designId:               design._id,
        designVersionId:        designVersion1._id,
        designUpdateId:         'ABC',
        workPackageType:        WorkPackageType.WP_UPDATE,
        workPackageName:        'WorkPackage2',
        workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
        adoptingUserId:         'NONE'
    });
    const workPackage2 = Factory.create('workPackage2');

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
            chai.assert.equal(item.find('#nameLabel').children().text(), currentItemName);

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

            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.assert.equal(item.find('#statusLabel').children().text(), currentItemStatus);

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

            chai.expect(item.find('#statusLabel')).to.have.length(1);
            chai.assert.equal(item.find('#statusLabel').children().text(), currentItemStatus);

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
            chai.assert.equal(item.find('#nameLabel').children().text(), designVersion1.designVersionName);

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
            chai.assert.equal(item.find('#refLabel').children().text(), designVersion1.designVersionNumber);

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
            chai.assert.equal(item.find('#statusLabel').children().text(), designVersion1.designVersionStatus);

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
            chai.assert.equal(item.find('#statusLabel').children().text(), designVersion2.designVersionStatus);

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

    // WORK PACKAGES ---------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to edit its name', () => {

        it('initial design version work package has an edit option for a Manager', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage1._id}
                    currentItemName={workPackage1.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage1.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

        it('design update work package has an edit option for a Manager', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage2._id}
                    currentItemName={workPackage2.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage2.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('When a Work Package name is being edited there is an option to save changes', () => {

        it('save available for initial design work package', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage1._id}
                    currentItemName={workPackage1.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage1.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });

        it('save available for design update work package', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage2._id}
                    currentItemName={workPackage2.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage2.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });
    });

    describe('When a Work Package name is being edited there is an option to undo changes', () => {

        it('cancel available for initial design work package', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage1._id}
                    currentItemName={workPackage1.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage1.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });

        it('cancel available for design update work package', () => {

            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage2._id}
                    currentItemName={workPackage2.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage2.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });
    });

    describe('Only a Manager may edit a Work Package name', () => {

        it('edit not available for Designer', () => {

            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage1._id}
                    currentItemName={workPackage1.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage1.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('edit not available for Developer', () => {

            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage1._id}
                    currentItemName={workPackage1.workPackageName}
                    currentItemRef={null}
                    currentItemStatus={workPackage1.workPackageStatus}
                    onSelectItem={onSelectItem}
                    userRole={userRole}
                />
            );

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });
    });
});
