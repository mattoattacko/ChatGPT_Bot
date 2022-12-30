// ~~~~ Gets Response from OpenAI ~~~~ //

import express from "express";
import * as dotenv from "dotenv"; //get data from .env file
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

//to use dotenv variables
dotenv.config();

console.log(process.env.OPENAI_API_KEY);

//function that accepts an object
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//create an instance of openai
const openai = new OpenAIApi(configuration);

//create an instance of express
const app = express();

//middleware
app.use(cors()); //to allow cross-origin requests and allow our server to communicate with our font end client

//pass json from FE to BE
app.use(express.json());

//dummy route route
// with a get route, we cant really receive data from the front end

app.get('/', async (req, res) => {
  res.status(200).send({
    message: "Hello World!",
  })
});

// a post route will let us do that with a body/payload
// we get the data from the body of the front end request
// we want to get a response from Open API
// we are using the 'text-davinci-003' model
// once we get a response we send it back to the FE
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt; //the text area is the prompt

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, //higher the number the more "risks" it takes with answers. Was 0.7
      max_tokens: 3000, //how many words it will generate
      top_p: 1,
      frequency_penalty: 0.5, //how much it will penalize new words
      presence_penalty: 0,
    })

    res.status(200).send({
      bot: response.data.choices[0].text //the first choice is the best one
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error); //if there is an error, send it back to the FE
  }
})

//makes sure our serer always listens for new requests
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))
