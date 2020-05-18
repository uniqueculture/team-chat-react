import { DataService } from './DataService';

const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
const WS_BASE_URL = "http://localhost:8080";


class DummyMessagingService {
    constructor() {
        this._isConnected = false;
        this.connetionListeners = [];
    }

    isConnected() {
        return this._isConnected;
    }

    addConnectionListener(callback) {
        this.connetionListeners.push(callback);
        return this.connetionListeners.length - 1;
    }

    removeConnectionListener(index) {
        this.connetionListeners.splice(index, 1);
    }

    connect() {
        return new Promise((resolveCallback, rejectCallback) => {
            if (this._isConnected) {
                console.debug("Already connected");
                resolveCallback(true);
                return;
            }

            var token = DataService.getToken();
            var socket = new SockJS(WS_BASE_URL + "/api/chat");
            this.client = Stomp.over(socket);
            this.client.connect({
                "X-Authorization": "Bearer " + token,
            }, (frame) => {
                this._isConnected = true;
                this.onConnectionEvent();

                resolveCallback(true);

            }, (errorFrame) => {
                console.error(errorFrame);

                this._isConnected = false;
                this.onConnectionEvent();
            });

            var closeFunc = socket.onclose;
            socket.onclose = (closeEvent) => {
                // Call close function added by Stomp
                closeFunc(closeEvent);

                // Change our own state
                this._isConnected = false;
                this.client = null;
                this.onConnectionEvent();
            };
        });
    }

    disconnect() {
        return new Promise((resolveCallback, rejectCallback) => {
            if (this.client != null && this._isConnected) {
                this.client.disconnect(() => {
                    this._isConnected = false;
                    this.onConnectionEvent();

                    resolveCallback(true);
                });

                this.client = null;
            }
        });
    }

    onConnectionEvent() {
        this.connetionListeners.forEach((listener) => {
            listener(this._isConnected);
        });
    }

    async post(chatUri, post) {
        // Make sure we are connected
        if (!this._isConnected) {
            throw new Error("Not connected");
        }

        // Get token
        var token = DataService.getToken();

        // Send the message
        await this.client.send("/app/post/" + encodeURIComponent(chatUri), {
            "X-Authorization": "Bearer " + token,
        }, JSON.stringify({
            message: post.message,
            chatUri: post.chat.getUri(),
            authorUri: post.author.getUri(),
            dateTime: new Date(),
        }));
    }

    susbscribeToChat(chatUri, onMessage) {
        if (this.client == null) {
            throw new Error("Cannot subscribe. Client is not initialized");
        }

        // Get token
        var token = DataService.getToken();

        // Subscribe
        return this.client.subscribe("/topic/" + encodeURIComponent(chatUri), (frame) => {
            onMessage(JSON.parse(frame.body));
        }, {
            "X-Authorization": "Bearer " + token,
        });
    }
}


export let MessagingService = new DummyMessagingService();