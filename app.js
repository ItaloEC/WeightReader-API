const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./index");

// ------------------ api methods to send the weight for the clients

const port = process.env.PORT || 4001;

const app = express();

app.use(index);
const server = http.createServer(app);
const io = socketIo(server); 

io.on("connection", socket => {
  console.log("New client connected"), getApiAndEmit(socket);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async () => {
  try {
    io.emit("FromAPI", pesoFormatado); // Emitting a new message. It will be consumed by the client
    
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));

// ------------------ communication with the serial port and reading the weight

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const serialPort = new SerialPort("COM1", { baudRate: 256000 });

const parser = new Readline();
serialPort.pipe(parser);

var pesoFormatado = "";

serialPort.on("data", function(data) {
  console.log("Data:", data);
  var str = data.toString();
  console.log("toString: ", str);
  var lastDigit = parseInt(str.charAt(5));

  if (str.charAt(1) !== '0')
    var peso =
      str.charAt(1) +
      str.charAt(2) +
      "," +
      str.charAt(3) +
      str.charAt(4) +
      lastDigit;
  else
    var peso = str.charAt(2) + "," + str.charAt(3) + str.charAt(4) + lastDigit;

  pesoFormatado = peso;

  getApiAndEmit();
});

