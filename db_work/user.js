var mongoose = require('config/schema');
var crypto = require('crypto');
var nconf = require('nconf');

/*mongoose.connect(nconf.get('mongoose: uri'), nconf.get('mongoose: options')); */

var schema = new mongoose.Schema({                        //задаем схему коллекции Пользователь
    username:{                                            //ключи и их параметры
        type: String,
        unique: true,
        required: true
    },
    hashPassword:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    gender:{
        type: String
    },
    birthday:{
        type: Date
    },
    phone:{
        type: Array
    },
    email:{
        type: String
    },
    status:{
        type: Array
    },
    created:{
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');          //метод шифрования пароля
};

schema.virtual('password')
    .set(function(password){                                                  //пароль задается пользовательской строкой
        this._plainPassword = password;                                       //+ случайно сгенерированной величиной salt
        this.salt = Math.random() + '';
        this.hashPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._plainPassword;
    });

schema.statics.auth = function(username, password, callback){                         //метод авторизации
    var User = this;                                                                  //ищем есть ли такой юзер в базе
    User.findOne({username: username}, function(error, user, status){
        if(error) console.log(error);
        if(user){                                                                    // если есть то проверяем пароль
            if(user.checkPassword(password)){;                                       // передаем код 200 ОК и id пользователя из базы
                status = 200;
                user = user._id;
                callback( null, user, status);
            }
            else{
                status = 403;                                                        //если пароль не совпал с введеным, передаем код 403
                callback(null, null, status);
            }
        }
        else{
            var status = 404;                                                        //если пользователя нет - код 404 не наиден
            callback(null, null, status);
        };
        //console.log(user);
    });


}


schema.methods.checkPassword = function(password){                                 //метод проверки пароля
    return this.encryptPassword(password) === this.hashPassword;
};

exports.User = mongoose.model('User', schema);
//exports.Session = mongoose.model('Session', session);
