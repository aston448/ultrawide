module.exports = {
    mocha: true,
    mochaConfig:
        {
            reporter: 'ultrawide-mocha-reporter',
            reporterOptions:
                {
                    resultsFile: '.test_results/mocha_int_results_server_sum.json',
                    consoleOutput: 'ON'
                }
        }
}