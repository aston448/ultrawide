
import {RoleType, ViewType, ViewMode, DisplayContext, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class ContainerDataVerifications {

    featureIsSeenInUpdateEditorForDesigner(featureParent, featureName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE, featureParent, featureName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            featureName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureNotSeenInUpdateEditorForDesigner(featureParent, featureName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE, featureParent, featureName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_NO_COMPONENT_RETURNED',
            'NONE',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureAspectIsSeenInUpdateEditorForDesigner(featureName, aspectName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE_ASPECT, featureName, aspectName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            aspectName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureAspectNotSeenInUpdateEditorForDesigner(featureName, aspectName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.FEATURE_ASPECT, featureName, aspectName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_NO_COMPONENT_RETURNED',
            'NONE',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    scenarioIsSeenInUpdateEditorForDesigner(aspectName, scenarioName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.SCENARIO, aspectName, scenarioName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            scenarioName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    scenarioNotSeenInUpdateEditorForDesigner(aspectName, scenarioName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.SCENARIO, aspectName, scenarioName,
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
