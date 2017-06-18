import fs from 'fs';

import {DesignVersionComponents}               from '../../collections/design/design_version_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';

import { UserUnitTestResults }           from '../../collections/test_results/user_unit_test_results';

import {ComponentType, MashStatus, MashTestStatus, TestType, TestDataStatus, LogLevel} from '../../constants/constants.js';
import {log} from '../../common/utils.js';

// Plugin class to read test results from a meteor -test mocha JSON reported file
class MeteorMochaTestServices{

    getJsonTestResults(resultsFile, userId){

        if(Meteor.isServer) {

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open meteor mocha tests file: {}", e);
                return [];
            }

            // Clean ---------------------------------------------------------------------------------------------------

            // No cleaning needed for this file
            let cleanText = resultsText;

            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = [];

            try{
                resultsJson = JSON.parse(cleanText);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse meteor mocha tests file: {}", e);
                return [];
            }

            // Store Standard Data -------------------------------------------------------------------------------------

            // testFullName must always contain the Scenario as all of part of it.  May also contain test Suite Group and Name as well
            // If it contains these it should be in the form 'Suite Group Name'

            let resultsBatch = [];

            // Add latest results
            resultsJson.passes.forEach((test) => {

                resultsBatch.push(
                    {
                        userId:             userId,
                        testFullName:       test.fullTitle,
                        testSuite:          'NONE',             // Not yet calculated
                        testGroup:          'NONE',             // Not yet calculated
                        testName:           test.title,
                        testResult:         MashTestStatus.MASH_PASS,
                        testError:          '',
                        testErrorReason:    '',
                        testDuration:       test.duration,
                        testStackTrace:     '',
                    }
                );
            });

            resultsJson.failures.forEach((test) => {

                resultsBatch.push(
                    {
                        userId:             userId,
                        testFullName:       test.fullTitle,
                        testSuite:          'NONE',             // Not yet calculated
                        testGroup:          'NONE',             // Not yet calculated
                        testName:           test.title,
                        testResult:         MashTestStatus.MASH_FAIL,
                        testError:          test.err.message,
                        testErrorReason:    'Expected "' +  test.err.expected + '" but got "' + test.err.actual + '"',
                        testDuration:       test.duration,
                        testStackTrace:     test.err.stack
                    }
                );
            });

            resultsJson.pending.forEach((test) => {

                resultsBatch.push(
                    {
                        userId:             userId,
                        testFullName:       test.fullTitle,
                        testName:           test.title,
                        testSuite:          'NONE',             // Not yet calculated
                        testGroup:          'NONE',             // Not yet calculated
                        testResult:         MashTestStatus.MASH_PENDING,
                        testError:          '',
                        testErrorReason:    '',
                        testDuration:       0,
                        stackTrace:         ''
                    }
                );
            });

            log((msg) => console.log(msg), LogLevel.DEBUG, "    New batches populated.");

            if(resultsBatch.length > 0) {
                UserUnitTestResults.batchInsert(resultsBatch);
            }

            log((msg) => console.log(msg), LogLevel.DEBUG, "    New data inserted.");

            log((msg) => console.log(msg), LogLevel.DEBUG, "DONE Meteor Mocha results");
        }
    };

}

export default new MeteorMochaTestServices();
