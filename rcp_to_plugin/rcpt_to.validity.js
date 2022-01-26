// rcpt_to.validity

// documentation via: haraka -c /home/tora/haraka-test -h plugins/rcpt_to.validity

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin
var util = require("util"),
  axios = require("axios");

exports.register = function () {
  this.logdebug("initializing recipient checker");

  var config = this.config.get("aws_s3_queue.json");

  this.logdebug("config loaded: " + util.inspect(config));

  this.email_checker_endpoint = config.email_checker_endpoint;
};

exports.hook_rcpt = function (next, connection, params) {
  var rcpt = params[0];

  this.logdebug("checking if email exists: " + util.inspect(params[0]));

  this.is_user_valid(rcpt.user)
    .then((res) => {
      if (res) {
        connection.logdebug("Valid email recipient. Continuing...", this);
        next();
      } else {
        connection.logdebug(
          "Invalid email recipient. DENY email receipt.",
          this
        );
        next(DENY, "Invalid email address.");
      }
    })
    .catch((err) => {
      connection.logdebug("Invalid email recipient. DENY email receipt.", this);
      next(DENY, "Invalid email address.");
    });
};

exports.is_user_valid = async function (userID) {
  var plugin = this;

  try {
    const response = await axios.get(
      `${plugin.email_checker_endpoint}/?rua_mail=${userID}`
    );

    return response.data.email_exists;
  } catch (error) {
    return false;
  }
};

exports.shutdown = function () {
    this.loginfo("Shutting down validity plugin.");
};