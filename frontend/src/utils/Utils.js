import { useState, useEffect } from "react";
import { MessagingService } from "../data/MessagingService";


export function getAbbreviation(str) {
    if (str == null) {
        return "";
    }

    var split = str.split(" ");
    if (split.length < 2) {
        return str.substring(0, 2).toUpperCase();
    } else {
        return (split[0].substring(0, 1) + split[1].substring(0, 1)).toUpperCase();
    }
}

export function findGroupBySlug(groups, slug) {
    if (slug !== "") {
        // Determine selected group
        for (var g of groups) {
            if (g.slug === slug) {
                return g;
            }
        }
    }

    return null;
}

export function useConnectionStatus() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Make an initial update
        setIsConnected(MessagingService.isConnected());

        // Subscribe to updates
        var index = MessagingService.addConnectionListener((status) => {
            setIsConnected(status);
        });

        return () => {
            MessagingService.removeConnectionListener(index);
        };
    }, []);

    return isConnected;
}

export function useUserGroups(user) {

    const userUri = user.getUri();
    const [isLoading, setIsLoading] = useState(true);
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        // Initial load
        // Read in loaded groups
        user.getUserGroups().then((userGroups) => {
            console.log("Loaded groups ", userGroups.length);
            setUserGroups(userGroups);
            setIsLoading(false);
        });
    }, [userUri])

    const refresh = () => {
        user.refresh().then(() => {
            // Populate groups
            user.getUserGroups().then((userGroups) => {
                console.log("Loaded groups ", userGroups.length);
                setUserGroups(userGroups);
                setIsLoading(false);
            });
        });
    }

    return { userGroups, isLoading, refresh };
}

export function useGroupChats(group) {
    const groupUri = group.getUri();
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Initial load
        group.getChats().then((chats) => {
            setChats(chats);
            setIsLoading(false);
        });
    }, [groupUri]);

    const refresh = () => {
        group.refresh().then(() => {
            group.getChats().then((chats) => {
                setChats(chats);
                setIsLoading(false);
            });
        });
    }

    return { chats, isLoading, refresh };
}