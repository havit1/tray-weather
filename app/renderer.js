const axios = require("axios");
const Vue = require("vue/dist/vue");

const vm = new Vue({
  el: "#app",
  data() {
    return {
      cityName: "",
      weather: null,
    };
  },
  methods: {
    async loadWeather() {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=`; //TODO: add .env

      try {
        const { data } = await axios.get(url);
        console.log(data);
      } catch (error) {
        console.log(error);
        const notification = new Notification(
          "Something went wrong loading weather data!",
          {
            body: error.message,
          }
        );
        notification.onclick = () => {
          console.log("Clicked!");
        };
      }
    },
  },
});
