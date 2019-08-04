module.exports = {
	"globals": {
		"ts-jest": {
			"diagnostics": false
		}
	},
	"moduleFileExtensions": [
		"js",
		"jsx",
		"ts",
		"tsx"
	],
	"moduleNameMapper": {
		"^~(.*)$": "<rootDir>/assets/src/__mocks__/@ithoughts/tooltip-glossary/config/$1"
	},
	"transform": {
		".*\\.ts$": "ts-jest",
		".*\\.tsx$": "ts-jest",
		"^.+\\.js$": "babel-jest",
		".*\\.(svg|s?css)$": "./assets/__tests__/helpers/default-loader.js"
	}
}
