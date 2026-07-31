const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("./utils/error");
const { successHandler } = require("./utils/success");

const headers = require("./utils/headers");

const data = [];

const requestListener = (request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  if (request.url === "/todos" && request.method === "GET") {
    successHandler(response, data);
  } else if (request.url === "/todos" && request.method === "POST") {
    request.on("end", () => {
      try {
        const { title } = JSON.parse(body);

        if (title && title.trim() !== "") {
          data.push({
            title: title.trim(),
            id: uuidv4(),
          });

          successHandler(response, data);
        } else {
          errorHandler(response, 400, "title 不能為空");
        }
      } catch (error) {
        errorHandler(response, 400, "title 不能為空");
      }
    });
  } else if (request.url === "/todos" && request.method === "DELETE") {
    data.length = 0;
    successHandler(response, data, "刪除成功!");
  } else if (request.url.startsWith("/todos/") && request.method === "DELETE") {
    const id = request.url.split("/").pop();
    const index = data.findIndex((el) => el.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      successHandler(response, data, "刪除成功!");
    } else {
      errorHandler(response, 400, "無此 todo id");
    }
  } else if (request.url.startsWith("/todos/") && request.method === "PATCH") {
    request.on("end", () => {
      try {
        const { title } = JSON.parse(body);

        const id = request.url.split("/").pop();
        const index = data.findIndex((el) => el.id === id);

        if (title && index !== -1 && title.trim() !== "") {
          data[index].title = title;
          successHandler(response, data);
        } else {
          errorHandler(response, 400, "欄位未填寫正確，或無此 todo id");
        }
      } catch (error) {
        errorHandler(response, 400, "JSON 格式錯誤");
      }
    });
  } else if (request.method === "OPTIONS") {
    response.writeHead(200, headers);
    response.end();
  } else {
    errorHandler(response, 404, "無此網站路由");
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
