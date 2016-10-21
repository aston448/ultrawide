/**
 * Created by aston on 29/09/2016.
 */

import DesignServices from '../../servicers/design_services.js';

class DataCreate {

    processInstructions(instructions){

        instructions.map((instruction) => {

            switch(instruction.action){
                case 'CREATE':
                    let itemId = this.createItem(instruction.item, instruction.in);

                    if(itemId) {
                        console.log("Created " + instruction.item + ' with ID ' + itemId);
                        this.renameItem(instruction.item, itemId, instruction.newName, instruction.version);
                    }
                    break;
                case 'UPDATE':

            }

        });

    };

    createItem(item, parent){

        switch(item){
            case 'DESIGN':
                let result =  DesignServices.addDesign();
                console.log("Result: Design: " +  result);
                return result;
        }
    };

    renameItem(item, itemId, name, version){
        switch(item) {
            case 'DESIGN':
                DesignServices.updateDesignName(itemId, name);
                break;
        }
    }

    updateItem(item, parent, newName, newVersion){

    }
}

export default new DataCreate;