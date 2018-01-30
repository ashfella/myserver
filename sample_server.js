/*global require,setInterval,console */
var opcua = require("node-opcua");

//read csv file into json
const csvFilePath='TestFile.csv'
const csv=require('csvtojson')
var sensorsObject = [];

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    sensorsObject.push(jsonObj);
})
.on('done',(error)=>{
})

// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "UA/MyLittleServer", // this path will be added to the endpoint resource name
     buildInfo : {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2018,30,1)
    }
});

function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {
    
        var addressSpace = server.engine.addressSpace;
        
        // declare a new object
        var device = addressSpace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        });
        
        // emulate variable1 changing every 1000 ms
        var sensorsData;
        var sensorObjectLength = sensorsObject.length;
        var i = 0;       
       
        setInterval(function(){
            //check if client is monitoring, if not don't get data
            if(server.currentSubscriptionCount){
                // console.log(server.currentSubscriptionCount);
                if(sensorObjectLength > 0 ){
                    console.log(i);
                    sensorsData = sensorsObject[i];
                    i++;
                    sensorObjectLength--;
                }
            }
        }, 1000);

        function getDataFromCsv(sensorsData) {
            if(server.currentSubscriptionCount){
                // convert json to string
                return JSON.stringify(sensorsData);
            }
        }

        server.engine.addressSpace.addVariable({
            
            componentOf: device,
            
            nodeId: "ns=1;s=csv", // a string nodeID
            browseName: "CSV",
            dataType: "Double",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.String, value: getDataFromCsv(sensorsData)});}
            }
        });
    }
    construct_my_address_space(server);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}
server.initialize(post_initialize);