const path = require('path');
module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        filename: "javascript-object-sanitizer.js",
        path: path.resolve(__dirname, 'dist.webpack'),
        library: "ObjectSanitizer",
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }]
    }
}
