'use strict';

const SESServiceProvider = require("aws-sdk/clients/ses");
const sesServiceProvider = new SESServiceProvider({ apiVersion: '2010-12-01' })

const sendMailSES = async ({ subject, body, to, companyName }) => {
    try {
        var params = {
            Source: `${companyName ? companyName : 'Integrador de servicos'} <${process.env.EMAIL_FROM_SENDER}>`,
            Destination: { ToAddresses: to },
            Message: {
                Body: {
                    Html: { Charset: "UTF-8", Data: body },
                },
                Subject: { Charset: 'UTF-8', Data: subject }
            },
        };
        return await sesServiceProvider.sendEmail(params).promise()
    } catch (error) {
        return error
    }
}

const sendEmailMessage = async ({ to, subject, body, companyName }) => {
    try {
        if (!to.length)
            return null

        const objSend = {
            subject, to, body: createBodyMessage(body, companyName), companyName
        }
        return await sendMailSES(objSend);
    } catch (error) {
        throw new Error(error)
    }
}

const createBodyMessage = (body, companyName) => {
    return `
        <div width="100%" style="margin:0;background-color:#f0f2f3">
            <div style="margin:auto;max-width:600px;padding-top:50px" class="m_-3166743653847993863email-container">
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                    id="m_-3166743653847993863logoContainer"
                    style="background:#850534;border-radius:3px 3px 0 0;max-width:600px">
                    <tbody>
                        <tr>
                            <td style="background:#850534;border-radius:3px 3px 0 0;text-align:center">
                                <p
                                    style="font-size: 25px; color: #fff; font-weight: bold; padding-top: 25px; padding-bottom: 25px;">
                                    ${companyName ? companyName : 'Integrador de serviços'}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                ${body}

                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                    id="m_-3166743653847993863emailBodyContainer"
                    style="border:0px;border-bottom:1px solid #d6d6d6;max-width:600px">
                    <tbody>
                        <tr>
                            <td
                                style="background-color:#fff;border-top:1px solid #e0e0e0;color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                                <p style="margin:0 0 15px 0;padding:0 0 0 0">O integrador nunca enviará um e-mail
                                    solicitando que você divulgue ou verifique sua senha, cartão de crédito ou número de
                                    conta bancária.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
}

// const cropo = `
//         <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
//             id="m_-3166743653847993863emailBodyContainer" style="max-width:600px">
//             <tbody>
//                 <tr>
//                     <td
//                         style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
//                         <p style="margin:0;padding:0">Olá uma nova mensagem foi criada e está aguardando aprovação . Veja os
//                             detalhes abaixo.</p>
//                         <br />
//                         <h1 style="font-size:20px;font-weight:bold;line-height:1.3;margin:0 0 15px 0">${message.title}
//                         </h1>
//                         <p style="margin:0;padding:0">${message.message}</p>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td
//                         style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px;padding-top:0;text-align:center">
//                         <div style="font-weight:bold;padding-bottom:15px">Para ver a mensagem código</div>
//                         <div style="color:#000;font-size:36px;font-weight:bold;padding-bottom:15px">${message.id}</div>
//                         <div style="font-weight:bold;padding-bottom:15px">
//                             <a href="${appUrl}/messages/edit/${message.id}" target="_blank">Clique aqui</a>
//                         </div>
//                     </td>
//                 </tr>

//             </tbody>
//         </table> `

module.exports = { sendEmailMessage }