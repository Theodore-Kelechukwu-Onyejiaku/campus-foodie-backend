//  HERE WE ARE TO USE SENDGRID
//Configuring the API key
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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");

exports.sendEmail = (email,signature,userId) => {
    console.log({email,signature,userId});

    var link = `http://localhost/verify/${signature}/${userId}`
    var emailContent = "Please click the link below to verify your account";
    console.log(emailContent);
    
    const msg = {
      to: email,
      from: "theodore.onyejiaku.g20@gmail.com", // Use the email address or domain you verified above
      subject: "Email Activation",
      text: "Sending email activation",
      //html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      html: `<body>
                <h1  style='font-family:Tangerine, cursive'>Welcome to Campus Foodie</h1>
                <div style='background-color:blue;padding:'>
                    <a href="${link}"><button style="background-color:#ee6e73">Verify</button></div>
                </div>
                <footer></footer>
            </body>
            `
    };
  
    //ES6
    sgMail.sendMultiple(msg).then(
      (resp) => {
        console.log("Sent Successfully")
        return true
      },
      (error) => {
        console.error(error);
  
        if (error.response) {
          console.error(error.response.body);
          return false;
        }        
      }
    );
  };