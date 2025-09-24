const gulp = require('gulp');
const fs = require('fs');

const { series } = gulp;

function copyIcons() 
{
	if (!fs.existsSync('nodes')) 
    {
		return Promise.resolve();
	}

	return gulp.src('nodes/**/*.svg').pipe(gulp.dest('dist/nodes'));
}

exports['build:icons'] = series(copyIcons);