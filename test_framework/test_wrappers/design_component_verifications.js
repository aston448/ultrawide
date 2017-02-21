
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentVerifications{

    componentOfType_Called_DoesNotExist(type, name){
        server.call('verifyDesignComponents.componentDoesNotExistCalled', type, name,
          (function(error, result){
              return(error === null);
          })
        );
    }

    componentOfType_Called_ExistsInDesign_Version_(type, name, designName, designVersionName){
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', designName, designVersionName, type, name,
          (function(error, result){
              return(error === null);
          })
        );
    }

    componentOfType_Called_InDesign_Version_ParentIs_(type, name, designName, designVersionName, parentName){
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', designName, designVersionName, type, name, parentName,
          (function(error, result){
              return(error === null);
          })
        );
    }

    componentOfType_Called_InDesign_Version_FeatureRefIs_(type, parentName, name, designName, designVersionName, featureName){
        server.call('verifyDesignComponents.componentInDesignVersionFeatureRefIs', designName, designVersionName, type, parentName, name, featureName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    componentOfType_Called_InDesign_Version_CountIs_(type, name, designName, designVersionName, count){
        server.call('verifyDesignComponents.componentCountCalledIs', type, name, designName, designVersionName, count,
          (function(error, result){
              return(error === null);
          })
        );
    }

    sectionComponentCalled_LevelIs_(name, level){
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, name, level,
          (function(error, result){
              return(error === null);
          })
        );
    }

    scenarioCalled_FeatureReferenceIs_(scenarioName, featureName){
        server.call('verifyDesignComponents.componentFeatureIs', ComponentType.SCENARIO, scenarioName, featureName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designerSelectedComponentIsAboveComponent_WithParent_Called_(targetType, targetParentName, targetName){
        server.call('verifyDesignComponents.selectedComponentIsAboveComponent', targetType, targetParentName, targetName, 'gloria',
          (function(error, result){
              return(error === null);
          })
        );
    }

    feature_NarrativeIs(featureName, narrativeText){
        server.call('verifyDesignComponents.featureNarrativeIs', featureName, narrativeText,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designerSelectedComponentDetailsTextIs(detailsText){
        server.call('verifyDesignComponents.selectedComponentDetailsTextIs', detailsText, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    }

    designerSelectedComponentMergeStatusIs_(mergeStatus){
        server.call('verifyDesignComponents.selectedComponentMergeStatusIs', mergeStatus, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }



}

export default new DesignComponentVerifications();
