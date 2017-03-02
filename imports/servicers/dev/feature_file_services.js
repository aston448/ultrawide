
// External
import fs from 'fs';

// Ultrawide Collections
import {DesignComponents}               from '../../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps}         from '../../collections/design/feature_background_steps.js';
import {ScenarioSteps}                  from '../../collections/design/scenario_steps.js';
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {UserDevFeatures}                from '../../collections/dev/user_dev_features.js';
import {UserDevFeatureScenarios}        from '../../collections/dev/user_dev_feature_scenarios.js';
import {UserDevFeatureScenarioSteps}    from '../../collections/dev/user_dev_feature_scenario_steps.js';
//import {UserAccTestMashData}            from '../../collections/dev/user_acc_test_mash_data.js';
import { UserWorkPackageMashData }          from '../../collections/dev/user_work_package_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';

// Ultrawide Services
import {ComponentType, WorkPackageType, MashStatus, UserDevScenarioStatus, UserDevScenarioStepStatus, LogLevel} from '../../constants/constants.js';
import {log} from '../../common/utils.js';

//======================================================================================================================
//
// Server Code for Mash File Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class MashFileServices{

    // Convert a whole base design feature into a Gherkin feature file
    writeFeatureFile(featureReferenceId, userContext){

        if(Meteor.isServer) {

            // There are two contexts in which this function is called:
            // 1. Export a Feature File from a Design Feature
            // 2. Update an existing Dev feature file Scenarios

            // In context 1 we want to include everything in the Design Feature
            // In context 2 we only want to include Scenario Steps that are LINKED in Ultrawide

            log((msg) => console.log(msg), LogLevel.TRACE, 'Exporting feature file to {}', 'NONE');


            const wp = WorkPackages.findOne({_id: userContext.workPackageId});

            // This function should always be called in a WP context
            if (!wp) {return;}

            let feature = null;
            let scenarios = null;
            let featureName = '';

            switch (wp.workPackageType) {
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

                if (existingFile) {
                    // Get any tag assigned to this Scenario in Ultrawide
                    existingScenario = UserWorkPackageMashData.findOne({
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        workPackageId: userContext.workPackageId,
                        mashComponentType: ComponentType.SCENARIO,
                        designScenarioReferenceId: scenario.componentReferenceId
                    });

                    if (existingScenario) {
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
                    if (existingFile) {
                        // Only add steps if they are currently stored as linked steps
                        const mashStep = UserWorkPackageFeatureStepData.findOne({
                            userId: userContext.userId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            workPackageId: userContext.workPackageId,
                            designScenarioReferenceId: step.scenarioReferenceId,
                            accMashStatus: MashStatus.MASH_LINKED
                        });

                        if (mashStep) {
                            stepsToWrite.insert({
                                stepText: '    ' + step.stepType + ' ' + step.stepText + '\n',
                                stepIndex: step.stepIndex
                            });

                        }

                    } else {
                        // Add all steps found
                        stepsToWrite.insert({
                            stepText: '    ' + step.stepType + ' ' + step.stepText + '\n',
                            stepIndex: step.stepIndex
                        });
                    }
                });

                // If existing file, restore any additional dev-only steps for this Scenario that are NOT logically deleted
                if (existingFile) {
                    log((msg) => console.log(msg), LogLevel.TRACE, 'Looking for dev only steps for Feature: {}, Scenario {}', existingScenario.designFeatureReferenceId, existingScenario.designScenarioReferenceId);

                    const devSteps = UserDevFeatureScenarioSteps.find({
                        userId: userContext.userId,
                        featureReferenceId: existingScenario.designFeatureReferenceId,
                        scenarioReferenceId: existingScenario.designScenarioReferenceId,
                        stepStatus: UserDevScenarioStepStatus.STEP_DEV_ONLY,
                        isRemoved: false
                    }).fetch();

                    log((msg) => console.log(msg), LogLevel.TRACE, 'Found {} additional dev only steps', devSteps.length);

                    devSteps.forEach((devStep) => {

                        // This indexing will place the unknown step where it was previously in the file barring additional steps inserted from the design...
                        const previousStep = UserDevFeatureScenarioSteps.findOne({_id: devStep.previousStepId});
                        let prevIndex = 0;
                        let nextIndex = 0;
                        if (previousStep) {
                            prevIndex = previousStep.stepIndex;
                        }
                        const nextStep = UserDevFeatureScenarioSteps.findOne({previousStepId: devStep._id});
                        if (nextStep) {
                            nextIndex = nextStep.stepIndex;
                        }

                        stepsToWrite.insert({
                            stepText: '    ' + devStep.stepType + ' ' + devStep.stepText + '\n',
                            stepIndex: (prevIndex + nextIndex) / 2
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
            if (existingFile) {

                const devScenarios = UserDevFeatureScenarios.find({
                    userId: userContext.userId,
                    userDevFeatureId: existingFile._id,
                    scenarioStatus: UserDevScenarioStatus.SCENARIO_UNKNOWN
                }).fetch();

                devScenarios.forEach((scenario) => {
                    fileText += '  ' + scenario.scenarioTag + '\n';
                    fileText += '  Scenario: ' + scenario.scenarioName + '\n';

                    // All Steps in an UNKNOWN Scenario are UNKNOWN
                    let devScenarioSteps = UserDevFeatureScenarioSteps.find(
                        {
                            userId: userContext.userId,
                            userDevFeatureId: existingFile._id,
                            userDevScenarioId: scenario._id,
                            isRemoved: false
                        },
                        {sort: {stepIndex: 1}}
                    ).fetch();

                    devScenarioSteps.forEach((step) => {
                        fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
                    });

                    fileText += '\n';

                });
            }

            // TODO - FIX THIS WITH NEW USER SETTING
            fs.writeFileSync('NONE' + fileName, fileText);
        }

    };

}

export default new MashFileServices();
