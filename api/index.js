import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';
//import promise from 'promise';
//import { resolve } from 'dns';
import users from './users';
import auth from './auth';
import events from './events';
import query from './query';
import meteoquery from './meteoquery';
import operative_query from './operative_query';
import operative_report from './operative_report';
import admin_actions from './admin_actions';
import ftp_actions from './ftp_actions';
import cron from 'node-cron';
import ftp_upload from './ftp_actions';
import cron_email from './emailer';
import cors from 'cors';

const app = express();
app.use(cors());
//var staticPath = path.join(__dirname, '/');
//app.use(express.static(staticPath));

//app.use(bodyParser.json());

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/query', query);
app.use('/api/meteoquery', meteoquery);
app.use('/api/operative_query', operative_query);
app.use('/api/operative_report', operative_report);
app.use('/api/admin', admin_actions);
app.use('/api/ftp', ftp_actions);


const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));


app.get('/*', (req, resp) => {
    resp.sendFile(path.join(__dirname, '../client/public/index.html'));
    // console.log( data);
    //resp.send(data);

});

const server = app.listen(3000, () => {
    console.log('Server is started on 3000 port...');
    const task = cron.schedule('19,39,59 * * * *', () => {
        //running a task every 20 minute
        //ftp_upload();
        //cron_email(); //when smtp exist

    });
    const task_mail = cron.schedule('* * * * *', () => {
        //running a task every minute for critical events
        
        cron_email(); //when smtp exist

    });
});
