
class RestoreActionsClass{

    adminRestoresBackup(expectation){

        server.call('testRestore.restoreDesignBackup', 'admin', expectation);
    };
}

export const RestoreActions = new RestoreActionsClass();