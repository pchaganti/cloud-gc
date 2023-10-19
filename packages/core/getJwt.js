const assert = require("assert");
const { tap, pipe, get } = require("rubico");
const Axios = require("axios");
const jose = require("jose");

const logger = require("@grucloud/core/logger")({ prefix: "JWT" });

const requestJwt = ({ tokenUrl, subject, client_secret }) =>
  pipe([
    tap(() => {
      assert(tokenUrl);
      assert(subject);
      assert(client_secret);
    }),
    () => ({
      method: "POST",
      url: tokenUrl,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: subject,
        client_secret,
        resource: "uri:app",
        scope: "openid",
      }),
    }),
    Axios.request,
    get("data.access_token"),
    tap((access_token) => {
      assert(access_token);
    }),
    tap(
      pipe([
        jose.decodeJwt,
        tap((pcarams) => {
          assert(true);
        }),
      ])
    ),
  ])();

exports.getWebIdentityToken = async () => {
  const {
    GRUCLOUD_OAUTH_SERVER,
    GRUCLOUD_OAUTH_CLIENT_SECRET,
    GRUCLOUD_OAUTH_SUBJECT,
    GRUCLOUD_OAUTH_TOKEN,
  } = process.env;
  if (
    GRUCLOUD_OAUTH_SERVER &&
    GRUCLOUD_OAUTH_CLIENT_SECRET &&
    GRUCLOUD_OAUTH_SUBJECT
  ) {
    logger.info(`fetch a jwt from ${GRUCLOUD_OAUTH_SERVER}`);
    return requestJwt({
      tokenUrl: GRUCLOUD_OAUTH_SERVER,
      subject: GRUCLOUD_OAUTH_SUBJECT,
      client_secret: GRUCLOUD_OAUTH_CLIENT_SECRET,
    });
  } else if (GRUCLOUD_OAUTH_TOKEN) {
    logger.info(`using GRUCLOUD_OAUTH_TOKEN`);
    return GRUCLOUD_OAUTH_TOKEN;
  } else {
    throw Error(
      "GRUCLOUD_OAUTH_TOKEN or (GRUCLOUD_OAUTH_SERVER, GRUCLOUD_OAUTH_CLIENT_SECRET, GRUCLOUD_OAUTH_SUBJECT) missing"
    );
  }
};
