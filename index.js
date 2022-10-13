const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

const app = express();
app.use(
    express.static(path.join(__dirname, 'public')),
    bodyParser.urlencoded({extended: true})
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = JSON.stringify({
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    });

    const url = "https://us21.api.mailchimp.com/3.0/lists/39c6b83eda";
    const options = {
        method: "POST",
        auth: "wizjom:fe324cbb2af9dece6358fcec3677c143-us21"
    };
    
    const request = https.request(url, options, (response) => {
        const statusCode = response.statusCode;
        console.log(response);
        if (statusCode===200) {
            res.sendFile(__dirname + "/views/success.html");
        } else {
            res.sendFile(__dirname + "/views/failure.html");
        }
    });
    request.write(data);
    request.end();
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running!");
});