import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage,SystemMessage} from "langchain";
import {ChatMistralAI} from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY

});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})


export async function generateResponse(message) {
    const response = await geminiModel.invoke([new HumanMessage(message)

    ]);
    
    return response.text;


}

export async function generateChatTitle(message){
    const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and relevant titles for chat conversations.
        
    User will provide a message, and you will generate a title that captures the essence of the conversation in a 2-4 words. The title should be clear, informative, and engaging, giving users a quick understanding of the chat's content. Please ensure the title is concise and relevant to the message provided.
        `),
    new HumanMessage(`
        Generate a title for the chat conversation based on the following first message: "${message}"
        `)
    
    ])
    
    return response.text;
}


