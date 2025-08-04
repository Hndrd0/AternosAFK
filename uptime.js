const http = require("http");

http
  .createServer((req, res) => {
    res.write("AternosAFK is alive!");
    res.end();
  })
  .listen(8080);
