const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'cop4331lp@gmail.com',
        pass: 'nklpwmrmzzpxvlbs',
    },
});

exports.confirmationEmail = async function(user){
    let userID = {id: user._id.toString()};
    //console.log(user._id.toString());
    let emailToken = await jwt.sign(userID, process.env.SECRET_TOKEN);
    //console.log(emailToken);
    let url;

    
    if (process.env.NODE_ENV === 'production')
    {
        url = `https://obscure-springs-89188.herokuapp.com/confirmation/${emailToken}`;
    }
    else
    {
        url = `http://localhost:5000/confirmation/${emailToken}`;
    }
    

    //console.log(user.email);

    transporter.sendMail({
        from: 'cop4331lp@gmail.com',
        to: `${user.email}`,
        subject: 'Email confirmation',
        html: `Verify your account here: <a href=${url}>${url}</a>`
    });

    console.log("email sent!");
}

exports.sendResetPassword = async function(user){
    let userID = {id: user._id.toString()};
    let emailToken = await jwt.sign(userID, process.env.SECRET_TOKEN);
    let url;

    if (process.env.NODE_ENV === 'production')
    {
        url = `https://obscure-springs-89188.herokuapp.com/reset-password/?id=${emailToken}`;
    }
    else
    {
        url = `http://localhost:3000/reset-password/${emailToken}`;
    }

    transporter.sendMail({
        from: 'cop4331lp@gmail.com',
        to: `${user.email}`,
        subject: 'Barista - Forgot Password Link',
        html: `Reset your password here: <a href=${url}>${url}</a><br><br>If you did not request this email, you may ignore this message.`
    });

    console.log("email sent!");


}
