pragma solidity  ^0.4.2;

library MediaLib {
    
    
    struct Media {
        address creatorAddress;
        string [] tags;
        string id;
        uint32 claps;
        bool exists;
    }
    
    struct Tag {
        string id;
        bool exists;
        string [] mediaIds;
        uint32 mediaCount;
    }

    struct User {
        bool exists;
        uint32 mediaCount;
        string [] playlistIds;
    }
    
    struct Playlist{
        string id;
        bool exists;
        string [] mediaIds;
        uint32 mediaCount;
    }
    
}
