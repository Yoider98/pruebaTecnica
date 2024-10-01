import { Injectable } from '@angular/core';
import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class GestionTareaService {
  private storageKey = 'tareas';

  constructor() {
    // Inicializa con tareas si localStorage está vacío
    if (!this.getTareas()) {
      const tareas: Tarea[] = [];
      this.setTareas(tareas);
    }
  }
  getTareas(): Tarea[] {
    const tareas = localStorage.getItem(this.storageKey);
    const tareasParsed = tareas ? JSON.parse(tareas) : [];
    console.log('Tareas obtenidas:', tareasParsed); // Verifica las tareas obtenidas
    return tareasParsed;
}

  setTareas(tareas: Tarea[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tareas));
  }

  agregarTarea(tarea: Tarea): void {
    console.log('agregar: ', tarea);
    tarea.completed = false;
    const tareas = this.getTareas();
    tareas.push(tarea);
    this.setTareas(tareas);
  }

  actualizarTarea(tareaActualizada: Tarea): void {
    console.log('Tarea obtenida:', tareaActualizada);
    const tareas = this.getTareas();

    // Busca la tarea en el arreglo y reemplázala con la versión actualizada
    const tareasActualizadas = tareas.map(tarea => {
      if (tarea.id === tareaActualizada.id) {
        console.log('Tarea actualizada:', tareaActualizada);
        return tareaActualizada;
      } else {
        return tarea;
      }
    });

    // Guardar las tareas actualizadas en el almacenamiento
    this.setTareas(tareasActualizadas);

    // Confirmación de que el almacenamiento ha sido actualizado
    console.log('Tareas guardadas en localStorage:', tareasActualizadas);
  }

}
