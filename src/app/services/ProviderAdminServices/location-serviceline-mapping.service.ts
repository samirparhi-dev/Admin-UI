import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";



/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 24-07-2017
 * Objective: # A service which would handle the mapping of serviceline/servicelines
				available in a state,for a service provider to its office/workplace
				location in that state.
				*/

				@Injectable()
				export class LocationServicelineMapping {

					providerAdmin_Base_Url: any;
					getStates_url: any;
					getDistricts_url: any;
					getServiceLines_url: any;

					getWorkLocations_url: any;
					add_WorkLocation_url: any;
					edit_WorkLocation_url: any;
					delete_WorkLocation_url: any;



					constructor(private http: Http,public basepaths:ConfigService) { 
						this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();

						this.getStates_url = this.providerAdmin_Base_Url + "m/location/state";
						this.getDistricts_url = this.providerAdmin_Base_Url + "m/location/findDistrict";
						this.getServiceLines_url = this.providerAdmin_Base_Url + "m/location/service";
						this.getWorkLocations_url = this.providerAdmin_Base_Url + "m/location/getAlllocation";
						this.add_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/addLocation";
						this.edit_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/editLocation";
						this.delete_WorkLocation_url = this.providerAdmin_Base_Url + "m/location/deleteLocation";
					};

					getStates(serviceProviderID) {
						console.log("h",serviceProviderID);
						return this.http.post(this.getStates_url, { "serviceProviderID": serviceProviderID })
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					getDistricts(serviceProviderID,stateID) {
						return this.http.post(this.getDistricts_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					getServiceLines(serviceProviderID, stateID) {
						return this.http.post(this.getServiceLines_url, { "serviceProviderID": serviceProviderID, "stateID": stateID })
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					getWorkLocations()
					{
						return this.http.post(this.getWorkLocations_url, {})
							.map(this.handleSuccess)
							.catch(this.handleError);
					}

					addWorkLocation(requestObject)
					{
						return this.http.post(this.add_WorkLocation_url, requestObject)
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					editWorkLocation() {
						return this.http.post("", {})
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					deleteWorkLocation() {
						return this.http.post("", {})
						.map(this.handleSuccess)
						.catch(this.handleError);
					}

					handleSuccess(response: Response) {
						console.log(response.json().data, "--- in location-serviceline-mapping service");
						return response.json().data;
					}

					handleError(error: Response | any) {
						let errMsg: string;
						if (error instanceof Response) {
							const body = error.json() || '';
							const err = body.error || JSON.stringify(body);
							errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
						} else {
							errMsg = error.message ? error.message : error.toString();
						}
						console.error(errMsg);
						return Observable.throw(errMsg);
					}
				};



