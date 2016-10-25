import fs from 'fs';

import {DesignComponents}       from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps} from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}          from '../collections/design/scenario_steps.js';
import {WorkPackages}           from '../collections/work/work_packages.js';
import {WorkPackageComponents}  from '../collections/work/work_package_components.js';
import {UserDevFeatures}        from '../collections/dev/user_dev_features.js';
import {UserDevFeatureScenarios}from '../collections/dev/user_dev_feature_scenarios.js';
import {DesignDevFeatureMash}   from '../collections/dev/design_dev_feature_mash.js';
import {DesignDevScenarioMash}   from '../collections/dev/design_dev_scenario_mash.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus, UserDevScenarioStepStatus, MashStatus, MashTestStatus, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';
import FeatureFileServices from '../servicers/feature_file_services.js'

class MashDataServices{

    loadUserFeatureFileData(userContext){

        // Remove current user file data so deleted files are cleared.
        UserDevFeatures.remove({userId: userContext.userId});
        UserDevFeatureScenarios.remove({userId: userContext.userId});

        // This means looking for feature files in the dev users test folder
        let featureFiles = FeatureFileServices.getFeatureFiles(userContext);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} feature files", featureFiles.length);

        let devFeatures = [];

        let featureRefId = null;

        // Load up data for any feature file found but highlighting those in the current WP scope
        featureFiles.forEach((file) => {

            const fileText = FeatureFileServices.getFeatureFileText(userContext, file);
            const featureName = FeatureFileServices.getFeatureName(fileText.toString());

            // Initial default feature file data
            let devFeatureData = {
                userId:                 userContext.userId,
                featureFile:            file,
                // Data
                featureName:            featureName,
                featureNarrative:       '',
                // Status
                featureFileStatus:      UserDevFeatureFileStatus.FILE_VALID,
                featureStatus:          UserDevFeatureStatus.FEATURE_UNKNOWN,
            };

            let devFeatureId = null;

            log((msg) => console.log(msg), LogLevel.DEBUG, "Found feature {} file containing feature: {}", file, featureName);

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
                    featureRefId = designFeature.componentReferenceId;

                    // The feature is in the design - is it in the current work package?
                    const wpFeature = WorkPackageComponents.findOne(
                        {
                            workPackageId: userContext.workPackageId,
                            componentType: ComponentType.FEATURE,
                            componentActive: true,
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

            } else {
                // Invalid feature file!
                devFeatureData.fileStatus = UserDevFeatureFileStatus.FILE_INVALID;
            }

            // Add the feature to the list
            devFeatureId = UserDevFeatures.insert(
                {
                    // Identity
                    userId:                 devFeatureData.userId,
                    featureFile:            devFeatureData.featureFile,
                    // Data
                    featureName:            devFeatureData.featureName,
                    featureNarrative:       '',
                    // Status
                    featureFileStatus:      devFeatureData.featureFileStatus,
                    featureStatus:          devFeatureData.featureStatus
                }
            );

            // Get Scenario Data ---------------------------------------------------------------------------------------

            // Scenarios in this feature file
            const featureScenarios = FeatureFileServices.getFeatureScenarios(fileText.toString());

            log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} scenarios", featureScenarios.length);

            let devScenarioId = null;

            featureScenarios.forEach((devScenario) => {

                // Initial default data
                let devScenarioData = {
                    userId:                 userContext.userId,
                    userDevFeatureId:       devFeatureId,
                    text:                   devScenario,
                    featureReferenceId:     'NONE',
                    scenarioReferenceId:    'NONE',
                    scenarioStatus:         UserDevScenarioStatus.SCENARIO_UNKNOWN
                };

                // See if this scenario is in the design
                let designScenario = null;

                if (userContext.designUpdateId === 'NONE') {
                    // Working from a base design
                    designScenario = DesignComponents.findOne(
                        {
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId,
                            componentType: ComponentType.SCENARIO,
                            componentName: devScenario
                        }
                    );
                } else {
                    // Working from a Design Update
                    designScenario = DesignUpdateComponents.findOne(
                        {
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            componentType: ComponentType.SCENARIO,
                            componentNameNew: devScenario
                        }
                    );
                }

                if(designScenario){
                    if (userContext.designUpdateId === 'NONE') {
                        devScenarioData.featureReferenceId = designScenario.componentFeatureReferenceId;
                    } else {
                        devScenarioData.featureReferenceId = designScenario.componentFeatureReferenceIdNew;
                    }

                    devScenarioData.scenarioReferenceId = designScenario.componentReferenceId;

                    // The scenario is in the design - is it in the current work package?
                    const wpScenario = WorkPackageComponents.findOne(
                        {
                            workPackageId: userContext.workPackageId,
                            componentType: ComponentType.SCENARIO,
                            componentActive: true,
                            componentReferenceId: designScenario.componentReferenceId
                        }
                    );

                    if(wpScenario){
                        // This scenario is implemented for the WP
                        devScenarioData.scenarioStatus = UserDevScenarioStatus.SCENARIO_IN_WP;

                    } else {
                        // The scenario is implemented but not relevant to the WP
                        devScenarioData.scenarioStatus = UserDevScenarioStatus.SCENARIO_IN_DESIGN;
                    }

                } else {
                    // The scenario is not in the design
                    devScenarioData.scenarioStatus = UserDevScenarioStatus.SCENARIO_UNKNOWN;

                    // However, if it is related to a feature that IS then it can appear as
                    // a new Scenario for that feature
                    if(featureRefId){
                        devScenarioData.featureReferenceId = featureRefId;
                    }
                }

                devScenarioId = UserDevFeatureScenarios.insert(
                    {
                        // Identity
                        userId:                 devScenarioData.userId,
                        userDevFeatureId:       devScenarioData.userDevFeatureId,
                        featureReferenceId:     devScenarioData.featureReferenceId,
                        scenarioReferenceId:    devScenarioData.scenarioReferenceId,
                        // Data
                        scenarioName:           devScenario,
                        // Status
                        scenarioStatus:         devScenarioData.scenarioStatus
                    }
                )

            });

        });

    }

    createFeatureMashData(userContext){

        // Called when opening a new development work package or when data is imported / exported from / to dev

        // Get list of all features in current WP
        let designWpFeatures = WorkPackageComponents.find(
            {
                workPackageId: userContext.workPackageId,
                componentType: ComponentType.FEATURE,
                componentActive: true
            }
        );

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} design features in current WP", designWpFeatures.count());

        // Remove existing WP Mash
        DesignDevFeatureMash.remove({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            workPackageId:              userContext.workPackageId,
        });

        designWpFeatures.forEach((designWpFeature) => {

            let featureName = '';

            if(userContext.designUpdateId === 'NONE'){
                featureName = DesignComponents.findOne({_id: designWpFeature.componentId}).componentName;
            } else {
                featureName = DesignUpdateComponents.findOne({_id: designWpFeature.componentId}).componentNameNew;
            }

            // See if we have a corresponding Dev feature
            const devFeature = UserDevFeatures.findOne({
                userId: userContext.userId,
                featureName: featureName
            });

            let devFeatureId = null;
            let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

            if(devFeature){
                devFeatureId = devFeature._id;
                mashStatus = MashStatus.MASH_LINKED;
                mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
            }

            // Add new Mash
            DesignDevFeatureMash.insert(
                {
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    designUpdateId:             userContext.designUpdateId,
                    workPackageId:              userContext.workPackageId,
                    userDevFeatureId:           devFeatureId,
                    designFeatureReferenceId:   designWpFeature.componentReferenceId,
                    // Data
                    featureName:                featureName,
                    // Status
                    featureMashStatus:          mashStatus,
                    featureTestStatus:          mashTestStatus
                }
            );

        });

        // NOTE: if a feature is not in the design we don't add it to the mash.  Assumption that only designed Features are valid

        // Also, there is no removal of Features from the mash as it is not possible to remove a feature from a WP

    };

    createScenarioMashData(userContext){

        //Get list of all Features in current WP
        let designWpFeatures = WorkPackageComponents.find(
            {
                workPackageId: userContext.workPackageId,
                componentType: ComponentType.FEATURE,
                componentActive: true
            }
        );

        // And a list of scenarios
        let designWpScenarios = WorkPackageComponents.find(
            {
                workPackageId: userContext.workPackageId,
                componentType: ComponentType.SCENARIO,
                componentActive: true
            }
        );

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} design scenarios in current WP", designWpScenarios.count());

        // Remove existing WP Mash
        DesignDevScenarioMash.remove({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            workPackageId:              userContext.workPackageId,
        });

        // Insert any Scenarios that are either in the current WP or in DEV in a feature that is in the WP

        // Scenarios in current WP
        designWpScenarios.forEach((designWpScenario) => {

            let scenarioName = '';
            if(userContext.designUpdateId === 'NONE'){
                scenarioName = DesignComponents.findOne({_id: designWpScenario.componentId}).componentName;
            } else {
                scenarioName = DesignUpdateComponents.findOne({_id: designWpScenario.componentId}).componentNameNew;
            }

            // See if we have a corresponding Dev Scenario
            const devScenario = UserDevFeatureScenarios.findOne({
                userId: userContext.userId,
                scenarioName: scenarioName
            });

            let devScenarioId = null;
            let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

            if(devScenario){
                devScenarioId = devScenario._id;
                mashStatus = MashStatus.MASH_LINKED;
                mashTestStatus = MashTestStatus.MASH_PENDING;
            }

            // Add new Mash
            DesignDevScenarioMash.insert(
                {
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    designUpdateId:             userContext.designUpdateId,
                    workPackageId:              userContext.workPackageId,
                    userDevScenarioId:          devScenarioId,
                    designFeatureReferenceId:   designWpScenario.componentFeatureReferenceId,
                    // Data
                    scenarioName:               scenarioName,
                    // Status
                    scenarioMashStatus:         mashStatus,
                    scenarioTestStatus:         mashTestStatus
                }
            );

        });

        // Extra Dev Scenarios NOT in Design but in Features in Design
        designWpFeatures.forEach((wpFeature) => {

            let devOnlyScenarios = UserDevFeatureScenarios.find({
                userId:             userContext.userId,
                featureReferenceId: wpFeature.componentReferenceId,
                scenarioStatus:     UserDevScenarioStatus.SCENARIO_UNKNOWN
            }).fetch();

            devOnlyScenarios.forEach((scenario) => {
                // Add new Mash
                DesignDevScenarioMash.insert(
                    {
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             userContext.designUpdateId,
                        workPackageId:              userContext.workPackageId,
                        userDevScenarioId:          scenario._id,
                        designFeatureReferenceId:   wpFeature.componentReferenceId,
                        // Data
                        scenarioName:               scenario.scenarioName,
                        // Status
                        scenarioMashStatus:         MashStatus.MASH_NOT_DESIGNED,
                        scenarioTestStatus:         MashTestStatus.MASH_NOT_LINKED
                    }
                );
            });
        });


    };

    createScenarioStepMashData(userContext){

    };
}

export default new MashDataServices();
