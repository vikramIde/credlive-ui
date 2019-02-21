pragma solidity  ^0.4.2;
import "./helper_contracts/strings.sol";

contract TestContract {

    using strings for *;

    struct Media{
        string hash;
        string title;
        bool exists;
        address creator;
    }

    mapping (string => Media) private mediaList;
    string[] mediaIds;
    Media mediaObj;

    /// addMedia content 
    function addMedia(string mediaHash, string title) public {
        
        //Creating media object
        mediaObj = Media({
            hash : mediaHash,
            title : title,
            exists : true,
            creator : msg.sender
        });
        
        //storing new media into mapping
        mediaList[mediaHash] = mediaObj;
        mediaIds.push(mediaHash);
    }
    
    /// fetch content 
    function getMediaDetByHash(string mediaHash) public view returns(address creatorAddress,
    string title){
        creatorAddress = mediaList[mediaHash].creator;
        title = mediaList[mediaHash].title;
    }

    function getAllMediaIds() public view returns(string commasepIds, uint count){
        commasepIds = convertArrayToString(mediaIds);
        count = mediaIds.length;
    }


    function convertArrayToString(string[] arr) internal 
    pure 
    returns(string arrConvertedToStr){
        var parts = new strings.slice[](arr.length);
        for (uint32 i = 0; i < arr.length; i++) {
            parts[i] = arr[i].toSlice();
        }
        arrConvertedToStr = "|".toSlice().join(parts);   
    }
    
}
