module.exports = {
    preset: 'jest-preset-angular',
    setupTestFrameworkScriptFile: '<rootDir>/test/jest.ts',
    coverageDirectory: '<rootDir>/build/test-results/',
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.json'
        },
        __TRANSFORM_HTML__: true
    },
    moduleNameMapper: {
        'app/(.*)': '<rootDir>/src/app/$1'
    },
    reporters: [
        'default',
        [ 'jest-junit', { output: './build/test-results/jest/TESTS-results.xml' } ]
    ],
    testResultsProcessor: 'jest-sonar-reporter',
    transformIgnorePatterns: ['node_modules/(?!@angular/common/locales)'],
    testMatch: ['<rootDir>/test/spec/**/+(*.)+(spec.ts)'],
    rootDir: '../',
    testURL: "http://localhost/"
};
