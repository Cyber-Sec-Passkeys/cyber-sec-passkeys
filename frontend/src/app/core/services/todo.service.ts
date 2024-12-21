import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = environment.businessServiceUrl + '/todos';

  constructor() {}
}
