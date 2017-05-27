/**
 * Created by andresdkm on 19/05/17.
 */
var fs = require('fs');
var ejs = require("ejs");
var config = require('./config.json');

function titleCase(str) {
    return str.split(' ').map(function(val){
        return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
    }).join(' ');
}




function generateModels(config)
{
    var dir = config.path+"/"+config.path_models;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }

    fs.readFile("./templates/model.ejs", 'utf8', function (err, data) {
        if (err) { console.log(err); return false; }
        for(var i=0;i<config.entities.length;i++)
        {
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    name:titleCase(config.entities[i].entityName),
                    fields:config.entities[i].fields
                });
            fs.writeFile(dir+"/"+config.entities[i].entityName.toLowerCase()+ '.model.ts', model, function(err) {
                if(err) { console.log(err); return false }
                return true;
            });
        }
    });
}

function generateComponent(config)
{


    fs.readFile("./templates/component.ejs", 'utf8', function (err, data) {
        if (err) { console.log(err); return false; }
        for(var i=0;i<config.entities.length;i++)
        {
            var dir = config.path+"/"+config.path_components+"/"+config.entities[i].entityName.toLowerCase();
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    title:config.entities[i].title,
                    api:config.entities[i].api_path,
                    nameLower:config.entities[i].entityName.toLowerCase(),
                    nameTitle:titleCase(config.entities[i].entityName),
                    fields:config.entities[i].fields,
                    sources:config.sources?config.sources:[]
                });
            fs.writeFile(dir+"/"+config.entities[i].entityName.toLowerCase()+ '.component.ts', model, function(err) {
                if(err) { console.log(err); return false }
                return true;
            });
        }
    });

    fs.readFile("./templates/view.ejs", 'utf8', function (err, data) {
        if (err) { console.log(err); return false; }
        for(var i=0;i<config.entities.length;i++)
        {
            var dir = config.path+"/"+config.path_components+"/"+config.entities[i].entityName.toLowerCase();
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    title:config.entities[i].title,
                    api:config.entities[i].api_path,
                    nameLower:config.entities[i].entityName.toLowerCase(),
                    nameTitle:titleCase(config.entities[i].entityName),
                    fields:config.entities[i].fields
                });
            fs.writeFile(dir+"/"+config.entities[i].entityName.toLowerCase()+ '.view.html', model, function(err) {
                if(err) { console.log(err); return false }
                return true;
            });
        }
    });

}

function initGenerator(config)
{
    /*
    var dir = __dirname + '/config.entity';
    if (!path.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }*/
}

generateModels(config);
generateComponent(config);