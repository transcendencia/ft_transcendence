import { getCookie } from './loginPage.js';

class DoughnutGraph {
	constructor(chartId, title, backgroundColors, cutoutPercentage = '50%') {
	  this.chartId = chartId;
	  this.dataStats = [0, 0];
	  this.chart = null;
	  Chart.defaults.font.family = 'Space';
	  Chart.defaults.color = 'white';
	  if (title === 'Map')
		this.position = 'bottom';
	  else
		this.position = 'bottom';
  
	  this.data = {
		labels: ['Label 1', 'Label 2'],
		datasets: [{
		  label: 'Percentage',
		  data: this.dataStats,
		  backgroundColor: backgroundColors,
		  borderColor: '#3777ff00',
		  cutout: cutoutPercentage
		}]
	  };
  
	  this.centerText = {
		id: 'centerText',
		beforeDraw: (chart) => {
		  const { ctx, chartArea: { top, left, width, height } } = chart;
		  ctx.save();
  
		  ctx.font = `${chart.config.options.plugins.centerText.fontSize} ${chart.config.options.plugins.centerText.fontFamily}`;
		  ctx.fillStyle = chart.config.options.plugins.centerText.fontColor;
		  ctx.textAlign = 'center';
		  ctx.textBaseline = 'middle';
		  ctx.fillText(this.dataStats[0] + '%', left + width / 2, top + height / 2);
		}
	  };
  
	  this.config = {
		type: 'doughnut',
		data: this.data,
		options: {
		  layout: {
			padding: {
			  top: 30, // Add padding to move the doughnut chart up
			  bottom: 10
			}
		  },
		  plugins: {
			centerText: {
			  fontColor: 'white',
			  fontSize: '30px',
			  fontFamily: 'Space'
			},
			title: {
			  display: true,
			  text: title,
			  font: {
				size: 18,
				family: 'Space'
			  },
			  padding: {
				top: 0, // Remove top padding for title
				bottom: 10 // Adjust bottom padding for title
			  },
			  align: 'center',
			  position: 'top', // Ensure the title is positioned at the top
			},
			legend: {
			  display: true,
			  position: this.position,
			},
			shadow: {
			  shadowOffsetX: 15,
			  shadowOffsetY: 15,
			  shadowBlur: 10,
			  shadowColor: 'rgba(0, 0, 0, 1)',
			  shadowOpacity: 1
			}
		  },
		  responsive: true,
		  maintainAspectRatio: false,
		},
		plugins: [this.centerText]
	  };
  
	  this.chart = new Chart(
		document.getElementById(this.chartId),
		this.config
	  );
	}
  
	updateData(newDataStats, labels = ['Label 1', 'Label 2']) {
	  this.dataStats = newDataStats;
	  this.chart.data.datasets[0].data = newDataStats;
	  this.chart.data.labels = labels;
	  
	  // Resetting the chart data to trigger animation
	  this.chart.data.datasets[0].data = [];
	  this.chart.update();
  
	  // Setting the new data and triggering the animation
	  setTimeout(() => {
		this.chart.data.datasets[0].data = newDataStats;
		this.chart.update();
	  }, 0);
	}
  }

// // get charts blocks by id
const stat1 = document.getElementById('ststsBlock1');
const stat2 = document.getElementById('ststsBlock2');

export function chooseStats(stat) {
	const stat1 = document.getElementById('statsBlock1');
	const stat2 = document.getElementById('statsBlock2');
	if (stat === 1) {
		stat1.style.display = 'flex';
		stat2.style.display = 'none';
	} else if (stat === 2){
		stat2.style.display = 'flex';
		stat1.style.display = 'none';
	}
	else if (stat === 3){
		stat2.style.display = 'none';
		stat1.style.display = 'none';
	}
}

const winLostChart = new DoughnutGraph('winLostStat', 'Win rate', ['#5dffa990', '#ff5d5d90']);
const mapChart = new DoughnutGraph('mapStat', 'Map', ['#ff5f02bb', '#1f15efbb', '#ccfbfbbb', '#000030bb']);
const modeChart = new DoughnutGraph('gameModeStat', 'Mode', ['#5dffa990', '#ff5d5d90', '#ff5f02bb']);
const dashChart = new DoughnutGraph('dashStat', 'Dash', ['#5dffa990', '#ff5d5d90']);
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
    mapChart.updateData([data.mapPercentages.dragonMap, data.mapPercentages.oceanMap, data.mapPercentages.skyMap, data.mapPercentages.spaceMap], ['dragon', 'ocean', 'sky', 'space']);
	modeChart.updateData([data.modePercentages.classicMode, data.modePercentages.powerlessMode, data.modePercentages.spinOnlyMode], ['classic', 'powerless', 'spinOnly']);
    winLostChart.updateData([data.percentageGameWon, data.percentageGameLost], ['Win', 'Lost']);
	dashChart.updateData([data.dashesPercentage, data.poweredUsedPercentage], ['Dash used', 'Power ups']);
  })
  .catch(error => {
    console.error('Error fetching user stats:', error);
  });
}
