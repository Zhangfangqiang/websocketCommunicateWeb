/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Message = (function() {

    /**
     * Properties of a Message.
     * @exports IMessage
     * @interface IMessage
     * @property {string|null} [avatar] Message avatar
     * @property {string|null} [fromUsername] Message fromUsername
     * @property {string|null} [from] Message from
     * @property {string|null} [to] Message to
     * @property {string|null} [content] Message content
     * @property {number|null} [contentType] Message contentType
     * @property {string|null} [type] Message type
     * @property {number|null} [messageType] Message messageType
     * @property {string|null} [url] Message url
     * @property {string|null} [fileSuffix] Message fileSuffix
     * @property {Uint8Array|null} [file] Message file
     */

    /**
     * Constructs a new Message.
     * @exports Message
     * @classdesc Represents a Message.
     * @implements IMessage
     * @constructor
     * @param {IMessage=} [properties] Properties to set
     */
    function Message(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Message avatar.
     * @member {string} avatar
     * @memberof Message
     * @instance
     */
    Message.prototype.avatar = "";

    /**
     * Message fromUsername.
     * @member {string} fromUsername
     * @memberof Message
     * @instance
     */
    Message.prototype.fromUsername = "";

    /**
     * Message from.
     * @member {string} from
     * @memberof Message
     * @instance
     */
    Message.prototype.from = "";

    /**
     * Message to.
     * @member {string} to
     * @memberof Message
     * @instance
     */
    Message.prototype.to = "";

    /**
     * Message content.
     * @member {string} content
     * @memberof Message
     * @instance
     */
    Message.prototype.content = "";

    /**
     * Message contentType.
     * @member {number} contentType
     * @memberof Message
     * @instance
     */
    Message.prototype.contentType = 0;

    /**
     * Message type.
     * @member {string} type
     * @memberof Message
     * @instance
     */
    Message.prototype.type = "";

    /**
     * Message messageType.
     * @member {number} messageType
     * @memberof Message
     * @instance
     */
    Message.prototype.messageType = 0;

    /**
     * Message url.
     * @member {string} url
     * @memberof Message
     * @instance
     */
    Message.prototype.url = "";

    /**
     * Message fileSuffix.
     * @member {string} fileSuffix
     * @memberof Message
     * @instance
     */
    Message.prototype.fileSuffix = "";

    /**
     * Message file.
     * @member {Uint8Array} file
     * @memberof Message
     * @instance
     */
    Message.prototype.file = $util.newBuffer([]);

    /**
     * Creates a new Message instance using the specified properties.
     * @function create
     * @memberof Message
     * @static
     * @param {IMessage=} [properties] Properties to set
     * @returns {Message} Message instance
     */
    Message.create = function create(properties) {
        return new Message(properties);
    };

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @function encode
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.avatar);
        if (message.fromUsername != null && Object.hasOwnProperty.call(message, "fromUsername"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.fromUsername);
        if (message.from != null && Object.hasOwnProperty.call(message, "from"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.from);
        if (message.to != null && Object.hasOwnProperty.call(message, "to"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.to);
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.content);
        if (message.contentType != null && Object.hasOwnProperty.call(message, "contentType"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.contentType);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.type);
        if (message.messageType != null && Object.hasOwnProperty.call(message, "messageType"))
            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.messageType);
        if (message.url != null && Object.hasOwnProperty.call(message, "url"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.url);
        if (message.fileSuffix != null && Object.hasOwnProperty.call(message, "fileSuffix"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.fileSuffix);
        if (message.file != null && Object.hasOwnProperty.call(message, "file"))
            writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.file);
        return writer;
    };

    /**
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @function decode
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Message();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.avatar = reader.string();
                    break;
                }
            case 2: {
                    message.fromUsername = reader.string();
                    break;
                }
            case 3: {
                    message.from = reader.string();
                    break;
                }
            case 4: {
                    message.to = reader.string();
                    break;
                }
            case 5: {
                    message.content = reader.string();
                    break;
                }
            case 6: {
                    message.contentType = reader.int32();
                    break;
                }
            case 7: {
                    message.type = reader.string();
                    break;
                }
            case 8: {
                    message.messageType = reader.int32();
                    break;
                }
            case 9: {
                    message.url = reader.string();
                    break;
                }
            case 10: {
                    message.fileSuffix = reader.string();
                    break;
                }
            case 11: {
                    message.file = reader.bytes();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Message message.
     * @function verify
     * @memberof Message
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Message.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.avatar != null && message.hasOwnProperty("avatar"))
            if (!$util.isString(message.avatar))
                return "avatar: string expected";
        if (message.fromUsername != null && message.hasOwnProperty("fromUsername"))
            if (!$util.isString(message.fromUsername))
                return "fromUsername: string expected";
        if (message.from != null && message.hasOwnProperty("from"))
            if (!$util.isString(message.from))
                return "from: string expected";
        if (message.to != null && message.hasOwnProperty("to"))
            if (!$util.isString(message.to))
                return "to: string expected";
        if (message.content != null && message.hasOwnProperty("content"))
            if (!$util.isString(message.content))
                return "content: string expected";
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            if (!$util.isInteger(message.contentType))
                return "contentType: integer expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        if (message.messageType != null && message.hasOwnProperty("messageType"))
            if (!$util.isInteger(message.messageType))
                return "messageType: integer expected";
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.fileSuffix != null && message.hasOwnProperty("fileSuffix"))
            if (!$util.isString(message.fileSuffix))
                return "fileSuffix: string expected";
        if (message.file != null && message.hasOwnProperty("file"))
            if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                return "file: buffer expected";
        return null;
    };

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Message
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Message} Message
     */
    Message.fromObject = function fromObject(object) {
        if (object instanceof $root.Message)
            return object;
        var message = new $root.Message();
        if (object.avatar != null)
            message.avatar = String(object.avatar);
        if (object.fromUsername != null)
            message.fromUsername = String(object.fromUsername);
        if (object.from != null)
            message.from = String(object.from);
        if (object.to != null)
            message.to = String(object.to);
        if (object.content != null)
            message.content = String(object.content);
        if (object.contentType != null)
            message.contentType = object.contentType | 0;
        if (object.type != null)
            message.type = String(object.type);
        if (object.messageType != null)
            message.messageType = object.messageType | 0;
        if (object.url != null)
            message.url = String(object.url);
        if (object.fileSuffix != null)
            message.fileSuffix = String(object.fileSuffix);
        if (object.file != null)
            if (typeof object.file === "string")
                $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
            else if (object.file.length >= 0)
                message.file = object.file;
        return message;
    };

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Message
     * @static
     * @param {Message} message Message
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Message.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.avatar = "";
            object.fromUsername = "";
            object.from = "";
            object.to = "";
            object.content = "";
            object.contentType = 0;
            object.type = "";
            object.messageType = 0;
            object.url = "";
            object.fileSuffix = "";
            if (options.bytes === String)
                object.file = "";
            else {
                object.file = [];
                if (options.bytes !== Array)
                    object.file = $util.newBuffer(object.file);
            }
        }
        if (message.avatar != null && message.hasOwnProperty("avatar"))
            object.avatar = message.avatar;
        if (message.fromUsername != null && message.hasOwnProperty("fromUsername"))
            object.fromUsername = message.fromUsername;
        if (message.from != null && message.hasOwnProperty("from"))
            object.from = message.from;
        if (message.to != null && message.hasOwnProperty("to"))
            object.to = message.to;
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = message.content;
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            object.contentType = message.contentType;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.messageType != null && message.hasOwnProperty("messageType"))
            object.messageType = message.messageType;
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.fileSuffix != null && message.hasOwnProperty("fileSuffix"))
            object.fileSuffix = message.fileSuffix;
        if (message.file != null && message.hasOwnProperty("file"))
            object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
        return object;
    };

    /**
     * Converts this Message to JSON.
     * @function toJSON
     * @memberof Message
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Message.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Message
     * @function getTypeUrl
     * @memberof Message
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Message.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Message";
    };

    return Message;
})();

module.exports = $root;
