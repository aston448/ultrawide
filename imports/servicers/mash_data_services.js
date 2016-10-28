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
import {UserDesignDevMashData}   from '../collections/dev/user_design_dev_mash_data.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus, UserDevScenarioStepStatus, MashStatus, MashTestStatus, DevTestTag, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';
import FeatureFileServices from '../servicers/feature_file_services.js'

class MashDataServices{

    loadUserFeatureFileData(userContext, filePath){

        // Remove current user file data so deleted files are cleared.
        UserDevFeatures.remove({userId: userContext.userId});
        UserDevFeatureScenarios.remove({userId: userContext.userId});

        // This means looking for feature files in the dev users test folder
        let featureFiles = FeatureFileServices.getFeatureFiles(filePath);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} feature files", featureFiles.length);

        let devFeatures = [];

        let featureRefId = null;

        // Load up data for any feature file found but highlighting those in the current WP scope
        featureFiles.forEach((file) => {

            const fileText = FeatureFileServices.getFeatureFileText(filePath, file);
            const feature = FeatureFileServices.getFeatureName(fileText.toString());
            const featureName = feature.feature;
            const tag = feature.tag;

            // Initial default feature file data
            let devFeatureData = {
                userId:                 userContext.userId,
                featureFile:            file,
                // Data
                featureName:            featureName,
                featureNarrative:       '',
                featureTag:             tag,
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
                    scenarioName:           devScenario.scenario,
                    scenarioTag:            devScenario.tag,
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
                            componentName: devScenario.scenario
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
                            componentNameNew: devScenario.scenario
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
                        scenarioName:           devScenarioData.scenarioName,
                        scenarioTag:            devScenarioData.scenarioTag,
                        // Status
                        scenarioStatus:         devScenarioData.scenarioStatus
                    }
                );

                // TODO - Get Scenario Step Data -----------------------------------------------------------------------


            });

        });

    };

    createDesignDevMashData(userContext){

        // Data created depends on context...

        if(userContext.workPackageId != 'NONE'){
            // A work package is being used so create data related to that
            this.createWpDevMashData(userContext);
        } else {
            // Otherwise we will be creating data for the whole design version or update for a view of progress
            if(userContext.designUpdate != 'NONE'){
                this.createDesignUpdateDevMashData(userContext);
            } else {
                this.createDesignVersionDevMashData(userContext);
            }
        }
    };

    createWpDevMashData(userContext){

        // Remove existing WP Mash
        UserDesignDevMashData.remove({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            workPackageId:              userContext.workPackageId,
        });

        // Get list of all mashable elements in current WP: Features, Feature Aspects, Scenarios
        let designWpItems = WorkPackageComponents.find(
            {
                workPackageId: userContext.workPackageId,
                componentType: {$in: [ComponentType.FEATURE, ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]},
                $or:[{componentActive: true}, {componentParent: true}]
            }
        );

        designWpItems.forEach((item) => {

            let designItem = null;
            let designItemParent = null;
            let designItemIndex = 0;

            if(userContext.designUpdateId === 'NONE'){
                designItem = DesignComponents.findOne({_id: item.componentId});
                designItemParent = DesignComponents.findOne({_id: designItem.componentParentId});
                designItemIndex = designItem.componentIndex;
            } else {
                designItem = DesignUpdateComponents.findOne({_id: item.componentId}).componentNameNew;
                designItemParent = DesignUpdateComponents.findOne({_id: designItem.componentParentIdNew});
                designItemIndex = designItem.componentIndexNew;
            }

            let itemName = designItem.componentName;

            let devFeature = null;
            let devFeatureId = 'NONE';
            let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let tag = DevTestTag.TEST_TEST; // Default testing tag to Test

            switch(item.componentType){
                case ComponentType.FEATURE:
                    // See if we have a corresponding Dev item
                    devFeature = UserDevFeatures.findOne({
                        userId: userContext.userId,
                        featureName: itemName
                    });


                    if(devFeature){
                        devFeatureId = devFeature._id;
                        mashStatus = MashStatus.MASH_LINKED;
                        mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
                        tag = devFeature.featureTag;
                    }

                    // Add new Mash
                    UserDesignDevMashData.insert(
                        {
                            // Identity
                            userId:                         userContext.userId,
                            designVersionId:                userContext.designVersionId,
                            designUpdateId:                 userContext.designUpdateId,
                            workPackageId:                  userContext.workPackageId,
                            designComponentId:              item.componentId,
                            mashComponentType:              ComponentType.FEATURE,
                            designComponentReferenceId:     designItem.componentReferenceId,
                            designFeatureReferenceId:       item.componentReferenceId,
                            mashItemIndex:                  designItemIndex,
                            // Links
                            devFeatureId:                   devFeatureId,
                            // Data
                            mashItemName:                   itemName,
                            mashItemTag:                    tag,
                            // Status
                            mashStatus:                     mashStatus,
                            mashTestStatus:                 mashTestStatus
                        }
                    );

                    // For each WP Feature, check also for scenarios in this feature in Dev but NOT in Design
                    let devOnlyScenarios = UserDevFeatureScenarios.find({
                        userId:             userContext.userId,
                        featureReferenceId: item.componentReferenceId,
                        scenarioStatus:     UserDevScenarioStatus.SCENARIO_UNKNOWN
                    }).fetch();

                    devOnlyScenarios.forEach((scenario) => {
                        // Add new Mash
                        UserDesignDevMashData.insert(
                            {
                                // Identity
                                userId:                         userContext.userId,
                                designVersionId:                userContext.designVersionId,
                                designUpdateId:                 userContext.designUpdateId,
                                workPackageId:                  userContext.workPackageId,
                                designComponentId:              item.componentId,
                                mashComponentType:              ComponentType.SCENARIO,
                                designFeatureReferenceId:       item.componentReferenceId,
                                // Links
                                devFeatureId:                   devFeatureId,
                                devScenarioId:                  scenario._id,
                                // Data
                                mashItemName:                   scenario.scenarioName,
                                mashItemTag:                    scenario.scenarioTag,
                                // Status
                                mashStatus:                     MashStatus.MASH_NOT_DESIGNED,
                                mashTestStatus:                 MashTestStatus.MASH_NOT_LINKED
                            }
                        );
                    });
                    break;

                case ComponentType.FEATURE_ASPECT:
                    // There is no direct equivalent dev data - this is for organisation on the design side

                    // However, link to the dev Feature for which this is an Aspect
                    let parentFeatureName = '';
                    const wpFeatureItem = WorkPackageComponents.findOne({
                        workPackageId: userContext.workPackageId,
                        componentReferenceId: item.componentFeatureReferenceId
                    });

                    if(userContext.designUpdateId === 'NONE'){
                        parentFeatureName = DesignComponents.findOne({_id: wpFeatureItem.componentId}).componentName;
                    } else {
                        parentFeatureName = DesignUpdateComponents.findOne({_id: wpFeatureItem.componentId}).componentNameNew;
                    }

                    devFeature = UserDevFeatures.findOne({
                        userId: userContext.userId,
                        featureName: parentFeatureName
                    });

                    if(devFeature){
                        devFeatureId = devFeature._id;
                        mashStatus = MashStatus.MASH_LINKED;
                        mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
                        tag = devFeature.featureTag;
                    }

                    // Add new Mash
                    UserDesignDevMashData.insert(
                        {
                            // Identity
                            userId:                         userContext.userId,
                            designVersionId:                userContext.designVersionId,
                            designUpdateId:                 userContext.designUpdateId,
                            workPackageId:                  userContext.workPackageId,
                            designComponentId:              item.componentId,
                            mashComponentType:              ComponentType.FEATURE_ASPECT,
                            designComponentReferenceId:     designItem.componentReferenceId,
                            designFeatureReferenceId:       item.componentFeatureReferenceId,
                            mashItemIndex:                  designItemIndex,
                            // Links
                            devFeatureId:                   devFeatureId,
                            // Data
                            mashItemName:                   itemName,
                            mashItemTag:                    tag,
                            // Status
                            mashStatus:                     mashStatus,
                            mashTestStatus:                 mashTestStatus
                        }
                    );

                    break;

                case ComponentType.SCENARIO:
                    // See if we have a corresponding Dev Scenario
                    const devScenario = UserDevFeatureScenarios.findOne({
                        userId: userContext.userId,
                        scenarioName: itemName
                    });

                    let devScenarioId = 'NONE';
                    let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
                    let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

                    if(devScenario){
                        devFeatureId = devScenario.userDevFeatureId;
                        devScenarioId = devScenario._id;
                        mashStatus = MashStatus.MASH_LINKED;
                        mashTestStatus = MashTestStatus.MASH_PENDING;
                        tag = devScenario.scenarioTag;
                    }

                    let featureAspectReferenceId = 'NONE';
                    if(designItemParent.componentType === ComponentType.FEATURE_ASPECT){
                        featureAspectReferenceId = designItemParent.componentReferenceId
                    }

                    // Add new Mash
                    UserDesignDevMashData.insert(
                        {
                            // Identity
                            userId:                         userContext.userId,
                            designVersionId:                userContext.designVersionId,
                            designUpdateId:                 userContext.designUpdateId,
                            workPackageId:                  userContext.workPackageId,
                            designComponentId:              item.componentId,
                            mashComponentType:              ComponentType.SCENARIO,
                            designComponentReferenceId:     designItem.componentReferenceId,
                            designFeatureReferenceId:       item.componentFeatureReferenceId,
                            designFeatureAspectReferenceId: featureAspectReferenceId,
                            designScenarioReferenceId:      item.componentReferenceId,
                            mashItemIndex:                  designItemIndex,
                            // Links
                            devFeatureId:                   devFeatureId,
                            devScenarioId:                  devScenarioId,
                            // Data
                            mashItemName:                   itemName,
                            mashItemTag:                    tag,
                            // Status
                            mashStatus:                     mashStatus,
                            mashTestStatus:                 mashTestStatus
                        }
                    );
                    break;
            }
        });
    };

    createDesignUpdateDevMashData(userContext){
        // TODO
    };

    createDesignVersionDevMashData(userContext){
        // TODO
    }


    // createFeatureMashData(userContext){
    //
    //     // Called when opening a new development work package or when data is imported / exported from / to dev
    //
    //     // Get list of all features in current WP
    //     let designWpFeatures = WorkPackageComponents.find(
    //         {
    //             workPackageId: userContext.workPackageId,
    //             componentType: ComponentType.FEATURE,
    //             componentActive: true
    //         }
    //     );
    //
    //     log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} design features in current WP", designWpFeatures.count());
    //
    //     // Remove existing WP Mash
    //     DesignDevFeatureMash.remove({
    //         userId:                     userContext.userId,
    //         designVersionId:            userContext.designVersionId,
    //         designUpdateId:             userContext.designUpdateId,
    //         workPackageId:              userContext.workPackageId,
    //     });
    //
    //     designWpFeatures.forEach((designWpFeature) => {
    //
    //         let featureName = '';
    //
    //         if(userContext.designUpdateId === 'NONE'){
    //             featureName = DesignComponents.findOne({_id: designWpFeature.componentId}).componentName;
    //         } else {
    //             featureName = DesignUpdateComponents.findOne({_id: designWpFeature.componentId}).componentNameNew;
    //         }
    //
    //         // See if we have a corresponding Dev feature
    //         const devFeature = UserDevFeatures.findOne({
    //             userId: userContext.userId,
    //             featureName: featureName
    //         });
    //
    //         let devFeatureId = null;
    //         let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
    //         let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;
    //
    //         if(devFeature){
    //             devFeatureId = devFeature._id;
    //             mashStatus = MashStatus.MASH_LINKED;
    //             mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
    //         }
    //
    //         // Add new Mash
    //         DesignDevFeatureMash.insert(
    //             {
    //                 userId:                     userContext.userId,
    //                 designVersionId:            userContext.designVersionId,
    //                 designUpdateId:             userContext.designUpdateId,
    //                 workPackageId:              userContext.workPackageId,
    //                 userDevFeatureId:           devFeatureId,
    //                 designFeatureReferenceId:   designWpFeature.componentReferenceId,
    //                 // Data
    //                 featureName:                featureName,
    //                 // Status
    //                 featureMashStatus:          mashStatus,
    //                 featureTestStatus:          mashTestStatus
    //             }
    //         );
    //
    //     });
    //
    //     // NOTE: if a feature is not in the design we don't add it to the mash.  Assumption that only designed Features are valid
    //
    //     // Also, there is no removal of Features from the mash as it is not possible to remove a feature from a WP
    //
    // };
    //
    // createScenarioMashData(userContext){
    //
    //     //Get list of all Features in current WP
    //     let designWpFeatures = WorkPackageComponents.find(
    //         {
    //             workPackageId: userContext.workPackageId,
    //             componentType: ComponentType.FEATURE,
    //             componentActive: true
    //         }
    //     );
    //
    //     // And a list of scenarios
    //     let designWpScenarios = WorkPackageComponents.find(
    //         {
    //             workPackageId: userContext.workPackageId,
    //             componentType: ComponentType.SCENARIO,
    //             componentActive: true
    //         }
    //     );
    //
    //     log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} design scenarios in current WP", designWpScenarios.count());
    //
    //     // Remove existing WP Mash
    //     DesignDevScenarioMash.remove({
    //         userId:                     userContext.userId,
    //         designVersionId:            userContext.designVersionId,
    //         designUpdateId:             userContext.designUpdateId,
    //         workPackageId:              userContext.workPackageId,
    //     });
    //
    //     // Insert any Scenarios that are either in the current WP or in DEV in a feature that is in the WP
    //
    //     // Scenarios in current WP
    //     designWpScenarios.forEach((designWpScenario) => {
    //
    //         let designScenario = null;
    //         let scenarioName = ''
    //         if(userContext.designUpdateId === 'NONE'){
    //             designScenario = DesignComponents.findOne({_id: designWpScenario.componentId});
    //             if(designScenario){
    //                 scenarioName = designScenario.componentName;
    //             }
    //         } else {
    //             designScenario = DesignUpdateComponents.findOne({_id: designWpScenario.componentId});
    //             if(designScenario){
    //                 scenarioName = designScenario.componentNameNew;
    //             }
    //         }
    //
    //         // See if we have a corresponding Dev Scenario
    //         const devScenario = UserDevFeatureScenarios.findOne({
    //             userId: userContext.userId,
    //             scenarioName: scenarioName
    //         });
    //
    //         let devScenarioId = null;
    //         let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
    //         let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;
    //
    //         if(devScenario){
    //             devScenarioId = devScenario._id;
    //             mashStatus = MashStatus.MASH_LINKED;
    //             mashTestStatus = MashTestStatus.MASH_PENDING;
    //         }
    //
    //         // Add new Mash
    //         DesignDevScenarioMash.insert(
    //             {
    //                 userId:                     userContext.userId,
    //                 designVersionId:            userContext.designVersionId,
    //                 designUpdateId:             userContext.designUpdateId,
    //                 workPackageId:              userContext.workPackageId,
    //                 userDevScenarioId:          devScenarioId,
    //                 designFeatureReferenceId:   designWpScenario.componentFeatureReferenceId,
    //                 designScenarioReferenceId:  designScenario.componentReferenceId,
    //                 // Data
    //                 scenarioName:               scenarioName,
    //                 // Status
    //                 scenarioMashStatus:         mashStatus,
    //                 scenarioTestStatus:         mashTestStatus
    //             }
    //         );
    //
    //     });
    //
    //     // Extra Dev Scenarios NOT in Design but in Features in Design
    //     designWpFeatures.forEach((wpFeature) => {
    //
    //         let devOnlyScenarios = UserDevFeatureScenarios.find({
    //             userId:             userContext.userId,
    //             featureReferenceId: wpFeature.componentReferenceId,
    //             scenarioStatus:     UserDevScenarioStatus.SCENARIO_UNKNOWN
    //         }).fetch();
    //
    //         devOnlyScenarios.forEach((scenario) => {
    //             // Add new Mash
    //             DesignDevScenarioMash.insert(
    //                 {
    //                     userId:                     userContext.userId,
    //                     designVersionId:            userContext.designVersionId,
    //                     designUpdateId:             userContext.designUpdateId,
    //                     workPackageId:              userContext.workPackageId,
    //                     userDevScenarioId:          scenario._id,
    //                     designFeatureReferenceId:   wpFeature.componentReferenceId,
    //                     // Data
    //                     scenarioName:               scenario.scenarioName,
    //                     // Status
    //                     scenarioMashStatus:         MashStatus.MASH_NOT_DESIGNED,
    //                     scenarioTestStatus:         MashTestStatus.MASH_NOT_LINKED
    //                 }
    //             );
    //         });
    //     });
    //
    //
    // };

    createScenarioStepMashData(userContext){

    };

    updateTestData(userContext, resultsPath){

        // Read the test results file
        const resultsText = fs.readFileSync(resultsPath);

        let results = JSON.parse(resultsText);

        log((msg) => console.log(msg), LogLevel.TRACE, "UPDATE TEST DATA: {}", results);

        results.forEach((result) => {
            if(result.keyword === 'Feature'){
                const featureName = result.name;
                let featureTestStatus = MashTestStatus.MASH_PASS;

                let designFeature = null;
                if(userContext.designUpdateId === 'NONE'){
                    designFeature = DesignComponents.findOne({
                        designId: userContext.designId,
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.FEATURE,
                        componentName: featureName
                    });
                } else {
                    designFeature = DesignUpdateComponents.findOne({
                        designId: userContext.designId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentType: ComponentType.FEATURE,
                        componentNameNew: featureName
                    });
                }

                result.elements.forEach((element) => {
                    if(element.keyword === 'Scenario'){
                        const scenarioName = element.name;
                        let scenarioTestStatus = MashTestStatus.MASH_PASS;
                        let scenarioError = '';
                        element.steps.forEach((step) => {
                            if(step.result.status != 'passed'){
                                scenarioTestStatus = MashTestStatus.MASH_FAIL;
                                featureTestStatus = MashTestStatus.MASH_FAIL;
                                scenarioError = step.result.error_message;
                            }
                        });


                        // Update the data for this scenario
                        let designScenario = null;
                        if(userContext.designUpdateId === 'NONE'){
                            designScenario = DesignComponents.findOne({
                                designId: userContext.designId,
                                designVersionId: userContext.designVersionId,
                                componentType: ComponentType.SCENARIO,
                                componentName: scenarioName
                            });
                        } else {
                            designScenario = DesignUpdateComponents.findOne({
                                designId: userContext.designId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                componentType: ComponentType.SCENARIO,
                                componentNameNew: scenarioName
                            });
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "Design Scenario is: {}", designScenario);

                        if(designFeature && designScenario) {
                            UserDesignDevMashData.update(
                                {
                                    userId:                         userContext.userId,
                                    designVersionId:                userContext.designVersionId,
                                    designUpdateId:                 userContext.designUpdateId,
                                    workPackageId:                  userContext.workPackageId,
                                    mashComponentType:              ComponentType.SCENARIO,
                                    designFeatureReferenceId:       designFeature.componentReferenceId,
                                    designScenarioReferenceId:      designScenario.componentReferenceId,
                                 },
                                {
                                    $set:{
                                        mashTestStatus: scenarioTestStatus
                                    }
                                },
                                (error, result) => {
                                    log((msg) => console.log(msg), LogLevel.TRACE, "Updated {} scenario", result);
                                }

                            );
                        }
                    }
                });

                // TODO - Update this to set Feature Aspect and Feature Status by looking at the Scenarios within them...

                // Update the feature test status as well
                if(designFeature){
                    UserDesignDevMashData.update(
                        {
                            userId:                         userContext.userId,
                            designVersionId:                userContext.designVersionId,
                            designUpdateId:                 userContext.designUpdateId,
                            workPackageId:                  userContext.workPackageId,
                            mashComponentType:              ComponentType.FEATURE,
                            designFeatureReferenceId:       designFeature.componentReferenceId,
                        },
                        {
                            $set:{
                                mashTestStatus: featureTestStatus
                            }
                        }

                    );
                }
            }
        });

    }
}

export default new MashDataServices();
