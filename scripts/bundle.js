import { writeFileSync } from 'fs';
import path from 'path';
import esbuild from 'esbuild';
import { createRequire } from 'module';

const { version } = createRequire(import.meta.url)('../package.json');

async function build() {
    const genModules = {
        'version.js': `export const version = "${version}";`,
        'version.cjs': `exports.version = "${version}";`
    };
    const genModulesFilter = new RegExp('lib[\\\\/](' + Object.keys(genModules).join('|').replace(/\./g, '\\.') + ')$');
    const plugins = [{
        name: 'replace',
        setup({ onLoad }) {
            onLoad({ filter: genModulesFilter }, args => ({
                contents: genModules[path.basename(args.path)]
            }));
        }
    }];

    await Promise.all([
        esbuild.build({
            entryPoints: ['lib/bundle.js'],
            outfile: 'dist/csstree-validator.js',
            format: 'iife',
            globalName: 'csstreeValidator',
            bundle: true,
            minify: true,
            logLevel: 'info',
            plugins
        }),

        esbuild.build({
            entryPoints: ['lib/bundle.js'],
            outfile: 'dist/csstree-validator.esm.js',
            format: 'esm',
            bundle: true,
            minify: true,
            logLevel: 'info',
            plugins
        })
    ]);

    for (const [key, value] of Object.entries(genModules)) {
        const fn = path.basename(key);

        writeFileSync(`dist/${fn}`, value);
    }
}

build();
