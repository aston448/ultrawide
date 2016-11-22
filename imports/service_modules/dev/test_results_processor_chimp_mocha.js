import fs from 'fs';
import {MashTestStatus, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServices{

    getJsonTestResults(resultsFile){

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
            if(cleanText.length > 0) {
                let resultsJson = [];

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

            let returnData = [];

            resultsJson.passes.forEach((test) => {
                returnData.push(
                    {
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
                returnData.push(
                    {
                        testName:           test.title,
                        testFullName:       test.fullTitle,
                        testResult:         MashTestStatus.MASH_FAIL,
                        testError:          test.err.error,
                        testErrorReason:    test.err.reason,
                        testDuration:       test.duration,
                        stackTrace:         test.err.stack
                    }
                );
            });

            resultsJson.pending.forEach((test) => {
                returnData.push(
                    {
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

            return returnData;

        }

    };

    cleanResults(fileText){

        // For this format, want everything from the first {

        const jsonStart = fileText.indexOf('{');

        return fileText.substring(jsonStart);

    }

}

export default new ChimpMochaTestServices();