import {DefaultFeatureAspects}              from '../../collections/design/default_feature_aspects.js'


class DefaultFeatureAspectData{

    // INSERT ==========================================================================================================

    insertDefaultAspect(designId, aspect){

        return DefaultFeatureAspects.insert(
            {
                designId:               designId,
                defaultAspectName:      aspect.defaultAspectName,
                defaultAspectNameRaw:   aspect.defaultAspectNameRaw,
                defaultAspectIncluded:  aspect.defaultAspectIncluded,
                defaultAspectIndex:     aspect.defaultAspectIndex
            }
        );
    }

    // SELECT ==========================================================================================================

    getDefaultAspectsForDesign(designId){

        return DefaultFeatureAspects.find(
            {designId: designId},
            {sort: {defaultAspectIndex: 1}}
        ).fetch();
    }

    getOtherDefaultAspectsForDesign(designId, defaultAspectId){

        return DefaultFeatureAspects.find(
            {_id: {$ne: defaultAspectId}},
            {designId: designId}
        ).fetch();
    }

    getIncludedDefaultAspectsForDesign(designId){

        return DefaultFeatureAspects.find(
            {designId: designId, defaultAspectIncluded: true},
            {sort: {defaultAspectIndex: 1}}
        ).fetch();
    }

    // UPDATE ==========================================================================================================

    updateAspectName(aspectId, newNamePlain, newNameRaw){

        return DefaultFeatureAspects.update(
            {_id: aspectId},
            {
                $set:{
                    defaultAspectName:      newNamePlain,
                    defaultAspectNameRaw:   newNameRaw
                }
            }
        );
    }

    updateAspectIncluded(aspectId, included){

        return DefaultFeatureAspects.update(
            {_id: aspectId},
            {
                $set:{
                    defaultAspectIncluded:  included
                }
            }
        );
    }


    // REMOVE ==========================================================================================================

    removeAllDefaultAspects(){

        return DefaultFeatureAspects.remove({});
    }

    removeDesignDefaultAspects(designId){

        return DefaultFeatureAspects.remove({
            designId: designId
        });
    }

}

export default new DefaultFeatureAspectData();
