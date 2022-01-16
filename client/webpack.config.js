const path = require('path');
const { rules } = require('eslint-config-prettier');
module.exports = {
    mode: 'development',
    entry: './index.js',
    output:{
        path:path.resolve(__dirname,'public'),
        filename:'main.js'
    },
    target: 'node',
    devServer : {
        port:'9500',
        contentBase : ['./public'],
        open: true
    },
    resolve : {
        extensions : ['.js','.jsx','.json','.scss']
    } ,
    module: {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            
        ]
    },
}