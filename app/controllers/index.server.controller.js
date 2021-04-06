//
//https://github.com/PacktPublishing/Hands-on-Machine-Learning-with-TensorFlow.js/tree/master/Section5_4
//
const tf = require('@tensorflow/tfjs');
//require('@tensorflow/tfjs-node');
//load iris training and testing data
const iris = require('../../iris.json');
const irisTesting = require('../../iris-testing.json');

var lossValue;

exports.render = function (req, res) {
    res.render('index', {
        info: 'see the results in console window',
    });
};

exports.trainAndPredict = function (req, res) {
    var epochsNumber =
        req.query.epochs != undefined ? parseFloat(req.query.epochs) : 100;
    var learningRate =
        req.query.rate != undefined ? parseFloat(req.query.rate) : 0.06;
    const data = {
        sepal_length:
            req.query.sepal_length != undefined
                ? parseFloat(req.query.sepal_length)
                : 4.9,
        sepal_width:
            req.query.sepal_width != undefined
                ? parseFloat(req.query.sepal_width)
                : 3,
        petal_length:
            req.query.petal_length != undefined
                ? parseFloat(req.query.petal_length)
                : 1.4,
        petal_width:
            req.query.petal_width != undefined
                ? parseFloat(req.query.petal_width)
                : 0.2,
    };
    //
    // convert/setup our data for tensorflow.js
    //
    //tensor of features for training data
    // include only features, not the output
    const trainingData = tf.tensor2d(
        iris.map((item) => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width,
        ])
    );
    //console.log(trainingData.dataSync())
    //
    //tensor of output for training data
    //the values for species will be:
    // setosa:       1,0,0
    // virginica:    0,1,0
    // versicolor:   0,0,1
    const outputData = tf.tensor2d(
        iris.map((item) => [
            item.species === 'setosa' ? 1 : 0,
            item.species === 'virginica' ? 1 : 0,
            item.species === 'versicolor' ? 1 : 0,
        ])
    );
    //console.log(outputData.dataSync())
    //
    //tensor of features for testing data
    // const testingData = tf.tensor2d(
    //     irisTesting.map((item) => [
    // item.sepal_length,
    // item.sepal_width,
    // item.petal_length,
    // item.petal_width,
    //     ])
    // );
    const testingData = tf.tensor2d([
        [
            data.sepal_length,
            data.sepal_width,
            data.petal_length,
            data.petal_width,
        ],
    ]);
    //console.log(testingData.dataSync())
    //
    // build neural network using a sequential model
    const model = tf.sequential();
    //add the first layer
    model.add(
        tf.layers.dense({
            inputShape: [4], // four input neurons
            activation: 'sigmoid',
            units: 5, //dimension of output space (first hidden layer)
        })
    );
    //add the hidden layer
    model.add(
        tf.layers.dense({
            inputShape: [5], //dimension of hidden layer
            activation: 'sigmoid',
            units: 3, //dimension of final output (setosa, virginica, versicolor)
        })
    );
    //add output layer
    model.add(
        tf.layers.dense({
            activation: 'sigmoid',
            units: 3, //dimension of final output (setosa, virginica, versicolor)
        })
    );
    //compile the model with an MSE loss function and Adam algorithm
    model.compile({
        loss: 'meanSquaredError',
        optimizer: tf.train.adam(learningRate),
    });
    console.log(model.summary());
    //
    //Train the model and predict the results for testing data
    //
    // train/fit the model for the fixed number of epochs
    async function run() {
        const startTime = Date.now();
        //train the model
        await model.fit(trainingData, outputData, {
            epochs: epochsNumber,
            callbacks: {
                //list of callbacks to be called during training
                onEpochEnd: async (epoch, log) => {
                    lossValue = log.loss;
                    //console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
                    elapsedTime = Date.now() - startTime;
                    //console.log('elapsed time: ' + elapsedTime);
                },
            },
        });

        const results = model.predict(testingData);
        // console.log('prediction results: ', results.dataSync());
        // results.print();

        // get the values from the tf.Tensor
        //var tensorData = results.dataSync();
        results.array().then((array) => {
            console.log(array[0][0]);
            var resultForData1 = array[0];
            var dataToSent = {
                result: getPredictResult(resultForData1),
            };
            res.status(200).send(dataToSent);
            //
        });
        //
    } //end of run function
    run();
};

function getPredictResult(result) {
    const maxValue = Math.max(...result);
    const species = ['setosa', 'virginica', 'versicolor'];
    const index = result.indexOf(maxValue);
    return species[index];
}
