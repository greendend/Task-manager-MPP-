const express = require("express");
 
const app = express();

const mysql = require("mysql2");

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var count = 0;

let taskName = new Array();
let taskDesc = new Array();
let taskDateTime = new Array();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "task_manager",
  password: "frhjgjkbc"
});

const sql = `SELECT * FROM tasks`;
 
connection.query(sql, function(err, results) {
    if(err) console.log(err);
    const tasks = results;
    //console.log(results);
    for(let i=0; i < tasks.length; i++){
        taskName[i] = tasks[i].name;
        taskDesc[i] = tasks[i].description;
        taskDateTime[i] = tasks[i].dt;
        count = i;
      }
    console.log("Получение данных из БД");
});


connection.end();
 
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

// Обратите внимание на используемый путь. Именно он задается в атрибуте action формы
app.post('/tasks', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("idi nahui");
    console.log(req.body);

    count++;
    taskName[count] = req.body.form_taskName;
    taskDesc[count] = req.body.form_taskDescription;
    taskDateTime[count] = req.body.form_taskDateTime;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "task_manager",
        password: "frhjgjkbc"
      });

    const sqlInsert = `INSERT INTO tasks(name, description, dt) VALUES('${req.body.form_taskName}', '${req.body.form_taskDescription}', '${req.body.form_taskDateTime}')`;

    connection.query(sqlInsert, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null;
    connection.end();


    res.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskName,
        taskDesc,
        taskDateTime
    });
});
 
app.use("/", function(request, response){
     
    response.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskName,
        taskDesc,
        taskDateTime
    });
});


app.use("/", function(request, response){
     
    response.send("Please follow the port 3001!");
});

app.listen(3001, function() {
    console.log("Server was started");
});