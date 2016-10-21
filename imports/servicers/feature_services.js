/**
 * Created by aston on 24/07/2016.
 */


class FeatureServices{

    getDefaultRawName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : "New Feature or Use Case",
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
                { "key" : "5efv7", "text" : "New Feature Aspect",
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
                        "text" : "As a \nI want to \nSo that I can ",
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
                { "key" : "5efv7", "text" : "Text relevant to this feature may be entered here...",
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