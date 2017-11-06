

import officegen from 'officegen';
import fs from 'fs';
import async from 'async';
import {convertFromRaw} from 'draft-js';

import WordExportModules from './word_export_modules.js';

import DesignData           from '../../../imports/data/design/design_db.js';
import DesignVersionData    from '../../../imports/data/design/design_version_db.js';
import DesignComponentData  from '../../../imports/data/design/design_component_db.js';
import DomainDictionaryData from '../../../imports/data/design/domain_dictionary_db.js';

import { ComponentType, UpdateMergeStatus } from "../../constants/constants";
import { DefaultDetailsText } from "../../constants/default_names";

class DocumentExportServices{

    exportWordDocument(designId, designVersionId){

        let docx = officegen ( {
            type: 'docx',
            orientation: 'portrait',
            pageMargins: { top: 200, left: 200, bottom: 200, right: 200 }
        } );

        docx.on ( 'error', ( err ) => {
            console.log ( err );
        });


        // Get Data ----------------------------------------------------------------------------------------------------
        const designVersionData = this.getDesignVersionData(designId, designVersionId);

        // Make the Doc ------------------------------------------------------------------------------------------------
        let paragraph = docx.createP();

        // Front Page
        WordExportModules.mainTitle(paragraph, designVersionData.designName);
        paragraph = docx.createP();
        WordExportModules.subTitle(paragraph, designVersionData.designVersionName + ' version: ' + designVersionData.designVersionNumber)



        // Get the applications in the order they are in the Design Version
        const applications = this.getApplications(designVersionId);

        applications.forEach((application) => {

            if(application.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                WordExportModules.newPage(docx);

                paragraph = docx.createP();
                WordExportModules.application(paragraph, application.componentNameNew);

                // Details
                let details = convertFromRaw(application.componentTextRawNew).getPlainText();

                if (details !== DefaultDetailsText.NEW_APPLICATION_DETAILS) {
                    paragraph = docx.createP();
                    WordExportModules.details(paragraph, details);
                }

                // Recursively get sections
                this.getChildDesignSections(docx, designVersionId, application.componentReferenceId);
            }

        });

        // Domain Dictionary
        const dictionary = DomainDictionaryData.getAllTerms(designId, designVersionId);

        WordExportModules.newPage(docx);

        paragraph = docx.createP();
        WordExportModules.application(paragraph, 'Domain Dictionary');

        paragraph = docx.createP ();
        paragraph.addHorizontalLine ();

        dictionary.forEach((term) => {

            paragraph = docx.createP();
            WordExportModules.term(paragraph, term.domainTermNew);

            let definition = convertFromRaw(term.domainTextRaw).getPlainText();

            paragraph = docx.createP();
            WordExportModules.definition(paragraph, definition);

            paragraph = docx.createP ();
            paragraph.addHorizontalLine ();

        });


        // Write File --------------------------------------------------------------------------------------------------

        let out = fs.createWriteStream ( '/Users/aston/ultrawide.docx' );

        out.on ( 'error', function ( err ) {
            console.log ( err );
        });

        async.parallel ([
            function ( done ) {
                out.on ( 'close', function () {
                    console.log ( 'Word Document FS Exported' );
                    done ( null );
                });
                docx.generate ( out );
            }

        ], function ( err ) {
            if ( err ) {
                console.log ( 'error: ' + err );
            } // Endif.
        });
    }

    getDesignVersionData(designId, designVersionId){

        const design = DesignData.getDesignById(designId);
        const designVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return{
            designName:             design.designName,
            designVersionName:      designVersion.designVersionName,
            designVersionNumber:    designVersion.designVersionNumber
        }
    }

    getApplications(designVersionId){

        return DesignVersionData.getAllApplications(designVersionId);
    }

    getChildDesignSections(docx, designVersionId, parentReferenceId){

        const childComponents = DesignComponentData.getChildComponents(designVersionId, parentReferenceId);

        let featureCount = 0;
        let paragraph = null;

        childComponents.forEach((component) => {

            if(component.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                if (component.componentType === ComponentType.DESIGN_SECTION) {

                    WordExportModules.newPage(docx);

                    paragraph = docx.createP();
                    WordExportModules.designSection(paragraph, component.componentNameNew, component.componentLevel);

                    // Details
                    let details = convertFromRaw(component.componentTextRawNew).getPlainText();

                    if (details !== DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS) {
                        paragraph = docx.createP();
                        WordExportModules.details(paragraph, details);
                    }

                    this.getChildDesignSections(docx, designVersionId, component.componentReferenceId)

                } else {

                    // It must be a feature

                    // For all features apart from the first one, start a new page
                    // if(featureCount > 0){
                    //     WordExportModules.newPage(docx);
                    // }

                    this.writeFeature(docx, designVersionId, component.componentReferenceId);

                    featureCount++;
                }
            }

        });
    }

    writeFeature(docx, designVersionId, featureRefId){

        let  paragraph = docx.createP ();
        paragraph.addHorizontalLine ();

        const feature = DesignComponentData.getDesignComponentByRef(designVersionId, featureRefId);

        paragraph = docx.createP();
        WordExportModules.feature(paragraph, feature.componentNameNew);

        let narrativeText = feature.componentNarrativeNew.replace('So', 'so');

        paragraph = docx.createP();

        WordExportModules.narrative(paragraph, narrativeText);

        // Details
        let details = convertFromRaw(feature.componentTextRawNew).getPlainText();

        if(details !== DefaultDetailsText.NEW_FEATURE_DETAILS) {
            paragraph = docx.createP();
            WordExportModules.details(paragraph, details);
        }

        this.writeFeatureAspects(docx, designVersionId, featureRefId)
    }

    writeFeatureAspects(docx, designVersionId, featureRefId){

        const aspects = DesignComponentData.getFeatureAspects(designVersionId, featureRefId);

        aspects.forEach((aspect) => {

            if(aspect.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                // Only include aspect if it has scenarios
                if (DesignComponentData.getChildCount(designVersionId, aspect.componentReferenceId) > 0) {

                    let paragraph = docx.createP();

                    WordExportModules.aspect(paragraph, aspect.componentNameNew);

                    this.writeScenarios(docx, designVersionId, aspect.componentReferenceId);
                }
            }
        });

    }

    writeScenarios(docx, designVersionId, aspectRefId){

        const scenarios = DesignComponentData.getNonRemovedChildComponentsOfType(designVersionId, ComponentType.SCENARIO, aspectRefId);

        scenarios.forEach((scenario) => {

            let paragraph = docx.createListOfDots();
            WordExportModules.scenario(paragraph, scenario.componentNameNew);

            // Details
            let details = convertFromRaw(scenario.componentTextRawNew).getPlainText();

            if(details !== DefaultDetailsText.NEW_SCENARIO_DETAILS) {
                paragraph = docx.createP();
                WordExportModules.details(paragraph, details);
            }
        });
    }

}

export default new DocumentExportServices();