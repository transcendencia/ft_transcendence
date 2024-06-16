let winLostStat = document.getElementById('winLostStat').getContext('2d')

Chart.defaults.global.defaultFontFamily = 'Space';
Chart.defaults.global.defaultFontColor = 'white';

let winLostChart = new Chart(winLostStat, {
	type: 'doughnut',
	data:{
		labels:['Win', 'Lost'],
		datasets:[{
			label: 'Number of game',
			data: [
				30,
				70
			],
			backgroundColor:[
				'green',
				'red'
			],
			borderColor:'#3777ff'
		}]
	},
	options:{
		title:{
			display:true,
			text:'Win rate'
		},
		legend: {
			display:false,
			position:'bottom'
		}
	}
});