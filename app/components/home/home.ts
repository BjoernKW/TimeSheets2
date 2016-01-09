import {Component, NgZone} from 'angular2/core';

declare var Mite: any;

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css']
})
export class HomeCmp {
	defaultDate: string;
	mite: any;

	storage = localStorage;

	showProjectHeadline = false;
	totalMinutes = 0;
	totalHours = 0;

	language = 'en';
	currentYear;

	projects = [];
	timeEntries = [];

	constructor(private _ngZone: NgZone) {
		var today = new Date();
		this.defaultDate = this.formatDate(today);
		this.currentYear = today.getFullYear();

		this.projects = JSON.parse(localStorage['projects']);
		this.timeEntries = JSON.parse(localStorage['timeEntries']);
		this.totalMinutes = localStorage['totalMinutes'];
		this.totalHours = this.totalMinutes / 60;

		if (!localStorage['startDate']) {
			localStorage['startDate'] = this.defaultDate;
		}
		if (!localStorage['endDate']) {
			localStorage['endDate'] = this.defaultDate;
		}
		if (!localStorage['headline']) {
			localStorage['headline'] = 'TimeSheets';
		}
		if (!localStorage['project']) {
			localStorage['project'] = '';
		}
		if (!localStorage['totalMinutes']) {
			localStorage['totalMinutes'] = this.totalMinutes;
		}
	}

	formatDateForDisplay(date: Date) {
		return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
	}

	formatDate(date: Date) {
		return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	}

	login() {
		this.mite = new Mite(
			{
				account: localStorage['accountName'],
				api_key: localStorage['apiKey']
			}
		);

		this._ngZone.runOutsideAngular(() => {
			this.mite.Project.active(
				data => {
					var projects = [];
					data.forEach(
						object => {
							projects.push({ key: object.project.id, value: object.project.customer_name + ': ' + object.project.name });
						}
					);

					localStorage['projects'] = JSON.stringify(projects);
				}
			);

			this._ngZone.run(() => { this.projects = JSON.parse(localStorage['projects']); });
		});
	}

	displayTimes() {
		if (!this.mite) {
			this.mite = new Mite(
				{
					account: localStorage['accountName'],
					api_key: localStorage['apiKey']
				}
			);
		}

		this._ngZone.runOutsideAngular(() => {
			this.mite.Project.find(
				localStorage['project'],
				data => {
					localStorage['projectName'] = data.project.customer_name + ': ' + data.project.name;
					localStorage['displayStartDate'] = this.formatDateForDisplay(new Date(localStorage['startDate']));
					localStorage['displayEndDate'] = this.formatDateForDisplay(new Date(localStorage['endDate']));
					localStorage['showProjectHeadline'] = true;
				}
			);

			this.mite.TimeEntry.all(
				{
					project_id: localStorage['project'],
					from: localStorage['startDate'],
					to: localStorage['endDate']
				},
				data => {
					var timeEntries = [];
					this.totalMinutes = 0;

					data.forEach(
						object => {
							var date = new Date(object.time_entry.date_at);
							var formattedDate = this.formatDateForDisplay(date);
							timeEntries.push(
								{
									userName: object.time_entry.user_name,
									serviceName: object.time_entry.service_name,
									date: formattedDate,
									hours: object.time_entry.minutes / 60
								}
							);
							this.totalMinutes += object.time_entry.minutes;
						}
					);

					localStorage['timeEntries'] = JSON.stringify(timeEntries);
					localStorage['totalMinutes'] = this.totalMinutes;
				}
			);

			this._ngZone.run(() => {
				this.timeEntries = JSON.parse(localStorage['timeEntries']);
				this.totalHours = this.totalMinutes / 60;
			});
		});
    }
}
