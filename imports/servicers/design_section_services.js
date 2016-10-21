/**
 * Created by aston on 29/08/2016.
 */


class DesignSectionServices{

    getDefaultRawName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : "New Design Section",
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
                { "key" : "5efv7", "text" : "Text relevant to this section may be entered here...",
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