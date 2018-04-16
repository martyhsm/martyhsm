const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
        entry: './src/marty.ts',
        mode: 'production',
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: 'marty.js',
            path: path.resolve(__dirname, 'dist')
        },
        node: {
            console: false,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        },
        plugins: [
            new CopyWebpackPlugin([{
                from: 'src/**/*',
                to: './ts',
                flatten: true
            }, {
                from: 'src/marty.ts',
                to: '.',
                flatten: true
            }], {
                debug: true
            })
        ]
    },
    {
        entry: './spec/martySpec.ts',
        mode: 'production',
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: 'martySpec.js',
            path: path.resolve(__dirname, 'dist', "test")
        },
        node: {
            console: false,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        },
    },
    {
        entry: {
            example: './example/example.ts',
            stoplight: './example/stoplight.ts'
        },
        mode: 'production',
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            path: path.resolve(__dirname, 'example')
        },
        node: {
            console: false,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        },
    }
];