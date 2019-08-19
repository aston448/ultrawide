import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ConfigurationSettings } from '../ConfigurationSettings.jsx' // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'
import {RoleType, UserSettingValue} from "../../../../constants/constants";




describe('JSX: ConfigSettings', () => {

    function testConfigSettings(userContext, userSettings, userRole){

        return shallow(
            <ConfigurationSettings
                userContext={userContext}
                currentWindowSize={userSettings.currentWindowSize}
                includeNarratives={userSettings.includeNarratives}
                intTestOutputDir={userSettings.intTestOutputDir}
                includeSectionDetails={userSettings.includeSectionDetails}
                includeFeatureDetails={userSettings.includeFeatureDetails}
                includeNarrativeDetails={userSettings.includeNarrativeDetails}
                includeScenarioDetails={userSettings.includeScenarioDetails}
                userRole={userRole}
            />
        );
    }

    const defaultUserContext = {
        designId:           'DESIGN_1',
        designVersionId:    'DESIGN_VERSION_1',
    };

    const defaultUserSettings = {
        currentWindowSize:          UserSettingValue.SCREEN_SIZE_LARGE,
        includeNarratives:          UserSettingValue.SETTING_INCLUDE,
        intTestOutputDir:           '',
        includeSectionDetails:      UserSettingValue.SETTING_INCLUDE,
        includeFeatureDetails:      UserSettingValue.SETTING_INCLUDE,
        includeNarrativeDetails:    UserSettingValue.SETTING_INCLUDE,
        includeScenarioDetails:     UserSettingValue.SETTING_INCLUDE
    };

    describe('UC 846', function(){

        describe('Interface', function(){

            describe('There is a list of Design Permutations that are defined for the current Design', function(){

                it('User Role - Designer', function(){

                    const userRole = RoleType.DESIGNER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PERMUTATIONS_TAB, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

                it('User Role - Developer', function(){

                    const userRole = RoleType.DEVELOPER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PERMUTATIONS_TAB, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

                it('User Role - Manager', function(){

                    const userRole = RoleType.MANAGER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PERMUTATIONS_TAB, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

            });

            it('The Design Permutations list is not visible for a Guest Viewer', function(){

                const userRole = RoleType.GUEST_VIEWER;

                const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                const expectedItem = hashID(UI.CONFIG_PERMUTATIONS_TAB, '');

                chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' found');
            });
        });
    });

    describe('UC884', () => {

        describe('Interface', () => {

            describe('The general configuration screen has an option to change the current user password', () => {

                it('has change password pane for designer', () => {

                    const userRole = RoleType.DESIGNER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PASSWORD, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

                it('has change password pane for developer', () => {

                    const userRole = RoleType.DEVELOPER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PASSWORD, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

                it('has change password pane for manager', () => {

                    const userRole = RoleType.MANAGER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PASSWORD, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });

                it('has change password pane for guest', () => {

                    const userRole = RoleType.GUEST_VIEWER;

                    const item = testConfigSettings(defaultUserContext, defaultUserSettings, userRole);

                    const expectedItem = hashID(UI.CONFIG_PASSWORD, '');

                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });
            });
        });
    });


});