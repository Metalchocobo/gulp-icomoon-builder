'use strict';

const through = require('through2');
const merge = require('merge');
const gutil = require('gulp-util');
const mustache = require('mustache');
const fs = require('fs');

const plugin = {
  name: 'gulp-icomoon-parser',
  error: gutil.PluginError,
};

module.exports = function (opts) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(new plugin.error(plugin.name, 'File ' + file + ' cannot be found'));
    }
    if (file.isStream()) {
      return cb(new plugin.error(plugin.name, 'Streaming is not supported'));
    }

    let icomoon, template,
      renderedTemplate,
      options = merge({
        templateType: 'map', // var, map, svg?
        extraIcons: {},
        externalTemplare: false,
        filename: '_icons.scss',
      }, opts);
    let mustacheVars = {};
    mustacheVars.icons = [];
    mustacheVars.extraIcons = [];

    // Load icomoon
    try {
      icomoon = JSON.parse(file.contents.toString(enc));
    } catch (e) {
      return cb(new plugin.error(plugin.name, 'Failed to parse IcoMoon project file: ' + e.message));
    }

    if (options.templateType === 'svg') {
      // Add icons path to mustache array to form svg
      icomoon.icons.forEach(function (icon) {
        let n = icon.properties.name.split(",").map(function (item) {
          return item.trim();
        });

        n.forEach(function(name){
          mustacheVars.icons.push({
            path: icon.icon.paths,
            grid: icon.icon.grid,
            name: name
          });
        });

        
      });

    } else {
      // Add icons to mustache array
      icomoon.icons.forEach(function (icon) {
        let iconProperties = icon.properties;

        mustacheVars.icons.push({
          name: iconProperties.name,
          code: iconProperties.code.toString(16),
        })
      });

      // Add extra icons to mustache array
      if (typeof options.extraIcons === 'object') {
        for (let i in options.extraIcons) {
          if (options.extraIcons.hasOwnProperty(i)) {
            let name = i, code = options.extraIcons[i];

            if (typeof code === 'string') {
              code = code.replace("\\", "");
            } else if (typeof code === 'number') {
              code = code.toString(16);
            } else {
              return cb(new plugin.error(plugin.name, 'The "value" of the  parameter should be string or number'));
            }

            mustacheVars.extraIcons.push({
              name: name,
              code: code,
            })
          }
        }

      } else {
        return cb(new plugin.error(plugin.name, 'Parameter "extraIcons" should be Object - {"key": "value"}'));
      }
    }

    // Set template
    if (typeof options.templateType === 'string') {
      let tpl = options.templateType;
      let src = __dirname + '/templates/icomoon.' + tpl + '.mustache';

      if (typeof options.externalTemplare === 'string') {
        src = options.externalTemplare;
      }

      fs.readFile(src, 'utf8', function (error, data) {
        if (error) {
          return cb(new plugin.error(plugin.name, 'Failed to read template file, ' + error));
        }
        template = data;

        try {
          renderedTemplate = mustache.render(template, mustacheVars);
        } catch (e) {
          return cb(new plugin.error(plugin.name, 'Failed to compile template'));
        }

        // Pass file to Gulp processing
        cb(null, new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: file.base + options.filename,
          contents: new Buffer(renderedTemplate)
        }));
      });

    } else {
      return cb(new plugin.error(plugin.name, 'Parameter "templateType" should be string.'));
    }


  });
};
