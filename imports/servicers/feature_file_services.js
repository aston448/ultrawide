import fs from 'fs';

import {DesignComponents}       from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps} from '../collections/design/feature_background_steps.js';
import {ScenarioSteps}          from '../collections/design/scenario_steps.js';
import {WorkPackages}           from '../collections/work/work_packages.js';

import {ComponentType, WorkPackageType, LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';

class FeatureFileServices{

    // Convert a whole base design feature into a Gherkin feature file
    writeFeatureFile(userContext){

        const path = userContext.featureFilesLocation;

        log((msg) => console.log(msg), LogLevel.TRACE, 'Exporting feature file to {}', path);

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
                        componentReferenceId: userContext.featureReferenceId
                    }
                );

                featureName = feature.componentName;

                scenarios = DesignComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: userContext.featureReferenceId
                    }
                ).fetch();
                break;

            case WorkPackageType.WP_UPDATE:
                feature = DesignUpdateComponents.findOne(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: userContext.featureReferenceId
                    }
                );

                featureName = feature.componentNameNew;

                scenarios = DesignUpdateComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentType: ComponentType.SCENARIO,
                        componentFeatureReferenceId: userContext.featureReferenceId
                    }
                ).fetch();
                break;
        }

        log((msg) => console.log(msg), LogLevel.TRACE, 'Feature exporting is {}', featureName);

        const backgroundSteps = FeatureBackgroundSteps.find(
            {
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                featureReferenceId: userContext.featureReferenceId
            }
        ).fetch();


        const fileName = featureName.replace(' ', '_') + '.feature';

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
        scenarios.forEach((scenario) => {
            let scenarioSteps = [];

            fileText += '  @test\n';
            fileText += '  Scenario: ' + scenario.componentName + '\n';

            scenarioSteps = ScenarioSteps.find(
                {
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    scenarioReferenceId: scenario.componentReferenceId
                }
            ).fetch();

            scenarioSteps.forEach((step) => {
                fileText += ('    ' + step.stepType + ' ' + step.stepText + '\n');
            });

            fileText += '\n';

        });

        fs.writeFileSync(path + fileName, fileText);

    };

    getFeatureFiles(userContext){

        if(userContext.featureFilesLocation != 'NONE'){

            let featureFiles = [];
            let files = fs.readdirSync(userContext.featureFilesLocation);

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

    getFeatureFileText(userContext, fileName){

        return fs.readFileSync(userContext.featureFilesLocation + fileName);

    }

    getFeatureName(fileText){

        let featureStartIndex = fileText.indexOf('Feature:');
        let featureEndIndex = 0;



        if(featureStartIndex >= 0){

            featureEndIndex = fileText.indexOf('\n', featureStartIndex);

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for feature name from {} to {}", featureStartIndex, featureEndIndex);

            return fileText.substring(featureStartIndex + 8, featureEndIndex).trim();

        } else {
            return '';
        }
    }

}

export default new FeatureFileServices();
