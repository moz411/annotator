'use strict';

const vision = require('@google-cloud/vision');
const clientOptions = {apiEndpoint: 'eu-vision.googleapis.com'};
const client = new vision.ImageAnnotatorClient(clientOptions);
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const compressing = require('compressing');
const { pipeline } = require('stream')

async function AnnotateFile(event) {
    console.log('AnnotateFile ' + event.name);
    const gcsSourceUri = 'gs://annotator-input/' + event.name;
    const gcsDestinationUri = 'gs://annotator-output/'  + event.name + '/';
    
    const inputConfig = {
        mimeType: 'application/pdf',
        gcsSource: {
            uri: gcsSourceUri,
        },
    };
    const outputConfig = {
        gcsDestination: {
            uri: gcsDestinationUri,
        },
    };
    const features = [{
        type: 'DOCUMENT_TEXT_DETECTION'
    }];
    const fileRequest = {
        inputConfig: inputConfig,
        outputConfig: outputConfig,
        features: features,
        batch_size: 100
      };

      const request = {
        requests: [fileRequest],
      };
  
      const [operation] = await client.asyncBatchAnnotateFiles(request);
      const [filesResponse] = await operation.promise();
      const bucket = storage.bucket('annotator-input');
      bucket.file(event.name).delete();
      console.log('AnnotateFile ' + filesResponse.responses[0].outputConfig.gcsDestination.uri);
};

async function CompressOutput(event) {
    console.log('CompressOutput ' + event.name);
    const bucket = storage.bucket('annotator-output');
    bucket.getFiles({prefix: event.name}).then(function (data) {
        const file = data[0][0];
        // console.log(file.metadata.name);
        const inputfile = bucket.file(file.metadata.name);
        const outputfile = bucket.file(event.name.replace('.pdf', '.gz'))
        const sourceStream = inputfile.createReadStream()
        const gzipStream = new compressing.gzip.FileStream();
        const destStream = outputfile.createWriteStream();
        pipeline(sourceStream, gzipStream, destStream, () => (inputfile.delete()));
        console.log('CompressOutput ' + outputfile.id);
    });
};

exports.Main = async (event, context) => {
    await AnnotateFile(event).catch(console.error);
    await CompressOutput(event).catch(console.error);
};
