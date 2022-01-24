// aws_s3-queue

// documentation via: haraka -c /home/tora/haraka-test -h plugins/aws_s3-queue

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin
var aws = require('aws-sdk'),
	zlib = require('zlib'),
	util = require('util'),
	async = require('async'),
    axios = require('axios'),
	Transform = require('stream').Transform;

exports.register = function() {
	this.logdebug("initializing aws s3 queue");

	var config = this.config.get("aws_s3_queue.json")
	this.logdebug("config loaded: " + util.inspect(config));

	aws.config.update({
		accessKeyId: config.accesskeyid,
		secretAccessKey: config.secretaccesskey,
		region: config.region
	})

	this.s3bucket = config.s3bucket;
    this.webhook_address = config.webhook_address;
	this.zipbeforeupload = config.zipbeforeupload;
	this.fileextension = config.fileextension;
	this.copyalladdresses = config.copyalladdresses;
};

exports.hook_queue = function (next, connection) {
	var plugin = this;

	var transaction = connection.transaction;
	var emailto = transaction.rcpt_to;

	var gzip = zlib.createGzip();

	var transformer = plugin.zipbeforeupload ? gzip : new TransformStream();
	var body = transaction.message_stream.pipe(transformer);

	var s3 = new aws.S3();

	var addresses = plugin.copyalladdresses ? transaction.rcpt_to : tranaction.rcpt_to[0];

	async.each(addresses, function (address, eachcallback) {
		var key = address.user + "@" + address.host + "/" + transaction.uuid + plugin.fileextension;

		var params = {
			Bucket: plugin.s3bucket,
			Key: key,
			Body: body,
			ACL: "public-read"
		};

		s3.upload(params).on('httpuploadprogress', function (evt){
			plugin.logdebug('uploading file... status  : ' + util.inspect(evt));
		}).send(function (err, data) {
            axios.post(plugin.webhook_address, {
                rcp: `${address.user}@${address.host}`,
                s3_url: data.Location,
				s3_key: data.Key
            }).then(res => {
				plugin.logdebug("webhook sent: ", res.data.message);
			}).catch(err => {
				plugin.logdebug("webhook error: ", err.response.data.message);
			})
			plugin.logdebug("s3 send response data : " + util.inspect(data));
            		eachcallback(err);
		});
	}, function (err) {
		if (err) {
            		plugin.logerror(err);
            		next();
        	} else {
            		next(OK, "email accepted.");
        	}
	})
};

exports.shutdown = function () {
    this.loginfo("shutting down queue plugin.");
};

var TransformStream = function() {
    Transform.call(this);
};
util.inherits(TransformStream, Transform);

TransformStream.prototype._transform = function(chunk, encoding, callback) {
    this.push(chunk);
    callback();
};
