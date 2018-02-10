import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ItemName } from './ItemName.jsx';  // Non Redux wrapped

import {  DesignUpdateStatus,  RoleType, ItemType } from '../../../constants/constants.js'
import {DesignStatus, DesignVersionStatus} from "../../../constants/constants";



let currentItemId = 'ID0001';
let statusClass = 'status-class';


function testItemName(itemType, itemStatus, userRole, itemName){

    return shallow(
        <ItemName
            currentItemName={itemName}
            currentItemId={currentItemId}
            currentItemType={itemType}
            currentItemStatus={itemStatus}
            statusClass={statusClass}
            userRole = {userRole}
        />
    );
}


describe('JSX: ItemName', () => {

    // DESIGNS ---------------------------------------------------------------------------------------------------------

    describe('Each Design in the list is identified by its name', () => {

        it('has the design name', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Design Name should be visible and have the expected name and status
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.assert.equal(item.find('#nameLabel').children().text(), itemName);
        });
    });


    describe('Each Design in the Designs list has an Edit option against the Design name', () => {

        it('has an edit option for a Designer', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });
    });

    describe('The Edit option for a Design name is only visible for a Designer', () => {

        it('has no edit option for a Developer', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('has no edit option for a Manager', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.MANAGER;
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });
    });

    describe('When a Design name is being edited there is a Save option', () => {

        it('save option visible', () => {

            const itemType = ItemType.DESIGN;
            const itemStatus = DesignStatus.DESIGN_LIVE;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

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
            const itemName = 'Design 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

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
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Design Version Name should be visible and have the expected name
            chai.expect(item.find('#nameLabel')).to.have.length(1);
            chai.assert.equal(item.find('#nameLabel').children().text(), itemName);
        });

    });


    describe('Each Design Version has a edit option against its name', () => {

        it('new design version has an edit name option for a Designer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });


    describe('The edit option for a Design Version name is only visible to a Designer', () => {

        it('published design version has no edit option for a Developer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('published design version has no edit option for a Manager', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.MANAGER;
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

    });


    describe('When a Design Version name or number is being edited there is a save option', () => {

        it('save option visible for name', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.expect(item.find('#editOk')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });

    });

    describe('When a Design Version name or number is being edited there is an undo option', () => {

        it('undo option visible for name', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Version 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.expect(item.find('#editCancel')).to.have.length(0);

            // And now edit...
            item.setState({nameEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });

    });

    // DESIGN UPDATES --------------------------------------------------------------------------------------------------

    describe('A Design Update name has an option to edit it', () => {

        it('designer has edit option for new update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });

        it('designer has edit option for published update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });

        it('designer has edit option for merged update name', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 1, 'Edit name option not found');
        });
    });

    describe('A Design Update name being edited has an option to save changes', () => {

        it('designer has save option for new update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });

        it('designer has save option for published update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });

        it('designer has save option for merged update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editOk').length, 1, 'Save name option not found');
        });
    });


    describe('A Design Update name being edited has an option to discard changes', () => {

        it('designer has cancel option for new update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for published update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for merged update name edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            chai.assert.equal(item.find('#editCancel').length, 1, 'Cancel option not found');
        });
    });

    describe('The edit option for a Design Update name is only visible for a Designer', () => {

        it('no option for Developer on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Developer on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Developer on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });

        it('no option for Manager on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;
            const itemName = 'Design Update 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            chai.assert.equal(item.find('#edit').length, 0, 'Edit name option was present');
        });
    });

    // WORK PACKAGES ---------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to edit its name', () => {

        it('initial design version work package has an edit option for a Manager', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

        it('design update work package has an edit option for a Manager', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is visible
            chai.expect(item.find('#edit')).to.have.length(1);
        });

    });

    describe('When a Work Package name is being edited there is an option to save changes', () => {

        it('save available for initial design work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });

        it('save available for design update work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            // Save Item is visible
            chai.expect(item.find('#editOk')).to.have.length(1);
        });
    });

    describe('When a Work Package name is being edited there is an option to undo changes', () => {

        it('cancel available for initial design work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });

        it('cancel available for design update work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.MANAGER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            item.setState({nameEditable: true});

            // Cancel Item is visible
            chai.expect(item.find('#editCancel')).to.have.length(1);
        });
    });

    describe('Only a Manager may edit a Work Package name', () => {

        it('edit not available for Designer', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.DESIGNER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });

        it('edit not available for Developer', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const itemStatus = null;
            const userRole = RoleType.DEVELOPER;
            const itemName = 'Work Package 1';

            let item = testItemName(itemType, itemStatus, userRole, itemName);

            // Edit Item is not visible
            chai.expect(item.find('#edit')).to.have.length(0);
        });
    });
});