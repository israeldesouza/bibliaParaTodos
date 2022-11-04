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
		const date = new Date().setHours(0, 0, 0, 0);

		this._deviceList.ref
			.where('date', '==', new Date(date))
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
						date: accessCount.date,
						count: accessCount.count + 1,
					});
				} else {
					this._addAccessCount({ date: new Date(date), count: 1 });
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
	date: Date;
	count: number;
}
