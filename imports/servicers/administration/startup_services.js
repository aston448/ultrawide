
// Ultrawide Services
import { UltrawideDirectory, LogLevel } from '../../constants/constants.js';
import {log} from "../../common/utils";

import { ImpExServices }                    from '../../servicers/administration/impex_services.js';
import { StartupModules }                   from '../../service_modules/administration/startup_service_modules.js';
import {DesignComponentServices}            from "../design/design_component_services";

// Data Access
import { UserRoleData }                     from '../../data/users/user_role_db.js';
import {DesignData}                         from "../../data/design/design_db";
import {DesignComponentData}                from "../../data/design/design_component_db";



//======================================================================================================================
//
// Server Code for Import / Export.
//
// Methods called directly by Server API
//
//======================================================================================================================

class StartupServicesClass{

    onApplicationStart(){

        if(Meteor.isServer){

            // Determine if this is a brand new instance (new prod or dev reset)
            // This is done by seeing if the Admin user exists

            const adminUser = UserRoleData.getRoleByUserName('admin');

            if(!adminUser){
                console.log("NEW ULTRAWIDE INSTANCE");

                // Create the Admin user so that work can be started
                console.log("Creating admin user...");

                ImpExServices.createAdminUser();
            }

            // Also make sure the global App data exists and is up to date for the current release
            const dataStore = StartupModules.setUltrawideVersionData();

            // We now have the base ultrawide data directory so check that the key sub-dirs exist
            StartupModules.checkCreateDataDirs(dataStore);

            // Now check that all the backup files for this instance are represented
            const backupLocation = dataStore + UltrawideDirectory.BACKUP_DIR;

            // Get and populate backup file data.  This will allow new files to be picked up and removed ones to disappear
            ImpExServices.checkAndPopulateBackupFileData(backupLocation);

        }
    }

    repairComponentHierarchyIndices(){

        if(Meteor.isServer) {

            const designs = DesignData.getAllDesigns();

            designs.forEach((design) => {

                const dvs = DesignData.getDesignVersions(design._id);

                dvs.forEach((dv) => {

                    const missingScenarios = DesignComponentData.getScenariosWithNoHierarchy(dv._id);

                    if (missingScenarios.length > 0) {

                        DesignComponentServices.populateHierarchyIndexData(dv._id)
                    }
                });
            });
        }
    }
}

export const StartupServices = new StartupServicesClass();