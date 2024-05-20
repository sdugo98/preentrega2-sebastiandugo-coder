import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587,
        auth: {
            user: "sebastiandugo98@gmail.com",
            pass: "nlgixgkrvkyldwec"
        }
    }
)

export const sendMail = (to, subject, message)=>{
    return transport.sendMail(
        {
            to, subject,
            html: message
        }
    )
}