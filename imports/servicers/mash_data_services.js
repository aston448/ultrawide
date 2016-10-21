import fs from 'fs';

import {DesignComponents}       from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps} from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}          from '../collections/design/scenario_steps.js';
import {WorkPackages}           from '../collections/work/work_packages.js';
import {WorkPackageComponents}  from '../collections/work/work_package_components.js';
import {UserDevFeatures}        from '../collections/dev/user_dev_features.js';
import {DesignDevFeatureMash}   from '../collections/dev/design_dev_feature_mash.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, MashStatus, MashTestStatus, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';
import FeatureFileServices from '../servicers/feature_file_services.js'

class MashDataServices{

    createFeatureMashData(userContext){

        // Called when opening a new development work package or when data is imported / exported from / to dev

        // 1. Check for and update the latest Dev data
        // This means looking for feature files in the dev users test folder
        let featureFiles = FeatureFileServices.getFeatureFiles(userContext);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} feature files", featureFiles.length);

        let devFeatures = [{}];

        featureFiles.forEach((file) => {

            const fileText = FeatureFileServices.getFeatureFileText(userContext, file);
            const featureName = FeatureFileServices.getFeatureName(fileText.toString());

            let devFeatureData = {
                name: featureName,
                fileName: file,
                featureStatus: '',
                fileStatus: ''
            };

            log((msg) => console.log(msg), LogLevel.DEBUG, "Found feature file containing feature: {}", featureName);

            if(featureName.length > 0) {

                let designFeature = null;

                // Get the corresponding design feature (if any)
                if (userContext.designUpdateId != 'NONE') {
                    // Working from a Design Update
                    designFeature = DesignUpdateComponents.findOne(
                        {
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            componentType: ComponentType.FEATURE,
                            componentNameNew: featureName
                        }
                    );
                } else {
                    // Working from a base design
                    designFeature = DesignComponents.findOne(
                        {
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId,
                            componentType: ComponentType.FEATURE,
                            componentName: featureName
                        }
                    );
                }

                if(designFeature){
                    // The feature is in the design - is it in the current work package?
                    const wpFeature = WorkPackageComponents.findOne(
                        {
                            workPackageId: userContext.workPackageId,
                            componentType: ComponentType.FEATURE,
                            componentReferenceId: designFeature.componentReferenceId
                        }
                    );

                    if(wpFeature){
                        // This file is implemented for the WP
                        devFeatureData.featureStatus = UserDevFeatureStatus.FEATURE_IN_WP;

                    } else {
                        // The file is implemented but not relevant
                        devFeatureData.featureStatus = UserDevFeatureStatus.FEATURE_IN_DESIGN;
                    }

                } else {
                    // The file is not in the design
                    devFeatureData.featureStatus = UserDevFeatureStatus.FEATURE_UNKNOWN;
                }

                // See if we have an existing file status to preserve for this feature
                const featureFile = UserDevFeatures.findOne({featureName: featureName});

                if(featureFile){
                    devFeatureData.fileStatus = featureFile.featureFileStatus;
                } else {
                    // If we didn't clock this before assume from DEV
                    devFeatureData.fileStatus = UserDevFeatureFileStatus.FILE_FROM_DEV;
                }


            } else {
                // Invalid feature file!
                devFeatureData.fileStatus = UserDevFeatureFileStatus.FILE_INVALID;
            }

            // Add this info to the list...
            devFeatures.push(devFeatureData);

        });

        // Remove current user file data so deleted files are cleared.
        UserDevFeatures.remove({userId: userContext.userId});

        devFeatures.forEach((devFeature) => {
            UserDevFeatures.insert(
                {
                    // Identity
                    userId:                 userContext.userId,
                    featureFile:            devFeature.fileName,
                    // Data
                    featureName:            devFeature,name,
                    featureNarrative:       '',
                    // Status
                    featureFileStatus:      devFeature.fileStatus,
                    featureStatus:          devFeature.featureStatus
                }
            );
        });


        // 2. Update the Mash data for the current view

        // Add / update design mash
        let designFeatures = null;

        if(userContext.designUpdateId === 'NONE'){
            designFeatures = DesignComponents.find(
                {
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId,
                    workPackageId: userContext.workPackageId,
                    componentType: ComponentType.FEATURE
                }
            );
        } else {
            designFeatures = DesignUpdateComponents.find(
                {
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    componentType: ComponentType.FEATURE
                }
            );
        }


        designFeatures.forEach((designFeature) => {

            let featureName = '';
            if(userContext.designUpdateId === 'NONE'){
                featureName = designFeature.componentName;
            } else {
                featureName = designFeature.componentNameNew;
            }

            // See if we have a corresponding Dev feature
            const devFeature = UserDevFeatures.findOne({
                userId: userContext.userId,
                featureName: featureName
            });

            // And see if we have a Mash entry
            const mashFeature = DesignDevFeatureMash.findOne({
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                featureName: featureName,
            });

            let devFeatureId = null;
            let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

            if(devFeature){
                devFeatureId = devFeature._id;
                mashStatus = MashStatus.MASH_LINKED;
                mashTestStatus = MashTestStatus.MASH_PENDING;
            }

            if(mashFeature){
                // Update existing Mash
                DesignDevFeatureMash.update(
                    {
                        _id: mashFeature._id
                    },
                    {
                        $set:{
                            userDevFeatureId: devFeatureId,
                            featureMashStatus: mashStatus
                        }
                    }
                );
            } else {
                // Add new Mash
                DesignDevFeatureMash.insert(
                    {
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             userContext.designUpdateId,
                        workPackageId:              userContext.workPackageId,
                        userDevFeatureId:           devFeatureId,
                        designFeatureReferenceId:   designFeature.componentReferenceId,
                        // Data
                        featureName:                featureName,
                        // Status
                        featureMashStatus:          mashStatus,
                        featureTestStatus:          mashTestStatus
                    }
                )
            }
        });

        // NOTE: if a feature is not in the design we don't add it to the mash.  Assumption that only designed Features are valid

        // Also, there is no removal of Features from the mash as it is not possible to remove a feature from a WP

    };

    createScenarioMashData(userContext){

    };

    createScenarioStepMashData(userContext){

    };
}

export default new MashDataServices();
