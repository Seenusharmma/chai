const http = require("http");

const data = JSON.stringify({});

const options = {
  hostname: "localhost",
  port: 5002,
  path: "/api/menu/seed",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`StatusCode: ${res.statusCode}`);

  let responseBody = "";
  res.on("data", (chunk) => {
    responseBody += chunk;
  });

  res.on("end", () => {
    console.log("Response:", responseBody);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
