# gulp-icomoon-builder
This module is used for automate Icomoon integration with your SCSS project.

### Instalation
`npm install gulp-icomoon-builder`

### Usage
You can use this module in two ways:
 * Add icons to SCSS file as [variables](http://sass-lang.com/guide#topic-2) or [variable maps](http://blog.grayghostvisuals.com/sass/real-sass-real-maps/)
 * Build [SVG sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/) and insert icon like this `<svg><use xlink:href="#icon-my-awesome-icon"></use></svg>`
 
**SCSS way:**

You can create gulp task and add it to watcher. Task example:
 
```
const icomoonBuilder = require('gulp-icomoon-builder');

gulp.task('build-fonts', () => {
  gulp.src('./path_to_font/icomoon/selection.json')
    .pipe(icomoonBuilder({
      templateType: 'map',
      extraIcons: {
        'custom-icon-1': '\f2b9',
        'custom-icon-2': '\f2ba',
      },
    }))
    .on('error', function (error) {
      console.log(error);
      // or if you use "gulp-notify"
      notify().write(error);
    })

    .pipe(gulp.dest('scss'))
    .on('error', function (error) {
      console.log(error)
      notify().write(error);
    });
});
```
**SVG Sprite way:**

**Note:** Parameter `extraIcons` not working for svg sprites

```
const icomoonBuilder = require('gulp-icomoon-builder');

gulp.task('build-svg-sprite', () => {
  gulp.src('./path_to_font/icomoon/selection.json')
    .pipe(icomoonBuilder({
      templateType: 'svg',
      filename: 'icons.svg',
    }))
    .on('error', function (error) {
      console.log(error);
      // or if you use "gulp-notify"
      notify().write(error);
    })

    .pipe(gulp.dest('icons'))
    .on('error', function (error) {
      console.log(error)
      notify().write(error);
    });
});
```

### Options

Option | Type | Default | Description
--- | --- | --- | ---
templateType | `string` | *map* | Type of the template. Can be `map`, `var` or `svg`
externalTemplare | `string` | *none* | Path to custom `Mustache` template. See `/templates` folder
filename | `string` | *_icons.scss* | Name of your file.
extraIcons | `object` | *{}* | Additional icons that aren't included in your `Icomoon` project
