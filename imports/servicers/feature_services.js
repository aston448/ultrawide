
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';

class FeatureServices{

    getDefaultRawName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultComponentNames.NEW_FEATURE_NAME,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };

    };

    getDefaultRawAspectName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };

    };

    getDefaultRawNarrative(){

        return {
            "entityMap" : {  },
            "blocks" :
                [
                    {
                        "key" : "5efv7",
                        "text" : DefaultComponentNames.NEW_NARRATIVE_TEXT,
                        "type" : "unstyled",
                        "depth" : 0,
                        "inlineStyleRanges" : [ ],
                        "entityRanges" : [ ],
                        "data" : {  }
                    }
                ]
        }
    };

    getDefaultRawText(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultDetailsText.NEW_FEATURE_DETAILS,
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

export default new FeatureServices();