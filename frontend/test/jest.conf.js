module.exports = {
    preset: 'jest-preset-angular',
    setupTestFrameworkScriptFile: '<rootDir>/test/jest.ts',
    coverageDirectory: '<rootDir>/build/test-results/',
    globals: {
        'ts-jest': {
            stringifyContentPathRegex: '\\.html$',
            tsConfig: 'tsconfig.json',
            astTransformers: [require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer')]
        }
    },
    coveragePathIgnorePatterns: [
        '<rootDir>/test'
    ],
    moduleNameMapper: {
        'app/(.*)': '<rootDir>/src/app/$1'
    },
    reporters: [
        'default',
        ['jest-junit', { output: './build/test-results/TESTS-results-jest.xml' }]
    ],
    testResultsProcessor: 'jest-sonar-reporter',
    transformIgnorePatterns: ['node_modules/(?!@angular/common/locales)'],
    testMatch: ['<rootDir>/test/spec/**/@(*.)@(spec.ts)'],
    rootDir: '../',
    testURL: 'http://localhost/'
};
