
// Ultrawide Collections
import { DesignBackups }            from '../../collections/backup/design_backups.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, WorkPackageStatus, WorkPackageType, LogLevel } from '../../constants/constants.js';

import DesignComponentServices      from '../../servicers/design/design_component_services.js';
import WorkPackageModules           from '../../service_modules/work/work_package_service_modules.js';

//======================================================================================================================
//
// Server Modules for Import Export.
//
// Methods called from within main API methods
//
//======================================================================================================================

class ImpexModules{

    markAllBackupsAsUnconfirmed(){

        // Set all to no existing - we are about to confirm if files do actually exist
        DesignBackups.update({}, {$set: {fileExists: false}}, {multi: true});
    }

    addConfirmBackupFile(fileName){

        const existingFile = DesignBackups.findOne({backupFileName: fileName});

        if(existingFile){

            // Confirm as existing
            DesignBackups.update(
                {_id: existingFile._id},
                {
                    $set:{
                        fileExists: true
                    }
                }
            );

        } else {

            // A new file we don't know about

            const designName = this.getDesignFromFile(fileName);
        }
    }

    getDesignFromFile(fileName){

        // Format is ULTRAWIDE_<Design name>_DATE.UBK
        // Design Names are not allowed to start or end with _

        // The design name is everything between the first and last _

        let components = fileName.split('_');

        if(components.length < 3){
            // Invalid name
            return 'Invalid';
        } else {
            if(components.length === 3){
                // Easy name
                return components[1];
            } else {
                // Name must have underscores in it
                let index = 0;
                let name = '';
                components.forEach((component) => {
                    console.log("COMPONENT [" + index + "] = " + component);
                    if(index === 0 || index === components.length -1){
                        // Ignore
                    } else {
                        name += component;
                        if(index < components.length -2){
                            // Must be _s in the design name so restore them
                            name += '_';
                        }
                    }
                    index++
                });

                return name;
            }
        }
    }
}

export default new ImpexModules();

