const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "b03061679@gmail.com",
                pass: "lzupuzgslndbrfsq"
            }

        });

        await transporter.sendMail({
            from: "Leetcode Tracker b03061679@gmail.com",
            to: email,
            subject: subject,
            text: text
        });
        console.log('Email sent to ${email}')
    } catch (error) {
        console.error("Error sending emails :", error)
    }

}

const testEmail = async () => {
    await sendEmail(
        "aanchalbittusharma@gmail.com",
        "Test Email",
        "This is a test email sent from Leetcode Tracker"
    )
}

testEmail()
module.exports = sendEmail;