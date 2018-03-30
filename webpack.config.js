const webpack = require('webpack');
const path = require('path');

const CssHotLoader = require('css-hot-loader');
const autoprefixer = require('autoprefixer');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackConfig = new HtmlWebpackPlugin({template: 'index.html'});

const HotModuleReplacementConfig = new webpack.HotModuleReplacementPlugin();

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJsConfig = new UglifyJsPlugin({
    sourceMap: true,
    uglifyOptions: {
        compress: true,
        output: {
            comments: false,
            beautify: true
        }
    }
});

const CleanwebpackPlugin = require('clean-webpack-plugin');
const pathsToClean = ['dist'];
const cleanOptions = {
    verbose: true,
    dry: false
};
const CleanWebpackConfig = new CleanwebpackPlugin(pathsToClean, cleanOptions);

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractTextPluginConfig = new ExtractTextPlugin({filename: "styles/main.css", allChunks: true});

const productionCssLoaders = {
    fallback: 'style-loader',
    use: [
        {
            loader: 'css-loader',
            options: {
                minimize: true
            }
        },
        {
            loader: 'postcss-loader'
        }
    ]
};

module.exports = env => {
    return {
        mode: 'none',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: { test: /node_modules/, name: "vendors", chunks: "all" }
                }
            }
        },
        devtool: 'source-map',
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: 'html-es6-template-loader',
                    exclude: /node_modules/
                }, {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'postcss-loader', 'sass-loader']
                    }),
                    exclude: /node_modules/
                }, {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'postcss-loader', 'less-loader']
                    })
                }, {
                    test: /\.styl$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'postcss-loader', 'stylus-loader']
                    })
                }, {
                    test: /\.css$/,
                    use: env && env.production
                        ? ExtractTextPlugin.extract(productionCssLoaders)
                        : ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'eslint-loader',
                    enforce: 'pre'
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }, {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                }, {
                    test: /\.coffee$/,
                    exclude: /node_modules/,
                    use: 'coffee-loader'
                }
            ]
        },
        plugins: [
            CleanWebpackConfig,
            HtmlWebpackConfig,
            autoprefixer,
            HotModuleReplacementConfig,
            UglifyJsConfig,
            ExtractTextPluginConfig
        ]
    }
};