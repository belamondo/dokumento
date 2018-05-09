const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const shell = require("shelljs");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

//Welcome to Dokumento
app.get("/", (req,res) => {
	res.send("Welcome to Dokumento");
})

app.post("/crud", (req, res) => {
    let resObject = [];

    if(!req.body.params) {
        resObject.push({
            code: "c-error-01",
            message: "No params"
        });
    } else {
        let params = req.body.params;
    
        if (params.create) {
            //Set params errors: start
            if(!params.create.collection) {
                resObject.push({
                    code: "cr-error-01",
                    message: "Required param: collection"
                });
            }

            if(!params.create.objectToCreate) {
                resObject.push({
                    code: "cr-error-02",
                    message: "Required param: objectToCreate"
                });
            }
            //Set params errors: end

            //If no errors found
            if(resObject.length < 1) {
                //Look for folder with the same name as params.create.collection
                if(shell.find("./collections/"+params.create.collection).code == 1) {
                    //Create the folder if not found
                    shell.mkdir("./collections/"+params.create.collection);
                    //Create files according to params.create.objectToCreate with timestamp as name (add user id in the future, before the timestamp)
                    for(let lim = params.create.objectToCreate.length, i = 0; i < lim; i++) {
                        setTimeout(() => {
                            resObject.push(params.create.objectToCreate[i]);
                            shell.exec("echo "+ JSON.stringify(params.create.objectToCreate[i]) + " >./collections/"+params.create.collection + Date.now());
                        }, 10)
                    };
                } else { 
                    //Create files according to params.create.objectToCreate with timestamp as name (add user id in the future, before the timestamp)
                    for(let lim = params.create.objectToCreate.length, i = 0; i < lim; i++) {
                        setTimeout(() => {
                            resObject.push(params.create.objectToCreate[i]);
                            shell.exec("echo "+ JSON.stringify(params.create.objectToCreate[i]) + " >./collections/" + params.create.collection + "/" + Date.now());
                        }, 10)
                    };
                }
            } else {
                res.send(resObject);
            }
        }
    
        if (params.read) {
            //Set params errors: start
            if(!params.read.collection) {
                resObject.push({
                    code: "r-error-01",
                    message: "Required param: collection"
                });
            }
            //Set params errors: end
        }
    
        if(params.update) {
            console.log("Update");  
        }
    
        if(params.delete) {
            console.log("Create");  
        }    
    }

    res.send(resObject);
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})
