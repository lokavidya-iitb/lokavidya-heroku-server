var ffmpeg = require('fluent-ffmpeg');

var BaseParseClass = require('./BaseParseClass');

class BaseResourceClass extends BaseParseClass.BaseParseClass {

    // To be implemented by the implementing class
    stitch() {}

}

var stitchSlide = (slide) => {
    console.log('stitchSlide : called');
    console.log(slide);
    var childrenResources = slide.get('children_resources');
    console.log(childrenResources);
    childrenResources.fetch().then(
        () => {
            var childResource = childrenResources.get('elements')[0];
            childResource.fetch().then(
                () => {
                    console.log(childResource);
                    if(childResource.className === 'Image') {
                        // stitch image
                        var c = childResource.get('children_resources');
                        c.fetch().then(
                            () => {
                                var e = c.get('elements');
                                if(e) {
                                    // elements is not falsey
                                    var audioResource = e[0];
                                    audioResource.fetch().then(
                                        () => {
                                            var audioFile = audioResource.get('file');
                                            var imageFile = childResource.get('file');
                                            console.log(audioFile);
                                            console.log(imageFile);

                                            // stitch
                                            ffmpeg()
                                                .input(audioFile.url())
                                                .input(imageFile.url())
                                                .output('outputfile.mp4')
                                                .videoCodec('libx264')
                                                .size('640x480')
                                                .on('stderr', function(stderrLine) {
                                                    console.log('Stderr output: ' + stderrLine);
                                                })
                                                .on('end', function(stdout, stderr) {
                                                    console.log('Transcoding succeeded !');
                                                    console.log('stitching done');
                                                    var file = new File('outputfile.mp4');
                                                        console.log('stitching done');
                                                    var parseFile = new Parse.File('outputfile', file);
                                                    console.log('stitching done');
                                                    return parseFile;
                                                })
                                                .run();
                                        }
                                    )
                                }
                            }
                        )
                    } else if(childResource.className == 'Video') {
                        // stitch video
                        var file = childResource.get('file');
                        return file;
                    } else if(childResource.className == 'Question') {
                        // stitch question
                    }
                }
            );
        },
        (error) => {
            console.log(error);
        }
    );
}

var readTextFile = (file) => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                fileDisplayArea.innerText = allText
            }
        }
    }
    rawFile.send(null);
}

module.exports = {
    BaseResourceClass,
    stitchSlide
}
