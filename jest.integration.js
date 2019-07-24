const baseConf = require( './jest' );

module.exports = {
	...baseConf,
	"collectCoverage": false,
	"moduleNameMapper": {
		...baseConf.moduleNameMapper,
		"^@ithoughts/tooltip-glossary(/.*$)": "<rootDir>/assets/src/$1",
		"^(@wordpress/(api)$)": "<rootDir>/assets/src/__mocks__/$1",
	},
	"roots": [
		"<rootDir>/assets/__tests__/integration",
	],
	"testMatch": [
		"**/?(*.)+(spec|test).[jt]s?(x)"
	],
}
