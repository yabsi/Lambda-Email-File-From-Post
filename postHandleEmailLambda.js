const nodemailer = require('nodemailer');

exports.handler = (event, context, callback) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: "success"
    };

    const result = JSON.parse(event.body);
    const email= process.env.email;
    const password= process.env.password;

    var transporter = nodemailer.createTransport("smtps://"+email+":"+encodeURIComponent(password) + "@email-smtp.us-east-1.amazonaws.com:465");

    let mailOptions = {
        from: '"Source Allies Recruitment 👻" <yabsi@sourceallies.com>', // sender address
        to: 'yabsi@sourceallies.com', // list of receivers
        subject: 'Applicant: '+result.fullname, // Subject line
        html: `
        <p><img src="https://www.sourceallies.com/img/logo/source-allies-logo-muted-light.png" alt="" width="145" height="30" /></p>
        <hr />
        <p><strong>Full Name:&nbsp;</strong> ${result.fullname}</p>
        <p><strong>Email:&nbsp;</strong>${result.email}</p>
        <p><strong>Phone:&nbsp;</strong>${result.phone}</p>
        <p><strong>Website(s):&nbsp;</strong>${result.sites}</p>
        <p><strong>Roles:&nbsp;</strong>${result.roles}</p>
        <p><strong>Why Us:&nbsp;</strong>${result.why}</p>
        <p><strong>Anything to Share:&nbsp;</strong>${result.share}</p>
        <p>Resume is Attached,</p>
        <p>Have a great day!</p>
        <hr />
        <p style="text-align: center;">www.sourceallies.com</p>
        `, // html body
        attachments: [
                {   // utf-8 string as an attachment
                    filename: `${result.fullname}Resume${result.fileFormat}`,
                    path: result.file,
                }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        callback(null, response);
    });
}
