import { Component, ViewChild } from '@angular/core';
import { ModalCrearEditarComponent } from './lista-tareas/modal-crear-editar/modal-crear-editar.component';
import { ListaTareasComponent } from './lista-tareas/lista-tareas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PruebaTecnica';

  @ViewChild(ListaTareasComponent) listaTareasComponent!: ListaTareasComponent;
  @ViewChild(ModalCrearEditarComponent) modalComponent!: ModalCrearEditarComponent;

  openModal(): void {
    this.modalComponent.openModal();
  }
  cargarTareas(){
    this.listaTareasComponent.cargarTareas();
  }
}
