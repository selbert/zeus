const webpack = require('webpack');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const utils = require('./utils.js');

const alias = { app: utils.root('src/app/') };
Object.apply(alias, rxPaths());

module.exports = (options) => ({
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
        alias: alias
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    caseSensitive: true,
                    removeAttributeQuotes: false,
                    minifyJS: false,
                    minifyCSS: false
                },
                exclude: /(src\/index.html)/
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
                loader: 'file-loader',
                options: {
                    digest: 'hex',
                    hash: 'sha512',
                    name: 'content/[hash].[ext]'
                }
            },
            {
                test: /manifest.webapp$/,
                loader: 'file-loader',
                options: {
                    name: 'manifest.webapp'
                }
            },
            // Ignore warnings about System.import in Angular
            { test: /[\/\\]@angular[\/\\].+\.js$/, parser: { system: true } },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `'${options.env}'`,
                BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
                VERSION: `'${utils.parseVersion()}'`,
                DEBUG_INFO_ENABLED: options.env === 'development',
                // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
                // If this URL is left empty (""), then it will be relative to the current context.
                // If you use an API server, in `prod` mode, you will need to enable CORS
                // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
                SERVER_API_URL: `'/'`
            }
        }),
        new CopyWebpackPlugin([
            { from: './node_modules/swagger-ui/dist/css', to: 'swagger-ui/dist/css' },
            { from: './node_modules/swagger-ui/dist/lib', to: 'swagger-ui/dist/lib' },
            { from: './node_modules/swagger-ui/dist/swagger-ui.min.js', to: 'swagger-ui/dist/swagger-ui.min.js' },
            { from: './src/swagger-ui/', to: 'swagger-ui' },
            { from: './src/content/', to: 'content' },
            { from: './src/favicon.ico', to: 'favicon.ico' },
            { from: './src/manifest.webapp', to: 'manifest.webapp' },
            { from: './src/robots.txt', to: 'robots.txt' }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['vendors', 'polyfills', 'global', 'main'],
            chunksSortMode: 'manual',
            inject: 'body'
        }),
        new BaseHrefWebpackPlugin({ baseHref: '/' })
    ]
});
