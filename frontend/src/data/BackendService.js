
const { Ketting, Resource } = require('ketting');
const slugify = require('slugify');
const axios = require('axios').default;



const TOKEN_KEY = "jwt-token";
const USER_KEY = "user-uri";
const BACKEND_ROOT_URL = "http://localhost:8080/api";


class BackendService {
    constructor() {
        this.k = new Ketting(BACKEND_ROOT_URL);
        this.root = this.k.go();
        this._groups = {};
        this._currentUser = null;

        var token = window.sessionStorage.getItem(TOKEN_KEY);
        if (token != null) {
            this._token = token;
        } else {
            this._token = null;
        }
    }

    async getGroups() {
        var resource = await this.k.follow("servers");
        var repr = await resource.representation();
        var embedded = repr.getEmbedded();
        var objects = [];

        for (var uri in embedded) {
            objects.push(new BackendGroup(this.k, uri, embedded[uri]));
        }

        return objects;
    }

    async getPosts(chat, pageNumber) {
        var token = this.getToken();
        var response = await axios.get(BACKEND_ROOT_URL + "/posts/search/findByChannel", {
            params: {
                channel: chat.getUri(),
                page: pageNumber + ",20",
                sort: "createdAt,desc",
                projection: "fullPost",
            },
            headers: {
                "Authorization": "Bearer " + token,
            },
            responseType: "json",
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        var data = response.data;
        var posts = data._embedded.posts;
        var objects = [];
        var uri, post;
        for (var i = posts.length - 1; i >= 0; i--) {
            post = posts[i];
            uri = post._links.self.href;
            objects.push(new BackendPost(this.k, uri, post));
        }

        return objects;
    }

    async authenticate(username, password) {
        var response = await axios.post(BACKEND_ROOT_URL + "/authenticate", {
            username: username,
            password: password,
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        var data = response.data;
        if (typeof (data.token) !== "undefined") {
            this._setToken(data.token);

            // Set for class
            this.k.fetchHelper.options.auth = {
                type: 'bearer',
                "token": data.token,
            };

            // Get the user information and set as current
            var user = await this._requestCurrentUser(data.token, data.user);
            this._setCurrentUser(user);
        }

        return true;
    }

    async tryAuthenticate() {
        var token = this.getToken();
        if (token == null) {
            // See if it's saved in the browser
            token = window.sessionStorage.getItem(TOKEN_KEY);
            if (token == null) {
                return false;
            }
        }

        // Get current user
        var userUri = window.sessionStorage.getItem(USER_KEY);
        if (userUri == null) {
            return false;
        }
        // Request current user info, if token is not valid
        // the request should fail
        // Might want to delete the token from session store?!
        var user = await this._requestCurrentUser(token, userUri);
        if (user == null) {
            return false;
        }

        // Token is valid, got user info
        this._setCurrentUser(user);
        // Set for class
        this.k.fetchHelper.options.auth = {
            type: 'bearer',
            "token": token,
        };

        return true;
    }

    async _requestCurrentUser(token, uri) {
        // Get the user information
        var response = await axios.get(uri, {
            headers: {
                "Authorization": "Bearer " + token,
            }
        });

        if (response.status !== 200) {
            return null;
        }

        var user = new BackendUser(this.k, response.data._links.self.href, response.data);
        // Need an indicator that this is the current user?
        return user;
    }

    _setToken(token) {
        this._token = token;
        // Store the token locally
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    getToken() {
        return this._token;
    }

    _setCurrentUser(user) {
        this._currentUser = user;
        // Store the uri locally
        window.sessionStorage.setItem(USER_KEY, user.getUri());
    }

    getCurrentUser() {
        return this._currentUser;
    }

    logout() {
        window.sessionStorage.removeItem(USER_KEY);

        this._token = null;
        this._currentUser = null;
        this.k.fetchHelper.options.auth = {};
    }

    createPost(uri, json) {
        return new BackendPost(this.k, uri, json);
    }

    createGroup(json) {
        json.createdBy = this.getCurrentUser().getUri();
        json.createdAt = new Date();
        json.updatedAt = new Date();
        return new BackendGroup(this.k, null, json);
    }

    createGroupUser(group, user, role) {
        return new BackendGroupUser(this.k, null, {
            "role": role,
        }, group, user);
    }

    createChat(group, json) {
        return new BackendChat(this.k, group.getUri(), null, json);
    }
}

class BackendGroup {
    constructor(ketting, uri, body) {
        this._resource = new Resource(ketting, uri);

        this._hydrate(body);
        //this._hydrateGroupUsers(body);
    }

    _hydrate(body) {
        if (body === null) {
            return;
        }

        this.name = body.name;
        this.accessType = body.accessType;
        this.createdBy = body.createdBy;
        this.createdAt = body.createdAt;
        this.updatedAt = body.updatedAt;
        this.users = body.users;
        this.slug = slugify(this.name.toLowerCase());
        //this.groupUsers = [];
    }

    /*_hydrateGroupUsers(body) {
        if (typeof(body.users) === "undefined") {
            console.log("Group body did not have users");
            return;
        }

        this.groupUsers = [];
        for (var u of body.users) {
            this.groupUsers.push(new BackendGroupUser(this._resource.client, u, this, null));
        }
    }*/

    getUri() {
        return this._resource.uri;
    }

    async refresh() {
        var body = await this._resource.get();
        this._hydrate(body);
    }

    async getChats() {
        var channelsResource = await this._resource.follow("channels");
        var repr = await channelsResource.representation();
        var chats = repr.getEmbedded();
        var objects = [];
        for (var uri in chats) {
            objects.push(new BackendChat(this._resource.client, this._resource.uri, uri, chats[uri]));
        }

        return objects;
    }

    /*addUser(user, role) {
        // Check if user already exist
        for (var gu of this.groupUsers) {
            if (gu.getUserUri() === user.getUri()) {
                // User is already assigned to the group
                gu.role = role;
                return;
            }
        }

        // If the user does not exist
        this.groupUsers.push(new BackendGroupUser(this._resource.client, {
            "role": role,
        }, this, user));
    }*/
    addUser(user, role) {
        if (!Array.isArray(this.users)) {
            this.users = [];
        }

        this.users.push({
            role: role,
            user: user.getUri(),
        });
    }

    removeUser(user) {
        if (!Array.isArray(this.users)) {
            this.users = [];
            return;
        }

        var index = -1;
        for (var i in this.users) {
            if (this.users[i]._links.user.href === user.getUri()) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }

    async save() {
        var uri = this.getUri();
        if (uri == null) {
            // Creating a new group
            var follow = await this._resource.client.follow("servers");
            var resource = await follow.post({
                "name": this.name,
                "accessType": this.accessType,
                "createdBy": this.createdBy,
                "createdAt": this.createdAt,
                "updatedAt": this.updatedAt,
            });

            this._resource = resource;
            this.slug = slugify(this.name);

            // Set URI for users
            this.users.forEach(u => u.server = this._resource.uri);
            // Add users associated to the group
            await this._resource.patch({
                "users": this.users,
            });

            /*var users = [];
            if (this.groupUsers.length > 0) {
                for (var gu of this.groupUsers) {
                    users.push({
                        "role": gu.role,
                        "server": resource.uri,
                        "user": gu.getUserUri(),
                    });
                }
            }

            await this._resource.patch({
                "users": users,
            });*/

            return true;
        } else {
            // Update an existing group with uri
            await this._resource.patch({
                "accessType": this.accessType,
            });

            // Set URI for users
            this.users.forEach(u => u.server = this._resource.uri);
            // Add users associated to the group
            await this._resource.patch({
                "users": this.users,
            });

            return true;
        }
    }

    async delete() {

    }

    async getGroupUsers() {
        /*var follow = await this._resource.follow("users", { projection: "inlineUser" });
        var repr = await follow.representation();
        var groupUsers = repr.getEmbedded();
        var objects = [];
        for (var uri in groupUsers) {
            // Crete a group instance
            var user = new BackendUser(this._resource.client, groupUsers[uri]._links.user.href, groupUsers[uri].user);
            objects.push(new BackendGroupUser(this._resource.client, uri, groupUsers[uri], this, user));
        }

        return objects;*/
        if (typeof (this.users) === "undefined") {
            console.log("Group body did not contain users");
            return;
        }

        var users = [];
        for (var u of this.users) {
            // Populate related user
            var user = new BackendUser(this._resource.client, u._links.user.href, null);
            // Refresh the group info
            await user.refresh();
            // Populate user group
            users.push(new BackendGroupUser(u, this, user));
        }

        return users;
    }

}

class BackendChat {
    constructor(ketting, groupUri, uri, body) {
        this._resource = new Resource(ketting, uri);
        this.groupUri = groupUri;
        this.name = body.name;
        this.slug = slugify(this.name.toLowerCase());
    }

    getUri() {
        return this._resource.uri;
    }

    getGroupUri() {
        return this.groupUri;
    }

    async save() {
        var uri = this.getUri();
        if (uri == null) {
            // Creating a new chat
            var follow = await this._resource.client.follow("channels");
            var resource = await follow.post({
                "name": this.name,
                "server": this.groupUri,
                "createdAt": this.createdAt,
                "updatedAt": this.updatedAt,
            });

            this._resource = resource;
            this.slug = slugify(this.name);

            // Invalidate cache entries
            invalidateCache(this._resource, "channels");

            return true;
        } else {
            // Update an existing group with uri
            await this._resource.put({
                "name": this.name,
            });
            return true;
        }
    }
}

class BackendUser {
    constructor(ketting, uri, body) {
        this._resource = new Resource(ketting, uri);

        this._hydrate(body);
        //this._hydrateUserGroups(body);
    }

    _hydrate(body) {
        if (body === null) {
            return;
        }

        this.displayName = body.displayName;
        this.principal = body.principal;
        this.servers = body.servers;
        //this.userGroups = [];
    }

    async refresh() {
        var body = await this._resource.refresh();
        this._hydrate(body);
    }

    /*_hydrateUserGroups(body) {
        if (typeof (body.servers) === "undefined") {
            console.log("User body did not contain servers");
            return;
        }

        this.userGroups = [];
        for (var s of body.servers) {
            // Populate related group
            var group = new BackendGroup(this._resource.client, s._links.server.href, null);
            // Refresh the group info
            await group.refresh();
            // Populate user group
            this.userGroups.push(new BackendGroupUser(this._resource.client, s, group, this));
        }
    }*/

    getUri() {
        return this._resource.uri;
    }

    /*async refresh() {
        var body = await this._resource.get();
        this._hydrate(body);
        this._hydrateUserGroups(body);
    }*/

    async getUserGroups() {
        if (typeof (this.servers) === "undefined") {
            console.log("User body did not contain servers");
            return;
        }

        var groups = [];
        for (var s of this.servers) {
            // Populate related group
            var group = new BackendGroup(this._resource.client, s._links.server.href, null);
            // Refresh the group info
            await group.refresh();
            // Populate user group
            groups.push(new BackendGroupUser(s, group, this));
        }

        return groups;
    }

    /*async getUserGroups() {
        var follow = await this._resource.follow("servers", { projection: "inlineServer" });
        var repr = await follow.representation();
        var userGroups = repr.getEmbedded();
        var objects = [];
        for (var uri in userGroups) {
            // The href in an associated record cannot be used for 

            // Crete a group instance
            var group = new BackendGroup(this._resource.client, userGroups[uri]._links.server.href, userGroups[uri].server);
            objects.push(new BackendGroupUser(this._resource.client, uri, userGroups[uri], group, this));
        }

        return objects;
    }*/
}

class BackendGroupUser {
    constructor(body, group, user) {
        //this._k = new Resource(ketting, uri);
        this.role = body.role;
        this.group = group;
        this.user = user;
    }

    /*async save() {
        // Post to the API
        var follow = await this._k.client.follow("serverUsers", {});
        var resource = await follow.post({
            role: this.role,
            user: this.user.getUri(),
            server: this.group.getUri(),
        });

        // Remove the cache entry
        invalidateCache(this._k, "servers");

        return resource;
    }*/

    /*
    constructor(ketting, body, group, user) {
        this._k = ketting;
        this.role = body.role;

        // Populate related group
        if (typeof (group) !== "undefined" && group !== null) {
            this.group = group;
        } else {
            this.group = null;
            this.groupUri = typeof (body._links) !== "undefined" ? body._links.server.href : null;
        }

        // Populate related user
        if (typeof (user) !== "undefined" && user != null) {
            this.user = user;
        } else {
            this.user = null;
            this.userUri = typeof (body._links) !== "undefined" ? body._links.user.href : null;
        }
    }

    getUserUri() {
        if (this.user !== null) {
            return this.user.getUri();
        } else {
            return this.userUri;
        }
    }

    getGroupUri() {
        if (this.group !== null) {
            return this.group.getUri();
        } else {
            return this.groupUri;
        }
    }

    async getUser() {
        if (this.user !== null) {
            return this.user;
        }

        if (this.userUri === null) {
            return null;
        }

        // Load the user info
        var resource = this._k.go(this.userUri);
        var body = await resource.get();
        this.user = new BackendUser(this._k, this.userUri, body);
        return this.user;
    }

    async getGroup() {
        if (this.group !== null) {
            return this.group;
        }

        if (this.groupUri === null) {
            return null;
        }

        // Load the user info
        var resource = this._k.go(this.groupUri);
        var body = await resource.get();
        this.group = new BackendGroup(this._k, this.groupUri, body);
        return this.group;
    }*/
}

class BackendPost {
    constructor(ketting, uri, body) {
        this._resource = new Resource(ketting, uri);
        this.message = body.message;
        this.createdAt = body.createdAt;
        this.updatedAt = body.updatedAt;
        if (body._links != null) {
            this.author = new BackendUser(ketting, body._links.author.href, body.author);
        } else if (body.authorUri != null) {
            this.author = new BackendUser(ketting, body.authorUri, body.author);
        }
    }

    getUri() {
        return this._resource.uri;
    }
}

function invalidateCache(ketting, pattern) {
    for (var uri in ketting.client.resourceCache) {
        if (uri.indexOf(pattern) !== -1) {
            ketting.client.resourceCache[uri] = null;
        }
    }
}

export default BackendService;