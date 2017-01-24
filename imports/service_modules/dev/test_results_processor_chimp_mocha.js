import fs from 'fs';

import {UserIntTestResults} from '../../collections/dev/user_int_test_results.js'

import {TestType, MashTestStatus, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServices{

    getJsonTestResults(resultsFile, userId, testType){

        if(Meteor.isServer) {

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open mocha tests file: {}", e);
                return [];
            }

            // Clean ---------------------------------------------------------------------------------------------------
            let cleanText = '';
            try {
                cleanText = this.cleanResults(resultsText.toString());
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to clean mocha tests file: {}", e);
                return [];
            }

            log((msg) => console.log(msg), LogLevel.TRACE, "Cleaned file text is:\n {}", cleanText);


            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = [];

            if(cleanText.length > 0) {
                try {
                    resultsJson = JSON.parse(cleanText);
                } catch (e) {
                    log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse mocha tests file: {}", e);
                    return [];
                }
            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "No integration test data found", e);
                return [];
            }


            // Return Standard Data ------------------------------------------------------------------------------------

            log((msg) => console.log(msg), LogLevel.DEBUG, "Results: Passes {}, Fails {}, Pending {}", resultsJson.passes.length, resultsJson.failures.length, resultsJson.pending.length,);

            switch(testType){
                case TestType.INTEGRATION:

                    // Clear existing results for user
                    UserIntTestResults.remove({userId: userId});

                    // Add latest results
                    resultsJson.passes.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_PASS,
                                testError:          '',
                                testErrorReason:    '',
                                testDuration:       test.duration,
                                stackTrace:         ''
                            }
                        );
                    });

                    resultsJson.failures.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_FAIL,
                                testError:          test.err.message,       // This is the Reason plus the Error
                                testErrorReason:    test.err.reason,
                                testDuration:       test.duration,
                                stackTrace:         test.err.stack
                            }
                        );
                    });

                    resultsJson.pending.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_PENDING,
                                testError:          '',
                                testErrorReason:    '',
                                testDuration:       0,
                                stackTrace:         ''
                            }
                        );
                    });

                    break;
                default:
            }



        }

    };

    cleanResults(fileText){

        // For this format, want everything from the first {

        const jsonStart = fileText.indexOf('{');

        return fileText.substring(jsonStart);

    }

}

export default new ChimpMochaTestServices();