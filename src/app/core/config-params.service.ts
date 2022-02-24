import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigParams } from '../shared/models/config-params';

@Injectable({
  providedIn: 'root'
})
export class ConfigParamsService {

  constructor() { }

  configurarParametros(config: ConfigParams): HttpParams {
    let httpParms = new HttpParams();

    if (config.pagina)
      httpParms = httpParms.set('_page', config.pagina)

    if (config.limite)
      httpParms = httpParms.set('_limit', config.limite);

    if (config.pesquisa)
      httpParms = httpParms.set('q', config.pesquisa);

    if (config.campo)
      httpParms = httpParms.set(config.campo.tipo, config.campo.valor.toString());

    httpParms = httpParms.set('_sort', 'id');
    httpParms = httpParms.set('_order', 'desc');

    return httpParms;
  }
}
