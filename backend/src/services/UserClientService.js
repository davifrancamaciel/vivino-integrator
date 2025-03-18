"use strict";

const db = require('../database');
const User = require('../models/User')(db.sequelize, db.Sequelize);
const WineSaleUser = require('../models/WineSaleUser')(db.sequelize, db.Sequelize);
const { userType } = require("../utils/defaultValues");

const addClientsByWinesSales = async (sales) => {

    let wineSaleUserList = [];

    for (let i = 0; i < sales.length; i++) {
        const element = sales[i];
        try {
            const sale = JSON.parse(element.sale);
            const { companyId } = element

            const user = {
                companyId,
                name: sale?.user?.alias,
                image: sale?.user?.image?.location,
                email: sale?.user?.email,
                phone: sale?.shipping?.address?.phone
            }
            const userId = await createUserClient(user);

            wineSaleUserList.push({
                companyId,
                userId,
                code: element.code
            })

        } catch (error) {
            console.error(element, error)
        }
    }

    await WineSaleUser.bulkCreate(wineSaleUserList)
}

const addClientBySale = async (sale) => {
    try {

        const { companyId } = sale

        const user = {
            companyId,
            name: sale.clientName,
            image: null,
            email: sale.clientEmail,
            phone: sale.clientPhone
        }
        const userId = await createUserClient(user);
        return userId;
    } catch (error) {
        console.error(element, error)
        return null;
    }

}

const createUserClient = async ({ companyId, name, image, email, phone, }) => {
    const user = {
        companyId,
        name,
        image,
        email,
        phone,
        type: userType.CLIENT,
        active: true
    }

    const item = await User.findOne({ where: { email: user.email, companyId } })
    let userId = null;
    if (item != null) {
        userId = item.id;
        await item.update(user);
    }
    else {
        const result = await User.create(user)
        userId = result.id;
    }
    return userId;
}

module.exports = { addClientsByWinesSales, addClientBySale }