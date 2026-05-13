function errorHandler(response) {
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  response.writeHead(400, header);
  response.write(
    JSON.stringify({
      status: "false",
      message: "欄位未填寫正確，或無此 todo id  test",
    }),
  );
  response.end();
}

module.exports = { errorHandler };
