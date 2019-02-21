
Array.prototype.inArray = function (value)
{
	 // Returns true if the passed value is found in the
	 // array. Returns false if it is not.
	 var i;
	 for (i=0; i < this.length; i++)
	 {
	 if (this[i] == value)
	 {
	 return true;
	 }
	 }
	 return false;
}
const addNewTransaction = (appId, publicKey, rawTx) => {
    return new Promise((resolve) => {
	var tableName = 'transaction';
	db.collection(tableName).add({
	    appId: appId,
	    publicKey: publicKey,
	    encryptedRawTx: rawTx,
	    txDigest : "", // this will will be filled after tx signing in mobile app
	    txHash : "", // this will be filled once transaction is successfully broadcasted in network
	    txStatus : "Pending" //initially status will be in pending 
	})
	.then((docRef) => {
	    console.log("Document written with ID: ", docRef.id); // rowID
	    resolve(docRef.id) //send the docRef.id to phone app using QR
	})
	.catch((error) => {
	    console.error("Error adding document: ", error);
	});
    });
}

export const signtxMixin = {
	

	created(){
	
	},

	data(){
	     	 return {
     	 }
 	},
	methods:{
		resetForm() {
        console.log('Reseting the form')
        var self = this; //you need this because *this* will refer to Object.keys below`

        //Iterate through each object field, key is name of the object field`
        Object.keys(this.form).forEach(function(key,index) {
          self.form[key] = '';
        });
      },
		updateStatus(id,status) {
	      var d = document.getElementById(id);
	      if(d){
	        if(status == "NOTSTARTED"){
	          d.className += " not-started";
	        }

	        if(status == "STARTED"){
	          d.className += " started";
	        }
	        if(status == "COMPLETED"){
						d.className += " success";
						if(this && this.showQR)this.showQR = false
	        }
	      }
	    },
		
	}
}