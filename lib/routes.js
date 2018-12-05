'use strict'

const Path = require('path');
const Boom = require('boom');

module.exports = (server) => {

    const routes = [];

    routes.push({
        method: 'GET',
        path: '/images/{source*}',
        options: {
            handler: {
                directory: {
                    path: Path.join(__dirname, '..', 'source/images'),
                    index: false,
                    redirectToSlash: false
                }
            }
        }
    });

    routes.push({
        method: 'GET',
        path: '/vedio/{source*}',
        options: {
            handler: {
                directory: {
                    path: Path.join(__dirname, '.', 'source/vedio'),
                    index: false,
                    redirectToSlash: false
                }
            }
        }
    });
    
    return routes;
};