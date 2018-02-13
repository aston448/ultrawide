import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ItemLink } from './ItemLink.jsx';  // Non Redux wrapped

import {  DesignUpdateStatus,  RoleType, ItemType } from '../../../constants/constants.js'
import {DesignStatus, DesignVersionStatus, WorkPackageStatus} from "../../../constants/constants";



let currentItemId = 'ID0001';
let statusClass = 'status-class';


function testItemLink(itemType, itemStatus, userRole, itemLink){

    return shallow(
        <ItemLink
            currentItemLink={itemLink}
            currentItemId={currentItemId}
            currentItemType={itemType}
            currentItemStatus={itemStatus}
            itemStatusClass={statusClass}
            userRole = {userRole}
        />
    );
}


describe('JSX: ItemLink', () => {

    describe('Interface', () => {

        describe('A Work Package has an option to edit its link', () => {

            it('work package has an edit link option for a Manager', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                // Edit Item is visible
                chai.expect(item.find('#editLink')).to.have.length(1);
            });
        });

        describe('When a Work Package link is being edited there is an option to save changes', () => {

            it('save available for work package link', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                item.setState({linkEditable: true});

                // Save Item is visible
                chai.expect(item.find('#editLinkOk')).to.have.length(1);
            });
        });

        describe('When a Work Package link is being edited there is an option to undo changes', () => {

            it('cancel available for work package link', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                item.setState({linkEditable: true});

                // Undo Item is visible
                chai.expect(item.find('#editLinkCancel')).to.have.length(1);
            });
        });

        describe('When a Work Package Link is being edited the actual URL is shown', () => {

            it('URL is visible', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                item.setState({linkEditable: true});

                chai.assert.equal(item.state().linkValue, itemLink);
            });
        });

        describe('When a Work Package Link is not being edited it reads as \'Open Link\'', () => {

            it('URL is not visible', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                item.setState({linkEditable: false});

                chai.assert.equal(item.find('#linkLabel').children().text(), 'Open Link');
            });
        });
    });

    describe('Actions', () => {

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Manager', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                // Edit Item is visible
                chai.expect(item.find('#editLink')).to.have.length(1);
            });
        });

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.DESIGNER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                // Edit Item is visible
                chai.expect(item.find('#editLink')).to.have.length(1);
            });
        });

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.DEVELOPER;
                const itemLink = 'https://hen.com';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                // Edit Item is visible
                chai.expect(item.find('#editLink')).to.have.length(1);
            });
        });
    });

    describe('Conditions', () => {

        describe('If a Work Package Link is not set the text reads \'Link Not Set\'', () => {

            it('URL is not visible', () => {

                const itemType = ItemType.WORK_PACKAGE;
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const userRole = RoleType.MANAGER;
                const itemLink = 'NONE';

                let item = testItemLink(itemType, itemStatus, userRole, itemLink);

                item.setState({linkEditable: false});

                chai.assert.equal(item.find('#linkLabel').text(), 'Link Not Set');
            });
        });
    });
});