const { ipcRenderer } = require('electron')
const Vue = require('vue/dist/vue')
const axios = require('axios')
const dayjs = require('dayjs')

require('dotenv').config({ path: '.env' })

Vue.filter('capitalize', function (value) {
	if (!value) return ''
	value = value.toString()
	return value
		.split(' ')
		.map(v => v.charAt(0).toUpperCase() + v.slice(1))
		.join(' ')
})

const vm = new Vue({
	el: '#app',
	data() {
		return {
			cityName: '',
			weather: null,
			loading: false,
			refreshIsOnTimeout: false,
		}
	},
	created: function () {
		if (this.cityName.trim().length === 0) this.cityName = 'Tokyo'
		this.loadWeather()
	},
	watch: {
		refreshIsOnTimeout: function (val) {
			ipcRenderer.send('change-height', val)
		},
	},
	methods: {
		async loadWeather() {
			if (this.loading) return
			this.loading = true
			this.weather = null

			try {
				const searchString = this.cityName.trim()
				if (searchString.length === 0) throw new Error('Enter valid city name')

				const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchString}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
				const { data } = await axios.get(url)

				const weather = {
					date: {
						date: dayjs().format('D'),
						month: dayjs().format('MMM'),
					},
					place: `${data.name}, ${data.sys.country}`,
					temp: Math.round(data.main.temp),
					humidity: data.main.humidity,
					windSpeed: data.wind.speed,
					weatherDescription: data.weather[0].description,
				}

				this.weather = weather
				if (!this.refreshIsOnTimeout) {
					this.refreshIsOnTimeout = true
					setTimeout(() => (this.refreshIsOnTimeout = false), 1.8e6)
				}
			} catch (error) {
				const notification = new Notification(error.message)
			} finally {
				this.loading = false
			}
		},
	},
})
