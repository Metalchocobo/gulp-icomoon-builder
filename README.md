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
gulp.task('build-fonts', () => {
  gulp.src('./path_to_font/icomoon/selection.json')
    .pipe(icomoon({
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
gulp.task('build-svg-sprite', () => {
  gulp.src('./path_to_font/icomoon/selection.json')
    .pipe(icomoon({
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
Option | Type | Default | Description























