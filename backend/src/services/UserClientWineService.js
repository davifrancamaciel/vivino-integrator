"use strict";

const db = require('../database');
const User = require('../models/User')(db.sequelize, db.Sequelize);
const WineSaleUser = require('../models/WineSaleUser')(db.sequelize, db.Sequelize);
const { userType } = require("../utils/defaultValues");

const addClientBySale = async (sales) => {

    let wineSaleUserList = [];

    for (let i = 0; i < sales.length; i++) {
        const element = sales[i];
        try {
            const sale = JSON.parse(element.sale);
            const user = {
                companyId: element.companyId,
                name: sale?.user?.alias,
                email: sale?.user?.email,
                phone: sale?.shipping?.address?.phone,
                type: userType.CLIENT,
                active: true
            }

            const item = await User.findOne({ where: { email: user.email } })
            let userId = null;
            if (item != null) {
                userId = item.id;
                await item.update(user);
            }
            else {
                const result = await User.create(user)
                userId = result.id;
            }
           
            wineSaleUserList.push({
                companyId: element.companyId,
                userId,
                code: element.code
            })

        } catch (error) {
            console.error(element, error)
        }
    }

    await WineSaleUser.bulkCreate(wineSaleUserList)
}

module.exports = { addClientBySale }