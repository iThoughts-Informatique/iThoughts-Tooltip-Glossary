module.exports = {
    headers: {
        src: [
            'tests/**/*.js',
            'js/src/**/*.js',
            'less/**/*.less',
            'class/**/*.php',
            'templates/src/*.php',
        ],
        overwrite:    true,
        replacements: [
            {
                from: /(@version) \d+\.\d+\.\d+/,
                to:   '$1 <%= pkg.version %>',
            },
        ],
    },
    readmeVersion: {
        src:          'readme.txt',
        overwrite:    true,
        replacements: [
            {
                from: /Stable tag: \d+\.\d+\.\d+/,
                to:   'Stable tag: <%= pkg.version %>',
            },
            {
                from: /Tested up to: \d+\.\d+/,
                to:   () => {
                    const wpVersionFile = resolve( process.env.WP_PATH, 'wp-includes/version.php' );
                    const wpVersionFileContent = fs.readFileSync( wpVersionFile, 'UTF-8' );
                    const versionNumbers = wpVersionFileContent.match( /^\$wp_version\s*=\s*'(\d+)\.(\d+)(?:\.(\d+))?';$/m ).slice( 1 ).map( Number );
                    const [ major, minor ] = versionNumbers;
                    return `Tested up to: ${major}.${minor}`;
                },
            },
        ],
    },
}
