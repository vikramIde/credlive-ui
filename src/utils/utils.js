// import database from "../database";
import ipfsAPI from "ipfs-api";

// export const IPFS_IP = "ipfs.infura.io"// "127.0.0.1";
export const IPFS_IP =  "127.0.0.1"
export const CLAPS = "clap";
export const TRANSACTION_UPLOAD = "UPLOAD";
export const TRANSACTION_CLAP = "CLAP";
export const METADATA = "metadata";
export const TRANSACTIONS = "transactions";
export const TRANSACTION_TYPE = "type";
export const USER = "user";
export const ACCOUNT = "account";
export const DEFAULT_PLAYLIST_ID = "PlayList0012";

export const validateConnections = (web3, changeNetworkState) => {
    //checking if metamask is installed or notdebugger
    console.log('checking if metamask is installed or not');
    if(typeof web3 == 'undefined' || web3 == null || typeof web3.currentProvider.isMetaMask == 'undefined'){
        changeNetworkState({
            isInNetwork: false,
            alertMessage: "Metamask is not installed. Please install Metamask from ",
            open: true
        });
        return
    }

    //checking conneted to Pramati network or not
    console.log('checking conneted to Pramati network or not...');
    if(web3.currentProvider.publicConfigStore._state.networkVersion.toString() != "9876") {
        changeNetworkState({
            isInNetwork: false,
            alertMessage: "Not connected to Pramati Network. Please select Pramati Network in Metamask to proceed!",
            open: true
        });
        return
    }

    //checking if user has unlocked wallet or not
    console.log('checking if user has unlocked wallet or not...');
    web3.eth.getAccounts((err, accounts) => {
        if (err != null) console.error("An error occurred: "+err);
        else if (accounts.length == 0){
            changeNetworkState({
                isInNetwork: false,
                alertMessage: "You are not logged in to Metamask! Please login to proceed!",
                open: true
            });
        return
        }
    });
}

export const getBalance = (web3, account) => {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(account, function (error, result) {
            if (!error) {
                const balance = parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(4);
                resolve(balance);
            } else {
                reject(error)
            }
        });
    })
}

export const getUserData = account => {
    return new Promise((resolve, reject) => {
        database.collection(USER).where(ACCOUNT, "==", account.toLowerCase())
        .get()
        .then(users => {
            if (users.size) {
                const user = users.docs[0].data();
                resolve(user);
            } else {
                reject(new Error("No user found"));
            }
        })
        .catch(reject);
    })
}

export const saveUser = user => {
    return database.collection(USER).add(user);
}

export const getClapFeed = () => {
    return database.collection(TRANSACTIONS)
    .where(TRANSACTION_TYPE, "==", TRANSACTION_CLAP)
    .orderBy("transactionTime", "desc")
    .limit(10)
    .get().then(clapList => {
        const clapPromises = []
        for(let i = 0; i < clapList.size; i++) {
            clapPromises.push(getFeedData(clapList.docs[i].data()));
        }
        clapPromises.reverse();
        return Promise.all(clapPromises);
    })
}

const getFeedData = ({ fromUser, mediaId, toUser, transactionTime }) => {
    const feed = {}
    return new Promise(resolve => {
        Promise.all([getUserData(fromUser), getMediaData(mediaId)])
        .then(values => {
            feed.user = values[0].name;
            feed.title = values[1].title;
            feed.mediaId = mediaId;
            feed.mediaHash = values[1].mediaHash;
            feed.author = toUser,
            feed.time = transactionTime
            resolve(feed)
        })
    })
}

export const getTotalDonation = mediaId => {
    return new Promise((resolve, reject) => {
        database.collection(TRANSACTIONS)
        .where("mediaId", "==", mediaId)
        .where(TRANSACTION_TYPE, "==", TRANSACTION_CLAP)
        // database.collection("clap").where("fromUser", "==", "0x8b06af07c8528f636b371650ec4211187a1a3257")
        .get()
        .then(querySnapshot => {
            let totalAmount = 0
            querySnapshot.forEach(doc => {
                totalAmount += doc.data().amount
            });
            resolve(totalAmount.toFixed(4))
        }).catch(reject)
    })
}

export const getMediaData = mediaId => {
    return new Promise((resolve, reject) => {
        database.collection(METADATA)
        .doc(mediaId)
        .get().then(metadata => {
            const data = metadata.data();
            const media = {};
            if (!data) {
                resolve(media); 
                return;
            }
            media.mediaHash = data.mediaHash;
            media.title = data.title;
            media.description = data.description;
            media.time = data.time;
            media.tags = data.tags
            media.authorName = data.authorName;
            media.author = data.author;
            resolve(media);
        }).catch(reject);
    });
}

export const getCreatorList = account => {
    return new Promise((resolve, reject) => {
        database.collection(TRANSACTIONS)
        .where("fromUser", "==", account)
        .where(TRANSACTION_TYPE, "==", TRANSACTION_UPLOAD)
        .orderBy("transactionTime", "desc")
        .get()
        .then(async transactionDocs => {
            let retrievedData = []
            for(let i = 0; i < transactionDocs.size; i++) {
                const videoData = transactionDocs.docs[i].data();
                videoData.amount = await getTotalDonation(videoData.mediaId);
                retrievedData.push(videoData);
            }
            resolve(retrievedData);
        })
        .catch(reject);
    })
}

export const getTransactionList = account => {
    return new Promise((resolve, reject) => {
        database.collection(TRANSACTIONS)
        .where("fromUser", "==", account)
        .orderBy("transactionTime", "desc")
        .get()
        .then(transactionDocs => {
            const retrievedData = [];
            transactionDocs.forEach( doc => {
                retrievedData.push(doc.data());
            });
            resolve(retrievedData);
        })
    })
}

export const  uploadFile = (file) => {
    return new Promise((resolve,reject) =>{
        const reader = new FileReader();
        if (!file) return;
        reader.onloadend = () => {
            const buffer = Buffer.from(reader.result, 0, reader.result.length);
            // const ipfs = ipfsAPI({ host: IPFS_IP, port: 5001, protocol: 'https' });
            const ipfs = ipfsAPI({ host: IPFS_IP, port: 5001, protocol: 'http' });
            const files = [
                {
                path: file.name,
                content: buffer
                }
            ];
            ipfs.files.add(files, function(err, files) {
                if(files && files[0]){
                    console.log(files[0].hash);
                    resolve({res : true, hash : files[0].hash})
                }else{
                    reject({res : false})
                }
            });
        };
        reader.readAsArrayBuffer(file);
    })
  }