const { src, dest, series } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const fs = require('fs');


// Minify CSS files
function minifyCSS() {
    if (fs.existsSync('source/css') && fs.readdirSync('source/css').length > 0) {
        return src('source/css/*.css')
            .pipe(cleanCSS())
            .pipe(dest('public/css'));
    } else {
        return new Promise((resolve) => {
            console.log('No CSS files to minify.');
            resolve();
        });
    }
}

// Minify JS files
function minifyJS() {
    if (fs.existsSync('source/js') && fs.readdirSync('source/js').length > 0) {
        return src('source/js/*.js')
            .pipe(uglify())
            .pipe(dest('public/js'));
    } else {
        return new Promise((resolve) => {
            console.log('No JS files to minify.');
            resolve();
        });
    }
}

// Default task
exports.default = series(minifyCSS, minifyJS);
