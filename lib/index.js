 const Glue = require('glue');
 const Path = require('path');
 const Chalk = require('chalk');
 const DefConf = require('./pluginConf.js')
 
 function App(){
    this.options = "";
    this.hapiConfig ={};
    this.isDoc = false;
    this.root = Path.dirname(require.main.filename);
 }

App.prototype.init = function(options){ 
      this.options = options;
      //处理工程的根目录
      if(options && options.root){
         this.root = options.root ;  
      }

      let _configPath = Path.join( this.root , 'config/config.js');
      const _config = require(_configPath).getConfig(process.argv[2]||'test');
      this.customConfig = _config.customConfig||{} 
      this.customConfig.root = this.root;
      let _serverConf = _config.server;
      this.isDoc = _serverConf.documentation;

      //获取server的默认插件配置
      let _registrations = DefConf.getDefPlugin({root:this.root,isdoc:this.isDoc,apiDir:_serverConf.apiDir});
     // delete _config.server;
    
      let pluginsKeys  =  Object.keys(_config.plugins);
      
      pluginsKeys.forEach(function(key){

         let pluginOptions = _config.plugins[key];
         if(pluginOptions && Object.keys(pluginOptions).lenght>0 && pluginOptions.relativeTo){
            pluginOptions.relativeTo = this.root;
         }
          
         let  _tempObj ={"plugin":{"register":key,"options":pluginOptions}};
         _registrations.push(_tempObj);

      });

      this.hapiConfig.server = {
        "app":this.customConfig,
        "load": {
             "sampleInterval": 1000
         }
      }

       if(_serverConf){
        this.hapiConfig.connections = [
            {
                "host": _serverConf.host||'localhost',
                "address": _serverConf.address||'0.0.0.0',
                "port":_serverConf.port||9000
            }
        ]
     }

      this.hapiConfig.registrations = _registrations;
      return this; 
}; 


App.prototype.start = function(callback){
       if(Object.keys(this.hapiConfig).length = 0){
           console.error('请先调用配置...');
            throw err;
       }
       Glue.compose(this.hapiConfig, {relativeTo:this.root}, (err, server) => {
        if (err) {
            console.error('failed to loadp plugin!');
            throw err;
        }
        _fomatInfo(server,this.isDoc);
        server.start(() => {
            callback();
            server.log('info',`Server runing at: ${server.info.uri}`);
        });
      });
    
     return this; 
};

  
  function _fomatInfo(server,isDoc){
    console.log('');
    console.log(Chalk.green("==============================WELCOME================================"));
    console.log(Chalk.yellow("  Welcome to LIGHT-API !!!"));
    console.log(Chalk.yellow(`  Start env: ${process.argv[2]||'test'}`));
    console.log(Chalk.yellow(`  Server runing at: ${server.info.uri}`));
    if(isDoc){
        console.log(Chalk.yellow(`  API test documentation runing at: ${server.info.uri}/test`));
    }
    console.log(Chalk.green("==============================WELCOME================================"));
    console.log("");  
 }

 let app = new App();

 module.exports = app



