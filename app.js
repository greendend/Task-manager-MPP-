// подключение express
const express = require("express");
var bodyParser = require('body-parser');
// создаем объект приложения
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var artists = [
    {
        id: 1,
        name: 'Green Day'
    },
    {
        id: 2,
        name: 'Metallica'
    },
    {
        id: 3,
        name: 'Твае вершы'
    }
]

app.get("/artists", function(req, res){
    res.send(artists);
});

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Expres!</h2>");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3001, function() {
    console.log('Server was started');
});