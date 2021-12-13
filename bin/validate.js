#!/usr/bin/env node

import { run, isCliError } from '../lib/cli.js';

async function perform() {
    try {
        await run();
    } catch (e) {
        // output user frendly message if cli error
        if (isCliError(e)) {
            console.error(e.message || e);
            process.exit(1);
        }

        // otherwise re-throw exception
        throw e;
    }
};

perform();
