module.exports = (req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
    console.log(log); // Later, save it to a file or DB if needed
    next();
};
