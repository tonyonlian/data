 const Glue = require('glue');
 const Path = require('path');
 var Chalk = require('chalk');
 

function start(options,func){
    
    let pluginPath = Path.join(options.relativeTo, 'config/config.js');
    const Config  = require(pluginPath);
    let serverConf = Config.server;
    delete Config.server;
    let hapiConfig = {};
    let registrations = [];
    Config.registrations.forEach(function(item) {
        if(item.options && item.options.relativeTo){
            item.options.relativeTo = options.relativeTo;
        }
        
        let  _temp = item.plugin;
        delete item.plugin;
        item.register =_temp;
        let _tempObj = {"plugin":item};
        registrations.push(_tempObj);
        
    });

    hapiConfig.server={
        "app":{
            "appRoot":options.relativeTo
         },
        "load": {
             "sampleInterval": 1000
         }
     }
     if(serverConf){
        hapiConfig.connections = [
            {
            "host": 'localhost',
            "port":serverConf.port||9000
            }
        ]
     }

     hapiConfig.registrations = registrations;



    Glue.compose(hapiConfig, options, (err, server) => {
        if (err) {
             console.error('failed to loadp plugin!');
            throw err;
        }
        _fomatInfo(server);

        //server.log('info','plugs register completed!');
        server.start(() => {
            func();
            server.log('info',`Server runing at: ${server.info.uri}`);
        });
    });

}

var funcsobj = {
    start:start
}
module.exports=funcsobj;


function _fomatInfo(server){
    console.log('');
    console.log(Chalk.green("==============================WELCOME================================"));
    console.log(Chalk.yellow("  Welcome to LIGHTWAY !!!"));
    console.log(Chalk.yellow(`  Start env: ${process.argv[2]||'test'}`));
    console.log(Chalk.yellow(`  Server runing at: ${server.info.uri}`));
    console.log(Chalk.yellow(`  API documentation runing at: ${server.info.uri}/documentation`));
    console.log(Chalk.green("==============================WELCOME================================"));
    console.log("");  
}
