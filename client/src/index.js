import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

class App extends Component {
	state = {
		userdata: [],
		usertasks: [],
		taskEditable: 'false',
		minusPlus: 0,
		turnTodayVisibility: 'hidden',
	};

	componentDidMount() {
		this.getItem();
	}

	getDate = () => {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var d = new Date(new Date().setDate(new Date().getDate() - this.state.minusPlus));
		var dayName = days[d.getDay()];

		return (
			dayName +
			' ' +
			new Date(new Date().setDate(new Date().getDate() - this.state.minusPlus))
				.toString()
				.split(' ')
				.splice(1, 3)
				.join(' ')
		);
	};

	getItem = () => {
		axios.get(`http://localhost:3001/task/get`).then(res => {
			const userdata = res.data;
			const usertasks = userdata.tasks;
			usertasks.reverse(); // For that : Users should be see task on top whichever is new
			this.setState({ userdata, usertasks });
		});
	};

	postItem = e => {
		if (e.key === 'Enter') {
			axios
				.post(
					`http://localhost:3001/task/insert?title=${
						document.getElementsByClassName('add-task')[0].value
					}&date=${this.selectedDate()}` //new Date(Date.now()).toISOString()
				)
				.then(() => {
					this.getItem();
					document.getElementsByClassName('add-task')[0].value = '';
				});
		}
	};

	editHandle = e => {
		// axios.put(`http://localhost:3001/task/delete/${e.target.id}`).then(() => this.getItem());
		// console.log(e.parent)
		this.setState({ taskEditable: 'true' });
	};

	deleteItem = e => {
		axios.delete(`http://localhost:3001/task/delete/${e.target.id}`).then(() => this.getItem());
	};

	minus = async () => {
		await this.setState({ minusPlus: this.state.minusPlus + 1 });
		this.getDate();
		this.checkIsToday();
	};

	plus = async () => {
		await this.setState({ minusPlus: this.state.minusPlus - 1 });
		this.getDate();
		this.checkIsToday();
	};

	checkIsToday = () => {
		if (this.state.minusPlus !== 0) {
			this.setState({ turnTodayVisibility: 'visible' });
		} else {
			this.setState({ turnTodayVisibility: 'hidden' });
		}
	};

	handleTurnToday = async () => {
		await this.setState({ minusPlus: 0, turnTodayVisibility: 'hidden' });
		this.getDate();
	};

	selectedDate = () => {
		let selectedDate = this.getDate().split(' ');
		let monthNumber = '';
		switch (selectedDate[1]) {
			case 'Jan':
				monthNumber = '01';
				break;
			case 'Feb':
				monthNumber = '02';
				break;
			case 'Mar':
				monthNumber = '03';
				break;
			case 'Apr':
				monthNumber = '04';
				break;
			case 'May':
				monthNumber = '05';
				break;
			case 'Jun':
				monthNumber = '06';
				break;
			case 'Jul':
				monthNumber = '07';
				break;
			case 'Aug':
				monthNumber = '08';
				break;
			case 'Sep':
				monthNumber = '09';
				break;
			case 'Oct':
				monthNumber = '10';
				break;
			case 'Nov':
				monthNumber = '11';
				break;
			case 'Dec':
				monthNumber = '12';
				break;
		}
		return selectedDate[3] + '-' + monthNumber + '-' + selectedDate[2];
	};

	render() {
		return (
			<div className="justify-content-center d-flex mt-5">
				<div className="card text-center transparent-bg" style={{ width: '30%' }}>
					<div className="card-header">
						<h3>{this.getDate()}</h3>
						<span className="text-center" style={{ visibility: this.state.turnTodayVisibility }}>
							<a href="#" className="turn-today" onClick={this.handleTurnToday}>
								Turn Today
							</a>
						</span>
					</div>
					<div className="card-body text-left" style={{ height: '100%' }}>
						<a href="#" className="arrow arrow-right transparent-color" onClick={this.plus}>
							<i className="fas fa-chevron-right"></i>
						</a>
						<a href="#" className="arrow arrow-left transparent-color" onClick={this.minus}>
							<i className="fas fa-chevron-left"></i>
						</a>
						<input
							type="text"
							className="add-task"
							placeholder="Add new task"
							style={{ visibility: this.state.turnTodayVisibility === 'hidden' ? 'visible' : 'hidden' }}
							onKeyPress={this.postItem}
						/>
						<ul className="tasks">
							{this.state.usertasks.map(task => {
								this.selectedDate();
								if (task.date.substring(0, 10) == this.selectedDate()) {
									// console.log("a:"+task.date)
									// console.log("b:"+new Date(Date.now()).toISOString().substring(0,10))
									return (
										<li key={task._id}>
											<span>
												<i className="far fa-circle"></i>{' '}
											</span>
											<span>{task.title}</span>
											<span className="float-right">
												<i className="fas fa-pen mr-2" onClick={this.editHandle}></i>
												<i
													className="fas fa-trash-alt"
													id={task._id}
													onClick={this.deleteItem}></i>
											</span>
										</li>
									);
								}
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));