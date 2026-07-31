const headers = require("./headers");

function successHandler(res, data, message) {
  res.writeHead(200, headers);
  const responseData = {
    status: "success",
    data,
  };

  if (message) {
    responseData.message = message;
  }

  res.write(JSON.stringify(responseData));
  res.end();
}

module.exports = { successHandler };
