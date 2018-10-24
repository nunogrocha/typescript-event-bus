"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomainEvent = /** @class */ (function () {
    function DomainEvent(_channel, _payload) {
        this._channel = _channel;
        this._payload = _payload;
        this._recorded = new Date();
    }
    Object.defineProperty(DomainEvent.prototype, "recorded", {
        get: function () {
            return this._recorded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainEvent.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainEvent.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        enumerable: true,
        configurable: true
    });
    DomainEvent.prototype.toJSON = function () {
        return {
            payload: this.payload,
            channel: this.channel,
            recorded: this.recorded
        };
    };
    return DomainEvent;
}());
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=DomainEvent.js.map