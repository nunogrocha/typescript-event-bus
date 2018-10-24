"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/fn/array/find");
require("core-js/fn/array/filter");
var EventBus = /** @class */ (function () {
    function EventBus(middleware) {
        this._subscriptions = [];
        this._middleware = middleware ? middleware.slice() : [];
    }
    Object.defineProperty(EventBus.prototype, "middleware", {
        get: function () {
            return this._middleware;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventBus.prototype, "subscriptions", {
        get: function () {
            return this._subscriptions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clears all subscription
     */
    EventBus.prototype.unregisterAll = function () {
        this._subscriptions = [];
        return true;
    };
    /**
     * Releases a channel and subscribers from the event processor
     * @param domain
     */
    EventBus.prototype.unregister = function (channel) {
        if (channel) {
            this._subscriptions = this._subscriptions.filter(function (s) { return s.channel !== channel; });
            return true;
        }
        return false;
    };
    /**
     * Registers a subscription to a domains channel
     * @param subscription
     */
    EventBus.prototype.register = function (subscription) {
        var that = this;
        var index = this._subscriptions.push(subscription);
        return {
            index: index,
            unsubscribe: function () {
                that._subscriptions.splice(index - 1, 1);
            }
        };
    };
    /**
     * Notifies domains channel subscribers
     */
    EventBus.prototype.trigger = function (event) {
        var _this = this;
        this._subscriptions.forEach(function (sub) {
            if (sub.channel === event.channel) {
                _this.process(event, sub);
            }
        });
    };
    EventBus.prototype.process = function (event, sub) {
        var middleware = [].concat(this._middleware);
        function run(event) {
            if (middleware.length === 0) {
                return sub.callback(event.payload);
            }
            else {
                var first = middleware.splice(0, 1)[0];
                return first(event, run);
            }
        }
        return run(event);
    };
    return EventBus;
}());
exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map