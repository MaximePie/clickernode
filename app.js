const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http.createServer(app);

const router = express.Router();

router.get("/", (req, res) => {
  console.log("HAHA");
  res.send({ response: "I am alive" }).status(200);
});

const socketIo = require("socket.io");

const io = socketIo(server);

let counter = 0;

io.on("connection", (socket) => {

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on('incrementCounter', () => {
    counter++;
    console.log("Sending value " + counter);
    io.sockets.emit('counterUpdate', counter);
  })
});


const port = process.env.PORT || 4001

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
