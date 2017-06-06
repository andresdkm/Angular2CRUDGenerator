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

function dropPlural(name) {
    if(name.charAt(name.length-1)=='s')
    {
        name=name.substr(0, name.length-1);
    }
    return name;
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
            var name=dropPlural(config.entities[i].entityName);
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    name:titleCase(name),
                    fields:config.entities[i].fields
                });
            fs.writeFile(dir+"/"+name.toLowerCase()+ '.model.ts', model, function(err) {
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
            var name=dropPlural(config.entities[i].entityName);
            var dir = config.path+"/"+config.path_components+"/"+name.toLowerCase();
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    title:config.entities[i].title,
                    api:config.entities[i].api_path,
                    nameLower:name.toLowerCase(),
                    nameTitle:titleCase(name),
                    fields:config.entities[i].fields,
                    sources:config.sources?config.sources:[]
                });
            fs.writeFile(dir+"/"+name.toLowerCase()+ '.component.ts', model, function(err) {
                if(err) { console.log(err); return false }
                return true;
            });
        }
    });

    fs.readFile("./templates/view.ejs", 'utf8', function (err, data) {
        if (err) { console.log(err); return false; }
        for(var i=0;i<config.entities.length;i++)
        {
            var name=dropPlural(config.entities[i].entityName);
            var dir = config.path+"/"+config.path_components+"/"+name.toLowerCase();
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            var ejs_string = data,
                template = ejs.compile(ejs_string),
                model = template({
                    title:config.entities[i].title,
                    api:config.entities[i].api_path,
                    nameLower:name.toLowerCase(),
                    nameTitle:titleCase(name),
                    fields:config.entities[i].fields
                });
            fs.writeFile(dir+"/"+name.toLowerCase()+ '.component.html', model, function(err) {
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