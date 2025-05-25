// import pino from 'pino';
// import fs from 'fs';
// import path from 'path';

// const isProd = process.env.NODE_ENV === 'production';

// const logDir = path.join(__dirname, '../..', 'logs');
// if (!fs.existsSync(logDir)) {
//     fs.mkdirSync(logDir);
// }

// export const logger = pino({
//     transport: isProd
//         ? undefined // ⬅️ Default: ke stdout untuk PM2 di production
//         : {
//             target: 'pino-pretty', // ⬅️ Pretty log hanya di dev
//             options: {
//                 colorize: true,
//                 translateTime: 'HH:MM:ss dd-mm-yyyy',
//                 ignore: 'pid,hostname',
//             },
//         },
//     level: isProd ? 'info' : 'debug',
// }, isProd ? undefined : pino.destination(path.join(logDir, 'app.log')));

import pino from 'pino';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

const logDir = path.join(__dirname, '../..', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const streams = [];

if (isProd) {
    // production ke stdout
    streams.push({ stream: process.stdout });
} else {
    // dev: console pretty
    streams.push({
        level: 'debug',
        stream: pino.transport({
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss dd-mm-yyyy',
                ignore: 'pid,hostname',
            },
        }),
    });

    // dev: simpan file juga
    const fileStream = pino.destination(path.join(logDir, 'app.log'));
    streams.push({ level: 'debug', stream: fileStream });
}

const logger = pino({ level: isProd ? 'info' : 'debug' }, pino.multistream(streams));

export { logger };

