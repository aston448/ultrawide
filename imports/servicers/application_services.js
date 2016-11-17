
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';

class ApplicationServices{

    getDefaultRawName(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : DefaultComponentNames.NEW_APPLICATION_NAME,
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
                { "key" : "5efv7", "text" : DefaultDetailsText.NEW_APPLICATION_DETAILS,
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

export default new ApplicationServices();