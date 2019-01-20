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

    // DESIGNS ---------------------------------------------------------------------------------------------------------

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