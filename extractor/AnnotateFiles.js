'use strict';

const vision = require('@google-cloud/vision');
const clientOptions = {apiEndpoint: 'eu-vision.googleapis.com'};
const client = new vision.ImageAnnotatorClient(clientOptions);

exports.AnnotateFiles = async (event, context) => {
    console.log(event.name);
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
      console.log(filesResponse.responses[0].outputConfig.gcsDestination.uri);
};
