import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdatesList } from './DesignUpdatesContainer.jsx';  // Non container wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'
import {ItemType, WorkPackageType} from "../../../constants/constants";
import PropTypes from "prop-types";



describe('JSX: WorkPackagesList', () => {


    function testWorkPackagesContainer(){

    }


    // Work Packages
    describe('The Work Package list for an Initial Design Version has an option to add a new Work Package', () => {

        it('has an add option for a manager in New WPs list');

    });
});