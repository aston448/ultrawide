
import {RoleType, ViewType, ViewMode, DisplayContext, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class ContainerDataVerifications {

    featureIsSeenInUpdateEditorForDesigner(featureGrandparent, featureParent, featureName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE, featureGrandparent, featureParent, featureName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            featureName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureNotSeenInUpdateEditorForDesigner(featureGrandparent, featureParent, featureName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE, featureGrandparent, featureParent, featureName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_NO_COMPONENT_RETURNED',
            'NONE',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureAspectIsSeenInUpdateEditorForDesigner(aspectGrandparent, featureName, aspectName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE_ASPECT, aspectGrandparent, featureName, aspectName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            aspectName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureAspectNotSeenInUpdateEditorForDesigner(aspectGrandparent, featureName, aspectName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE_ASPECT, aspectGrandparent, featureName, aspectName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_NO_COMPONENT_RETURNED',
            'NONE',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    scenarioIsSeenInUpdateEditorForDesigner(featureName, aspectName, scenarioName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.SCENARIO, featureName, aspectName, scenarioName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            scenarioName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    scenarioNotSeenInUpdateEditorForDesigner(featureName, aspectName, scenarioName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.SCENARIO, featureName, aspectName, scenarioName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_NO_COMPONENT_RETURNED',
            'NONE',
            (function (error, result) {
                return (error === null);
            })
        );
    }
}
export default new ContainerDataVerifications();
