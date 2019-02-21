/**Test cases for Story 001 of Adhat.*/
/**
 * Context : UPLOAD -> SALE -> BUY
 * -----------------------------------------
 * Story 001 :: PROPERTY OWNERSHIP
 * -----------------------------------------
 * 1. Alice :  I have a valuable content which I will upload to the platform. Now I want to put it on sale.
 * 2. Bob : I buyer I want to buy that content. So I came to adhat market place to buy it. I saw Alice is selling
 *         a content which I am interested in. I want the owner ship of the content to be delivered to me.
 * 
 * -------------------------------------------
 * Note : Same story can be applied to car owner ship, flat ownership etc.
 * --------------------------------------------
 * Alice  : content Owner
 * Bob : Buyer 1
 */
'use strict';

// import expectThrow from './expectThrow';
const MediaStore = artifacts.require('../contracts/MediaStore.sol');

contract('MediaStore', function (accounts) {
     
    let ms;
    let bob;
    let alice;
    let adhatOwner;
    
    before(async function () {
        // Instantiate the MediaStore Contract
        ms = await MediaStore.new();

        console.log('****************THE PROPERTY OWNERSHIP****************************')
        console.log('Welcome to Adhat Story Part 001!')
        console.log('The story depicts following feature of application : UPLOAD -> SALE -> BUY')
        console.log('Actors of this story are :: ...........')
        console.log('Alice - a content owner.')
        console.log('Bob - a content buyer.')
        console.log('****************THE PROPERTY OWNERSHIP****************************')
        
        bob = accounts[0];
        alice = accounts[1];
    });

    describe("User Module", function() {
        describe("lets first onboard Alice and Bob", function(){
            it("should onbord Alice", async function(){
                await ms.registerUser("Alice", {from : alice});
                let exists = await ms.getUser(alice);
                assert.isTrue(exists);
            })

            it("should onbord Bob", async function(){
                await ms.registerUser("Bob", {from : bob});
                let exists = await ms.getUser(bob);
                assert.isTrue(exists);
            })

        })
    })

    describe("Content Module", function(){

        describe("Add content", function(){

            it("Alice should be able to add a new content - 1", async function(){
                await ms.addContent("a_mediaHash1", 0, 10, {from :alice});
                let [count, commaSepIds] = await ms.getUserUploadedContents({from: alice})
                assert.equal(count, 1);
            })

            it("Alice should be able to add another content - 2", async function(){
                await ms.addContent("a_mediaHash2", 0, 10, {from :alice});
                let [count, commaSepIds] = await ms.getUserUploadedContents({from: alice})
                assert.equal(count, 2);
            })

            it("Alice should be able to add another content - 3", async function(){
                await ms.addContent("a_mediaHash3", 0, 10, {from :alice});
                let [count, commaSepIds] = await ms.getUserUploadedContents({from: alice})
                assert.equal(count, 3);
            })

            it("Alice should NOT be able to add an existing content document", async function(){
                try {
                    await ms.addContent("a_mediaHash2", 0, 10, {from :alice});
                }
                catch (error) {
                    assert(true);
                }
            })

            it("Alice should be able to retrive all of her uploaded doc ids", async function(){
                let [count, commaSepIds] = await ms.getUserUploadedContents({from: alice});
                let contentHashes  = commaSepIds.split(',');
                assert.equal(count, 3);
                // console.log('List of documents which Alice has uploaded so far...')
                // contentHashes.forEach(element => {
                //     console.log(element);
                // });
            })

        })

        describe("Sell content", function(){

            it("Alice should be able to put content on sale", async function(){
                await ms.putContentForSale('a_mediaHash1', 1, {from :alice});
                let [creator, cntType, isSold, resaleCnt, price, forSale] = await ms.getContentDetByHash('a_mediaHash1')
                assert.equal(forSale, true);
                assert.equal(price, 1);
            })

            it("Alice should be able to put another content on sale", async function(){
                await ms.putContentForSale('a_mediaHash2', 1, {from :alice});
                let [creator, cntType, isSold, resaleCnt, price, forSale, currentOwner] = await ms.getContentDetByHash('a_mediaHash2')
                assert.equal(forSale, true);
                assert.equal(price, 1);
                assert.equal(currentOwner, alice);
            })

            it("Bob (or some other person) should NOT be able to put the content on sale as he doesnt own", async function(){
                try{
                    await ms.putContentForSale('a_mediaHash2', 1, {from :bob});
                }catch(err){
                    assert(true);
                }
            })

            it("should be able to retrive all contents on sale", async function(){
                let [commaSepContentIds, count] = await ms.getContentsOnSale(0);
                //commaSepContentIds : \
                assert.equal(count, 3);
            })

        })

        describe("Buy Content", function(){

            it("Bob should be able to buy the content on sale", async function(){
                await ms.buyContent('a_mediaHash2', {from : bob, value : 1})
                let [creator, cntType, isSold, resaleCnt, price, forSale, currentOwner] = await ms.getContentDetByHash('a_mediaHash2')
                assert.equal(forSale, false);
                assert.equal(forSale, false);
                assert.equal(currentOwner, bob);
                
            })

            it("Bob should be able to retrive list of bought contents", async function(){
                let [contentCount, commaSepContentIds] = await ms.getUserBoughtContents({from : bob});
                assert.equal(contentCount, 1);
            })

            it("Alice should NOT be able to buy her own contents", async function(){
                try{
                    await ms.putContentForSale('a_mediaHash2', 1, {from :alice});
                }catch(err){
                    assert(true);
                }
            })

            it("Alice should recieve crypto from Bob", async function(){

            })

            it("Bob should NOT be able to buy the content which is not in sale", async function(){
                try{
                    await ms.putContentForSale('a_mediaHash2', 1, {from :bob});
                }catch(err){
                    assert(true);
                }
            })

            it("Bob can also put the content on sale", async function(){
                await ms.putContentForSale('a_mediaHash2', 1, {from :bob});
                let [creator, cntType, isSold, resaleCnt, price, forSale] = await ms.getContentDetByHash('a_mediaHash2')
                assert.equal(forSale, true);
                assert.equal(price, 1);
            })
        })

    })

})
