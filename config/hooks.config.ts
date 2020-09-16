import {ReportAggregator} from '@rpii/wdio-html-reporter';

export const hooksConfig = {
  onPrepare: function (config, capabilities) {

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
    })();
  },
};
