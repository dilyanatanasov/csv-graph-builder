let years = [];
let CPUs = ["CPUs"];
let dates = [];
let months = [];
let dataToBeFiltered = [];

function parseData(createGraph) {
	Papa.parse("../csv-graph-builder/data/test.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

function generateGraph(CPUs, years) {
	c3.generate({
		bindto: '#chart',
		data: {
			columns: [
				CPUs
			]
		},
		axis: {
			x: {
				type: 'category',
				categories: years,
				tick: {
					multiline: false,
					culling: {
						max: 15
					}
				}
			}
		},
		zoom: {
			enabled: true
		},
		legend: {
			position: 'right'
		}
	});
}

function filterData() {
	document.getElementById("filter").onclick = () => {
		let e = document.getElementById("days");
		let b = document.getElementById("months");
		let datePicked = Number(e.value);
		let monthPicked = Number(b.value);

		years = [];
		CPUs = ["CPUs"];
		for (let i = 0; i < dataToBeFiltered.length; i++) {
			if (dataToBeFiltered[i][0] !== "") {
				const date = Number(new Date(dataToBeFiltered[i][0]).getDate());
				const month = Number(new Date(dataToBeFiltered[i][0]).getMonth() + 1);

				if (datePicked === date && monthPicked === month) {
					years.push(dataToBeFiltered[i][0]);
					CPUs.push(dataToBeFiltered[i][1])
				}
			}
		}

		document.getElementById("chart").innerHTML = "";
		generateGraph(CPUs, years);
	};
}

function filter24Hours() {
	document.getElementById("24_hours").onclick = () => {
		years = [];
		CPUs = [];
		for (let i = 0; i < dataToBeFiltered.length; i++) {
			if (dataToBeFiltered[i][0] !== "") {
				let date1 = new Date(dataToBeFiltered[i][0]);
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let timeStampYesterday = timeStamp - (24 * 3600);
				let is24 = date1 >= new Date(timeStampYesterday*1000).getTime();

				if (is24) {
					years.push(dataToBeFiltered[i][0]);
					CPUs.push(dataToBeFiltered[i][1]);
				}
			}
		}

		document.getElementById("chart").innerHTML = "";
		generateGraph(CPUs, years);
	};
}

function filterRange() {
	document.getElementById("range_filter").onclick = () => {
		console.log("Clicked")
		let s = document.getElementById("start_date");
		let e = document.getElementById("end_date");
		let startDate = new Date(s.value).getTime();
		let endDate = new Date(e.value).getTime();
		console.log(`Start Date ${startDate}`);
		console.log(`End Date ${endDate}`);
		years = [];
		CPUs = ["CPUs"];
		for (let i = 0; i < dataToBeFiltered.length; i++) {
			if (dataToBeFiltered[i][0] !== "") {
				let date = new Date(dataToBeFiltered[i][0]).getTime();
				console.log(`Date ${date}`);
				if (date >= startDate && date <= endDate) {
					years.push(dataToBeFiltered[i][0]);
					CPUs.push(dataToBeFiltered[i][1]);
				}
			}
		}

		document.getElementById("chart").innerHTML = "";
		generateGraph(CPUs, years);
	};
}

function createGraph(data) {
	data.shift();
	for (let info of data) {
		if (info[0] !== "") {
			dataToBeFiltered.push(info);
			const date = new Date(info[0]).getDate();
			const month = new Date(info[0]).getMonth() + 1;
			if (!dates.includes(date)) {
				dates.push(date);
			}
			if (!months.includes(month)) {
				months.push(month);
			}
		}
	}
	dates.sort((a, b) => {return a-b});
	months.sort((a, b) => {return a-b});

	let daysList = document.getElementById("days");

	//Create and append the options
	for (let i = 0; i < dates.length; i++) {
		let option = document.createElement("option");
		option.value = dates[i];
		option.text = dates[i];
		daysList.appendChild(option);
	}

	let monthsList = document.getElementById("months");
	//Create and append the options
	for (let i = 0; i < months.length; i++) {
		let option = document.createElement("option");
		option.value = months[i];
		option.text = months[i];
		monthsList.appendChild(option);
	}

	for (let i = 0; i < dataToBeFiltered.length; i++) {
		if (dataToBeFiltered[i][0] !== "") {
			let date1 = new Date(dataToBeFiltered[i][0]);
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let timeStampYesterday = timeStamp - (24 * 3600);
			let is24 = date1 >= new Date(timeStampYesterday*1000).getTime();

			if (is24) {
				years.push(dataToBeFiltered[i][0]);
				CPUs.push(dataToBeFiltered[i][1]);
			}
		}
	}

	generateGraph(CPUs, years);
}
parseData(createGraph);

setTimeout(() => {
	filterData();
	filter24Hours();
	filterRange();
}, 1000);
