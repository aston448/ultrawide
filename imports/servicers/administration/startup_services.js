
// Ultrawide Collections
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
}

export default new StartupServices()