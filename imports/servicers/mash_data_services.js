import fs from 'fs';

import {DesignComponents}               from '../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps}         from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}                  from '../collections/design/scenario_steps.js';
import {WorkPackages}                   from '../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../collections/work/work_package_components.js';
import {UserDevFeatures}                from '../collections/dev/user_dev_features.js';
import {UserDevFeatureScenarios}        from '../collections/dev/user_dev_feature_scenarios.js';
import {UserDevFeatureScenarioSteps}    from '../collections/dev/user_dev_feature_scenario_steps.js';
import {UserAccTestMashData}          from '../collections/dev/user_acc_test_mash_data.js';
import {UserCurrentDevContext}          from '../collections/context/user_current_dev_context.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus,
    UserDevScenarioStepStatus, StepContext, MashStatus, MashTestStatus, DevTestTag, LogLevel} from '../constants/constants.js';
import {log}                            from '../common/utils.js';
import FeatureFileServices              from './feature_file_services.js'
import ScenarioServices                 from './scenario_services.js';
import MochaTestServices                from '../service_modules/server/test_results_processor_meteor_mocha.js';

import IntegrationTestServices          from '../service_modules/server/integration_test_services.js';
import ModuleTestServices               from '../service_modules/server/module_test_services.js';

class MashDataServices{

    loadUserFeatureFileData(userContext){

        // Remove current user file data so deleted files are cleared.
        UserDevFeatures.remove({userId: userContext.userId});
        UserDevFeatureScenarios.remove({userId: userContext.userId});
        UserDevFeatureScenarioSteps.remove({userId: userContext.userId});

        // This means looking for feature files in the dev users test folder
        let featureFiles = FeatureFileServices.getFeatureFiles(userContext.featureFilesLocation);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} feature files", featureFiles.length);

        let devFeatures = [];

        let featureRefId = null;

        // Load up data for any feature file found but highlighting those in the current WP scope
        featureFiles.forEach((file) => {

            const fileText = FeatureFileServices.getFeatureFileText(userContext.featureFilesLocation, file);
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
                fileText:               fileText.toString(),
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
                    fileText:               devFeatureData.fileText,
                    // Status
                    featureFileStatus:      devFeatureData.featureFileStatus,
                    featureStatus:          devFeatureData.featureStatus
                }
            );

            // Get Scenario and Step Data ------------------------------------------------------------------------------

            // Scenarios in this feature file
            const featureScenarios = FeatureFileServices.getFeatureScenarios(fileText.toString());

            log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} scenarios", featureScenarios.length);

            let devScenarioId = null;

            featureScenarios.forEach((devScenario) => {
                log((msg) => console.log(msg), LogLevel.TRACE, "Found scenario: ", devScenario.scenario);

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

                    // Add Feature background steps
                    let stepIndex = 0;
                    devScenario.backgroundSteps.forEach((backgroundStep) => {

                        let devBackgroundStepData = {
                            // Identity
                            userId:                     userContext.userId,
                            userDevFeatureId:           devFeatureId,
                            userDevScenarioId:          devScenarioId,
                            featureReferenceId:         devScenarioData.featureReferenceId,     // Feature is in design
                            scenarioReferenceId:        devScenarioData.scenarioReferenceId,    // Scenario is in design
                            scenarioStepReferenceId:    'NONE',                                 // Until known to be in Design
                            stepIndex:                  stepIndex,
                            // Data
                            stepType:                   this.getStepType(backgroundStep),
                            stepText:                   this.getStepText(backgroundStep),
                            stepFullName:               backgroundStep,
                            // Status
                            stepContext:                StepContext.STEP_FEATURE_SCENARIO,   // Background step
                            stepStatus:                 UserDevScenarioStepStatus.STEP_DEV_ONLY  // Until known to be in Design
                        };

                        // Returns null if no step found
                        const designBackgroundStep = this.getDesignBackgroundStep(backgroundStep, devScenarioData.featureReferenceId, userContext);

                        if(designBackgroundStep){
                            devBackgroundStepData.scenarioStepReferenceId = designBackgroundStep.stepReferenceId;
                            devBackgroundStepData.stepStatus = UserDevScenarioStepStatus.STEP_LINKED;
                            devBackgroundStepData.stepIndex = designBackgroundStep.stepIndex;
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "Inserting Background Step: {} as {}", devBackgroundStepData.stepFullName, devBackgroundStepData.stepStatus);

                        UserDevFeatureScenarioSteps.insert({
                            // Identity
                            userId:                     devBackgroundStepData.userId,
                            userDevFeatureId:           devBackgroundStepData.userDevFeatureId,
                            userDevScenarioId:          devBackgroundStepData.userDevScenarioId,
                            featureReferenceId:         devBackgroundStepData.featureReferenceId,
                            scenarioReferenceId:        devBackgroundStepData.scenarioReferenceId,
                            scenarioStepReferenceId:    devBackgroundStepData.scenarioStepReferenceId,
                            stepIndex:                  devBackgroundStepData.stepIndex,
                            // Data
                            stepType:                   devBackgroundStepData.stepType,
                            stepText:                   devBackgroundStepData.stepText,
                            stepFullName:               devBackgroundStepData.stepFullName,
                            // Status
                            stepContext:                devBackgroundStepData.stepContext,
                            stepStatus:                 devBackgroundStepData.stepStatus
                        });

                        stepIndex++;

                    });

                    // If the scenario is in the design, assume any steps in it that are in the design scenario
                    // are design or WP steps (depending on where the scenario is) and any other steps are not.

                    stepIndex = 0;
                    let previousStepId = 'NONE';
                    devScenario.steps.forEach((step) => {

                        let devStepData = {
                            // Identity
                            userId:                     userContext.userId,
                            userDevFeatureId:           devFeatureId,
                            userDevScenarioId:          devScenarioId,
                            featureReferenceId:         devScenarioData.featureReferenceId,     // Feature is in design
                            scenarioReferenceId:        devScenarioData.scenarioReferenceId,    // Scenario is in design
                            scenarioStepReferenceId:    'NONE',                 // Until known to be in Design
                            stepIndex:                  stepIndex,
                            // Data
                            stepType:                   this.getStepType(step),
                            stepText:                   this.getStepText(step),
                            stepFullName:               step,
                            // Status
                            stepContext:                StepContext.STEP_SCENARIO,
                            stepStatus:                 UserDevScenarioStepStatus.STEP_DEV_ONLY  // Until known to be in Design
                        };

                        // Returns null if no step found
                        const designStep = this.getDesignStep(step, devScenarioData.scenarioReferenceId, userContext);

                        if(designStep){
                            devStepData.scenarioStepReferenceId = designStep.stepReferenceId;
                            devStepData.stepStatus = UserDevScenarioStepStatus.STEP_LINKED;
                            devStepData.stepIndex = designStep.stepIndex;
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "Inserting Dev Step: {} as {}", devStepData.stepFullName, devStepData.stepStatus);

                        previousStepId = UserDevFeatureScenarioSteps.insert({
                            // Identity
                            userId:                     devStepData.userId,
                            userDevFeatureId:           devStepData.userDevFeatureId,
                            userDevScenarioId:          devStepData.userDevScenarioId,
                            featureReferenceId:         devStepData.featureReferenceId,
                            scenarioReferenceId:        devStepData.scenarioReferenceId,
                            scenarioStepReferenceId:    devStepData.scenarioStepReferenceId,
                            previousStepId:             previousStepId,
                            stepIndex:                  devStepData.stepIndex,
                            // Data
                            stepType:                   devStepData.stepType,
                            stepText:                   devStepData.stepText,
                            stepFullName:               devStepData.stepFullName,
                            // Status
                            stepContext:                devStepData.stepContext,
                            stepStatus:                 devStepData.stepStatus
                        });

                        stepIndex++;

                    });


                } else {
                    // The scenario is not in the design
                    devScenarioData.scenarioStatus = UserDevScenarioStatus.SCENARIO_UNKNOWN;

                    // However, if it is related to a feature that IS then it can appear as
                    // a new Scenario for that feature
                    if(featureRefId){
                        devScenarioData.featureReferenceId = featureRefId;
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

                    // Where the scenario is not in the Design, but the Feature is, save the steps so they are preserved in Dev on a refresh

                    // let devStepIndex = 0;
                    // devScenario.backgroundSteps.forEach((backgroundStep) => {
                    //
                    //     UserDevFeatureBackgroundSteps.insert({
                    //         // Identity
                    //         userId:                     userContext.userId,
                    //         userDevFeatureId:           devFeatureId,
                    //         userDevScenarioId:          devScenarioId,
                    //         featureReferenceId:         'NONE',
                    //         scenarioReferenceId:        'NONE',
                    //         scenarioStepReferenceId:    'NONE',
                    //         stepIndex:                  devStepIndex,
                    //         // Data
                    //         stepType:                   this.getStepType(backgroundStep),
                    //         stepText:                   this.getStepText(backgroundStep),
                    //         stepFullName:               backgroundStep,
                    //         // Status
                    //         stepContext:                StepContext.STEP_FEATURE_SCENARIO,
                    //         stepStatus:                 UserDevScenarioStepStatus.STEP_DEV_ONLY
                    //     });
                    //
                    //     devStepIndex++;
                    //
                    // });

                    let devStepIndex = 0;
                    devScenario.steps.forEach((step) => {

                        UserDevFeatureScenarioSteps.insert({
                            // Identity
                            userId:                     userContext.userId,
                            userDevFeatureId:           devFeatureId,
                            userDevScenarioId:          devScenarioId,
                            featureReferenceId:         'NONE',
                            scenarioReferenceId:        'NONE',
                            scenarioStepReferenceId:    'NONE',
                            stepIndex:                  devStepIndex,
                            // Data
                            stepType:                   this.getStepType(step),
                            stepText:                   this.getStepText(step),
                            stepFullName:               step,
                            // Status
                            stepContext:                StepContext.STEP_SCENARIO,
                            stepStatus:                 UserDevScenarioStepStatus.STEP_DEV_ONLY
                        });

                        devStepIndex++;

                    });
                }
            });

        });

    };


    getDesignStep(step, scenarioRef, userContext){

        // Even if the scenario has duplicate steps in it they are then the same step so have the same reference...

        return ScenarioSteps.findOne({
            designId:                   userContext.designId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            scenarioReferenceId:        scenarioRef,
            stepFullName:               step,
            isRemoved:                  false
        });
    }

    getDesignBackgroundStep(step, featureRef, userContext) {

        return FeatureBackgroundSteps.findOne({
            designId:               userContext.designId,
            designVersionId:        userContext.designVersionId,
            designUpdateId:         userContext.designUpdateId,
            featureReferenceId:     featureRef,
            stepFullName:           step,
            isRemoved:              false
        });
    }

    getStepType(stepFullName){
        // The first word in the step
        const firstSpace = stepFullName.indexOf(' ');
        return stepFullName.substring(0, firstSpace).trim();

    }

    getStepText(stepFullName){
        // The step without its first word
        const firstSpace = stepFullName.indexOf(' ');
        return stepFullName.substring(firstSpace, stepFullName.length).trim();
    }

    createRawStepText(stepFullName){

        // Create Ultrawide editor text from the text created by a Developer

        let stepText = this.getStepText(stepFullName);

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : stepText,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    };

    createAccTestMashData(userContext){

        // Data created depends on context...

        log((msg) => console.log(msg), LogLevel.DEBUG, "Creating Feature Mash Data. --------------------------");
        log((msg) => console.log(msg), LogLevel.DEBUG, "WP: {} DU: {} ", userContext.workPackageId, userContext.designUpdateId);

        if(userContext.workPackageId != 'NONE'){
            // A work package is being used so create data related to that
            this.createWpAccTestMashData(userContext);
        } else {
            // Otherwise we will be creating data for the whole design version or update for a view of progress
            if(userContext.designUpdateId != 'NONE'){
                this.createDesignUpdateAccTestMashData(userContext);
            } else {
                this.createDesignVersionAccTestMashData(userContext);
            }
        }
    };

    createWpAccTestMashData(userContext){

        // Remove existing WP Mash
        UserAccTestMashData.remove({
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

        log((msg) => console.log(msg), LogLevel.DEBUG, "Creating WP Data. --------------------------");

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

            log((msg) => console.log(msg), LogLevel.TRACE, "Found WP Item: {} : {}", item.componentType, itemName);

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
                    UserAccTestMashData.insert(
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
                        UserAccTestMashData.insert(
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
                    UserAccTestMashData.insert(
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
                    UserAccTestMashData.insert(
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

                    // Create the scenario step mash data for this scenario
                    this.createScenarioStepMashData(item.componentReferenceId, featureAspectReferenceId, item.componentFeatureReferenceId, userContext);

                    break;
            }
        });
    };

    createDesignUpdateAccTestMashData(userContext){
        // TODO
    };

    createDesignVersionAccTestMashData(userContext){
        // Remove existing DV Mash
        UserAccTestMashData.remove({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId
        });

        // Get list of all mashable elements in current DV: Features, Feature Aspects, Scenarios
        let designVersionItems = DesignComponents.find(
            {
                designVersionId: userContext.designVersionId,
                componentType: {$in: [ComponentType.FEATURE, ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]}
            }
        );

        log((msg) => console.log(msg), LogLevel.DEBUG, "Creating DV Data. --------------------------");

        designVersionItems.forEach((item) => {

            let itemName = item.componentName;

            let designItemParent = DesignComponents.findOne({_id: item.componentParentId});
            if(designItemParent) {

                let devFeature = null;
                let devFeatureId = 'NONE';
                let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
                let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;
                let tag = DevTestTag.TEST_TEST; // Default testing tag to Test

                log((msg) => console.log(msg), LogLevel.TRACE, "Found DV Item: {} : {}", item.componentType, itemName);

                switch (item.componentType) {
                    case ComponentType.FEATURE:
                        // See if we have a corresponding Dev item
                        devFeature = UserDevFeatures.findOne({
                            userId: userContext.userId,
                            featureName: itemName
                        });


                        if (devFeature) {
                            devFeatureId = devFeature._id;
                            mashStatus = MashStatus.MASH_LINKED;
                            mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
                            tag = devFeature.featureTag;
                        }

                        // Add new Mash
                        UserAccTestMashData.insert(
                            {
                                // Identity
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                workPackageId: userContext.workPackageId,
                                designComponentId: item.componentId,
                                mashComponentType: ComponentType.FEATURE,
                                designComponentReferenceId: item.componentReferenceId,
                                designFeatureReferenceId: item.componentReferenceId,
                                mashItemIndex: item.componentIndex,
                                // Links
                                devFeatureId: devFeatureId,
                                // Data
                                mashItemName: itemName,
                                mashItemTag: tag,
                                // Status
                                mashStatus: mashStatus,
                                mashTestStatus: mashTestStatus
                            }
                        );

                        log((msg) => console.log(msg), LogLevel.TRACE, "Inserted MASH feature: {} ", item.componentName);

                        // For each Feature, check also for scenarios in this feature in Dev but NOT in Design
                        let devOnlyScenarios = UserDevFeatureScenarios.find({
                            userId: userContext.userId,
                            featureReferenceId: item.componentReferenceId,
                            scenarioStatus: UserDevScenarioStatus.SCENARIO_UNKNOWN
                        }).fetch();

                        devOnlyScenarios.forEach((scenario) => {
                            // Add new Mash
                            UserAccTestMashData.insert(
                                {
                                    // Identity
                                    userId: userContext.userId,
                                    designVersionId: userContext.designVersionId,
                                    designUpdateId: userContext.designUpdateId,
                                    workPackageId: userContext.workPackageId,
                                    designComponentId: item.componentId,
                                    mashComponentType: ComponentType.SCENARIO,
                                    designFeatureReferenceId: item.componentReferenceId,
                                    // Links
                                    devFeatureId: devFeatureId,
                                    devScenarioId: scenario._id,
                                    // Data
                                    mashItemName: scenario.scenarioName,
                                    mashItemTag: scenario.scenarioTag,
                                    // Status
                                    mashStatus: MashStatus.MASH_NOT_DESIGNED,
                                    mashTestStatus: MashTestStatus.MASH_NOT_LINKED
                                }
                            );
                        });
                        break;

                    case ComponentType.FEATURE_ASPECT:
                        // There is no direct equivalent dev data - this is for organisation on the design side

                        // However, link to the dev Feature for which this is an Aspect
                        let parentFeatureName = '';
                        const featureItem = DesignComponents.findOne({
                            designVersionId: userContext.designVersionId,
                            componentReferenceId: item.componentFeatureReferenceId
                        });

                        if (featureItem) {

                            devFeature = UserDevFeatures.findOne({
                                userId: userContext.userId,
                                featureName: featureItem.componentName
                            });

                            if (devFeature) {
                                devFeatureId = devFeature._id;
                                mashStatus = MashStatus.MASH_LINKED;
                                mashTestStatus = MashTestStatus.MASH_PENDING;   // TODO - reference last test data
                                tag = devFeature.featureTag;
                            }

                            // Add new Mash
                            UserAccTestMashData.insert(
                                {
                                    // Identity
                                    userId: userContext.userId,
                                    designVersionId: userContext.designVersionId,
                                    designUpdateId: userContext.designUpdateId,
                                    workPackageId: userContext.workPackageId,
                                    designComponentId: item.componentId,
                                    mashComponentType: ComponentType.FEATURE_ASPECT,
                                    designComponentReferenceId: item.componentReferenceId,
                                    designFeatureReferenceId: item.componentFeatureReferenceId,
                                    mashItemIndex: item.componentIndex,
                                    // Links
                                    devFeatureId: devFeatureId,
                                    // Data
                                    mashItemName: itemName,
                                    mashItemTag: tag,
                                    // Status
                                    mashStatus: mashStatus,
                                    mashTestStatus: mashTestStatus
                                }
                            );

                            log((msg) => console.log(msg), LogLevel.TRACE, "Inserted MASH feature aspect: {} ", item.componentName);
                        } else {
                            log((msg) => console.log(msg), LogLevel.WARNING, "ORPHAN FEATURE ASPECT! Aspect Ref: {} Feature Ref: {} ", item.componentReferenceId, item.componentFeatureReferenceId);
                        }

                        break;

                    case ComponentType.SCENARIO:
                        // See if we have a corresponding Dev Scenario
                        const devScenario = UserDevFeatureScenarios.findOne({
                            userId: userContext.userId,
                            scenarioName: itemName
                        });

                        let devScenarioId = 'NONE';

                        if (devScenario) {
                            devFeatureId = devScenario.userDevFeatureId;
                            devScenarioId = devScenario._id;
                            mashStatus = MashStatus.MASH_LINKED;
                            mashTestStatus = MashTestStatus.MASH_PENDING;
                            tag = devScenario.scenarioTag;
                        }

                        let featureAspectReferenceId = 'NONE';
                        if (designItemParent.componentType === ComponentType.FEATURE_ASPECT) {
                            featureAspectReferenceId = designItemParent.componentReferenceId
                        }

                        // Add new Mash
                        UserAccTestMashData.insert(
                            {
                                // Identity
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                workPackageId: userContext.workPackageId,
                                designComponentId: item.componentId,
                                mashComponentType: ComponentType.SCENARIO,
                                designComponentReferenceId: item.componentReferenceId,
                                designFeatureReferenceId: item.componentFeatureReferenceId,
                                designFeatureAspectReferenceId: featureAspectReferenceId,
                                designScenarioReferenceId: item.componentReferenceId,
                                mashItemIndex: item.componentIndex,
                                // Links
                                devFeatureId: devFeatureId,
                                devScenarioId: devScenarioId,
                                // Data
                                mashItemName: itemName,
                                mashItemTag: tag,
                                // Status
                                mashStatus: mashStatus,
                                mashTestStatus: mashTestStatus
                            }
                        );

                        // Create the scenario step mash data for this scenario
                        this.createScenarioStepMashData(item.componentReferenceId, featureAspectReferenceId, item.componentFeatureReferenceId, userContext);

                        break;
                }
            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "ORPHAN ITEM! Item Type: {} Item Id: {} Item Name: {} Item Parent: {}", item.componentType, item._id, item.componentName, item.componentParentId);
            }
        });
    }

    createScenarioStepMashData(scenarioReferenceId, aspectReferenceId, featureReferenceId, userContext){
        // TODO - common function that can be used in all 3 above functions...

        let devScenarioStepId = 'NONE';
        let devScenarioId = 'NONE';
        let devFeatureId = 'NONE';
        let mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
        let mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

        // For Scenario Steps we want a combined list of steps from Design and Dev in a proper editor so that a final definition can be created and saved to the design.

        // Get all background steps in the Feature
        const backgroundSteps = FeatureBackgroundSteps.find({
            designId:                   userContext.designId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            featureReferenceId:         featureReferenceId,         // Don't use user context as feature may not yet be chosen
            isRemoved:                  false
        }).fetch();

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} feature background steps", backgroundSteps.length);

        // See if we have a corresponding Dev Scenario Step
        backgroundSteps.forEach((backgroundStep) => {
            const devBackgroundScenarioStep = UserDevFeatureScenarioSteps.findOne({
                userId:                 userContext.userId,
                scenarioReferenceId:    scenarioReferenceId,
                stepFullName:           backgroundStep.stepFullName,
                stepContext:            StepContext.STEP_FEATURE_SCENARIO
            });

            if(devBackgroundScenarioStep){
                devFeatureId = devBackgroundScenarioStep.userDevFeatureId;
                devScenarioId = devBackgroundScenarioStep.userDevScenarioId;
                devScenarioStepId = devBackgroundScenarioStep.scenarioStepReferenceId;
                mashStatus = MashStatus.MASH_LINKED;
                mashTestStatus = MashTestStatus.MASH_PENDING;
            }

            // Add new Mash
            log((msg) => console.log(msg), LogLevel.TRACE, "Adding background step {} to scenario {} with mash status {}", backgroundStep.stepFullName, scenarioReferenceId, mashStatus);
            UserAccTestMashData.insert(
                {
                    // Identity
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    designComponentId:              backgroundStep._id,
                    mashComponentType:              ComponentType.SCENARIO_STEP,
                    designComponentReferenceId:     backgroundStep.stepReferenceId,
                    designFeatureReferenceId:       featureReferenceId,
                    designFeatureAspectReferenceId: aspectReferenceId,
                    designScenarioReferenceId:      scenarioReferenceId,
                    mashItemIndex:                  backgroundStep.stepIndex,
                    // Links
                    devFeatureId:                   devFeatureId,
                    devScenarioId:                  devScenarioId,
                    devScenarioStepId:              devScenarioStepId,
                    // Data
                    mashItemName:                   backgroundStep.stepFullName,
                    mashItemTag:                    'NONE',
                    stepType:                       backgroundStep.stepType,
                    stepText:                       backgroundStep.stepText,
                    stepTextRaw:                    backgroundStep.stepTextRaw,
                    // Status
                    stepContext:                    StepContext.STEP_FEATURE_SCENARIO,
                    mashStatus:                     mashStatus,
                    mashTestStatus:                 mashTestStatus
                }
            );

        });


        //  Get all Design Steps in the Scenario
        const designSteps = ScenarioSteps.find({
            designId:                   userContext.designId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            scenarioReferenceId:        scenarioReferenceId,
            isRemoved:                  false
        });

        // See if we have a corresponding Dev Scenario Step
        designSteps.forEach((designStep) => {
            const devScenarioStep = UserDevFeatureScenarioSteps.findOne({
                userId:                 userContext.userId,
                scenarioReferenceId:    scenarioReferenceId,
                stepFullName:           designStep.stepFullName
            });

            devScenarioStepId = 'NONE';
            devScenarioId = 'NONE';
            devFeatureId = 'NONE';
            mashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            mashTestStatus = MashTestStatus.MASH_NOT_LINKED;

            if(devScenarioStep){
                devFeatureId = devScenarioStep.userDevFeatureId;
                devScenarioId = devScenarioStep.userDevScenarioId;
                devScenarioStepId = devScenarioStep.scenarioStepReferenceId;
                mashStatus = MashStatus.MASH_LINKED;
                mashTestStatus = MashTestStatus.MASH_PENDING;
            }

            // Add new Mash
            UserAccTestMashData.insert(
                {
                    // Identity
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    designComponentId:              designStep._id,
                    mashComponentType:              ComponentType.SCENARIO_STEP,
                    designComponentReferenceId:     designStep.stepReferenceId,
                    designFeatureReferenceId:       featureReferenceId,
                    designFeatureAspectReferenceId: aspectReferenceId,
                    designScenarioReferenceId:      designStep.scenarioReferenceId,
                    mashItemIndex:                  designStep.stepIndex,
                    // Links
                    devFeatureId:                   devFeatureId,
                    devScenarioId:                  devScenarioId,
                    devScenarioStepId:              devScenarioStepId,
                    // Data
                    mashItemName:                   designStep.stepFullName,
                    mashItemTag:                    'NONE',
                    stepType:                       designStep.stepType,
                    stepText:                       designStep.stepText,
                    stepTextRaw:                    designStep.stepTextRaw,
                    // Status
                    stepContext:                    StepContext.STEP_SCENARIO,
                    mashStatus:                     mashStatus,
                    mashTestStatus:                 mashTestStatus
                }
            );

        });

        // Now also add any Dev Steps not already covered
        const devSteps = UserDevFeatureScenarioSteps.find({
            userId:                 userContext.userId,
            scenarioReferenceId:    scenarioReferenceId
        });

        devSteps.forEach((devStep) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking for dev step {}", devStep.stepFullName);

            // See if already exists
            const existingMashStep = UserAccTestMashData.find({
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                mashItemName:                   devStep.stepFullName
            });

            if(existingMashStep.count() == 0){
                log((msg) => console.log(msg), LogLevel.TRACE, "Adding dev only step {} to scenario {}", devStep.stepFullName, scenarioReferenceId);

                UserAccTestMashData.insert(
                    {
                        // Identity
                        userId:                         userContext.userId,
                        designVersionId:                userContext.designVersionId,
                        designUpdateId:                 userContext.designUpdateId,
                        workPackageId:                  userContext.workPackageId,
                        designComponentId:              'NONE',
                        mashComponentType:              ComponentType.SCENARIO_STEP,
                        designComponentReferenceId:     'NONE',
                        designFeatureReferenceId:       featureReferenceId,
                        designFeatureAspectReferenceId: 'NONE',
                        designScenarioReferenceId:      scenarioReferenceId,
                        // Links
                        devFeatureId:                   devStep.userDevFeatureId,
                        devScenarioId:                  devStep.userDevScenarioId,
                        devScenarioStepId:              devStep._id,
                        // Data
                        mashItemName:                   devStep.stepFullName,
                        mashItemTag:                    'NONE',
                        stepType:                       this.getStepType(devStep.stepFullName),
                        stepText:                       this.getStepText(devStep.stepFullName),
                        stepTextRaw:                    this.createRawStepText(devStep.stepFullName),
                        // Status
                        stepContext:                    devStep.stepContext,
                        mashStatus:                     MashStatus.MASH_NOT_DESIGNED,
                        mashTestStatus:                 MashTestStatus.MASH_NOT_LINKED
                    }
                );
            }

        });

    };

    // A Design Only step is moved into the Linked Steps area...
    updateMovedDesignStep(mashDataItemId)  {

        // Mark this step as linked
        UserAccTestMashData.update(
            {_id: mashDataItemId},
            {
                $set: {
                    mashStatus: MashStatus.MASH_LINKED,
                    mashTestStatus: MashTestStatus.MASH_PENDING
                }
            }
        );
    };

    // A Dev Only step is moved into the Linked Steps area
    updateMovedDevStep(devMashItemId, targetMashItemId, userContext){

        // The target step is the one below where the new step will fall

        // Get the index of the target step if there is one (there won't be if dropping into empty box)
        let targetIndex = 0;
        let newIndex = 0;

        const movingStep = UserAccTestMashData.findOne({_id: devMashItemId});
        const currentScenarioId = userContext.scenarioReferenceId;

        if(targetMashItemId) {
            targetIndex = UserAccTestMashData.findOne({_id: targetMashItemId}).mashItemIndex;
        }

        if(targetIndex > 0){
            log((msg) => console.log(msg), LogLevel.TRACE, "Target Index =  {}", targetIndex);
            let previousIndex = 0;

            // Find the next smallest index in the current set of steps

            const currentSteps = this.getFinalScenarioSteps(currentScenarioId, userContext);

            // The steps returned are in ascending order
            let lastItem = 0;
            currentSteps.forEach((step) => {

                if(step._id === targetMashItemId){
                    previousIndex = lastItem;
                }
                lastItem = step.mashItemIndex;
            });
            log((msg) => console.log(msg), LogLevel.TRACE, "Previous Index =  {}", previousIndex);

            newIndex = ((previousIndex + targetIndex) / 2);

            log((msg) => console.log(msg), LogLevel.TRACE, "New Index =  {}", newIndex);
        }

        // This data needs to be added to the design.  This process also updates the Mash data with the new Design item details
        const stepFullName = movingStep.stepType + ' ' +  movingStep.stepText;
        ScenarioServices.addDesignScenarioStepFromDev(currentScenarioId, userContext, movingStep.stepType, movingStep.stepText, stepFullName, newIndex, devMashItemId);

    }

    exportScenario(scenarioReferenceId, userContext){

        // Make out that this entire scenario is linked.  This should update the Scenario Entry and all the steps
        UserAccTestMashData.update(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      scenarioReferenceId
            },
            {
                $set:{
                    mashStatus: MashStatus.MASH_LINKED
                }
            },
            { multi: true }
        );

        // Then export the whole feature
        this.exportFeatureConfiguration(userContext);
    }

    exportFeatureConfiguration(userContext){

        const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});

        FeatureFileServices.writeFeatureFile(userContext.featureReferenceId, userContext, devContext.featureFilesLocation);

        // Reload all the data
        this.loadUserFeatureFileData(userContext, devContext.featureFilesLocation);
        this.createAccTestMashData(userContext);

    }

    updateTestData(userContext, viewOptions){

        if(viewOptions.designAccTestsVisible || viewOptions.devAccTestsVisible){
            this.updateAcceptanceTestData(userContext);
        }

        if(viewOptions.designIntTestsVisible || viewOptions.devIntTestsVisible){
            IntegrationTestServices.getIntegrationTestResults('CHIMP_MOCHA', userContext);
        }

        if(viewOptions.designModTestsVisible || viewOptions.devModTestsVisible){
            ModuleTestServices.getModuleTestResults('METEOR_MOCHA', userContext);
        }
    }

    updateAcceptanceTestData(userContext){

        // if(Meteor.isServer) {
        //     MochaTestServices.processTestResults(userContext);
        // }

        // Read the test results file
        const resultsText = fs.readFileSync(userContext.acceptanceTestResultsLocation);

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
                            UserAccTestMashData.update(
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

                            // And update the step results too
                            element.steps.forEach((step) => {

                                UserAccTestMashData.update(
                                    {
                                        userId:                         userContext.userId,
                                        designVersionId:                userContext.designVersionId,
                                        designUpdateId:                 userContext.designUpdateId,
                                        workPackageId:                  userContext.workPackageId,
                                        mashComponentType:              ComponentType.SCENARIO_STEP,
                                        designFeatureReferenceId:       designFeature.componentReferenceId,
                                        designScenarioReferenceId:      designScenario.componentReferenceId,
                                        stepText:                       step.name
                                    },
                                    {
                                        $set:{
                                            mashTestStatus: step.result.status === 'passed' ? MashTestStatus.MASH_PASS : MashTestStatus.MASH_FAIL
                                        }
                                    },
                                    (error, result) => {
                                        log((msg) => console.log(msg), LogLevel.TRACE, "Updated {} scenario step", result);
                                    }
                                )
                            });
                        }
                    }
                });

                // TODO - Update this to set Feature Aspect and Feature Status by looking at the Scenarios within them...

                // Update the feature test status as well
                if(designFeature){
                    UserAccTestMashData.update(
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

    };

    // GENERIC FIND FUNCTIONS ==========================================================================================

    getFinalScenarioSteps(designScenarioReferenceId, userContext) {
        return UserAccTestMashData.find(
            {
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                designScenarioReferenceId: designScenarioReferenceId,
                mashStatus: MashStatus.MASH_LINKED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    };

    getDesignOnlyScenarioSteps(designScenarioReferenceId, userContext) {
        return UserAccTestMashData.find(
            {
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                designScenarioReferenceId: designScenarioReferenceId,
                mashStatus: MashStatus.MASH_NOT_IMPLEMENTED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    };

}

export default new MashDataServices();
