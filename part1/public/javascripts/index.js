const vueinst = Vue.createApp({
    data(){
        return{
            dog_img_url:'',
        };
        },
       async mounted(){
        try{
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            console.log(data.message);
            this.dog_img_url = data.message;
            }
        catch(err){
            console.log('Failed to load dog image', err);
        }
        }

}).mount('#app');

