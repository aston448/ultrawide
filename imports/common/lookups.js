import {ComponentType} from '../constants/constants.js';


// In this class we can change what is displayed without buggering up the existing data.
// Could be changed to source from stored data ...

class TextLookups {

    componentTypeName(componentType){

        switch(componentType){
            case ComponentType.APPLICATION:
                return 'Application';
            case ComponentType.DESIGN_SECTION:
                return 'Section';
            case ComponentType.FEATURE:
                return 'Feature';
            case ComponentType.FEATURE_ASPECT:
                return 'Feature Aspect';
            case ComponentType.SCENARIO:
                return 'Scenario';
            default:
                return 'Text not defined';
        }
    };

}

export default new TextLookups();
