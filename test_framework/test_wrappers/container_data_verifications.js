
import {RoleType, ViewType, ViewMode, DisplayContext, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class ContainerDataVerifications {

    applicationIsSeenInUpdateEditorForDesigner(applicationName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.APPLICATION, 'NONE', 'NONE',
            ComponentType.APPLICATION, applicationName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            applicationName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    designSectionIsSeenInUpdateEditorForDesigner(parentName, sectionName) {

        // When using this always use a section that is under an Application

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.APPLICATION, 'NONE', parentName,
            ComponentType.DESIGN_SECTION, sectionName,
            'gloria',
            ViewType.DESIGN_UPDATE_EDIT, DisplayContext.UPDATE_EDIT,
            'VALIDATE_COMPONENT_RETURNED',
            sectionName,
            (function (error, result) {
                return (error === null);
            })
        );
    }

    featureIsSeenInUpdateEditorForDesigner(featureGrandparent, featureParent, featureName) {

        server.call('testContainerServices.getAndValidateChildComponentsForParent',
            ComponentType.DESIGN_SECTION, featureGrandparent, featureParent,
            ComponentType.FEATURE, featureName,
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
            ComponentType.DESIGN_SECTION, featureGrandparent, featureParent,
            ComponentType.FEATURE, featureName,
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
            ComponentType.FEATURE, aspectGrandparent, featureName,
            ComponentType.FEATURE_ASPECT, aspectName,
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
            ComponentType.FEATURE, aspectGrandparent, featureName,
            ComponentType.FEATURE_ASPECT, aspectName,
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
            ComponentType.FEATURE_ASPECT, featureName, aspectName,
            ComponentType.SCENARIO, scenarioName,
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
            ComponentType.FEATURE_ASPECT, featureName, aspectName,
            ComponentType.SCENARIO, scenarioName,
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
