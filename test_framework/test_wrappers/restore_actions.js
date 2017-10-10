
class RestoreActions{

    adminRestoresBackup(expectation){

        server.call('testRestore.restoreDesignBackup', 'admin', expectation);
    };
}

export default new RestoreActions();