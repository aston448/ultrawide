import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import ItemList                 from './ItemList.jsx'
import { ItemWrapper }          from './ItemWrapper.jsx';       // Non Redux
import { Design }               from './Design.jsx';            // Non Redux
import { DesignVersion }        from './DesignVersion.jsx';     // Non Redux
import { DesignUpdate }         from './DesignUpdate.jsx';      // Non Redux

import { DesignStatus, RoleType, ItemType} from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import {DesignVersionStatus, WorkPackageType} from "../../../constants/constants";



describe('JSX: ItemList', () => {

    function  renderDesignsList(designs){

        return designs.map((design) => {
            return (
                <ItemWrapper
                    key={design._id}
                    itemType={ItemType.DESIGN}
                    item={design}
                />
            );
        });
    }

    function renderDesignVersionsList(designVersions){

        if (designVersions) {
            return designVersions.map((designVersion) => {
                return (
                    <ItemWrapper
                        key={designVersion._id}
                        itemType={ItemType.DESIGN_VERSION}
                        item={designVersion}
                    />
                );
            });
        }

    }

    function renderDesignUpdatesList(designUpdates){

        if(designUpdates.length > 0) {
            return designUpdates.map((designUpdate) => {
                return (
                    <ItemWrapper
                        key={designUpdate._id}
                        itemType={ItemType.DESIGN_UPDATE}
                        item={designUpdate}
                    />
                );
            });
        }
    }

    function  renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <ItemWrapper
                        key={workPackage._id}
                        itemType={ItemType.WORK_PACKAGE}
                        item={workPackage}
                    />
                );
            });
        }
    }



    function testItemContainer(itemType, itemList,  headerText, hasFooterAction, footerAction){

        let bodyDataFunction = null;
        let footerActionFunction = null;

        switch(itemType){
            case ItemType.DESIGN:
                bodyDataFunction = () => renderDesignsList(itemList);
                break;
            case ItemType.DESIGN_VERSION:
                bodyDataFunction = () => renderDesignVersionsList(itemList);
                break;
            case ItemType.DESIGN_UPDATE:
                bodyDataFunction = () => renderDesignUpdatesList(itemList);
                break;
            case ItemType.WORK_PACKAGE:
                bodyDataFunction = () => renderWorkPackagesList(itemList);
                break;
        }

        return shallow(
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
                footerActionFunction={footerActionFunction}
            />
        );
    }

    // Designs ---------------------------------------------------------------------------------------------------------

    describe('A list of all Designs is visible to all users', () => {

        it('no designs in list', () => {

            const designs = [

            ];

            const item = testItemContainer(ItemType.DESIGN, designs, 'Designs', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 0, 'Expecting no Designs');
        });

        it('one design in list', () => {

            const designs = [
                {
                    _id: '1',
                    designName: 'Design1'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN, designs, 'Designs', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 1, 'Expecting 1 Design');
        });

        it('two designs in list', () => {

            const designs = [
                {
                    _id: '1',
                    designName: 'Design1'
                },
                {
                    _id: '2',
                    designName: 'Design2'
                },
            ];

            const item = testItemContainer(ItemType.DESIGN, designs, 'Designs', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 2, 'Expecting 2 Designs');
        });
    });

    // Design Versions -------------------------------------------------------------------------------------------------

    describe('A list of Design Versions is visible for the current Design', () => {

        it('one design version in list', () => {

            const designVersions = [
                {
                    _id: '1',
                    designVersionName: 'DesignVersion1'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN_VERSION, designVersions, 'Design Versions', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 1, 'Expecting 1 Design Version');
        });

        it('two design versions in list', () => {

            const designVersions = [
                {
                    _id: '1',
                    designVersionName: 'DesignVersion1'
                },
                {
                    _id: '2',
                    designVersionName: 'DesignVersion2'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN_VERSION, designVersions, 'Design Versions', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 2, 'Expecting 2 Design Versions');
        });
    });

    // Design Updates --------------------------------------------------------------------------------------------------

    describe('A list of Design Updates is visible for the current Design Version', () => {

        it('design version with two updates has two in list', () => {

            const designUpdates = [
                {
                    _id: '1',
                    updateName: 'DesignUpdate1'
                },
                {
                    _id: '2',
                    updateName: 'DesignUpdate2'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN_UPDATE, designUpdates, 'Design Updates', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 2, 'Expecting 2 Design Updates');
        });

        it('design version with three updates has three in list', () => {

            const designUpdates = [
                {
                    _id: '1',
                    updateName: 'DesignUpdate1'
                },
                {
                    _id: '2',
                    updateName: 'DesignUpdate2'
                },
                {
                    _id: '3',
                    updateName: 'DesignUpdate3'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN_UPDATE, designUpdates, 'Design Updates', false, '');

            chai.assert.equal(item.find('ItemWrapper').length, 3, 'Expecting 3 Design Updates');
        });
    });

});
