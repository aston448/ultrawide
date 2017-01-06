import {ViewType, ComponentType, MashStatus, MashTestStatus, FeatureTestSummaryStatus, DisplayContext} from '../constants/constants.js';


// In this class we can change what is displayed without buggering up the existing data.
// Could be changed to source from stored data ...

class TextLookups {

    viewText(view){

        switch(view){
            case ViewType.ADMIN:
                return 'ADMINISTRATION';
            case ViewType.AUTHORISE:
                return 'LOGIN';
            case ViewType.CONFIGURE:
                return 'CONFIGURATION';
            case ViewType.DESIGN_NEW_EDIT:
                return 'DESIGN EDITOR';
            case ViewType.DESIGN_PUBLISHED_VIEW:
                return 'DESIGN VIEW';
            case ViewType.DESIGN_UPDATE_EDIT:
                return 'DESIGN UPDATE EDITOR';
            case ViewType.DESIGN_UPDATE_VIEW:
                return 'DESIGN UPDATE VIEW';
            case ViewType.DESIGNS:
                return 'SELECT DESIGN';
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                return 'WORK PACKAGE IMPLEMENTATION';
            case ViewType.SELECT:
                return 'ITEM SELECTION';
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                return 'WORK PACKAGE SCOPING';
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return 'WORK PACKAGE VIEW';
        }
    }

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
    };

    mashTestTypes(displayContext){

        let testType = '';
        switch (displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                return 'Acceptance';
            case DisplayContext.MASH_INT_TESTS:
                return 'Integration';
            case DisplayContext.MASH_UNIT_TESTS:
                return 'Unit';
        }
    };

}

export default new TextLookups();
