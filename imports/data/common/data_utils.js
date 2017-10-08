import DesignComponentData              from '../../data/design/design_component_db.js';
import DesignUpdateComponentData        from '../../data/design_update/design_update_component_db.js';

class DataUtils{

    getParentComponent(childComponent){

        if(childComponent.designUpdateId === 'NONE'){

            return DesignComponentData.getDesignComponentByRef(childComponent.designVersionId, childComponent.componentParentReferenceIdNew);

        } else {

            return DesignUpdateComponentData.getUpdateComponentByRef(childComponent.designVersionId, childComponent.designUpdateId, childComponent.componentParentReferenceIdNew);

        }
    }

}

export default new DataUtils();