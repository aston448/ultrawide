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
import {UserDesignDevMashData}          from '../collections/dev/user_design_dev_mash_data.js';

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

            // Get Scenario and Step Data ------------------------------------------------------------------------------

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

                    // If the scenario is in the design, assume any steps in it that are in the design scenario
                    // are design or WP steps (depending on where te scenario is) and any other steps are not.

                    devScenario.steps.forEach((step) => {

                        let devStepData = {
                            // Identity
                            userId:                 userContext.userId,
                            userDevFeatureId:       devFeatureId,
                            userDevScenarioId:      devScenarioId,
                            featureReferenceId:     'NONE',                 // Until known to be in Design
                            scenarioReferenceId:    'NONE',                 // Until known to be in Design
                            scenarioStepReferenceId:'NONE',                 // Until known to be in Design
                            // Data
                            stepType:               this.getStepType(step),
                            stepText:               this.getStepText(step),
                            stepFullName:           step,
                            // Status
                            stepStatus:             UserDevScenarioStepStatus.STEP_DEV_ONLY  // Until known to be in Design
                        };

                        // Returns null if no step found
                        const designStep = this.getDesignStep(step, devScenarioData.scenarioReferenceId, userContext);

                        if(designStep){
                            devStepData.featureReferenceId = devScenarioData.featureReferenceId;
                            devStepData.scenarioReferenceId = designStep.scenarioReferenceId;
                            devStepData.scenarioStepReferenceId = designStep.stepReferenceId;
                            devStepData.stepStatus = UserDevScenarioStepStatus.STEP_LINKED;
                        }

                        UserDevFeatureScenarioSteps.insert({
                            // Identity
                            userId:                     devStepData.userId,
                            userDevFeatureId:           devStepData.userDevFeatureId,
                            userDevScenarioId:          devStepData.userDevScenarioId,
                            featureReferenceId:         devStepData.featureReferenceId,
                            scenarioReferenceId:        devStepData.scenarioReferenceId,
                            scenarioStepReferenceId:    devStepData.scenarioStepReferenceId,
                            // Data
                            stepType:                   devStepData.stepType,
                            stepText:                   devStepData.stepText,
                            stepFullName:               devStepData.stepFullName,
                            // Status
                            stepStatus:                 devStepData.stepStatus
                        });
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

                    // Where the scenario is not in the Design, all steps are assumed to be DEV only even if they do happen to match steps in the design
                    devScenario.steps.forEach((step) => {

                        UserDevFeatureScenarioSteps.insert({
                            // Identity
                            userId:                     userContext.userId,
                            userDevFeatureId:           devFeatureId,
                            userDevScenarioId:          devScenarioId,
                            featureReferenceId:         'NONE',
                            scenarioReferenceId:        'NONE',
                            scenarioStepReferenceId:    'NONE',
                            // Data
                            stepType:                   this.getStepType(step),
                            stepText:                   this.getStepText(step),
                            stepFullName:               step,
                            // Status
                            stepStatus:                 UserDevScenarioStepStatus.STEP_DEV_ONLY
                        });
                    });
                }



            });

        });

    };


    getDesignStep(step, scenarioRef, userContext){

        // Even if the scenario has duplicate steps in it they are then the same step so have the same reference...

        let designStep = ScenarioSteps.findOne({
            designId:                   userContext.designId,
            designVersionId:            userContext.designVersionId,
            designUpdateId:             userContext.designUpdateId,
            scenarioReferenceId:        scenarioRef,
            stepFullName:               step
        });

        return (designStep);
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

                    // Create the scenario step mash data for this scenario
                    this.createScenarioStepMashData(item.componentReferenceId, userContext);

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

    createScenarioStepMashData(scenarioReferenceId, userContext){
        // TODO - common function that can be used in all 3 above functions...

    }

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
