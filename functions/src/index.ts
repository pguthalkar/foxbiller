import * as functions from 'firebase-functions';



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const sendEmail = functions.https.onCall((data, context) => {
    let html = '<html><body><p>Dear User,</p> <p> Here is your invoice.</p></body></html>';
    console.log(html);
    const SparkPost = require('sparkpost');
const sparky = new SparkPost('c85b357e95407438503a5bb7c9a49b53c6c2ac78');
    sparky.transmissions.send({
        content: {
            from: 'no-reply@foxbiller.com',
            subject: data.subject,
            html: html,
            attachments:data.attachments
        },
        recipients: [{ address: data.email }]
    }).then((res: any) => {
        console.log(res);
        return {status: 'success'};
    }).catch((err:any) => {
        console.log(err,'....Whoops! Something went wrong');
        return {status: 'fail'};
      });
});

