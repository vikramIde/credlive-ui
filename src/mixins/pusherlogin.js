
import Pusher from 'pusher-js' // import Pusher
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

export const authservice = {
	

	created(){

		     	let that = this
		     	this.pusher= new Pusher('46d2cb8ef7cf9dc2666d',{
		     	cluster: 'ap2',
	            encrypted: true })

	            this.pusher.logToConsole = true

	            this.channel = this.pusher.subscribe('hypermine-hypersign')
	           
	            this.channel.bind('auth-service',function(data){
	            	that.$emit('incoming_sync_block',data)
	            })
	    //         this.channel.bind('tx-service',function(data){
					// console.log('tx-service')
					// console.log(data)
	    //         	that.$emit('tx-service',data)
	    //         })

	            this.$on('incoming_sync_block',function(tokenMessage){
					// console.log('on incoming_sync_block event trigger : ' + tokenMessage)
	            	this.handleLogin(tokenMessage);
				})
				
				// this.$on('tx-service',function(tokenMessage){
				// 	console.log(tokenMessage)
				// 	// this.handleLogin(tokenMessage);
				// })				
	},

	data(){
	     	 return {
	     	 	pusher:null,
	     	 	channel:null,
	     	 	syncData:null,
	     	 	tokenDataMap:{},
     	 }
 	},
	methods:{
		
	}
}