
// Ultrawide Collections
import { AppGlobalData }                from '../../collections/app/app_global_data.js';
import { UserRoles }                    from '../../collections/users/user_roles.js';

// Ultrawide Services
import ImpexServices                    from '../../servicers/administration/impex_services.js';

//======================================================================================================================
//
// Server Code for Import / Export.
//
// Methods called directly by Server API
//
//======================================================================================================================

class StartupServices{

    onApplicationStart(){

        if(Meteor.isServer){

            // Determine if this is a brand new instance (new prod or dev reset)
            // This is done by seeing if the Admin user exists

            const adminUser = UserRoles.findOne({
                userName: 'admin'
            });

            if(!adminUser){

                // Create the Admin user so that work can be started
                ImpexServices.createAdminUser();
            }

            // Also make sure the global App data exists and is up to date for the current release
            this.setUltrawideVersionData();

            // Now check that all the backup files for this instance are represented
            const backupLocation = process.env.ULTRAWIDE_BACKUP_PATH;

            if (typeof(backupLocation) !== 'undefined') {

                // Get and populate backup file data.  This will allow new files to be picked up and removed ones to disappear
                ImpexServices.checkAndPopulateBackupFileData(backupLocation);

            } else {
                console.log("CANNOT START ULTRAWIDE: Environment variable ULTRAWIDE_BACKUP_PATH must be set to a locatcion accessible by this instance");
            }
        }
    }

    setUltrawideVersionData(){

        const appData = AppGlobalData.findOne({
            versionKey: 'CURRENT_VERSION'
        });

        // MODIFY THIS CODE FOR EACH NEW RELEASE
        const appVersion = 1;                   // Version of Ultrawide
        const dataVersion = 1;                  // DB Version of Ultrawide
        const versionDate = '2017-05-04';       // Date this version introduced

        if(!appData){

            AppGlobalData.insert({
                versionKey:         'CURRENT_VERSION',
                appVersion:         appVersion,
                dataVersion:        dataVersion,
                versionDate:        versionDate
            });

        } else {

            AppGlobalData.update(
                {versionKey: 'CURRENT_VERSION'},
                {
                    $set:{
                        appVersion:         appVersion,
                        dataVersion:        dataVersion,
                        versionDate:        versionDate
                    }
                }
            )
        }
    }
}

export default new StartupServices()