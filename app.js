const express = require("express");
 
const app = express();
 
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));
 
app.use("/", function(request, response){
     
    response.render("tasks", {
        title: "Мои задачи",
        tasksVisible: true,
        taskName: ["Учёба", "Спорт", "Хобби"],
        taskDescription: ["Сделать дз", "Сделать упражнения на спину", "Поиграть на гитар"]
    });
});

app.use("/", function(request, response){
     
    response.send("Please follow the port 3001!");
});

app.listen(3001, function() {
    console.log("Server was started");
});