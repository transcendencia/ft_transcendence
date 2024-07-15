import { getCookie } from './loginPage.js';
import { getTranslatedText } from './translatePages.js';


class DoughnutGraph {
	constructor(chartId, title, backgroundColors, cutoutPercentage = '50%') {
	  this.chartId = chartId;
	  this.dataStats = [0, 0];
	  this.chart = null;
	  Chart.defaults.font.family = 'Space';
	  Chart.defaults.color = 'white';
	  this.position = 'bottom';
	  if (title === 'Modes played' || title === 'Maps played')
		cutoutPercentage = '0%';
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
		  if (title === 'Accuracy' || title === 'Win%') {
			if (this.dataStats[0] + this.dataStats[1] === 0)
				ctx.fillText('0%', left + width / 2, top + height / 2);
			else
			{
				const result = (this.dataStats[0] / (this.dataStats[0] + this.dataStats[1]) * 100).toFixed(1);
				ctx.fillText(result + '%', left + width / 2, top + height / 2);
			}
		  }
		  else if (title === 'Modes played' || title === 'Maps played')
			ctx.fillText('', left + width / 2, top + height / 2);
		}
	  };
  
	  this.config = {
		type: 'doughnut',
		data: this.data,
		options: {
		  layout: {
			padding: {
			  top: 30,
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
				top: 0,
				bottom: 10
			  },
			  align: 'center',
			  position: 'top',
			},
			legend: {
			  display: true,
			  position: this.position,
			},
			shadow: {
			  shadowOffsetX: 15,
			  shadowOffsetY: 15,
			  shadowBlur: 10,
			  shadowColor: 'rgba(1, 0, 0, 1)',
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

function removeClasses(stat) {
	stat.classList.remove('slideInLeft');
	stat.classList.remove('slideInRight');
	stat.classList.remove('slideOutLeft');
	stat.classList.remove('slideOutRight');
}

export function chooseStats(stat) {
    const stat1 = document.getElementById('statsBlock1');
    const stat2 = document.getElementById('statsBlock2');
    const stat3 = document.getElementById('statsBlock3');
	const stat4 = document.getElementById('statsBlock4');
	const stat5 = document.getElementById('statsBlock5');
	const stat6 = document.getElementById('statsBlock6');

	removeClasses(stat4);
	removeClasses(stat5);
	removeClasses(stat6);
	removeClasses(stat1);
	removeClasses(stat2);
	removeClasses(stat3);

    if (stat === 1) {
        if (stat2.style.display === 'flex') {
            stat2.classList.add('slideOutRight');
            setTimeout(() => {
                stat2.style.display = 'none';
                stat2.classList.remove('slideOutRight');
                stat1.classList.add('slideInLeft');
                stat1.style.display = 'flex';
            }, 250);
        } else if (stat3.style.display === 'flex') {
            stat3.classList.add('slideOutRight');
            setTimeout(() => {
                stat3.style.display = 'none';
                stat3.classList.remove('slideOutRight');
                stat1.classList.add('slideInLeft');
                stat1.style.display = 'flex';
            }, 250);
        } else {
            stat1.style.display = 'flex';
            stat1.classList.add('slideInLeft');
        }
    } else if (stat === 2) {
        if (stat1.style.display === 'flex') {
            stat1.classList.add('slideOutLeft');
            setTimeout(() => {
                stat1.style.display = 'none';
                stat1.classList.remove('slideOutLeft');
                stat2.classList.add('slideInRight');
                stat2.style.display = 'flex';
            }, 250);
        } else if (stat3.style.display === 'flex') {
            stat3.classList.add('slideOutRight');
            setTimeout(() => {
                stat3.style.display = 'none';
                stat3.classList.remove('slideOutRight');
                stat2.classList.add('slideInLeft');
                stat2.style.display = 'flex';
            }, 250);
        }
    } else if (stat === 3) {
        if (stat1.style.display === 'flex') {
            stat1.classList.add('slideOutLeft');
            setTimeout(() => {
                stat1.style.display = 'none';
                stat1.classList.remove('slideOutLeft');
                stat3.classList.add('slideInRight');
                stat3.style.display = 'flex';
            }, 250);
        } else if (stat2.style.display === 'flex') {
            stat2.classList.add('slideOutLeft');
            setTimeout(() => {
                stat2.style.display = 'none';
                stat2.classList.remove('slideOutLeft');
                stat3.classList.add('slideInRight');
                stat3.style.display = 'flex';
            }, 250);
        }
    }
	else if (stat === 4) {
		stat5.style.display = 'none';
		stat6.style.display = 'none';
		stat4.style.display = 'flex';
	}
	else if (stat === 5) {
		stat4.style.display = 'none';
		stat6.style.display = 'none';
		stat5.style.display = 'flex';
	}
	else if (stat === 6) {
		stat4.style.display = 'none';
		stat5.style.display = 'none';
		stat6.style.display = 'flex';
	}
}

function convertTime(time) {
	time /= 1000;
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);
	return `${hours}hrs ${minutes}min ${seconds}sec`;
}

function updateBasicStats(data) {
	const basicStats = document.getElementById('winLoseTexts1');
	basicStats.innerHTML = `
	<div class="basicStats"> ${getTranslatedText('winLoseText1')} : ${data.nbrMatch}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText2')} : ${data.nbrWin}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText3')} : ${data.nbrLose}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText4')} : ${data.nbrGoal}</div>
	`;
	const basicStats2 = document.getElementById('winLoseTexts2');
	basicStats2.innerHTML = `
	<div class="basicStats"> ${getTranslatedText('winLoseText1')} : ${data.nbrMatch}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText2')} : ${data.nbrWin}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText3')} : ${data.nbrLose}</div>
	<div class="basicStats"> ${getTranslatedText('winLoseText4')} : ${data.nbrGoal}</div>
	`;
}

function updateStats3(data)
{
	const statValues = document.querySelectorAll('.statValue');

	let scoreRatio;
	if (data.totalPointsTaken === null)
		scoreRatio = 0;
	else
		scoreRatio = (data.nbrGoal / data.totalPointsTaken).toFixed(2);

	const values = [
		data.currentStreak,
		data.maxStreak,
		data.totalDashes,
		data.totalPowerUpsUsed,
		scoreRatio,
		data.nbrFriends,
		convertTime(data.totalGameTime),
		data.userInfo.created_at.split('T')[0]
	]		

	statValues.forEach((stat, index) => {
		stat.textContent = values[index % 8];
	});
}

const winLostChart = new DoughnutGraph('winLostStat', 'Win%', ['#5dffa990', '#ff5d5d90']);
const mapChart = new DoughnutGraph('mapStat', 'Maps played', ['#ff5f02bb', '#1f15efbb', '#ccfbfbbb', '#000030bb']);
const modeChart = new DoughnutGraph('gameModeStat', 'Modes played', ['#5dffa990', '#ff5d5d90', '#ff5f02bb']);
const accuracy = new DoughnutGraph('accuracyStat', 'Accuracy', ['#5dffa990', '#ff5d5d90']);
const winLostChart2 = new DoughnutGraph('winLostStat2', 'Win%', ['#5dffa990', '#ff5d5d90']);
const mapChart2 = new DoughnutGraph('mapStat2', 'Maps played', ['#ff5f02bb', '#1f15efbb', '#ccfbfbbb', '#000030bb']);
const modeChart2 = new DoughnutGraph('gameModeStat2', 'Modes played', ['#5dffa990', '#ff5d5d90', '#ff5f02bb']);
const accuracy2 = new DoughnutGraph('accuracyStat2', 'Accuracy', ['#5dffa990', '#ff5d5d90']);

export function getUserStats(userId) {
  const token = sessionStorage.getItem('host_auth_token');
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
    winLostChart.updateData([data.nbrWin, data.nbrLose], ['Win', 'Lost']);
	accuracy.updateData([data.totalBounces, data.totalPointsTaken], ['Hits', 'Misses']);
    mapChart2.updateData([data.mapPercentages.dragonMap, data.mapPercentages.oceanMap, data.mapPercentages.skyMap, data.mapPercentages.spaceMap], ['dragon', 'ocean', 'sky', 'space']);
	modeChart2.updateData([data.modePercentages.classicMode, data.modePercentages.powerlessMode, data.modePercentages.spinOnlyMode], ['classic', 'powerless', 'spinOnly']);
    winLostChart2.updateData([data.nbrWin, data.nbrLose], ['Win', 'Lost']);
	accuracy2.updateData([data.totalBounces, data.totalPointsTaken], ['Hits', 'Misses']);
	updateStats3(data);
	updateBasicStats(data);
  })
  .catch(error => {
    console.error('Error fetching user stats:', error);
  });
}
