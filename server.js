'use strict';

const Config = require('getconfig');
const Hapi = require('hapi');
const Path = require('path');

if (Config.server.cache) {
    Config.server.cache.engine = require(Config.server.cache.engine);
}

const server = Hapi.server(Config.server);

const start = async function () {

    server.ext({
        type: 'onPreResponse',
        method: function (request, h) {

            if (!request.response.isBoom) {
                return h.continue;
            }
            return h.view('error', request.response).code(request.response.output.statusCode);
        } });


    const plugins = [
        {
            plugin: require('good'),
            options: {
                ops: {
                    interval: 30 * 1000
                },
                reporters: {
                    console: [{
                        module: 'good-console',
                        args: [{ log: '*', response: '*', log: '*' }]
                    }, 'stdout']
                }
            }
        },
        require('vision'),
        require('inert')
    ];


    await server.register(plugins);
    server.route(require('./lib/routes')(server));
    try {
        await server.start();
        console.log('Images-Sever running at: ' + server.info.uri);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, p) => {

    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

start();