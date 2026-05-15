// const { v4: uuidv4 } = require("uuid");

// console.log("uuidv4 => ", uuidv4());

// const a = uuidv4();
// console.log("a => ", uuidv4());

// const data = {
//   title: "測試",
//   id: uuidv4(),
// };

// console.log("data => ", data);

const http = require("http");
const { title } = require("process");
const { v4: uuidv4 } = require("uuid");
const { errorHandler } = require("./utils/error");

const data = [{ title: 1, id: uuidv4() }];

const requestListener = (request, response) => {
  console.log(request.url, request.method);

  let body = "";
  let count = 0;

  request.on("data", (chunk) => {
    body += chunk;
    count++;
    console.log("chunk", chunk);
    // console.log("執行次數 : ", count);
  });

  // request.on("end", () => {
  //   console.log("========================");
  //   console.log(body);
  //   console.log(typeof body);
  //   console.log(typeof JSON.parse(body));
  //   console.log(JSON.parse(body));
  //   console.log(JSON.parse(body).title);
  // });

  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  if (request.url === "/todos" && request.method === "GET") {
    response.writeHead(200, header);
    response.write(
      JSON.stringify({
        status: "success",
        data,
      }),
    );
    response.end();
  } else if (request.url === "/todos" && request.method === "POST") {
    request.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        console.log(title);
        console.log(typeof body);

        if (title) {
          data.push({
            title,
            id: uuidv4(),
          });

          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data,
            }),
          );
          response.end();
        } else {
          errorHandler(response);
        }
      } catch (error) {
        errorHandler(response);
      }
    });
  } else if (request.url === "/todos" && request.method === "DELETE") {
    data.length = 0;

    response.writeHead(200, header);
    response.write(
      JSON.stringify({
        status: "success",
        message: "刪除成功!",
        data,
      }),
    );
    response.end();
  } else if (request.url.startsWith("/todos/") && request.method === "DELETE") {
    const id = request.url.split("/").pop();
    const index = data.findIndex((el) => el.id === id);
    console.log(id, index);
    if (index !== -1) {
      data.splice(index, 1);

      response.writeHead(200, header);
      response.write(
        JSON.stringify({
          status: "success",
          message: `刪除 ${id} 成功!`,
          data,
        }),
      );
      response.end();
    } else {
      errorHandler(response);
    }
  } else if (request.url.startsWith("/todos/") && request.method === "PATCH") {
    request.on("end", () => {
      try {
        const { title } = JSON.parse(body);

        const id = request.url.split("/").pop();
        const index = data.findIndex((el) => el.id === id);

        if (title && index !== -1) {
          data[index].title = title;
          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data,
            }),
          );

          response.end();
        } else {
          errorHandler(response);
        }
      } catch (error) {
        errorHandler(response);
      }
    });
  } else if (request.method === "OPTIONS") {
    response.writeHead(200, header);
    response.write(
      JSON.stringify({
        status: "true",
        message: "成功 !",
      }),
    );
    response.end();
  } else {
    response.writeHead(404, header);
    response.write(
      JSON.stringify({
        status: "false",
        message: ["發生錯誤 ! "],
      }),
    );
    response.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT  || 8080);
