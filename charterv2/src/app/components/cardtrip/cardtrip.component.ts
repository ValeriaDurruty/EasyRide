import { Component, Input } from '@angular/core';
import { Viaje } from '../../interfaces/viaje.interface';

@Component({
  selector: 'app-cardtrip',
  templateUrl: './cardtrip.component.html',
  styleUrls: ['./cardtrip.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css'
  ]
})
export class CardtripComponent {
  @Input() viajes: Viaje[] = [];
}
