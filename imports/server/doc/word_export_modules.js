
import { WordFonts }    from '../../../imports/constants/constants.js';

class WordExportModules {

    newPage(document){

        document.putPageBreak();
    }

    newLine(document){

        const p = document.createP ();
        p.addLineBreak ();
    }

    mainTitle(p, titleText){
        p.addText(titleText, {font_face: WordFonts.MAIN_TITLE.font, font_size: WordFonts.MAIN_TITLE.size})
    }

    subTitle(p, subtitleText){
        p.addText(subtitleText, {font_face: WordFonts.SUB_TITLE.font, font_size: WordFonts.SUB_TITLE.size})
    }

    application(p, applicationName){
        p.addText(applicationName, {font_face: WordFonts.APPLICATION.font, font_size: WordFonts.APPLICATION.size})
    }

    designSection(p, sectionName, sectionLevel){

        if(sectionLevel === 1){
            p.addText(sectionName, {font_face: WordFonts.SECTION_1.font, font_size: WordFonts.SECTION_1.size, color: WordFonts.SECTION_1.colour})
        } else{
            p.addText(sectionName, {font_face: WordFonts.SECTION_N.font, font_size: WordFonts.SECTION_N.size, color: WordFonts.SECTION_N.colour})
        }
    }

    feature(p, featureName){

        p.addText(featureName, {font_face: WordFonts.FEATURE.font, font_size: WordFonts.FEATURE.size, color: WordFonts.FEATURE.colour})
    }

    narrative(p, text){

        p.addText(text, {font_face: WordFonts.NARRATIVE.font, font_size: WordFonts.NARRATIVE.size, color: WordFonts.NARRATIVE.colour, italic: true})
    }

    aspect(p, aspectName){

        p.addText(aspectName, {font_face: WordFonts.ASPECT.font, font_size: WordFonts.ASPECT.size, color: WordFonts.ASPECT.colour, bold: true})
    }

    scenario(p, scenarioName){

        p.addText(scenarioName, {font_face: WordFonts.SCENARIO.font, font_size: WordFonts.SCENARIO.size, color: WordFonts.SCENARIO.colour})
    }

    details(p, detailsText){

        p.addText(detailsText, {font_face: WordFonts.DETAILS.font, font_size: WordFonts.DETAILS.size, color: WordFonts.DETAILS.colour})
    }

    term(p, termName){

        p.addText(termName, {font_face: WordFonts.DICT_TERM.font, font_size: WordFonts.DICT_TERM.size, color: WordFonts.DICT_TERM.colour})
    }

    definition(p, definitionText){

        p.addText(definitionText, {font_face: WordFonts.DICT_DEF.font, font_size: WordFonts.DICT_DEF.size, color: WordFonts.DICT_DEF.colour})
    }
}

export default new WordExportModules();