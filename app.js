const express = require("express");
 
const app = express();

const mysql = require("mysql2");

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var count = 0;

let taskId = new Array();
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
    var tasks = results;
    //console.log(results);
    for(let i=0; i < tasks.length; i++){
        taskId[i] = i+1;
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
app.post('/tasks_insert', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
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
        taskId,
        taskName,
        taskDesc,
        taskDateTime
    });
});

app.post('/tasks_delete', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "task_manager",
        password: "frhjgjkbc"
      });

    var tName = req.body.form_taskName;
    console.log(req.body.form_taskId);
    console.log(taskName[req.body.form_taskId-1]);
    if (req.body.form_taskId !== "" && Number(req.body.form_taskId) <= count+1 && Number(req.body.form_taskId) > 0) { // && req.body.form_taskId < count && req.body.form_taskId > 0
        
        tName = taskName[req.body.form_taskId-1];
        console.log(tName);
    }
    
    const sqlDelete = `DELETE FROM tasks WHERE name='${tName}'`;

    connection.query(sqlDelete, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null; 
    //connection.end();

    const sqlUp = `SELECT * FROM tasks`;

    taskId = [];
    taskName = [];
    taskDesc = [];
    taskDateTime = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var tasks = results;
    //console.log(results);
    for(let i=0; i < tasks.length; i++){
        taskId[i] = i+1;
        taskName[i] = tasks[i].name;
        taskDesc[i] = tasks[i].description;
        taskDateTime[i] = tasks[i].dt;
        count = i;
      }
      res.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskId,
        taskName,
        taskDesc,
        taskDateTime
    });
    
    });
    connection.end();

});

app.post('/tasks_update', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "task_manager",
        password: "frhjgjkbc"
      });

    var tName = req.body.form_taskName;

    const sqlUpdate = `UPDATE tasks SET description='${req.body.form_taskDescription}', dt='${req.body.form_taskDateTime}' WHERE name='${req.body.form_taskName}'`;

    connection.query(sqlUpdate, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null; 
    //connection.end();

    const sqlUp = `SELECT * FROM tasks`;

    taskId = [];
    taskName = [];
    taskDesc = [];
    taskDateTime = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var tasks = results;
    //console.log(results);
    for(let i=0; i < tasks.length; i++){
        taskId[i] = i+1;
        taskName[i] = tasks[i].name;
        taskDesc[i] = tasks[i].description;
        taskDateTime[i] = tasks[i].dt;
        count = i;
      }
      res.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskId,
        taskName,
        taskDesc,
        taskDateTime
    });
    
    });
    connection.end();

});

app.post('/tasks_sort', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "task_manager",
        password: "frhjgjkbc"
      });

    var checkOption = '';
    if (req.body.optionName == 'checkName') {
        checkOption = 'name';
        console.log(checkOption);
    }
       
    if (req.body.optionDateTime == 'checkDateTime')
       checkOption = 'dt'

    if (checkOption == '')
      console.log('option was not selected');
    
    req.body = null;

    const sqlUp = `SELECT * FROM tasks ORDER BY ${checkOption}`;

    taskId = [];
    taskName = [];
    taskDesc = [];
    taskDateTime = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var tasks = results;
    //console.log(results);
    for(let i=0; i < tasks.length; i++){
        taskId[i] = i+1;
        taskName[i] = tasks[i].name;
        taskDesc[i] = tasks[i].description;
        taskDateTime[i] = tasks[i].dt;
        count = i;
      }
      res.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskId,
        taskName,
        taskDesc,
        taskDateTime
    });
    
    });
    connection.end();

});
 
app.use("/", function(request, response){
     
    response.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskId,
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