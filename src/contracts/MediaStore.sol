pragma solidity  ^0.4.2;

import "./helper_contracts/strings.sol";
import "./helper_contracts/MediaLib.sol";

contract MediaStore {

    using MediaLib for *;
    using strings for *;

    mapping (address => MediaLib.User) private userList;
    mapping (string => MediaLib.Media) private mediaList;
    mapping (string => MediaLib.Tag) private tagList;
    mapping (address => mapping(string => MediaLib.Playlist))  private userPlayList;
    
    MediaLib.Tag tagObj;
    MediaLib.Media mediaObj;
    MediaLib.User userObj;
    MediaLib.Playlist playListObj;
    
    string [] tagIdsList;
    
    modifier checkUserExists(){
        //check if user exist or not, if not create user.
        if(!userList[msg.sender].exists) createUser();
        _;
    }
    
    modifier checkIfValue(){
        //check if some ether is passed or not
        require(msg.value >0);
        _;
    }

    //user 
    function createUser() public {
        userObj = MediaLib.User({
            exists : true,
            mediaCount : 0,
            playlistIds : new string[](0)
        });
        userObj.playlistIds.push("Default"); //if playlist is not specified, then "Default"
        userList[msg.sender] = userObj;
    }
        
    //Check if user exisits or not
    function getUser(address userAddress) public view returns (bool isUserExists) {
        return userList[userAddress].exists;
    }

    //Createing playlist
    function createPlaylist(string playListId) public{
        require(!userPlayList[msg.sender][playListId].exists);
        playListObj = MediaLib.Playlist({
          id :  playListId,
          mediaIds : new string[](0),
          mediaCount : 0,
          exists : true
        });
        userPlayList[msg.sender][playListId] = playListObj;
        //updating user's playlistids array object with playList
        userList[msg.sender].playlistIds.push(playListId);
    }

    //get all playlists of a userObj
    function getUserPlaylist(address userAddr) public view returns(uint256 count,string allPlaylistIds) {
        require(userList[userAddr].exists);
        count = userList[userAddr].playlistIds.length;
        allPlaylistIds = convertArrayToString(userList[userAddr].playlistIds);
    }
    
    //adding a new MediaLib
    //tagsString format : t1|t2|t3
    function addMedia(string playlistId, string mediaHash,string tagString)public checkUserExists checkIfValue{
        
        bytes memory mediaHashTemp = bytes(mediaHash);
        bytes memory tagStringTemp = bytes(tagString);
                
        //passed parameters are blank, check if new media
        require(mediaHashTemp.length > 0 && tagStringTemp.length > 0);

        string memory playListTemp = getConvertedPlayListId(playlistId);
        //if playlist does not exists then create
        if(!userPlayList[msg.sender][playListTemp].exists){
            //Call to Create playListTemp
            createPlaylist(playListTemp);
        } 
        
        if(!mediaList[mediaHash].exists){
            //spliting tagSring, iterating over and preparing tag array
            //TODO : can be optimised later
            var  tagSlice = tagString.toSlice();
            string  []  tempTagArr;
            uint256  tagSliceCount = tagSlice.count("|".toSlice()) + 1;
            for (uint i = 0; i < tagSliceCount; i++) {
                var t = tagSlice.split("|".toSlice());
                tempTagArr.push(t.toString());
                
                //Get tag object from tagList
                if(tagList[t.toString()].exists){
                    //if tag is already present, update mediaHash to the array present in the existing tag object
                    tagList[t.toString()].mediaIds.push(mediaHash);
                    tagList[t.toString()].mediaCount = tagList[t.toString()].mediaCount+1;
                }else{
                    //if tag not present, create new tag object and store into taglist
                    tagObj = MediaLib.Tag({
                        id : t.toString(),
                        exists : true,
                        mediaIds : new string[](0),
                        mediaCount: 1
                    });
                    tagObj.mediaIds.push(mediaHash);
                    tagList[t.toString()] = tagObj;
                    tagIdsList.push(t.toString());
                }

            }
            
            //Creating media object
            mediaObj = MediaLib.Media({
                creatorAddress : msg.sender,
                tags : tempTagArr,
                claps : 0,
                id: mediaHash,
                exists : true
            });
            
            //storing new media into mapping
            mediaList[mediaHash] = mediaObj;
        }else{
            string [] playListMedias = userPlayList[msg.sender][playListTemp].mediaIds;
            for(uint32 j = 0;j< playListMedias.length ; j++){
                if(keccak256(playListMedias[j]) == keccak256(mediaHash)) {
                    revert();
                }else{
                   continue;
                }
            }

        }
        //fetch playlist for this user and update the mediahash array
        userPlayList[msg.sender][playListTemp].mediaIds.push(mediaHash);
        userPlayList[msg.sender][playListTemp].mediaCount += userPlayList[msg.sender][playListTemp].mediaCount;

    }

    function getMediaListByUser(string playListId) public view returns(uint256 count, string allMediaIds){
        string memory playListTemp = getConvertedPlayListId(playListId);
        require(userPlayList[msg.sender][playListTemp].exists);
        count = userPlayList[msg.sender][playListTemp].mediaIds.length;
        allMediaIds = convertArrayToString(userPlayList[msg.sender][playListTemp].mediaIds);
    }

    function getConvertedPlayListId(string playlistId) private returns(string) {
        string memory playListTemp = "Default";
        bytes memory playlistIdTemp = bytes(playlistId);
        //Playlist 
        if(playlistIdTemp.length >0){
            playListTemp = playlistId;
        }
        return playListTemp;
    }
    
    //Get media details by hash
    function getMediaDetByHash(string mediaHash) public view returns(address creatorAddress,
    string allTags, uint32 claps){
        //check if media exisit or not 
        require(mediaList[mediaHash].exists);
        
        creatorAddress = mediaList[mediaHash].creatorAddress;
        string [] storage tagArr = mediaList[mediaHash].tags;
        allTags = convertArrayToString(tagArr);
        claps = mediaList[mediaHash].claps;
    }
    
    //Get all tags present
    function getTags() public view returns (uint256 count, string allTags) {
        allTags = convertArrayToString(tagIdsList);
        count = tagIdsList.length;
    }

    //Get mediaHashs of a tag
    function getMediaHashesByTag(string tag)public view returns(uint256 count,string allHashes){
        require(tagList[tag].exists);
        count = tagList[tag].mediaCount;
        allHashes = convertArrayToString(tagList[tag].mediaIds);
    } 

    function clap(address creatorAddress, string mediaHash, uint32 clapCount) public payable  checkIfValue{
        //check if media exisit or not 
        require(mediaList[mediaHash].exists);
        
        //check creator is present in the userlist
        require(userList[creatorAddress].exists);

        //increase the claps count and transfer the ether to creator
        mediaList[mediaHash].claps = mediaList[mediaHash].claps + clapCount;
        creatorAddress.transfer(msg.value);
    }
    
    //helper method to convert all values of an array in pipe separated
    function convertArrayToString(string []arr) internal pure returns(string arrConvertedToStr){
        var parts = new strings.slice[](arr.length);
        for (uint32 i = 0; i < arr.length; i++) {
            parts[i] =arr[i].toSlice();
        }
        arrConvertedToStr = "|".toSlice().join(parts);   
    }
}
