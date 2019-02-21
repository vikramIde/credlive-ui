pragma solidity  ^0.4.2;

import "./helper_contracts/MediaLib.sol";

contract MediaStore {

    using MediaLib for *;
    MediaLib.Media mediaObj;
    
    mapping (string => MediaLib.Media) private mediaList;

    /// addMedia content 
    function addMedia(string mediaHash,string tagString) public {
        
        bytes memory mediaHashTemp = bytes(mediaHash);
        bytes memory tagStringTemp = bytes(tagString);
                
        //passed parameters are blank, check if new media
        require(mediaHashTemp.length > 0 && tagStringTemp.length > 0);
        
        // media should not be already added
        require(!mediaList[mediaHash].exists);

        //Creating media object
        mediaObj = MediaLib.Media({
            creatorAddress : msg.sender,
            tag : tagString,
            claps : 0,
            id: mediaHash,
            exists : true
        });
        
        //storing new media into mapping
        mediaList[mediaHash] = mediaObj;
    }
    
    /// fetch content 
    function getMediaDetByHash(string mediaHash) public view returns(address creatorAddress,
    string allTags, uint32 claps){
        //check if media exisit or not 
        require(mediaList[mediaHash].exists);
        
        creatorAddress = mediaList[mediaHash].creatorAddress;
        allTags = mediaList[mediaHash].tag;
        claps = mediaList[mediaHash].claps;
    }
    
}
