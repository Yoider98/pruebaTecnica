import { Component, ViewChild } from '@angular/core';
import { ModalCrearEditarComponent } from './modal-crear-editar/modal-crear-editar.component';
import { GetDataService } from '../service/get-data.service';
import Swal from 'sweetalert2';
import { GestionTareaService } from '../service/gestion-tarea.service';
import { Tarea } from '../models/tarea.model';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css'],
})
export class ListaTareasComponent {
  tareas: Tarea[] = [];;
  filter: string = 'todas';
  @ViewChild(ModalCrearEditarComponent)
  modalComponent!: ModalCrearEditarComponent;
  tareaSeleccionada: Tarea | null = null;
  modalAbierto = false;

  // Variables para la paginación
  paginatedItems: Tarea[] = [];
  itemsPerPage = 10;
  currentPage = 1;

  constructor(private gestionTareaService: GestionTareaService) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareas = this.gestionTareaService.getTareas();
    this.updatePaginatedItems();
  }


  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedItems = this.tareasFiltradas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.tareasFiltradas.length) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  editarTarea(id: string) {
    const tarea = this.paginatedItems.find(t => t.id === id);

    if (tarea) {
      console.log("lo que envia: ",tarea)
      this.tareaSeleccionada = tarea;
      this.modalComponent.openModal();
    } else {
      console.error('Tarea no encontrada');
    }
  }


  actualizarTarea(id: string) {
    console.log("Actualiza: ", id);
    const tarea = this.paginatedItems.find(t => t.id === id);
    if(tarea){
      tarea.completed = true;

      // Actualiza la tarea en el servicio
      this.gestionTareaService.actualizarTarea(tarea);
      this.cargarTareas(); // Recarga las tareas

      // Mostrar una alerta usando SweetAlert2
      Swal.fire({
        title: 'Tarea Actualizada',
        text: `La tarea ha sido ${tarea.completed ? 'completada' : 'pendiente'}.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  setFilter(nuevoFiltro: string) {
    this.filter = nuevoFiltro;
    this.updatePaginatedItems();
  }

  get tareasFiltradas() {
    return this.tareas.filter(
      (tarea) =>
        this.filter === 'todas' ||
        (this.filter === 'completadas' && tarea.completed === true) ||
        (this.filter === 'pendientes' && tarea.completed === false)
    );
  }

  // Método que se invoca desde el modal cuando se guarda una tarea
  onGuardarTarea() {
    this.cargarTareas(); // Recargar la lista de tareas
  }
}
