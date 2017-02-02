
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class UpdateComponentVerifications{

    componentExistsForDesignerCurrentUpdate(type, parentName, name){
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', type, parentName, name, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    };

    componentDoesNotExistForDesignerCurrentUpdate(type, name){
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', type, name, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    componentIsInScopeForDesignerCurrentUpdate(type, parentName, name){
        server.call('verifyDesignUpdateComponents.componentIsInScope', type, parentName, name, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    }

    componentIsInParentScopeForDesignerCurrentUpdate(type, parentName, name){
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', type, parentName, name, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    }

    componentIsNotInScopeForDesignerCurrentUpdate(type, parentName, name){
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', type, parentName, name, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    }

    componentIsRemovedForDesigner(componentType, parentName, componentName){
        server.call('verifyDesignUpdateComponents.componentIsRemoved', componentType, parentName, componentName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    componentIsNotRemovedForDesigner(componentType, parentName, componentName){
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', componentType, parentName, componentName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(componentType, componentName, count){
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', componentType, componentName, count, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    designerSelectedComponentIsAboveComponent_WithParent_Called_(targetType, targetParentName, targetName){
        server.call('verifyDesignUpdateComponents.selectedComponentIsAboveComponent', targetType, targetParentName, targetName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    designerSelectedFeatureNarrativeIs(narrativeText){
        server.call('verifyDesignUpdateComponents.selectedFeatureNarrativeIs', narrativeText, 'gloria');
    }
}

export default new UpdateComponentVerifications();