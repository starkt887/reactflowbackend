import 'dotenv/config'
import { app } from './app.js'
import { PORT } from './constants.js'
import connectDB from './db/index.js';
import { Agenda } from '@hokify/agenda';
import { emailSender } from './utils/emailSender.js';



connectDB().then(() => {
    app.listen(PORT || 8001, (req, res) => {
        console.log(`Server listening on ${PORT}`);
    })
}).catch((error) => {
    console.log(`Mongodb Connection Error!!:${error}`);
})

app.on("error", (error) => {
    console.error("Error:", error);
})
function filterData(data) {
    
    let emailList, emailTemplate, waitFor, waitType
    data.forEach((d) => {
        if (d.id === "t1LeadSource") {
            emailList = d.emailList.join(',')
        }
        else if (d.id === "t2ColdEmail") {
            emailTemplate = d.emailTemplate
        }
        else if (d.id === "t3Delay") {
            waitFor = d.waitFor;
            waitType = d.waitType;
        }
    })
    console.log(emailList, emailTemplate, waitFor, waitType);
    return {
        emailList, emailTemplate, waitFor, waitType
    }
}


async function startAgenda(dataObj) {

    const agenda = new Agenda({ db: { address: process.env.MONGODB_CONNECTION_STRING } });
    agenda.define(
        'send email report',
        async job => {
            const { to, template } = job.attrs.data;
            const info = await emailSender.sendMail({
                to,
                subject: `Email Report: ${template}`,
                text: "Hello there",
                html: "<h1>Hello therer</h1>"
            });
            console.log("Message sent: %s", info.messageId);
        },
        { priority: 'high', concurrency: 10, }
    );
    await agenda.start();
    await agenda.schedule('in 1 minute', 'send email report', { to: dataObj.emailList, template: dataObj.emailTemplate });
    // await agenda.every(`${dataObj.waitFor} ${dataObj.waitType}`, 'send email report')
    console.log("Agenda scheduled");
};
app.post("/post-new-schedule", (req, res) => {
    console.log(req.body);

    let dataObj = filterData(req.body)
    startAgenda(dataObj)

    return res.status(200).json({ message: "OK" })
})


// {
//     "emailList": [
//         "jksfk",
//         "skdf",
//         "skfj"
//     ]
// }


// {
//     "emailTemplate": "welcome-template"
// }

// {
//     "waitFor": 22,
//     "waitType": "minutes"
// }