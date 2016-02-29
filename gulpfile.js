var _ = require("lodash");
var path = require("path");

var gulp = require("gulp");
var util = require('util');
var gutil = require("gulp-util");
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'run-sequence']
});

var webpack = require("webpack");
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

gulp.task("build", ["resources"], function () {
    gulp.start("webpack");
});

gulp.task("default", ["serve"]);

function runWebpack(config, callback) {
    var runCallback = config.watch;
    webpack(config, function (err, stats) {
        var jsonStats = stats.toJson();

        var buildError = err || jsonStats.errors[0] || jsonStats.warnings[0];

        if (buildError) {
            gutil.log(buildError);
            //throw new gutil.PluginError("webpack", buildError);
            throw new Error();
        }

        gutil.log("[webpack]", stats.toString({
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }));

        if (config.watch) {
            if (runCallback) {
                runCallback = false;
                callback();
            }
        } else {
            callback();
        }
    });
}

gulp.task("webpack", function (callback) {
    runWebpack(webpackConfig, callback);
});

gulp.task("webpack:watch", function (callback) {
    var wc = require("./webpack.config");
    wc.watch = true;
    runWebpack(wc, callback);
});


function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;
    var server = {
        baseDir: baseDir
    };

    browserSync.instance = browserSync.init({
        startPath: "/",
        server: server,
        browser: browser,
        port: conf.port,
        files: ".tmp/serve/**/*"
    });
}

browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task("browser-sync", function() {
    browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task("serve", function (callback) {
    $.runSequence(
        "resources",
        "webpack:watch",
        "browser-sync",
        callback
    )
});
