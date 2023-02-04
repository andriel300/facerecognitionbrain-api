const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const dotenv = require("dotenv");

dotenv.config();

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.PAT}`);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: process.env.USER_ID,
        app_id: process.env.APP_ID,
      },
      model_id: process.env.MODEL_ID,
      version_id: process.env.MODEL_VERSION_ID,
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log(`Error: ${err}`);
        return;
      }
      if (response.status.code !== 10000) {
        console.log(
          `Received failed status: ${response.status.description}\n${response.status.details}`,
        );
        return;
      }
      response.outputs[0].data.concepts.forEach(concept => {
        console.log(`${concept.name}: ${concept.value}`);
      });
      res.json(response);
    },
  );
};

module.exports = {
  handleApiCall,
};
