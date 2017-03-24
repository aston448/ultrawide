import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignItemHeader } from './DesignItemHeader.jsx';  // Non Redux wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, WorkPackageType, WorkPackageStatus, RoleType, ItemType } from '../../../constants/constants.js'

import { Designs }          from '../../../collections/design/designs.js';
import { DesignVersions }   from '../../../collections/design/design_versions.js';
import { DesignUpdates }    from '../../../collections/design_update/design_updates.js';
import { WorkPackages }     from '../../../collections/work/work_packages.js';

describe('JSX: DesignItemHeader', () => {

    // Global data for all tests

    // Designs ---------------------------------------------------------------------------------------------------------
    Factory.define('design', Designs, {
        designName: 'Design1',
        isRemovable: true,
        designStatus: DesignStatus.DESIGN_LIVE
    });
    const design = Factory.create('design');

    Factory.define('designArchived', Designs, {
        designName: 'DesignArchived',
        isRemovable: false,
        designStatus: DesignStatus.DESIGN_ARCHIVED
    });
    const designArchived = Factory.create('designArchived');

    // Design Versions -------------------------------------------------------------------------------------------------
    Factory.define('newDesignVersion', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion0',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_NEW
    });
    const newDesignVersion = Factory.create('newDesignVersion');

    Factory.define('publishedDesignVersion', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion0',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
    });
    const publishedDesignVersion = Factory.create('publishedDesignVersion');

    Factory.define('completeDesignVersion', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion1',
        designVersionNumber:    '0.1',
        designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });
    const completeDesignVersion = Factory.create('completeDesignVersion');

    Factory.define('updatableDesignVersion', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion2',
        designVersionNumber:    '1.0',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
    });
    const updatableDesignVersion = Factory.create('updatableDesignVersion');

    Factory.define('updatableCompleteDesignVersion', DesignVersions, {
        designId:               design._id,
        designVersionName:      'DesignVersion2',
        designVersionNumber:    '1.0',
        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    });
    const updatableCompleteDesignVersion = Factory.create('updatableCompleteDesignVersion');

    // Design Updates --------------------------------------------------------------------------------------------------

    Factory.define('newDesignUpdate', DesignUpdates, {
        designVersionId:            updatableDesignVersion._id,
        updateName:                 'New Update',
        updateReference:            'New Ref',
        updateStatus:               DesignUpdateStatus.UPDATE_NEW,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
        summaryDataStale:           false
    });
    const newDesignUpdate = Factory.create('newDesignUpdate');

    Factory.define('publishedDesignUpdate', DesignUpdates, {
        designVersionId:            updatableDesignVersion._id,
        updateName:                 'Published Update',
        updateReference:            'Published Ref',
        updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
        summaryDataStale:           false
    });
    const publishedDesignUpdate = Factory.create('publishedDesignUpdate');

    Factory.define('mergedDesignUpdate', DesignUpdates, {
        designVersionId:            updatableDesignVersion._id,
        updateName:                 'Merged Update',
        updateReference:            'Merged Ref',
        updateStatus:               DesignUpdateStatus.UPDATE_MERGED,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
        summaryDataStale:           false
    });
    const mergedDesignUpdate = Factory.create('mergedDesignUpdate');

    // Work Packages ---------------------------------------------------------------------------------------------------
    // Base WP
    Factory.define('baseWorkPackage', WorkPackages, {
        designId:               design._id,
        designVersionId:        completeDesignVersion._id,
        designUpdateId:         'NONE',
        workPackageType:        WorkPackageType.WP_BASE,
        workPackageName:        'WorkPackage1',
        workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
        adoptingUserId:         'NONE'
    });
    const baseWorkPackage = Factory.create('baseWorkPackage');

    // Update WP
    Factory.define('updateWorkPackage', WorkPackages, {
        designId:               design._id,
        designVersionId:        completeDesignVersion._id,
        designUpdateId:         'ABC',
        workPackageType:        WorkPackageType.WP_UPDATE,
        workPackageName:        'WorkPackage2',
        workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
        adoptingUserId:         'NONE'
    });
    const updateWorkPackage = Factory.create('updateWorkPackage');


    let currentItemId = '';
    let currentItemName = '';
    let currentItemRef = '';
    let currentItemStatus = '';
    const onSelectItem = () => {return true};

    function testDesignItemHeader(itemType, itemSubType, itemStatus, userRole){

        switch(itemType){
            case ItemType.DESIGN:
                switch(itemStatus) {
                    case DesignStatus.DESIGN_LIVE:
                        currentItemId = design._id;
                        currentItemName = design.designName;
                        currentItemStatus = design.designStatus;
                        break;
                    case DesignStatus.DESIGN_ARCHIVED:
                        currentItemId = designArchived._id;
                        currentItemName = designArchived.designName;
                        currentItemStatus = designArchived.designStatus;
                        break;
                }
                break;
            case ItemType.DESIGN_VERSION:
                switch(itemStatus){
                    case DesignVersionStatus.VERSION_NEW:
                        currentItemId = newDesignVersion._id;
                        currentItemName = newDesignVersion.designVersionName;
                        currentItemRef = newDesignVersion.designVersionNumber;
                        currentItemStatus = newDesignVersion.designVersionStatus;
                        break;
                    case DesignVersionStatus.VERSION_DRAFT:
                        currentItemId = publishedDesignVersion._id;
                        currentItemName = publishedDesignVersion.designVersionName;
                        currentItemRef = publishedDesignVersion.designVersionNumber;
                        currentItemStatus = publishedDesignVersion.designVersionStatus;
                        break;
                    case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                        currentItemId = completeDesignVersion._id;
                        currentItemName = completeDesignVersion.designVersionName;
                        currentItemRef = completeDesignVersion.designVersionNumber;
                        currentItemStatus = completeDesignVersion.designVersionStatus;
                        break;
                    case DesignVersionStatus.VERSION_UPDATABLE:
                        currentItemId = updatableDesignVersion._id;
                        currentItemName = updatableDesignVersion.designVersionName;
                        currentItemRef = updatableDesignVersion.designVersionNumber;
                        currentItemStatus = updatableDesignVersion.designVersionStatus;
                        break;
                    case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                        currentItemId = updatableCompleteDesignVersion._id;
                        currentItemName = updatableCompleteDesignVersion.designVersionName;
                        currentItemRef = updatableCompleteDesignVersion.designVersionNumber;
                        currentItemStatus = updatableCompleteDesignVersion.designVersionStatus;
                        break;
                }
                break;
            case ItemType.DESIGN_UPDATE:
                switch(itemStatus){
                    case DesignUpdateStatus.UPDATE_NEW:
                        currentItemId = newDesignUpdate._id;
                        currentItemName = newDesignUpdate.updateName;
                        currentItemRef = newDesignUpdate.updateReference;
                        currentItemStatus = newDesignUpdate.updateStatus;
                        break;
                    case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                        currentItemId = publishedDesignUpdate._id;
                        currentItemName = publishedDesignUpdate.updateName;
                        currentItemRef = publishedDesignUpdate.updateReference;
                        currentItemStatus = publishedDesignUpdate.updateStatus;
                        break;
                    case DesignUpdateStatus.UPDATE_MERGED:
                        currentItemId = mergedDesignUpdate._id;
                        currentItemName = mergedDesignUpdate.updateName;
                        currentItemRef = mergedDesignUpdate.updateReference;
                        currentItemStatus = mergedDesignUpdate.updateStatus;
                        break;
                }
                break;
            case ItemType.WORK_PACKAGE:
                switch(itemSubType){
                    case WorkPackageType.WP_BASE:
                        currentItemId = baseWorkPackage._id;
                        currentItemName = baseWorkPackage.workPackageName;
                        currentItemStatus = baseWorkPackage.workPackageStatus;
                        break;
                    case WorkPackageType.WP_UPDATE:
                        currentItemId = updateWorkPackage._id;
                        currentItemName = updateWorkPackage.workPackageName;
                        currentItemStatus = updateWorkPackage.workPackageStatus;
                        break;
                }

        }
        return shallow(
            <DesignItemHeader
                currentItemType={itemType}
                currentItemId={currentItemId}
                currentItemName={currentItemName}
                currentItemRef={currentItemRef}
                currentItemStatus={currentItemStatus}
                onSelectItem={onSelectItem}
                userRole={userRole}
            />
        );
    }


    // DESIGNS ---------------------------------------------------------------------------------------------------------

    describe('Each Design in the list is identified by its name', () => {

        it('has the design name', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.assert.equal(item.find('#nameLabel').children().text(), currentItemName);
        });
    });


    describe('Each Design in the Designs list has an Edit option against the Design name', () => {

        it('has an edit option for a Designer', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });
    });

    describe('The Edit option for a Design name is only visible for a Designer', () => {

        it('has no edit option for a Developer', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('has no edit option for a Manager', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });
    });

    describe('When a Design name is being edited there is a Save option', () => {

        it('save option visible', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editOk')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});
            chai.expect(item.find('#editOk')).to.have.length(1);
        });
    });

    describe('When a Design name is being edited there is an Undo option', () => {

        it('undo option visible', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editCancel')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });
    });


    // DESIGN VERSIONS -------------------------------------------------------------------------------------------------

    describe('Each Design Version in the list is identified by its name and version number', () => {

        it('name visible', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Design Version Name should be visible and have the expected name
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.assert.equal(item.find('#nameLabel').children().text(), completeDesignVersion.designVersionName);
        });

        it('version number visible', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Design Version Number should be visible and have the expected value
            chai.expect(item.find('#refLabel')).to.have.length(1);
            chai.assert.equal(item.find('#refLabel').children().text(), completeDesignVersion.designVersionNumber);
        });
    });


    describe('Each Design Version has a edit option against its name', () => {

        it('new design version has an edit name option for a Designer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('Each Design Version has an edit option against its number', () => {

        it('new design version has an edit number option for a Designer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is visible
            chai.expect(item.find('#editRef')).to.have.length(1);
        });

    });

    describe('The edit option for a Design Version name is only visible to a Designer', () => {

        it('published design version has no edit option for a Developer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('published design version has no edit option for a Manager', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

    });

    describe('The edit option for a Design Version number is only visible to a Designer', () => {

        it('published design version has no edit option for a Developer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#editRef')).to.have.length(0);
        });

        it('published design version has no edit option for a Manager', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#editRef')).to.have.length(0);
        });

    });

    describe('When a Design Version name or number is being edited there is a save option', () => {

        it('save option visible for name', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editOk')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });

        it('save option visible for number', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editRefOk')).to.have.length(0);

            // And now edit...
            item.setState({refEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editRefOk')).to.have.length(1);
        });
    });

    describe('When a Design Version name or number is being edited there is an undo option', () => {

        it('undo option visible for name', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editCancel')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });

        it('undo option visible for number', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.expect(item.find('#editRefCancel')).to.have.length(0);

            // And now edit...
            item.setState({refEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editRefCancel')).to.have.length(1);
        });
    });

    // DESIGN UPDATES --------------------------------------------------------------------------------------------------

    describe('Each Design Update in the list is identified by its name and reference', () => {

        it('has the design update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Design Update Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.assert.equal(item.find('#nameLabel').children().text(), currentItemName);
        });

        it('has the design update reference', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            // Design Update Name should be visible and have the expected name and status
            chai.expect(item.find('#refLabel')).to.have.length(1);
            chai.assert.equal(item.find('#refLabel').children().text(), currentItemRef);
        });
    });

    describe('A Design Update name has an option to edit it', () => {

        it('designer has edit option for new update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });

        it('designer has edit option for published update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });

        it('designer has edit option for merged update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });
    });

    describe('A Design Update reference has an option to edit it', () => {

        it('designer has edit option for new update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });

        it('designer has edit option for published update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });

        it('designer has edit option for merged update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });
    });

    describe('A Design Update name being edited has an option to save changes', () => {

        it('designer has save option for new update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });

        it('designer has save option for published update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });

        it('designer has save option for merged update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });
    });

    describe('A Design Update reference being edited has an option to save changes', () => {

        it('designer has save option for new update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });

        it('designer has save option for published update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });

        it('designer has save option for merged update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });
    });

    describe('A Design Update name being edited has an option to discard changes', () => {

        it('designer has cancel option for new update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for published update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for merged update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });
    });

    describe('A Design Update reference being edited has an option to discard changes', () => {

        it('designer has cancel option for new update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for published update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for merged update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });
    });

    describe('The edit option for a Design Update name is only visible for a Designer', () => {

        it('no option for Developer on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Developer on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Developer on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });
    });

    describe('The edit option for a Design Update reference is only visible for a Designer', () => {

        it('no option for Developer on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Developer on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Developer on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, null, itemStatus, userRole);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });
    });

    // WORK PACKAGES ---------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to edit its name', () => {

        it('initial design version work package has an edit option for a Manager', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_BASE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

        it('design update work package has an edit option for a Manager', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_UPDATE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('When a Work Package name is being edited there is an option to save changes', () => {

        it('save available for initial design work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_BASE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });

        it('save available for design update work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_UPDATE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });
    });

    describe('When a Work Package name is being edited there is an option to undo changes', () => {

        it('cancel available for initial design work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_BASE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });

        it('cancel available for design update work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_UPDATE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });
    });

    describe('Only a Manager may edit a Work Package name', () => {

        it('edit not available for Designer', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_BASE;
            const itemStatus = null;
            const userRole = RoleType.DESIGNER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('edit not available for Developer', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemSubType = WorkPackageType.WP_BASE;
            const itemStatus = null;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignItemHeader(itemType, itemSubType, itemStatus, userRole);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });
    });
});
