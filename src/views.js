const redis = require("redis");
const util = require("util");

const client = redis.createClient();

function viewLogger({ windowTimeMs }) {
  async function logView(url) {
    const logger = util.promisify((cb) => {
      const now = Date.now();

      client
        .multi()
        .zadd([`views:${url}`, now, now])
        .expire(`views:${url}`, windowTimeMs / 1000)
        .sadd(["urls", url])
        .exec(cb);
    });

    await logger();
  }

  async function getViews(url) {
    const getter = util.promisify((cb) => {
      const now = Date.now();
      const expirationMs = now - windowTimeMs;

      client
        .multi()
        .zremrangebyscore([`views:${url}`, 0, expirationMs])
        .zcard([`views:${url}`])
        .exec(cb);
    });

    const [, reply] = await getter();

    return parseInt(reply);
  }

  return { getViews, logView }
}

module.exports = viewLogger;