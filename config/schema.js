var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));    //задаем конфигурации mongoose, считывая их из фаила

module.exports = mongoose;