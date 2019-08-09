import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignPermutation } from '../DesignPermutation' // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'

import {
    RoleType,
    TestLocationFileStatus,
    TestLocationFileType,
    TestRunner,
    UserSettingValue
} from "../../../../constants/constants";

describe('JSX: DesignPermutation', () => {

    function testDesignPermutation(designPermutation, userRole, userContext, currentPermId){

        return shallow(
            <DesignPermutation
                permutation={designPermutation}
                userRole={userRole}
                userContext={userContext}
                currentPermutationId={currentPermId}
            />
        );
    }


});