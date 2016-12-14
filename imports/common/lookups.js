import {ComponentType, MashStatus, MashTestStatus, FeatureTestSummaryStatus} from '../constants/constants.js';


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


    mashStatus(mashStatus){

        switch(mashStatus){
            case MashStatus.MASH_LINKED:
                return 'Implemented';
            case MashStatus.MASH_NOT_IMPLEMENTED:
                return 'Not Implemented';
            case MashStatus.MASH_NOT_DESIGNED:
                return 'Not in Design';
            default:
                return 'UNKNOWN';
        }

    };

    mashTestStatus(mashTestStatus){

        switch(mashTestStatus){
            case MashTestStatus.MASH_NOT_LINKED:
                return 'No Test';
            case MashTestStatus.MASH_PENDING:
                return 'Pending';
            case MashTestStatus.MASH_PASS:
                return 'Pass';
            case MashTestStatus.MASH_FAIL:
                return 'Fail';
        }
    };

    featureSummaryStatus(featureSummaryStatus){

        switch(featureSummaryStatus){
            case FeatureTestSummaryStatus.FEATURE_PASSING_TESTS:
                return 'Tests are passing in this feature';
            case FeatureTestSummaryStatus.FEATURE_FAILING_TESTS:
                return 'Tests are failing in this feature';
            case FeatureTestSummaryStatus.FEATURE_NO_TESTS:
                return 'No tests in this feature';
            default:
                return 'No tests in this feature';
        }
    }

}

export default new TextLookups();
