'use strict';

const AWS = require('aws-sdk');
let iot = new AWS.Iot();
let threshold = 20;

module.exports.coffeebird = (event, context, callback) => {

    let pathParams = ( event.pathParameters.status == 'true' );

    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: "",
    };

    iot.updateThing(
        {
            thingName: "coffemachine",
            "attributePayload": {
                "attributes": {
                    "isFull" : `${pathParams}`
                }
            }
        },
        ()=>{
            iot.describeThing({thingName: "coffemachine"},
                ()=>{
                    response.body = JSON.stringify(threshold);
                    callback(null, response);
                });
        }
    );
};
