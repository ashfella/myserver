# Myserver

Let's install node opcua

```
$ npm init                      # create a package.json
$ npm install node-opcua --save # add the node-opcua

$ npm i --save csvtojson        # read csv file, convert to json
```

> In this project I decided to *inverse* roles of the server and client. My server *reads* data from file (simulating a sensor).
Then my client *monitors* the item. In this case, we can establish from our client multiple connections to servers and monitor all variables. My server will publish any data change on the monitored variables back to the client every second. 

> In this project I import data from csv file to an array of json objects. I then convert each json object to a string and send it to the client. My server checks if there are any subscriptions active right now. If no, it does not send data.



