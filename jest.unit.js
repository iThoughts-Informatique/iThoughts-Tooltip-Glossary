const baseConf = require( './jest' );

module.exports = {
	...baseConf,
	"collectCoverage": true,
	"collectCoverageFrom": [
		"assets/src/**/*.[jt]s{x,}",
		"!assets/src/__mocks__/**/*",
		"!**/node_modules/**"
	],
	"moduleNameMapper": {
		...baseConf.moduleNameMapper,
		"(^@ithoughts/tooltip-glossary/.*$)": "<rootDir>/assets/src/__mocks__/$1",
	},
	"preset": "ts-jest/presets/js-with-ts",
	"roots": [
		"<rootDir>/assets/src",
	],
	"testMatch": [
		"**/?(*.)+(spec|test).[jt]s?(x)"
	],
}
