import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: {
        status: 429,
        message: "Terlalu banyak permintaan. Coba lagi nanti.",
    },
});


export default {
    limiter
};