
exports.getDefPlugin = function(options){
 
 let _config = [
            {
                "plugin":{
                    "register":"handler-route",
                    "options":{
                        "relativeTo": options.root,
                        "servers": options.apiDir || ["api/**/*.js","node_modules/*/api/**/*.js"]
                    }
                } 
            },
            {
                "plugin":{
                    "register":"blipp",
                    "option":{
                        "showAuth":true
                    }
                }
            },
            {
                "plugin":"inert"
            },
            {
                "plugin":"vision"
            }
                
      ];


      let _docConfig = {
               "plugin": {
                    "register":"hapi-swagger",
                    "options":{
                        "lang":"zh-cn",
                        "consumes":["application/json","application/x-www-form-urlencoded","application/octet-stream","multipart/form-data","text/*"],
                        "produces":["application/json","application/x-www-form-urlencoded","application/octet-stream","multipart/form-data","text/*"],
                        "jsonEditor":"true",
                        "debug":true,
                        "documentationPath":'/test',
                        "info": {
                            "title": "LIGHT DATA-SERVICE API",
                            "version": "0.0.1",
                            'contact': {
                                'name': 'light developer',
                                'email': 'light@hundsun.com'
                            }
                        }
                    }  
                },
            }

     if(options.isdoc){
         _config.push(_docConfig);  
     }
     return _config;
}