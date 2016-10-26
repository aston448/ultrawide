/**
 * Created by aston on 03/07/2016.
 */

import { Meteor } from 'meteor/meteor';

import { Designs } from '../../collections/design/designs.js';
import { DesignVersions } from '../../collections/design/design_versions.js';
import { DesignUpdates } from '../../collections/design_update/design_updates.js';
import { UserRoles } from '../../collections/users/user_roles.js';
import { UserCurrentEditContext } from '../../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext } from '../../collections/context/user_current_dev_context.js';

import { DesignVersionStatus, ItemType } from '../../constants/constants.js';
import DataCreate from '../server/data_create.js';
import ImpExServices from '../../servicers/import_export.js'

// Set up some dummy data
Meteor.startup(() => {
    if(Meteor.isServer){
        Meteor.call('fixtures.startup');
    }
});


