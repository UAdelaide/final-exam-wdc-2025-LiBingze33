const vueinst = Vue.createApp({
    data(){
        return{
            dog_img_url:'',
        };
        },
        mounted(){
            fetch('https://dog.ceo/dog-api/documentation/random')
        }

}).mount('#app');

