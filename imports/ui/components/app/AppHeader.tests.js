import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { AppHeader } from './AppHeader';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: AppHeader', () => {

    function testAppHeader(mode, view, userRole, userName){

        const user = {};
        const userContext = {};
        const userViewOptions = {};
        const message = 'No message';
        const testDataFlag = 0;
        const currentViewDataValue = false;

        return shallow(
            <AppHeader
                user={user}
                mode={mode}
                view={view}
                userRole={userRole}
                userName={userName}
                userContext={userContext}
                userViewOptions={userViewOptions}
                message={message}
                testDataFlag={testDataFlag}
                currentViewDataValue={currentViewDataValue}
            />
        );
    }

    // Design Version Editor -------------------------------------------------------------------------------------------




    // Design Update Editor --------------------------------------------------------------------------------------------







});
