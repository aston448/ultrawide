module.exports = {
    mocha: true,
    mochaConfig:
        {
            reporter: 'ultrawide-mocha-reporter',
            reporterOptions:
                {
                    resultsFile: '.test_results/mocha_acc_results_des.json',
                    consoleOutput: 'ON'
                }
        }
}