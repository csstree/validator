#!/usr/bin/env node

import { run, isCliError } from '../lib/cli.js';

try {
    run();
} catch (e) {
    // output user frendly message if cli error
    if (isCliError(e)) {
        console.error(e.message || e);
        process.exit(2);
    }

    // otherwise re-throw exception
    throw e;
}
