import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import {
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentReference,
} from '@angular/fire/compat/firestore';

@Injectable({
	providedIn: 'root',
})
export class AccessCountService {
	private _dbPath = 'AccessCount';

	private _deviceList!: AngularFirestoreCollection<IAccessCount>;

	constructor(private _db: AngularFirestore) {
		this._deviceList = _db.collection(this._dbPath);
	}

	getAllAccess() {
		return this._deviceList.snapshotChanges().pipe(
			map((changes) =>
				changes.map((c) => ({
					id: c.payload.doc.id,
					...c.payload.doc.data(),
				}))
			)
		);
	}

	getAccessCount(): void {
		const currentDate = new Date();
		const date = `${currentDate.getFullYear()}-${
			currentDate.getMonth() + 1
		}-${currentDate.getDate()}`;

		this._deviceList.ref
			.where('date', '==', date)
			.get()
			.then((res) => {
				const accessCount =
					res.docs?.map((res) => {
						return {
							id: res.id,
							...res.data(),
						};
					})[0] || null;

				if (accessCount?.id) {
					this._updateAccessCount(accessCount.id, {
						date,
						count: accessCount.count + 1,
					});
				} else {
					this._addAccessCount({
						date,
						count: 1,
					});
				}
			});
	}

	private _addAccessCount(
		accessCount: IAccessCount
	): Promise<DocumentReference<IAccessCount>> {
		return this._deviceList.add(accessCount);
	}

	private _updateAccessCount(
		id: string,
		countAccess: IAccessCount
	): Promise<void> {
		return this._deviceList.doc(id).update(countAccess);
	}
}

export interface IAccessCount {
	id?: string;
	date: string;
	count: number;
}
