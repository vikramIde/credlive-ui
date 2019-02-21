const EventEmitter = require("events").EventEmitter;
const { TX_QR_EVENT } = require("../events");
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

class HSDispatcher extends EventEmitter {

  

    QREventGenerator = (rawTx) =>{
        return new Promise((resolve,reject) => {
          this.emit(TX_QR_EVENT,rawTx) 
          resolve() 
        })
        //Generate QR
    }

    QREventListener = () => {
        return new Promise((resolve,reject) => {
            this.on(TX_QR_EVENT, (rawTx) => {
                console.log('Listening to the event')
                resolve(rawTx)
                //call from API websocket lsiten 
            });
        })
        
    }

    
    TXEventListener = () => {
        return new Promise((resolve,reject) => {
            try{
                let that = this
            let pusher= new Pusher('46d2cb8ef7cf9dc2666d',{
            cluster: 'ap2',
            encrypted: true })

            pusher.logToConsole = true
            console.log(pusher)
            let channel = pusher.subscribe('hypermine-hypersign')

            channel.bind('tx-service',function(data){
                console.log('tx-service')
                console.log(data)
                resolve(data)
            })

            }catch(er){
                console.log(er)
            }
            
        })
            
        }

    // SIGNEventGenerator = (rawTx) =>{
    //     debugger
    //     this.emit(TX_QR_EVENT,rawTx)
    //     //Generate QR

    // }

    // SIGNEventListener = () => {
    //     debugger
    //     return new Promise((resolve,reject) => {
    //         this.on(TX_QR_EVENT, (rawTx) => {
    //             debugger
    //             console.log('Listening to the event')
    //             resolve(rawTx)
    //             //call from API websocket lsiten 
    //         });
    //     })
        
    // }

    
}


const instance = new HSDispatcher();
// Object.freeze(instance);

export default instance;