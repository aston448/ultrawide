import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import UltrawideItemEditableField from './UltrawideItemEditableField';

import { UI }           from "../../../constants/ui_context_ids";
import { hashID }       from "../../../common/utils";

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, WorkPackageStatus,  RoleType, ItemType, FieldType } from '../../../constants/constants.js'


function testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName){

    return shallow(
        <UltrawideItemEditableField
            fieldType={fieldType}
            currentItemType={itemType}
            currentItemId={itemId}
            currentFieldValue={fieldValue}
            currentItemStatus={itemStatus}
            statusClass={statusClass}
            userRole={userRole}
            uiName={uiName}
        />
    );
}

describe('JSX: EditableField', () => {

    // DESIGNS ---------------------------------------------------------------------------------------------------------
    describe('DES', () => {

        describe('Each Design in the list is identified by its name', () => {

            it('has the design name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
                chai.assert.equal(item.find(expectedUiItem).children().text(), fieldValue);
            });
        });

        describe('Each Design in the Designs list has an Edit option against the Design name', () => {

            it('has an edit option for a Designer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The Edit option for a Design name is only visible for a Designer', () => {

            it('has no edit option for a Developer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no edit option for a Manager', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('When a Design name is being edited there is a Save option', () => {

            it('save option visible', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('When a Design name is being edited there is an Undo option', () => {

            it('undo option visible', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN;
                const itemId = 'DESIGN_01';
                const fieldValue = 'Design1';
                const itemStatus = DesignStatus.DESIGN_LIVE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'Design1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

    });

    // DESIGN VERSIONS -------------------------------------------------------------------------------------------------
    describe('DV', () => {

        describe('Each Design Version in the list is identified by its name and version number', () => {

            it('name visible', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
                chai.assert.equal(item.find(expectedUiItem).children().text(), fieldValue);
            });

            it('version visible', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
                chai.assert.equal(item.find(expectedUiItem).children().text(), fieldValue);
            });

        });


        describe('Each Design Version has a edit option against its name', () => {

            it('new design version has an edit name option for a Designer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_NEW;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('Each Design Version has an edit option against its number', () => {

            it('new design version has an edit number option for a Designer', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_NEW;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('The edit option for a Design Version name is only visible to a Designer', () => {

            it('published design version has no edit option for a Developer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('published design version has no edit option for a Manager', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('published design version has no edit option for a Guest', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });

        describe('The edit option for a Design Version number is only visible to a Designer', () => {

            it('not visible for Developer', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('not visible for Manager', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('not visible for Guest Viewer', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });

        describe('When a Design Version name or number is being edited there is a save option', () => {

            it('save option visible for name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('save option visible for version', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('When a Design Version name or number is being edited there is an undo option', () => {

            it('undo option visible for name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = 'DesignVersion1';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignVersion1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('undo option visible for version', () => {

                const fieldType = FieldType.VERSION;
                const itemType = ItemType.DESIGN_VERSION;
                const itemId = 'DESIGN_VERSION_01';
                const fieldValue = '01';
                const itemStatus = DesignVersionStatus.VERSION_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = '01';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                // And now edit...
                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });
    });

    // DESIGN UPDATES --------------------------------------------------------------------------------------------------

    describe('DU', () => {

        describe('Each Design Update in the list is identified by its name and reference', () => {

            it('has the design update name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
                chai.assert.equal(item.find(expectedUiItem).children().text(), fieldValue);
            });

            it('has the design update reference', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
                chai.assert.equal(item.find(expectedUiItem).children().text(), fieldValue);
            });
        });

        describe('A Design Update name has an option to edit it', () => {

            it('designer has edit option for new update name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has edit option for published update name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has edit option for merged update name', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A Design Update name being edited has an option to save changes', () => {

            it('designer has save option for new update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has save option for published update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has save option for merged update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });


        describe('A Design Update name being edited has an option to discard changes', () => {

            it('designer has cancel option for new update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has cancel option for published update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has cancel option for merged update name edit', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The edit option for a Design Update name is only visible for a Designer', () => {

            it('no option for Developer on new update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Developer on published update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Developer on merged update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on new update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on published update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on merged update', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'DesignUpdate1';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'DesignUpdate1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Design Update reference has an option to edit it', () => {

            it('designer has edit option for new update ref', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('designer has edit option for published update ref', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has edit option for merged update ref', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A Design Update reference being edited has an option to save changes', () => {

            it('designer has save option for new update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has save option for published update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has save option for merged update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });


        describe('A Design Update reference being edited has an option to discard changes', () => {

            it('designer has cancel option for new update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has cancel option for published update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('designer has cancel option for merged update ref edit', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The edit option for a Design Update reference is only visible for a Designer', () => {

            it('no option for Developer on new update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Developer on published update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Developer on merged update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on new update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on published update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Manager on merged update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Guest on new update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Guest on published update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
                const statusClass = 'item-status-available';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for Guest on merged update', () => {

                const fieldType = FieldType.REFERENCE;
                const itemType = ItemType.DESIGN_UPDATE;
                const itemId = 'DESIGN_UPDATE_01';
                const fieldValue = 'CR001';
                const itemStatus = DesignUpdateStatus.UPDATE_MERGED;
                const statusClass = 'item-status-available';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = 'CR001';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });
    });

    // WORK PACKAGES ---------------------------------------------------------------------------------------------------
    describe('WP', () => {

        describe('A Work Package has an option to edit its name', () => {

            it('initial design version work package has an edit option for a Manager', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('design update work package has an edit option for a Manager', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('When a Work Package name is being edited there is an option to save changes', () => {

            it('save available for initial design work package', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('save available for design update work package', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('When a Work Package name is being edited there is an option to undo changes', () => {

            it('cancel available for initial design work package', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('cancel available for design update work package', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('Only a Manager may edit a Work Package name', () => {

            it('edit not available for Designer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DESIGNER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('edit not available for Developer', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('edit not available for Guest', () => {

                const fieldType = FieldType.NAME;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'WorkPackage1';
                const itemStatus = WorkPackageStatus.WP_NEW;
                const statusClass = 'item-status-new';
                const userRole = RoleType.GUEST_VIEWER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

    });

});


// Link Tests

describe('JSX: Field: LINK', () => {

    describe('Interface', () => {

        describe('A Work Package has an option to edit its link', () => {

            it('work package has an edit link option for a Manager', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('When a Work Package link is being edited there is an option to save changes', () => {

            it('save available for work package link', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });
        });

        describe('When a Work Package link is being edited there is an option to undo changes', () => {

            it('cancel available for work package link', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName) + '-' + fieldType;

                item.setState({fieldEditable: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('When a Work Package Link is being edited the actual URL is shown', () => {

            it('URL is visible', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'https://hen.com';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);

                item.setState({fieldEditable: true});

                chai.assert.equal(item.state().fieldValue, fieldValue);
            });
        });

        describe('When a Work Package Link is not being edited it reads as \'Open Link\'', () => {

            it('URL is not visible', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'https://hen.com';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);

                item.setState({fieldEditable: false});
                const expectedUiItem = hashID(UI.LINK_ITEM_LINK_LABEL, uiName);

                chai.assert.equal(item.find(expectedUiItem).children().text(), 'Open Link');
            });
        });
    });

    describe('Actions', () => {

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Manager', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Designer', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DESIGNER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('A Manager, Developer or Designer may edit a Work Package Link', () => {

            it('editable for a Developer', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.DEVELOPER;
                const uiName = 'WorkPackage1';


                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName) + '-' + fieldType;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });
    });

    describe('Conditions', () => {

        describe('If a Work Package Link is not set the text reads \'Link Not Set\'', () => {

            it('URL is not visible', () => {

                const fieldType = FieldType.LINK;
                const itemType = ItemType.WORK_PACKAGE;
                const itemId = 'WORK_PACKAGE_01';
                const fieldValue = 'NONE';
                const itemStatus = WorkPackageStatus.WP_AVAILABLE;
                const statusClass = 'item-status-available';
                const userRole = RoleType.MANAGER;
                const uiName = 'WorkPackage1';

                const item = testItemField(fieldType, itemType, itemId, fieldValue, itemStatus, statusClass, userRole, uiName);

                item.setState({fieldEditable: false});
                const expectedUiItem = hashID(UI.LINK_ITEM_LINK_LABEL, uiName);

                chai.assert.equal(item.find(expectedUiItem).children().text(), 'Link Not Set');
            });
        });
    });


});