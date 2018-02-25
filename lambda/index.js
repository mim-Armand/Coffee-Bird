/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const APP_ID = 'TODO:ADD_THIS_INFORMTION_PLEASE!';

const iotEndpoint = 'TODO:ADD_THIS_INFORMTION_PLEASE!';

let iot = new AWS.Iot();

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Coffee Machine!',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, Is there fresh coffee?! ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: 'Coffee Machine!',
            HELP_MESSAGE: "You can ask questions such as, Is there coffee, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, coffee machine status, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
        },
    },
    'fr': {
        translation: {
            SKILL_NAME: 'Machine de cafè',
            WELCOME_MESSAGE: 'Bienvenu a l\'app de machine de cafè mon ami!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'IsThereCoffeeIntent': function () {

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), ':)');
        // var d = new Date();
        // var minutes = d.getMinutes();
        // let timezone = -6;
        // var hr = d.getHours() + timezone;
        // let thereCoffee = (hr >= 6 && hr < 20 ) && (minutes % 2 == 0);



        iot.describeThing({thingName: 'coffeemachine'},
            (err, data) => {
                if (err) console.log('========ERRRRR=========',err, err.stack); // an error occurred
                else {
                    console.log('IS THE POT FULL?! ', data.attributes.isFull);           // successful response
                    let thereCoffee = (data.attributes.isFull == 'true');
                    if (thereCoffee) {
                        this.attributes.speechOutput = 'Good news! there is fresh coffee!';
                        this.emit(':tellWithCard', this.attributes.speechOutput, cardTitle, 'YES!\nGo get some coffee! ');
                    } else {
                        let speechOutput = this.t('Sorry! Looks like the pot is almost empty!');

                        this.attributes.speechOutput = speechOutput;
                        this.emit(':tellWithCard', this.attributes.speechOutput, cardTitle, `Sorry! looks like the pot is empty atm!`);
                    }
                }
            });


    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
