//import {Subject} from 'rxjs/Subject';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/filter';
//import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';

interface BroadcastEvent {
    key: any;
    data?: any;
}

export class Broadcaster {
    private _eventBus: Subject<BroadcastEvent>;

    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    broadcast(key: any, data?: any) {
        this._eventBus.next({key, data});
    }

    on<T>(key: any): Observable<any> {
        return this._eventBus.asObservable();
    }
}
