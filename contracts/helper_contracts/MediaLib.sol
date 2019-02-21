pragma solidity  ^0.4.2;

library MediaLib {
    
    struct Media {
        address creatorAddress;
        string tag;
        string id;
        uint32 claps;
        bool exists;
    }
        
    struct User {
        bool exists;
        uint32 mediaCount;
    }
    
}
