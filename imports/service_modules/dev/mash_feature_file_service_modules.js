// External
import fs from 'fs';

// Ultrawide Collections
import { DesignVersionComponents }          from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }           from '../../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }           from '../../collections/design/feature_background_steps.js';
import { ScenarioSteps }                    from '../../collections/design/scenario_steps.js';
import { WorkPackageComponents }            from '../../collections/work/work_package_components.js';
import { UserDevFeatures }                  from '../../collections/dev/user_dev_features.js';
import { UserDevFeatureScenarios }          from '../../collections/dev/user_dev_feature_scenarios.js';
import { UserDevFeatureScenarioSteps }      from '../../collections/dev/user_dev_feature_scenario_steps.js';

// Ultrawide Services
import { TestType, TestRunner, ComponentType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus, UserDevScenarioStepStatus, WorkPackageScopeType, StepContext, ScenarioStepStatus, ScenarioStepType, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import DesignComponentData          from '../../data/design/design_component_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
import WorkPackageComponentData     from '../../data/work/work_package_component_db.js';

//======================================================================================================================
//
// Server Modules for Mash Data or Feature File Services relating to Feature File Processing.
//
// Methods called from within main API methods
//
//======================================================================================================================

class MashFeatureFileModules{

    loadUserFeatureFileData(userContext){

        // Remove current user file data so deleted files are cleared.
        UserDevFeatures.remove({userId: userContext.userId});
        UserDevFeatureScenarios.remove({userId: userContext.userId});
        UserDevFeatureScenarioSteps.remove({userId: userContext.userId});

        // This means looking for feature files in the dev users test folder
        // TODO - FIX THIS WITH NEW USER SETTING
        let featureFiles = this.getFeatureFiles('NONE');

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} feature files", featureFiles.length);

        let devFeatures = [];

        let featureRefId = 'NONE';

        // Load up data for any feature file found but highlighting those in the current WP scope
        featureFiles.forEach((file) => {

            const fileText = this.getFeatureFileText('NONE', file);
            const feature = this.getFeatureName(fileText.toString());
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
                if (userContext.designUpdateId !== 'NONE') {

                    // Working from a Design Update
                    designFeature = DesignUpdateComponentData.getFeatureByName(
                        userContext.designVersionId,
                        userContext.designUpdateId,
                        featureName
                    );

                } else {

                    // Working from a base design
                    designFeature = DesignComponentData.getFeatureByName(
                        userContext.designVersionId,
                        featureName
                    );
                }


                if(designFeature){
                    featureRefId = designFeature.componentReferenceId;

                    // The feature is in the design - is it in the current work package?
                    const wpFeature = WorkPackageComponentData.getWorkPackageFeatureByRef(
                        userContext.workPackageId,
                        designFeature.componentReferenceId
                    );

                    if(wpFeature && wpFeature.scopeType === WorkPackageScopeType.SCOPE_ACTIVE){
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
                    // Link
                    designFeatureReference: featureRefId,
                    // Status
                    featureFileStatus:      devFeatureData.featureFileStatus,
                    featureStatus:          devFeatureData.featureStatus
                }
            );

            // Get Scenario and Step Data ------------------------------------------------------------------------------

            // Scenarios in this feature file
            const featureScenarios = this.getFeatureScenarios(fileText.toString());

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
                    designScenario = DesignVersionComponents.findOne(
                        {
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId,
                            componentType: ComponentType.SCENARIO,
                            componentNameNew: devScenario.scenario
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
                        devScenarioData.featureReferenceId = designScenario.componentFeatureReferenceIdNew;
                    } else {
                        devScenarioData.featureReferenceId = designScenario.componentFeatureReferenceIdNew;
                    }

                    devScenarioData.scenarioReferenceId = designScenario.componentReferenceId;

                    // The scenario is in the design - is it in the current work package?
                    const wpScenario = WorkPackageComponents.findOne(
                        {
                            workPackageId: userContext.workPackageId,
                            componentType: ComponentType.SCENARIO,
                            scopeType: WorkPackageScopeType.SCOPE_ACTIVE,
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


    getFeatureFiles(filePath){
        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for FEATURE FILES at {}", filePath);

        if(filePath != 'NONE'){

            let featureFiles = [];
            let files = fs.readdirSync(filePath);

            log((msg) => console.log(msg), LogLevel.TRACE, "Found {} files", files.length);

            files.forEach((file) => {
                let fileText = '';

                log((msg) => console.log(msg), LogLevel.TRACE, "Checking file {} with ending {} ", file, file.substring(file.length - 8));

                // Don't use endsWith - not supported by IE
                if (file.substring(file.length - 8) === '.feature'){

                    featureFiles.push(file);
                }
            });

            return featureFiles;

        } else {
            return [];
        }
    };

    getFeatureFileText(filePath, fileName){

        return fs.readFileSync(filePath + fileName);

    }

    getFeatureName(fileText){

        let featureStartIndex = fileText.indexOf('Feature:');
        let featureEndIndex = 0;



        if(featureStartIndex >= 0){

            featureEndIndex = fileText.indexOf('\n', featureStartIndex);

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for feature name from {} to {}", featureStartIndex, featureEndIndex);

            return(
                {
                    feature: fileText.substring(featureStartIndex + 8, featureEndIndex).trim(),
                    tag: this.getTag(fileText, featureStartIndex)
                }
            )

        } else {
            return '';
        }
    }

    getFeatureScenarios(fileText){

        // First get the Background steps for the whole Feature
        let backgroundStartIndex = fileText.indexOf('Background:', 0);
        let backgroundEndIndex = fileText.indexOf('\n', backgroundStartIndex);
        let backgroundSteps = this.getScenarioSteps(fileText, backgroundEndIndex);

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} background steps for Feature", backgroundSteps.length);

        let scenarioStartIndex = fileText.indexOf('Scenario:', 0);
        let scenarioEndIndex = 0;
        let scenarios = [];


        while (scenarioStartIndex >= 0){
            let scenarioText = '';
            let scenarioTag = '';
            let scenarioSteps = [];

            scenarioEndIndex = fileText.indexOf('\n', scenarioStartIndex);

            scenarioText = fileText.substring(scenarioStartIndex + 9, scenarioEndIndex).trim();
            scenarioTag = this.getTag(fileText, scenarioStartIndex);

            log((msg) => console.log(msg), LogLevel.TRACE, "Found scenario {} with tag {}", scenarioText, scenarioTag);

            scenarioSteps = this.getScenarioSteps(fileText, scenarioEndIndex);

            scenarios.push(
                {
                    scenario: scenarioText,
                    tag: scenarioTag,
                    backgroundSteps: backgroundSteps,       // All Scenarios have the same background steps
                    steps: scenarioSteps
                }
            );

            scenarioStartIndex = fileText.indexOf('Scenario:', scenarioEndIndex);
        }

        return scenarios;

    }

    getTag(fileText, tagLocation){

        // Assume that we pass in the location of a Feature: or Scenario: found in the file text.

        // We progress back until we hit an @

        const lastAtPos = fileText.lastIndexOf('@', tagLocation);

        const tagEnd = fileText.indexOf('\n', lastAtPos);

        const tag = fileText.substring(lastAtPos, tagEnd);

        log((msg) => console.log(msg), LogLevel.TRACE, "Found tag {}", tag);

        return tag;
    };

    getScenarioSteps(fileText, startPos){

        let steps = [];
        let step = '';
        let stepStart = startPos + 1;
        let nextStepEnd = fileText.indexOf('\n', stepStart);

        // The end of the steps is either the next tag or next Scenario.
        const stepsEndAt = fileText.indexOf('@', startPos);
        const stepsEndScenario = fileText.indexOf('Scenario:', startPos);

        if(stepsEndAt > 0 && stepsEndScenario > 0){
            // Not last scenario in file
            let endPos = 0;
            if(stepsEndAt > 0 && stepsEndAt < stepsEndScenario){
                endPos = stepsEndAt;
            } else {
                endPos = stepsEndScenario;
            }

            while(nextStepEnd < endPos){
                step = fileText.substring(stepStart, nextStepEnd);

                // Ignore blank lines
                if(step.trim().length > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Found step {}", step);
                    steps.push(step.trim());
                }

                stepStart = nextStepEnd + 1;
                nextStepEnd = fileText.indexOf('\n', stepStart);
            }
        } else {
            // Last scenario - keep reading until end
            while(nextStepEnd > 0){
                step = fileText.substring(stepStart, nextStepEnd);

                // Ignore blank lines
                if(step.trim().length > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Found step {}", step);
                    steps.push(step.trim());
                }

                stepStart = nextStepEnd + 1;
                nextStepEnd = fileText.indexOf('\n', stepStart);
            }
        }

        return steps;

    }


}

export default new MashFeatureFileModules();
