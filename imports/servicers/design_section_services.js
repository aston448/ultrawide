
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';

class DesignSectionServices{

    getDefaultRawName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };

    };

    getDefaultRawText(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    };

}

export default new DesignSectionServices();