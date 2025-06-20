const vueinst = Vue.createApp({
    data(){
        return{
            dog_img_url:'',
        };
        },
       async mounted(){
        try{
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json;
            this.dog_img_url = data.message;
            }
        catch(err){
            alert("cannot get picture")
            console.log('Failed to load dog image', err);
        }
        }

}).mount('#app');

