import { getCookie } from './loginPage.js';

class WinLostChart {
  constructor(chartId) {
    this.chartId = chartId;
    this.dataWinRate = [0, 0];
    this.chart = null;

    Chart.defaults.font.family = 'Space';
    Chart.defaults.color = 'white';

    this.data = {
      labels: ['Win', 'Lost'],
      datasets: [{
        label: 'Number of game',
        data: this.dataWinRate,
        backgroundColor: [
          '#5dffa990',
          "#ff5d5d90"
        ],
        borderColor: '#3777ff',
        cutout: '90%'
      }]
    };

    this.centerText = {
      id: 'centerText',
      beforeDraw: (chart, args, options) => {
        const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
        ctx.save();

        ctx.font = options.fontSize + ' ' + options.fontFamily;
        ctx.fillStyle = options.fontColor;
        ctx.textAlign = 'center';
        ctx.fillText(this.dataWinRate[0] + '%', width / 2, top + (height / 2));
      }
    };

    this.config = {
      type: 'doughnut',
      data: this.data,
      options: {
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
      plugins: [this.centerText]
    };

    this.chart = new Chart(
      document.getElementById(this.chartId),
      this.config
    );
  }

  updateData(newDataWinRate) {
    this.dataWinRate = newDataWinRate;
    this.chart.data.datasets[0].data = newDataWinRate;
    this.chart.update();
  }
}

class DashesPowerChart {
  constructor(chartId) {
    this.chartId = chartId;
    this.dataStats = [0, 0];
    this.chart = null;

    this.data = {
      labels: ['Dashes', 'Power Used'],
      datasets: [{
        label: 'Percentage',
        data: this.dataStats,
        backgroundColor: [
          "#f4ff69aa",
          '#ff6e6eaa'
        ],
        borderColor: '#3777ff',
        cutout: '90%'
      }]
    };

    this.centerText = {
      id: 'centerText',
      beforeDraw: (chart, args, options) => {
        const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
        ctx.save();

        ctx.font = options.fontSize + ' ' + options.fontFamily;
        ctx.fillStyle = options.fontColor;
        ctx.textAlign = 'center';
        ctx.fillText(this.dataStats[0] + '%', width / 2, top + (height / 2));
      }
    };

    this.config = {
      type: 'doughnut',
      data: this.data,
      options: {
        plugins: {
          centerText: {
            fontColor: 'white',
            fontSize: '30px',
            fontFamily: 'Space'
          },
          title: {
            display: true,
            text: 'Dashes vs Power Used'
          },
          legend: {
            display: false,
            position: 'bottom'
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

  updateData(newDataStats) {
    this.dataStats = newDataStats;
    this.chart.data.datasets[0].data = newDataStats;
    this.chart.update();
  }
}

const winLostChart = new WinLostChart('winLostStat');
const dashesPowerChart = new DashesPowerChart('dashesPowerStat');

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
	//   const winLostChart = new WinLostChart('winLostStat');
	  winLostChart.updateData([data.percentageGameWon, data.percentageGameLost]);
	  
	//   const dashesPowerChart = new DashesPowerChart('dashesPowerStat');
	  dashesPowerChart.updateData([
		parseFloat(data.dashesPercentage.toFixed(2)),
		parseFloat(data.poweredUsedPercentage.toFixed(2))
	  ]);
	  
	  console.log("currentStreak", data.currentStreak);
	})
	.catch(error => {
	  console.error('Error fetching user stats:', error);
	});
  }