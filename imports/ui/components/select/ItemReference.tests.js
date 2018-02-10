import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ItemReference } from './ItemReference.jsx';  // Non Redux wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, WorkPackageType, WorkPackageStatus, RoleType, ItemType } from '../../../constants/constants.js'


let currentItemId = 'ID0001';
let statusClass = 'status-class';


function testItemReference(itemType, itemStatus, userRole, itemRef){

    return shallow(
        <ItemReference
            currentItemRef={itemRef}
            currentItemId={currentItemId}
            currentItemType={itemType}
            currentItemStatus={itemStatus}
            itemStatusClass={statusClass}
            userRole = {userRole}
        />
    );
}


describe('JSX: ItemReference', () => {

    // DESIGN VERSIONS -------------------------------------------------------------------------------------------------

    describe('Each Design Version in the list is identified by its name and version number', () => {


        it('version number visible', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            // Design Version Number should be visible and have the expected value
            chai.expect(item.find('#refLabel')).to.have.length(1);
            chai.assert.equal(item.find('#refLabel').children().text(), itemRef);
        });
    });

    describe('Each Design Version has an edit option against its number', () => {

        it('new design version has an edit number option for a Designer', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            // Edit Item is visible
            chai.expect(item.find('#editRef')).to.have.length(1);
        });

    });

    describe('When a Design Version name or number is being edited there is a save option', () => {

        it('save option visible for name', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const itemStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

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
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

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
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

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
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.expect(item.find('#editRefCancel')).to.have.length(0);

            // And now edit...
            item.setState({refEditable: true});

            // Edit Save Item is visible
            chai.expect(item.find('#editRefCancel')).to.have.length(1);
        });
    });

    // DESIGN UPDATES --------------------------------------------------------------------------------------------------

    describe('Each Design Update in the list is identified by its name and reference', () => {

        it('has the design update reference', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            // Design Update Name should be visible and have the expected name and status
            chai.expect(item.find('#refLabel')).to.have.length(1);
            chai.assert.equal(item.find('#refLabel').children().text(), currentItemRef);
        });
    });


    describe('A Design Update reference has an option to edit it', () => {

        it('designer has edit option for new update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });

        it('designer has edit option for published update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });

        it('designer has edit option for merged update ref', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 1, 'Edit ref option not found');
        });
    });

    describe('A Design Update reference being edited has an option to save changes', () => {

        it('designer has save option for new update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });

        it('designer has save option for published update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });

        it('designer has save option for merged update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefOk').length, 1, 'Save ref option not found');
        });
    });


    describe('A Design Update reference being edited has an option to discard changes', () => {

        it('designer has cancel option for new update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for published update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });

        it('designer has cancel option for merged update ref edit', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DESIGNER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            item.setState({refEditable: true});

            chai.assert.equal(item.find('#editRefCancel').length, 1, 'Cancel option not found');
        });
    });

    describe('The edit option for a Design Update reference is only visible for a Designer', () => {

        it('no option for Developer on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.DEVELOPER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Developer on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Developer on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.DEVELOPER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on new update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on published update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });

        it('no option for Manager on merged update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;
            const itemRef = '0.1';

            let item = testItemReference(itemType, itemStatus, userRole, itemRef);

            chai.assert.equal(item.find('#editRef').length, 0, 'Edit ref option was present');
        });
    });


});