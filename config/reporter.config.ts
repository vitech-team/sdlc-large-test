import {ReportAggregator, HtmlReporter} from '@rpii/wdio-html-reporter';

const log4js = require("log4js");

export const reporterConf = {

    reporters: ['spec',
        ['json', {
            outputDir: './reports/json/',
            outputFileFormat: function (opts) {
                return `results-${opts.cid}.${opts.capabilities}.json`
            }
        }],
        [HtmlReporter, {
            debug: true,
            outputDir: './reports/html-reports/',
            filename: 'report.html',
            reportTitle: 'Test Report Title',

            //to show the report in a browser when done
            showInBrowser: false,

            //to turn on screenshots after every test
            useOnAfterCommandForScreenshot: true,

            // to use the template override option, can point to your own file in the test project:
            // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs'),

            // to add custom template functions for your custom template:
            // templateFuncs: {
            //     addOne: (v) => {
            //         return v+1;
            //     },
            // },

            //to initialize the logger
            LOG: log4js.getLogger("default")
        }
        ]
    ]

}
