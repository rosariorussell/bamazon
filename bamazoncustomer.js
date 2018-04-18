const mysql = require('mysql')
const inquirer = require('inquirer')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected on " + connection.threadId)
})

const showTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("Item id | Product name | Department name | Price | Stock quantity")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
        }
        askUser(res);
    })
}

const askUser = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'selection',
        message: 'What is the id of the item you want to purchase?'
    }]).then(function (answer) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == parseInt(answer.selection)) {
                var productId = res[i].item_id
                inquirer.prompt({
                    type: 'input',
                    name: 'quantity',
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true
                        } else {
                            return false
                        }
                    }
                }).then(function (answer) {
                    if ((res[productId].stock_quantity - answer.quantity) >= 0) {
                        newVal = res[productId].stock_quantity - parseInt(answer.quantity)
                        console.log(newVal)
                        connection.query(`"UPDATE products SET stock_quantity=${newVal} WHERE item_id=${productId}"`, function (err, res2) {
                            console.log("You purchased an item!")
                        })
                    } else {
                        console.log("Insufficient quantity!")
                        askUser(res)
                    }
                })
            }
        }

    })
}

showTable()
connection.end()