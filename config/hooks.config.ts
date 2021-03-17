import {ReportAggregator} from '@rpii/wdio-html-reporter';
import {TestRailReporter} from '../support/utils/test-rail-reporter'

export const hooksConfig = {
  onPrepare: function (config, capabilities) {

    global.testRailReporter = new TestRailReporter({
      domain: process.env.TESTRAIL_DOMAIN,
      username: process.env.TESTRAIL_username,
      apiToken: process.env.TESTRAIL_apiToken,
      projectKey: process.env.TESTRAIL_projectKey,
    });
    global.testRailReporter.cleanDir();


    let reportAggregator = new ReportAggregator({
      outputDir: './reports/html-reports/',
      filename: 'master-report.html',
      reportTitle: 'Master Report',
      // browserName : browser.capabilities.browserName,
      // to use the template override option, can point to your own file in the test project:
      // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs')
    });
    reportAggregator.clean() ;

    global.reportAggregator = reportAggregator;
  },

  onComplete: function(exitCode, config, capabilities, results) {
    (async () => {
      await global.reportAggregator.createReport();
      const mergeResults = require('wdio-json-reporter/mergeResults')
      await mergeResults(process.env.JSON_RESULTS_DIR, 'results-*', process.env.JSON_RESULTS_FILE)
      await global.testRailReporter.processResult()
    })();
  },
};
