import fs from 'fs';

import { MashTestStatus, TestType, LogLevel} from '../../constants/constants.js';
import {log} from '../../common/utils.js';

// Data Access
import UserUnitTestResultData               from '../../data/test_results/user_unit_test_result_db.js';
import UserIntegrationTestResultData        from '../../data/test_results/user_integration_test_result_db.js';
import UserAcceptanceTestResultData         from '../../data/test_results/user_acceptance_test_result_db.js';

// Plugin class to read test results from an ultrawide-mocha-reporter JSON file
class UltrawideMochaTestServices{

    getJsonTestResults(resultsFile, userId, testType){

        if(Meteor.isServer) {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Opening file {}.", resultsFile);

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';
            let cleanText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);

            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open meteor mocha tests file: {}", e);
                return [];
            }

            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = null;

            //log((msg) => console.log(msg), LogLevel.DEBUG, "  Original File = {}", resultsText);


            try{
                resultsJson = JSON.parse(resultsText);
                //log((msg) => console.log(msg), LogLevel.DEBUG, "  First Pass = {}", resultsJson.substr(1, 1000));

                //resultsJson = JSON.parse(resultsJson);

            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse meteor mocha tests file: {}", e);
                return [];
            }

            // Store Standard Data -------------------------------------------------------------------------------------

            // testFullName must always contain the Scenario as all of part of it.  May also contain test Suite Group and Name as well
            // If it contains these it should be in the form 'Suite Group Name'

            //log((msg) => console.log(msg), LogLevel.DEBUG, "  JSON Passes Count = {}", resultsJson.passes.length);

            if(resultsJson) {

                let resultsBatch = [];

                // Add latest results
                if(resultsJson.passes) {
                    resultsJson.passes.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testName: test.title,
                                testResult: MashTestStatus.MASH_PASS,
                                testError: '',
                                testErrorReason: '',
                                testDuration: test.duration,
                                testStackTrace: '',
                            }
                        );
                    });
                }

                if(resultsJson.failures) {
                    resultsJson.failures.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testName: test.title,
                                testResult: MashTestStatus.MASH_FAIL,
                                testError: test.err.message,
                                testErrorReason: 'Expected "' + test.err.expected + '" but got "' + test.err.actual + '"',
                                testDuration: test.duration,
                                testStackTrace: test.err.stack
                            }
                        );
                    });
                }

                if(resultsJson.pending) {
                    resultsJson.pending.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testName: test.title,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testResult: MashTestStatus.MASH_PENDING,
                                testError: '',
                                testErrorReason: '',
                                testDuration: 0,
                                testStackTrace: ''
                            }
                        );
                    });
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, "    New batches populated.");

                if (resultsBatch.length > 0) {
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} acc results...", resultsBatch.length);
                            UserAcceptanceTestResultData.bulkInsertData(resultsBatch);
                            break;
                        case TestType.INTEGRATION:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} int results...", resultsBatch.length);
                            UserIntegrationTestResultData.bulkInsertData(resultsBatch);
                            break;
                        case TestType.UNIT:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} unit results...", resultsBatch.length);
                            UserUnitTestResultData.bulkInsertData(resultsBatch);
                            break;
                    }
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, "    New data inserted.");

                log((msg) => console.log(msg), LogLevel.DEBUG, "DONE Ultrawide Mocha results");

            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "File <{}> had no data.", resultsFile);
            }
        }
    };

}

export default new UltrawideMochaTestServices();
