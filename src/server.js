const app = require("./app");

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
})