const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // 3000 : default 
//process.env : stores all of environment variables as key value pairs
const app = express();

//resgisterPartials() : takes the directory you want to use of all of you handlebar partials files
hbs.registerPartials(__dirname + '/views/partials');

//set() : let us set some various express related configurations
app.set('view engine', 'hbs');

//use() : takes middleware function
//미들웨어는 작성된 순서대로 실행된다.
app.use((req, res, next) => {
    const now = new Date().toString(); //human readable time stamp
    const log = `${now}: ${req.method} ${req.url}`; 
    //req.url : GET / , GET /about

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }; //node v7 이상에선 콜백이 필수다.
    });
    next(); //next()를 실행해야만 아래의 코드로 넘어간다.
    //next()가 없으면 여기서 멈추므로 아래의 핸들러들(get() 등)도 실행되지 못한다.
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });
// 어떤 url로 접속하던지 maintenance를 렌더링한다. 웹사이트를 막을 때 사용할 수 있다.

app.use(express.static(__dirname + '/public'));
//express.static : takes the absolute path to the folder you want to serve up
//__dirname : stores the path to your project's directory.


//Helpers : are ways to register functions to run to dynamically create some output.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//set up a handler for an HTTP get request
//need two arguments: url('/' : root), function(what to send back to the person making request)
app.get('/', (req, res) => { 
    //res.send('<h1>Hello Express!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        WelcomeMessage: 'Welcome to my website'
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
    //render : render any of the templates you have set up with your current view engine
});


app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

//listen() : binds the app to the port on our machine
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
//heroku port를 dynamically하게 바인드하기 위해 환경변수를 설정한다.
