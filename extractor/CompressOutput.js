const compressing = require('compressing');
const { pipeline } = require('stream')
const path = require('path');
const {
    Storage
} = require('@google-cloud/storage');

exports.CompressOutput = (event, context) => {
    const storage = new Storage();
    const bucket = storage.bucket('annotator-output');
    const dirname = path.dirname(event.name);
    // console.log(dirname);

    bucket.getFiles().then(function (data) {
        const file = data[0][0];
        console.log(file.metadata.name);
        const inputfile = bucket.file(file.metadata.name);
        const outputfile = bucket.file(dirname.replace('.pdf', '.gz'))
        const sourceStream = inputfile.createReadStream()
        const gzipStream = new compressing.gzip.FileStream();
        const destStream = outputfile.createWriteStream();
        pipeline(sourceStream, gzipStream, destStream, () => (inputfile.delete()))
    }).catch(console.error);
};
