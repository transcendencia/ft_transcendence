import { getCookie } from './loginPage.js';
// let winLostStat = document.getElementById('winLostStat').getContext('2d')

Chart.defaults.font.family = 'Space';
Chart.defaults.color = 'white';

let dataWinRate = [0, 0];
const data = {
	labels:['Win', 'Lost'],
	datasets:[{
		label: 'Number of game',
		data: dataWinRate,
		backgroundColor:[
			'#5dffa990',
			"#ff5d5d90"
		],
		borderColor:'#3777ff',
		cutout: '90%'
	}]
};

const centerText = {
	id: 'centerText',
	beforeDraw( chart, args, options ) {
		const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
		ctx.save();
		
		ctx.font = options.fontSize + ' ' + options.fontFamily;
		ctx.fillStyle = options.fontColor;
		ctx.textAlign = 'center';
		// ctx.textBaseline = 'middle';
		ctx.fillText(dataWinRate[0] + '%', width / 2, top + (height / 2))

		// ctx.restore();
	}
};

const config = {
	type: 'doughnut',
	data,
	options:{
		plugins: {
			centerText: {
				fontColor: 'white',
				fontSize: '30px',
				fontFamily: 'Space'
			},
			title: {
				display: true,
				text: 'Win rate'
			},
			legend: {
				display: false,
				position: 'bottom'
			}
		},
		responsive: true,
		maintainAspectRatio: false,
	},
	plugins: [centerText]
};

function drawChart() {
	const winLostChart = new Chart(
		document.getElementById('winLostStat'),
		config
	);
};

export function getUserStats(userId) {
	const token = localStorage.getItem('host_auth_token');
	fetch(`get_stats/${userId}`, {
		method: 'GET',
		headers: {
			'Authorization': `Token ${token}`,
			'X-CSRFToken': getCookie('crsftoken')
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		console.log(data);
		dataWinRate[0] = data.percentageGameWon;
		dataWinRate[1] = data.percentageGameLost;
		// console.log("dahsesPercentage", data.dashesPercentage);
		// console.log("poweredUsedPercentage", data.poweredUsedPercentage);
		// console.log("efficencyRatios", data.efficiencyRatios);
		// console.log("nbrGames", data.nbrGames);
		console.log("currentStreak", data.currentStreak);
		console.log("mapPercentages", data.mapPercentages);
		console.log("modePercentages", data.modePercentages);
		drawChart();
	})
	.catch(error => {
	});
}