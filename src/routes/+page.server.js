import {Configuration, OpenAIApi } from "openai";
import "dotenv/config"
let history = [];
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
function convertMarkDowntoHTML(markdown){
    //example markdown
    // # Hello World
    // ## This is a subheading
    // ```python
    // print("Hello World")
    // ```
    // **bold**
    //
    // That was a newline
    // `this is some non-highlighted code`


    //html
    // <h1>Hello World</h1>
    // <h2>This is a subheading</h2>
    // <code class="prettyprint lang-py">print("Hello World")</code>
    // <b>bold</b>
    // <br>
    // <p>That was a newline</p>
    // <code>this is some non-highlighted code</code>

    //make the conversion
    let html = markdown.trim();
    html = html.replace(/```(.*)\n([\s\S]*?)\n```/g, "<code class=\"prettyprint lang-$1\">$2</code>");
    html = html.replace(/\*\*(.*)\*\*/g, "<b>$1</b>");
    html = html.replace(/\n/g, "<br>");
    html = html.replace(/(.*)\n/g, "<p>$1</p>");
    html = html.replace(/`(.*)`/g, "<code>$1</code>");
    //make sure the # are not in a code block
    html = html.replace(/<code class="prettyprint lang-(.*)">(.*)<br>#(.*)<\/code>/g, "<code class=\"prettyprint lang-$1\">$2<br># $3</code>");
    html = html.replace(/<code class="prettyprint lang-(.*)">(.*)<br>##(.*)<\/code>/g, "<code class=\"prettyprint lang-$1\">$2<br>## $3</code>");
    return html;
} 
export const actions = {
    default: async ({request}) => {
        const formData = await request.formData();
        console.log(formData.get('message'));
        if(formData.get('message') == "[DELETE]"){
            history = [];
            return;
        }
        history.push({role: "user", content: formData.get('message')});
        let prompt = [{role: "system", content: "You are a helpful assistant."}];
        history.forEach((message) => {
            prompt.push(message);
        });
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: history
        });
        history.push({role: "assistant", content: convertMarkDowntoHTML(response.data.choices[0].message.content)})
    }
}
export const load = () => {
    return {
        history
    }
}