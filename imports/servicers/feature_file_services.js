import fs from 'fs';

import {DesignComponents}               from '../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps}         from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}                  from '../collections/design/scenario_steps.js';
import {WorkPackages}                   from '../collections/work/work_packages.js';
import {UserDevFeatures}                from '../collections/dev/user_dev_features.js';
import {UserDevFeatureScenarios}        from '../collections/dev/user_dev_feature_scenarios.js';
import {UserDevFeatureScenarioSteps}    from '../collections/dev/user_dev_feature_scenario_steps.js';
import {UserAccTestMashData}          from '../collections/dev/user_acc_test_mash_data.js';

import {ComponentType, WorkPackageType, MashStatus, UserDevScenarioStatus, UserDevScenarioStepStatus, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';

class FeatureFileServices{

    // Convert a whole base design feature into a Gherkin feature file
    writeFeatureFile(featureReferenceId, userContext){

        // There are two contexts in which this function is called:
        // 1. Export a Feature File from a Design Feature
        // 2. Update an existing Dev feature file Scenarios

        // In context 1 we want to include everything in the Design Feature
        // In context 2 we only want to include Scenario Steps that are LINKED in Ultrawide

        log((msg) => console.log(msg), LogLevel.TRACE, 'Exporting feature file to {}', userContext.featureFilesLocation);


        const wp = WorkPackages.findOne({_id: userContext.workPackageId});

        // This function should always be called in a WP context
        if(!wp){return;}

        let feature = null;
        let scenarios = null;
        let featureName = '';

        switch (wp.workPackageType){
            case WorkPackageType.WP_BASE:
                feature = DesignComponents.findOne(
                    {
                        designVersionId: userContext.designVersionId,
                        componentReferenceId: featureReferenceId
                    }
                );

                featureName = feature.componentName;

                scenarios = DesignComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: featureReferenceId
                    }
                ).fetch();
                break;

            case WorkPackageType.WP_UPDATE:
                feature = DesignUpdateComponents.findOne(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: featureReferenceId
                    }
                );

                featureName = feature.componentNameNew;

                scenarios = DesignUpdateComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: featureReferenceId
                    }
                ).fetch();
                break;
        }

        // See if we already have a file for this Feature
        const existingFile = UserDevFeatures.findOne({
                userId: userContext.userId,
                featureName: featureName
            });

        log((msg) => console.log(msg), LogLevel.TRACE, 'Feature exporting is "{}" and file existing is {}', featureName, existingFile);


        const backgroundSteps = FeatureBackgroundSteps.find(
            {
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                featureReferenceId: featureReferenceId,
                isRemoved: false
            }
        ).fetch();


        const fileName = featureName.replace(/ /g, '_') + '.feature';

        let fileText = '@test\n';

        // Header ------------------------------------------------------------------------------------------------------
        fileText += ('Feature: ' + featureName + '\n\n');

        // Narrative - could add here TODO? ----------------------------------------------------------------------------

        // Background --------------------------------------------------------------------------------------------------
        fileText += ('  Background:\n');

        backgroundSteps.forEach((step) => {
            fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
        });

        fileText += '\n';

        // Scenarios ---------------------------------------------------------------------------------------------------
        let existingScenario = null;

        scenarios.forEach((scenario) => {
            let scenarioSteps = [];

            let tag = '@test';  // Default tag for new exports

            if(existingFile){
                // Get any tag assigned to this Scenario in Ultrawide
                existingScenario = UserAccTestMashData.findOne({
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    mashComponentType:              ComponentType.SCENARIO,
                    designScenarioReferenceId:      scenario.componentReferenceId
                });

                if(existingScenario){
                    tag = existingScenario.mashItemTag;
                }
            }

            fileText += '  ' + tag + '\n';
            fileText += '  Scenario: ' + scenario.componentName + '\n';

            scenarioSteps = ScenarioSteps.find(
                {
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    scenarioReferenceId: scenario.componentReferenceId,
                    isRemoved: false
                },
                {sort: {stepIndex: 1}}
            ).fetch();

            let stepsToWrite = new Mongo.Collection(null);

            scenarioSteps.forEach((step) => {
                if(existingFile){
                    // Only add steps if they are currently stored as linked steps
                    const mashStep = UserAccTestMashData.findOne({
                        userId:                         userContext.userId,
                        designVersionId:                userContext.designVersionId,
                        designUpdateId:                 userContext.designUpdateId,
                        workPackageId:                  userContext.workPackageId,
                        mashComponentType:              ComponentType.SCENARIO_STEP,
                        stepText:                       step.stepText,
                        mashStatus:                     MashStatus.MASH_LINKED
                    });

                    if(mashStep){
                        stepsToWrite.insert({
                            stepText:   '    ' + step.stepType + ' ' + step.stepText + '\n',
                            stepIndex:  step.stepIndex
                        });

                    }

                } else {
                    // Add all steps found
                    stepsToWrite.insert({
                        stepText:   '    ' + step.stepType + ' ' + step.stepText + '\n',
                        stepIndex:  step.stepIndex
                    });
                }
            });

            // If existing file, restore any additional dev-only steps for this Scenario that are NOT logically deleted
            if(existingFile){
                log((msg) => console.log(msg), LogLevel.TRACE, 'Looking for dev only steps for Feature: {}, Scenario {}', existingScenario.designFeatureReferenceId, existingScenario.designScenarioReferenceId);

                const devSteps = UserDevFeatureScenarioSteps.find({
                    userId:                 userContext.userId,
                    featureReferenceId:     existingScenario.designFeatureReferenceId,
                    scenarioReferenceId:    existingScenario.designScenarioReferenceId,
                    stepStatus:             UserDevScenarioStepStatus.STEP_DEV_ONLY,
                    isRemoved:              false
                }).fetch();

                log((msg) => console.log(msg), LogLevel.TRACE, 'Found {} additional dev only steps', devSteps.length);

                devSteps.forEach((devStep) => {

                    // This indexing will place the unknown step where it was previously in the file barring additional steps inserted from the design...
                    const previousStep = UserDevFeatureScenarioSteps.findOne({_id: devStep.previousStepId});
                    let prevIndex = 0;
                    let nextIndex = 0;
                    if(previousStep){
                        prevIndex = previousStep.stepIndex;
                    }
                    const nextStep = UserDevFeatureScenarioSteps.findOne({previousStepId: devStep._id});
                    if(nextStep){
                        nextIndex = nextStep.stepIndex;
                    }

                    stepsToWrite.insert({
                        stepText:   '    ' + devStep.stepType + ' ' + devStep.stepText + '\n',
                        stepIndex:  (prevIndex + nextIndex) / 2
                    });
                });
            }

            // Write out all the steps in order
            let finalSteps = stepsToWrite.find(
                {},
                {sort: {stepIndex: 1}}
            ).fetch();

            finalSteps.forEach((step) => {
                fileText += step.stepText;
            });

            fileText += '\n';

        });


        // For existing files recreate dev-only Scenarios and their steps...
        if(existingFile) {

            const devScenarios = UserDevFeatureScenarios.find({
                userId:                         userContext.userId,
                userDevFeatureId:               existingFile._id,
                scenarioStatus:                 UserDevScenarioStatus.SCENARIO_UNKNOWN
            }).fetch();

            devScenarios.forEach((scenario) => {
                fileText += '  ' + scenario.scenarioTag + '\n';
                fileText += '  Scenario: ' + scenario.scenarioName + '\n';

                // All Steps in an UNKNOWN Scenario are UNKNOWN
                let devScenarioSteps = UserDevFeatureScenarioSteps.find(
                    {
                        userId:                         userContext.userId,
                        userDevFeatureId:               existingFile._id,
                        userDevScenarioId:              scenario._id,
                        isRemoved:                      false
                    },
                    {sort: {stepIndex: 1}}
                ).fetch();

                devScenarioSteps.forEach((step) => {
                    fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
                });

                fileText += '\n';

            });
        }

        fs.writeFileSync(userContext.featureFilesLocation + fileName, fileText);

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

export default new FeatureFileServices();
