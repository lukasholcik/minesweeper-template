var _ = require("lodash");
var path = require("path");

var gulp = require("gulp");
var gutil = require("gulp-util");
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del']
});

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config");

var browserSync = require("browser-sync");
var browserSyncSpa = require("browser-sync-spa");

var conf = {
    paths: {
        dist: "./dist",
        src: "./src",
        tmp: "./.tmp",
        serve: "./.tmp/serve"
    },
    port: 9000
};

gulp.task("clean", function() {
    return $.del([
        conf.paths.tmp
    ]);
});

gulp.task("resources", function () {
    var resources = require("./conf/resources.json");
    _.forEach(resources, function (src, key) {
        gutil.log("Bundling " + key);
        gulp.src(src)
            .pipe($.concat(key))
            .pipe(gulp.dest(conf.paths.serve));
    });
});

gulp.task("webpack", function (callback) {
    // run webpack
    webpack(webpackConfig, function (err, stats) {
        var jsonStats = stats.toJson();

        var buildError = err || jsonStats.errors[0] || jsonStats.warnings[0];

        if (buildError) {
            throw new gutil.PluginError("webpack", buildError);
        }

        gutil.log("[webpack]", stats.toString({
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }));

        callback();
    });
});

gulp.task("webpack-dev-server", function (callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    //var dir = path.resolve(".");
    //console.log("Content base:", dir);
    var server = new WebpackDevServer(compiler, {
        // webpack-dev-server options
        contentBase: conf.paths.serve,
        hot: true,

        // webpack-dev-middleware options
        quiet: false,
        noInfo: false,
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },

        publicPath: "http://localhost:" + conf.port + "/",
        stats: {
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        },
        historyApiFallback: true
    });

    server.listen(conf.port, "localhost", function (err) {
        gutil.log("Starting webpack-dev-server at localhost:" + conf.port);
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        callback();
    });
});

gulp.task("build", ["resources"], function () {
    gulp.start("webpack");
});

//gulp.task("serve", function () {
//    gulp.start("webpack-dev-server");
//});

gulp.task("default", ["serve"]);

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var bundler = webpack(webpackConfig, null, webpackChangeHandler);

var util = require('util');

function webpackChangeHandler(err, stats) {
    if (err) {
        conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
    }));
}

function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;
    var server = {
        baseDir: baseDir,
        middleware: [
            webpackDevMiddleware(bundler, {
                publicPath: webpackConfig.output.publicPath,
                stats: {colors: true}
            }),
            // bundler should be the same as above
            webpackHotMiddleware(bundler)
        ]
    };

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser,
        port: conf.port
    });
}

browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ["resources"], function () {
    browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});