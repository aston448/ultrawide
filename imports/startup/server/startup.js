
import { Meteor } from 'meteor/meteor';

import {StartupServices}    from "../../servicers/administration/startup_services.js";


Meteor.startup(() => {

    if(Meteor.isServer){
        StartupServices.onApplicationStart();

        StartupServices.repairComponentHierarchyIndices();
    }
});


