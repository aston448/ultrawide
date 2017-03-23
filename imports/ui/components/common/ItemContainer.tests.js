import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import ItemContainer            from '../../components/common/ItemContainer.jsx'
import { Design }               from '../../components/select/Design.jsx';          // Non Redux
import { DesignVersion }        from '../../components/select/DesignVersion.jsx';   // Non Redux

import { DesignStatus, RoleType, ItemType} from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'



describe('JSX: ItemContainer', () => {

    function  renderDesignList(designs){
        return designs.map((design) => {
            return (
                <Design
                    key={design._id}
                    design={design}
                />
            );
        });
    }

    function renderDesignVersionsList(designVersions){
        return designVersions.map((designVersion) => {
            return (
                <DesignVersion
                    key={designVersion._id}
                    designVersion={designVersion}
                />
            );
        });

    }

    function testItemContainer(itemType, itemlist,  headerText, hasFooterAction, footerAction){

        let bodyDataFunction = () => renderDesignList(designs);
        let footerActionFunction = null;

        switch(itemType){
            case ItemType.DESIGN:
                bodyDataFunction = () => renderDesignList(itemlist);
                break;
            case ItemType.DESIGN_VERSION:
                bodyDataFunction = () => renderDesignVersionsList(itemlist);
                break;
        }

        return shallow(
            <ItemContainer
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

            chai.assert.equal(item.find('Design').length, 0, 'Expecting no Designs');
        });

        it('one design in list', () => {

            const designs = [
                {
                    _id: '1',
                    designName: 'Design1'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN, designs, 'Designs', false, '');

            chai.assert.equal(item.find('Design').length, 1, 'Expecting 1 Design');
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

            chai.assert.equal(item.find('Design').length, 2, 'Expecting 2 Designs');
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

            chai.assert.equal(item.find('DesignVersion').length, 1, 'Expecting 1 Design Version');
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

            chai.assert.equal(item.find('DesignVersion').length, 2, 'Expecting 2 Design Versions');
        });
    });

});
