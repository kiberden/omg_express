var User = require('db_work/user').User;
var Session = require('db_work/user').Session;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app){                                     //ниже перечислены правила обработки запросов на разные url

    app.get('/', function(request, response, next){
        response.render('content/News');
    });

    app.get('/arts', function(request, response, next){
        response.render('content/Arts');
    });

    app.get('/auth', function(request, response, next){                   //методом .get отправляем данные в браузер
        response.render('content/Auth');
        var sid = request.sessionID;
        console.log(sid);
    });

    app.post('/auth', function(request, response, next){                  //методом .post обрабатываем передаваемые данные с браузера
        console.log("POST!");
        var username = request.body.username;                             //тут записываем логин и пас авторизующегося пользователя
        var password = request.body.password;
        var sid = request.sessionID;
        console.log(sid);
        console.log(username + " " + password);

        User.auth(username, password, function(error, user, status){        //и вызываем метод проверки на существование логина и
            if(error) throw error;                                          //корректности пароля из модуля db_work/user
            console.log("Get status " + status);
            console.log("Get user " + user);
            /*if(error){
                console.log("Error here!!")
                throw (error);
            } else{ */
            response.json(status);                                           //отправляем в браузер полученный статус 200б 403 или 404
            if(!user == null)                                               //ПРОБЛЕМНЫЙ КУСОК, НЕ СОЗДАЕТ ЗАПИСИ С ID ПОЛЬЗОВАТЕЛЯ
                request.session.user = user;
        });
    });

    app.get('/registration', function(request, response, next){
        response.render('content/Registration');
        console.log("Get user " + request.session.user);
    });

    app.post('/registration', function(request, response, next){             //то же самое, что и в предидущем методе post только тут все в куче и коряво
        var username = request.body.username;
        var password = request.body.password;
        var name = request.body.name;
        var date = request.body.date;
        var gender = request.body.gender;
        var email = request.body.email;
        var phone = request.body.phone;
        var sid = request.sessionID;

        console.log(sid + " " + username + " " + password + " " + name + " " + date + " " + gender + " " + email + " " + phone);

        var status_code = 0;
        var user = new User({
            username: username,
            password: password,
            name: name,
            gender: gender,
            birthday: date,
            email: email,
            phone: phone,
            status: status_code});
            user.save( function(error){                           //пытаемся сделать новую запись для пользователя в базе и записать инфу
                if(error) return next(error);
                response.json(200);
                //request.session.user = user._id;                //ТОЖЕ НЕ РАБОТАЮТ КОРРЕКТНО СЕССИИ, МОЖЕТ Я ЧЕГО ТО НЕ ДОПОНЯЛ
                //response.end();
            });
        });

    app.get('/service', function(request, response, next){
        response.render('content/Service', {user: request.session.user});
        console.log("!! " + request.session.user);
    });

    app.get('/users', function(request, response, next){                            //заидя на такой url можно посмотреть записи всех пользователей
        User.find( {}, function(error, users){
            if(error)
                console.log("Error in routes when users list called!")
            response.json(users);
        })
    });

    app.get('/users/:id', function(request, response, next){                         //тоже самое что и сверху, только добавляем id пользователя из
        try{                                                                         //базы и смотрим конкретно его инфу
            var id = new ObjectID(request.params.id);
        }
        catch(e) {
            response.render("content/404");
            return;
        }
        User.findById(request.params.id, function(error, user){
            if(error)
                console.log("Error in routes.js when user findId called!")
            if(!user) {
                //response.writeHead(404);
                //response.write("404");
                response.render("content/404");                                      //не нашли - 404
            }
            else
                response.json(user);                                                 //если наиден выводим инфо
        })
    });
}
