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
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'url-loader?limit=10000',
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: process.env.NODE_ENV === 'production',
                            gifsicle: {
                                interlaced: false
                            },
                            mozjpeg: {
                                progressive: true,
                                arithmetic: false
                            },
                            optipng: false, // disabled
                            pngquant: {
                                floyd: 0.5,
                                speed: 2
                            },
                            svgo: {
                                plugins: [
                                    { removeTitle: true },
                                    { convertPathData: false }
                                ]
                            }
                        }
                    }
                ],
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