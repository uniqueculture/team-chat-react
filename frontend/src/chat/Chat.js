
import React, { useEffect, useState } from 'react';
import './Chat.css';
import PanelHeader from '../utils/PanelHeader';
import { MessagingService } from '../data/MessagingService';
import ChatMessageInput from './ChatMessageInput';
import { useParams } from 'react-router-dom';
import { DataService } from '../data/DataService';
import { Spinner, Dropdown } from 'react-bootstrap';
import Avatar from '../utils/Avatar';
import { getAbbreviation, useConnectionStatus } from '../utils/Utils';
import { GearFill } from 'react-bootstrap-icons';


const moment = require('moment');

export default function Chat(props) {
    const isConnected = useConnectionStatus();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const postsRef = React.useRef();

    let { group: groupSlug, chat: chatSlug } = useParams();

    let chat = null;
    if (props.chats.length > 0) {
        for (var c of props.chats) {
            if (c.slug === chatSlug) {
                chat = c;
            }
        }

        if (chat === null) {
            throw new Error("Requested chat does not exist");
        }
    }

    const onSubmit = (message) => {
        if (chat === null) {
            console.error("Unable to post. No active chat");
            return;
        }

        var post = new Post(null, chat, new Date(), DataService.getCurrentUser(), message);
        // Return a Promise for child component to know when message
        // is done being posted
        return new Promise((resolveCallback, rejectCallback) => {
            MessagingService.post(chat.getUri(), post).then(() => {
                resolveCallback();
            }).catch((reason) => {
                rejectCallback(reason);
            });
        });
    }

    useEffect(() => {
        if (chat != null) {
            setIsLoading(true);
            // Get the posts
            console.log("Loading posts for chat", chat.name);
            DataService.getPosts(chat, 1).then((posts) => {
                setPosts(posts);
                setIsLoading(false);

                // Scroll to the last post
                postsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: "end" });
            });
        }

    }, [chatSlug, chat]);

    useEffect(() => {
        if (chat === null) {
            console.warn("Cannot subscribe. No active chat.");
            return;
        }

        if (isLoading) {
            // We are loading messages, most likely the same messages will
            // be returned as part of loading (may be not) 
            // Skip for now while loading
            // Might be able to display a notification that "New Messages Available. Refresh?"
            // if messages for this chat came in during loading
            console.warn("Cannot subscribe. Loading...");
            return;
        }

        // Subscribe to the channel updates
        var subscription = null;
        try {
            subscription = MessagingService.susbscribeToChat(chat.getUri(), (message) => {
                // Create a message
                var post = DataService.createPost(message.uri, message);
                setPosts(oldPosts => [...oldPosts, post]);

                // Scroll to the last post
                postsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: "end" });
            });
        } catch (error) {
            // Do nothing, chat will be view-only
        }

        return () => {
            if (subscription != null) {
                subscription.unsubscribe();
            }
        }
    }, [chatSlug, chat, isLoading, isConnected]);


    // Render
    if (isLoading) {
        return <Spinner className="loading" animation="grow" />;
    }

    var lastAuthor = null;
    var items = posts.map((post) => {
        var item;
        if (lastAuthor !== post.author.principal) {
            // Full post
            item = <ChatItem key={post.getUri()} post={post} />
        } else {
            // Short post from the same author
            item = <ChatShortItem key={post.getUri()} post={post}></ChatShortItem>
        }

        lastAuthor = post.author.principal;
        return item;
    });

    return (
        <div className="chat-container">
            <div className="header">
                <PanelHeader title={chat.name}>
                    <Dropdown>
                        <Dropdown.Toggle size="sm" variant="link" id="dropdown-basic">
                            <GearFill></GearFill>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-3">Delete channel</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </PanelHeader>
            </div>
            <div className="chat-posts">
                <div className="posts" ref={postsRef}>
                    {items}
                </div>
            </div>
            <div className="chat-message">
                <ChatMessageInput onSubmit={onSubmit} isConnected={isConnected}></ChatMessageInput>
            </div>
        </div>
    );
}


function ChatItem(props) {
    let post = props.post;
    let dateTimeFormatted = moment(post.createdAt).format("MMMM Do YYYY, h:mm a");

    return (
        <div className="post">
            <Avatar size="50">
                {getAbbreviation(post.author.displayName)}
            </Avatar>
            <div className="post-content">
                <div><span className="author">{post.author.displayName}</span><span className="date">{dateTimeFormatted}</span></div>
                <div className="message">{post.message}</div>
            </div>
        </div>
    );
}

function ChatShortItem(props) {
    let post = props.post;
    let dateTimeFormatted = moment(post.createdAt).format("h:mm a");

    return (
        <div className="short-post">
            <div className="post-content">
                <div className="date">{dateTimeFormatted}</div>
                <div className="message">{post.message}</div>
            </div>
        </div>
    );
}

class Post {
    constructor(id, chat, dateTime, author, message) {
        this.id = id;
        this.chat = chat;
        this.dateTime = dateTime;
        this.author = author;
        this.message = message;
    }
}