(function () {
  "use strict";

  var fs = require('fs')
    ;

  function noop() {}

  function copy(src, dst, cb) {
    function copyHelper(err) {
      var is
        , os
        ;

      if (!err) {
        return cb(new Error("File " + dst + " exists."));
      }

      fs.stat(src, function (err, stat) {
        if (err) {
          return cb(err);
        }

        is = fs.createReadStream(src);
        os = fs.createWriteStream(dst);

        is.pipe(os);
        os.on('close', function (err) {
          if (err) {
            return cb(err);
          }

          fs.utimes(dst, stat.atime, stat.mtime, function() {
              fs.chmod(dst, stat.mode, cb);
          } );
        });
      });
    }

    cb = cb || noop;
    fs.stat(dst, copyHelper);
  }

  module.exports = copy;
}());
