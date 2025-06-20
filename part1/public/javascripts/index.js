const vueinst = Vue.createApp({
    data(){
        return{
            dog_img_url:'',
        };
        },
       async mounted(){
            const response = await fetch('https://dog.ceo/dog-api/documentation/random');
            const data = await response.json
        }

}).mount('#app');

