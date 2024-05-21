import nodemailer from "nodemailer"

export const emailSender = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "ajtest2024@outlook.com",
        pass: "Akshay@123"
    },
    tls: {
        ciphers: 'SSLv3'
    }
});