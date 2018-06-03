import React from 'react';


import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';


import DesignVersion        from './DesignVersion';

import { ItemType, DesignVersionStatus, RoleType }         from '../../../constants/constants.js'

import {UI}                 from "../../../constants/ui_context_ids";
import {hashID}             from "../../../common/utils";

describe('JSX: DesignVersion', () => {


    function testDesignVersion(designVersion, userContext, userRole, uiName){

        const statusClass = 'item-status-available';

        return shallow(
            <DesignVersion
                designVersion={designVersion}
                statusClass={statusClass}
                userContext={userContext}
                userRole={userRole}
                uiName={uiName}
            />
        );
    }

    // Designs ---------------------------------------------------------------------------------------------------------

    describe('MODAL', () => {

        describe('A confirmation dialog asks the user to confirm the creation of a new Design Version', () => {

            it('Shows a modal dialog', () => {

                const itemData = {
                    _id: 'DESIGN_VERSION_01',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '01',
                    designVersionStatus: DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId: 'USER1',
                    designId: 'DESIGN_01',
                    designVersionId: 'DESIGN_VERSION_01',
                    designUpdateId: 'NONE',
                    workPackageId: 'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testDesignVersion(itemData, userContext, userRole, itemData.designVersionName);
                const expectedUiItem = hashID(UI.MODAL_NEXT_VERSION, 'DesignVersion1');

                // Show the modal
                item.setState({showModal: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('For an Updatable Design Version the confirmation dialog shows the Design Updates to Merge and Carry Forward in the new Design Version', () => {

            it('Has update actions summary for updatable version', () => {

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testDesignVersion(itemData, userContext, userRole, itemData.designVersionName);

                const expectedUiItem1 = hashID(UI.MODAL_DV_UPDATES_MERGE, 'DesignVersion1');
                const expectedUiItem2 = hashID(UI.MODAL_DV_UPDATES_ROLL, 'DesignVersion1');
                const expectedUiItem3 = hashID(UI.MODAL_DV_UPDATES_IGNORE, 'DesignVersion1');

                // Show the modal
                item.setState({showModal: true});

                chai.assert.equal(item.find(expectedUiItem1).length, 1, expectedUiItem1 + ' not found');
                chai.assert.equal(item.find(expectedUiItem2).length, 1, expectedUiItem2 + ' not found');
                chai.assert.equal(item.find(expectedUiItem3).length, 1, expectedUiItem3 + ' not found');
            });

            it('Has no update actions summary for initial version', () => {

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testDesignVersion(itemData, userContext, userRole, itemData.designVersionName);

                const expectedUiItem1 = hashID(UI.MODAL_DV_UPDATES_MERGE, 'DesignVersion1');
                const expectedUiItem2 = hashID(UI.MODAL_DV_UPDATES_ROLL, 'DesignVersion1');
                const expectedUiItem3 = hashID(UI.MODAL_DV_UPDATES_IGNORE, 'DesignVersion1');

                // Show the modal
                item.setState({showModal: true});

                chai.assert.equal(item.find(expectedUiItem1).length, 0, expectedUiItem1 + ' was found');
                chai.assert.equal(item.find(expectedUiItem2).length, 0, expectedUiItem2 + ' was found');
                chai.assert.equal(item.find(expectedUiItem3).length, 0, expectedUiItem3 + ' was found');
            });

        });

        describe('Creation of a new Design Version can be cancelled by cancelling the confirmation dialog.', () => {

            it('Has a cancel option', () => {

                const itemData = {
                    _id: 'DESIGN_VERSION_01',
                    designVersionName: 'DesignVersion1',
                    designVersionNumber: '01',
                    designVersionStatus: DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId: 'USER1',
                    designId: 'DESIGN_01',
                    designVersionId: 'DESIGN_VERSION_01',
                    designUpdateId: 'NONE',
                    workPackageId: 'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testDesignVersion(itemData, userContext, userRole, itemData.designVersionName);

                const expectedUiItem = hashID(UI.MODAL_DV_CANCEL, 'DesignVersion1');

                // Show the modal
                item.setState({showModal: true});

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

    });

});
