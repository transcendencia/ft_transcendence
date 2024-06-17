// let winLostStat = document.getElementById('winLostStat').getContext('2d')

Chart.defaults.font.family = 'Space';
Chart.defaults.color = 'white';

const canvas = document.getElementById('winLostStat');
const canvas_ctx = canvas.getContext('2d');

const dataValue = [97, 3];
const data = {
	labels:['Win', 'Lost'],
	datasets:[{
		label: 'Number of game',
		data: dataValue,
		backgroundColor:[
			'green',
			'red'
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
		ctx.fillText(dataValue[0] + '%', width / 2, top + (height / 2))

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
		maintainAspectRatio: false
	},
	plugins: [centerText]
};

function drawChart() {
	const winLostChart = new Chart(
		document.getElementById('winLostStat'),
		config
	);
}

// let winLostChart = new Chart(winLostStat, {
// 	document.getElementById('winLostStat'
// });
// elements: {
// 	center: {
// 	text: '50%',
// 	color: '#FF6384', // Default is #000000
// 	fontStyle: 'Space', // Default is Arial
// 	sidePadding: 20, // Default is 20 (as a percentage)
// 	minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
// 	lineHeight: 25 // Default is 25 (in px), used for when text wraps
// 	}
// }
