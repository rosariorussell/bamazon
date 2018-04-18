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

const updateTable = function () {
    connection.query("UPDATE products SET stock_quantity = 100 WHERE item_id = 1", function (err, res) {
        if (err) throw err;
        console.log("It worked!")
        }
    )
}

updateTable()
connection.end()