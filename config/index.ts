import {capabilitiesChromeConfig} from './chrome.config';
import {serverConfig} from './server.config';
import {testsConfig} from './tests.config';
import {reporterConf} from "./reporter.config";
import {hooksConfig} from "./hooks.config";

export const config = {
    runner: 'local',
    baseUrl: 'http://mood-feed-frontend',
    path: '/wd/hub',

    framework: 'jasmine',

    maxInstances: process.env.DEBUG_TESTS === 'true' ? 1 : 2,
    capabilities: [
        capabilitiesChromeConfig
    ],

    services: [],

    ...serverConfig,
    ...testsConfig,
    ...reporterConf,
    ...hooksConfig

};
