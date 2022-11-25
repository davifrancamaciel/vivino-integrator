'use strict';

const SESServiceProvider = require("aws-sdk/clients/ses");
const sesServiceProvider = new SESServiceProvider({ apiVersion: '2010-12-01' })
const { mapUser, findUserById } = require('./UserService')
const { Status, roules } = require("../utils/defaultValues");

const sendMailSES = async ({ subject, body, emails }) => {
    try {
        var params = {
            Source: `Claro message <${process.env.EMAIL_FROM_SENDER}>`,
            Destination: { ToAddresses: emails },
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

const sendEmailStatusMessage = async (message) => {
    try {
        const emails = await emailsToSend(message)

        if (!emails.length)
            return null

        const subject = `Mensagem ${message.status === Status.AGUARDANDO_APROVACAO ? 'pendente de aprovação' : 'reprovada'}  código ${message.id}`
        const objSend = {
            subject,
            emails,
            body: createBodyMessage(message),
        }
        return await sendMailSES(objSend);
    } catch (error) {
        throw new Error(error)
    }
}

const emailsToSend = async (message) => {
    if (message.status === Status.AGUARDANDO_APROVACAO) {
        const user = await findUserById(message.authorId)
        const userFormatted = mapUser(user)

        if (!userFormatted.manager)
            return []

        const manager = await findUserById(userFormatted.manager)
        if (!manager)
            return []

        const managerFormatted = mapUser(manager)

        if (!managerFormatted.accessTypeText.toLocaleLowerCase().includes(roules.message_approver) &&
            !managerFormatted.accessTypeText.toLocaleLowerCase().includes(roules.administrator))
            return []

        return [managerFormatted.email]
    }
    if (message.status === Status.REPROVADA) {
        const user = await findUserById(message.authorId)
        const userFormatted = mapUser(user)
        return [userFormatted.email]
    }
    return []
}

const createBodyMessage = (message) => {
    const appUrl = process.env.IS_OFFLINE ? 'http://localhost:3000' : process.env.URL_APP
    return `
    <div width="100%" style="margin:0;background-color:#f0f2f3">
        <div style="margin:auto;max-width:600px;padding-top:50px" class="m_-3166743653847993863email-container">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-3166743653847993863logoContainer"
                style="background:#FFBC4A;border-radius:3px 3px 0 0;max-width:600px">
                <tbody>
                    <tr>
                        <td
                            style="background:#FFBC4A;border-radius:3px 3px 0 0;padding:20px 0 10px 0;text-align:center">
                            <img src="https://nagra-static-files.s3.amazonaws.com/claro-message/logo-claro-message.png" height="45"
                                alt="Claro Message" border="0"
                                style="font-family:sans-serif;font-size:15px;line-height:140%;color:#555555"
                                class="CToWUd">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-3166743653847993863emailBodyContainer"
                style="border:0px;border-bottom:1px solid #d6d6d6;max-width:600px">
                <tbody>
                    <tr>
                        <td
                            style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                            <p style="margin:0;padding:0">Olá ${message.status === Status.AGUARDANDO_APROVACAO ? 'uma nova mensagem foi criada e está aguardando aprovação' : 'sua mensagem foi reprovada'} . Veja os detalhes abaixo.</p>
                            <br/>
                            <h1 style="font-size:20px;font-weight:bold;line-height:1.3;margin:0 0 15px 0">${message.title}</h1>
                            <p style="margin:0;padding:0">${message.message}</p>
                            
                            ${message.comments ? `<br/><div style="font-weight:bold;padding-bottom:15px">Comentários internos</div>
                            <p style="margin:0;padding:0">${message.comments}</p>` : ''}
                            
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px;padding-top:0;text-align:center">
                            <div style="font-weight:bold;padding-bottom:15px">Para ver a mensagem código</div>
                            <div style="color:#000;font-size:36px;font-weight:bold;padding-bottom:15px">${message.id}</div>
                            <div style="font-weight:bold;padding-bottom:15px">
                                <a href="${appUrl}/messages/edit/${message.id}" target="_blank">Clique aqui</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color:#fff;border-top:1px solid #e0e0e0;color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                            <p style="margin:0 0 15px 0;padding:0 0 0 0">A Nagra Kudelski nunca enviará um e-mail
                                solicitando que você divulgue ou verifique sua senha, cartão de crédito ou número de
                                conta bancária.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-3166743653847993863footer" style="max-width:600px">
                <tbody>
                    <tr>
                        <td
                            style="color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:12px;line-height:16px;padding:20px 30px;text-align:center">
                            Esta mensagem foi gerada e distribuída pela <a href="https://dtv.nagra.com/"
                                target="_blank">Nagra Kudelski</a>.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}

module.exports = { sendEmailStatusMessage }