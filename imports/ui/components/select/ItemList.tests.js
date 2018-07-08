import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ItemList }             from './ItemList.jsx'           // Non Redux
import { UltrawideItem }        from './UltrawideItem';       // Non Redux
import { UserDetails }          from "../admin/UserDetails";
import {TestOutputLocation}     from "../configure/TestOutputLocation";
import {TestOutputFile}         from "../configure/TestOutputFile";

import { ItemType} from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import {AddActionIds} from "../../../constants/ui_context_ids";
import {hashID} from "../../../common/utils";





describe('JSX: ItemList', () => {

    function  renderDesignsList(designs){

        return designs.map((design) => {
            return (
                <UltrawideItem
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
                    <UltrawideItem
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
                    <UltrawideItem
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
                    <UltrawideItem
                        key={workPackage._id}
                        itemType={ItemType.WORK_PACKAGE}
                        item={workPackage}
                    />
                );
            });
        }
    }

    function renderUserList(users){
        if(users.length > 0) {
            return users.map((user) => {
                return (
                    <UserDetails
                        key={user._id}
                        user={user}
                    />
                );
            });
        }
    }

    function renderLocationList(locations){
        if(locations.length > 0) {
            return locations.map((location) => {
                return (
                    <TestOutputLocation
                        key={location._id}
                        location={location}
                    />
                );
            });
        }
    }

    function renderLocationFileList(locationFiles){
        if(locationFiles.length > 0) {
            return locationFiles.map((file) => {
                return (
                    <TestOutputFile
                        key={file._id}
                        file={file}
                    />
                );
            });
        }
    }

    function addUserFunction(){

        return true;
    }

    function addLocationFunction(){

        return true;
    }

    function addLocationFileFunction(){

        return true;
    }


    function testItemContainer(itemType, itemList, headerText, hasFooterAction, footerAction, footerActionFunction, footerActionUiContext){

        let bodyDataFunction = null;

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
            case ItemType.USER:
                bodyDataFunction = () => renderUserList(itemList);
                break;
            case ItemType.TEST_LOCATION:
                bodyDataFunction = () => renderLocationList(itemList);
                break;
            case ItemType.TEST_LOCATION_FILE:
                bodyDataFunction = () => renderLocationFileList(itemList);
                break;

        }

        return shallow(
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={footerAction}
                footerActionUiContext={footerActionUiContext}
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

            chai.assert.equal(item.find('UltrawideItem').length, 0, 'Expecting no Designs');
        });

        it('one design in list', () => {

            const designs = [
                {
                    _id: '1',
                    designName: 'Design1'
                }
            ];

            const item = testItemContainer(ItemType.DESIGN, designs, 'Designs', false, '');

            chai.assert.equal(item.find('UltrawideItem').length, 1, 'Expecting 1 Design');
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

            chai.assert.equal(item.find('UltrawideItem').length, 2, 'Expecting 2 Designs');
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

            chai.assert.equal(item.find('UltrawideItem').length, 1, 'Expecting 1 Design Version');
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

            chai.assert.equal(item.find('UltrawideItem').length, 2, 'Expecting 2 Design Versions');
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

            chai.assert.equal(item.find('UltrawideItem').length, 2, 'Expecting 2 Design Updates');
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

            chai.assert.equal(item.find('UltrawideItem').length, 3, 'Expecting 3 Design Updates');
        });
    });

    // Users -----------------------------------------------------------------------------------------------------------

    describe('The user list has an option to add a new Ultrawide user', () => {

        it('has the option when footer function provided', () => {

            const users = [
                {
                    _id: '1',
                    userName:   'user1'
                }
            ];

            const item = testItemContainer(ItemType.USER, users, 'Users', true, 'Add User', addUserFunction, AddActionIds.UI_CONTEXT_ADD_USER);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_USER, '')).length, 1, 'Add user not found');
        });

        it('has no option when footer function not provided', () => {

            const users = [
                {
                    _id: '1',
                    userName:   'user1'
                }
            ];

            const item = testItemContainer(ItemType.USER, users, 'Users', false, '', null, AddActionIds.UI_CONTEXT_ADD_USER);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_USER, '')).length, 0, 'Add user was found');
        });
    });


    // Test Output Locations -------------------------------------------------------------------------------------------

    describe('The Test Output Locations list has an option to add a new item', () => {

        it('has the option when footer function provided', () => {

            const locations = [
                {
                    _id:            'LOCATION_1',
                    locationName:   'LOCATION1'
                }
            ];

            const item = testItemContainer(ItemType.TEST_LOCATION, locations, 'Locations', true, 'Add Test Location', addLocationFunction, AddActionIds.UI_CONTEXT_ADD_TEST_LOCATION);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_TEST_LOCATION)).length, 1, 'Add test location not found');
        });

        it('has no option when footer function not provided', () => {

            const locations = [
                {
                    _id:            'LOCATION_1',
                    locationName:   'LOCATION1'
                }
            ];

            const item = testItemContainer(ItemType.TEST_LOCATION, locations, 'Locations', false, '', null, AddActionIds.UI_CONTEXT_ADD_TEST_LOCATION);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_TEST_LOCATION, '')).length, 0, 'Add test location was found');
        });
    });

    // Test Output Location Files --------------------------------------------------------------------------------------

    describe('The Test Output File list for a Test Output Location has an option to add a new file', () => {

        it('has the option when footer function provided', () => {

            const files = [
                {
                    _id:            'FILE_1',
                    fileAlias:      'File1'
                }
            ];

            const item = testItemContainer(ItemType.TEST_LOCATION_FILE, files, 'Files', true, 'Add Test Location File', addLocationFileFunction, AddActionIds.UI_CONTEXT_ADD_TEST_FILE);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_TEST_FILE)).length, 1, 'Add test location file not found');
        });

        it('has no option when footer function not provided', () => {

            const files = [
                {
                    _id:            'FILE_1',
                    fileAlias:      'File1'
                }
            ];

            const item = testItemContainer(ItemType.TEST_LOCATION_FILE, files, 'Files', false, '', null, AddActionIds.UI_CONTEXT_ADD_TEST_FILE);

            chai.assert.equal(item.find(hashID(AddActionIds.UI_CONTEXT_ADD_TEST_FILE, '')).length, 0, 'Add test location file was found');
        });
    });

});
