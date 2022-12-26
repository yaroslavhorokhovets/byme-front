require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const cors = require('cors');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev: dev});
const handle = app.getRequestHandler();
const corsOptions ={
    origin:'*', 
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    const handleRequest = async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    };

    router.get("(/_next/static/.*)", handleRequest);
    router.get("/_next/webpack-hmr", handleRequest);

    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`Ready on http://localhost:${port}`);
    });
    
});