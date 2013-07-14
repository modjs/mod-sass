var path = require('path');

exports.summary = 'Compile Sass files to CSS';

exports.usage = '<src> [options]';

exports.options = {
    "dest" : {
        alias : 'd'
        ,default : '<src>'
        ,describe : 'destination file'
    },

    "includePaths": {
        describe: ""
    },

    "charset" : {
        alias : 'c'
        ,default : 'utf-8'
        ,describe : 'file encoding type'
    }
};

exports.run = function (options, done) {
    var src = options.src;
    var dest = options.dest;

    exports.async.eachSeries(exports.files, function(inputFile, callback){
        var outputFile = dest;
        if(exports.file.isDirFormat(dest)){
            outputFile = path.join(dest , path.basename(inputFile) );
            // replace file extname to .css
            outputFile = outputFile.replace(/\.sass|\.scss/, '.css');
        }

        exports.log("Compiling Sass...")
        try {
            exports.compileRubySass(inputFile, outputFile, options, function(err){

                if(err){
                    exports.compileNodeSass(inputFile, outputFile, options, callback);
                }else{
                    exports.log(inputFile, ">", outputFile);
                    callback();             
                }

            }); 
        }catch(e){}

    }, done);
};


exports.compileNodeSass = function(inputFile, outputFile, options, done){
    var sass = require('node-sass');
    options.data = exports.file.read(inputFile);
    var css = sass.renderSync(options);

    if(outputFile){
        exports.file.write(outputFile, css);
        exports.log(inputFile, '>', outputFile)
    }
    done();
    return css;
}


exports.compileRubySass = function(inputFile, outputFile, options, done){
    var binPath;
    var args = [
        inputFile,
        outputFile,
        '--load-path', path.dirname(inputFile)
    ];

    if (process.platform === 'win32') {
        binPath = 'sass.bat';
    } else {
        binPath = 'sass';
    }

    var childProcess = require('child_process');

    childProcess.execFile(binPath, args, function(err, stdout, stderr) {
        stdout && console.log(stdout);
        done(err, stderr);
    });
};