import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Tarea } from 'src/app/models/tarea.model';
import { GestionTareaService } from 'src/app/service/gestion-tarea.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-crear-editar',
  templateUrl: './modal-crear-editar.component.html',
  styleUrls: ['./modal-crear-editar.component.css']
})
export class ModalCrearEditarComponent {
  @Input() tareaSeleccionada: Tarea | null = null;
  @Output() tareaGuardada = new EventEmitter<void>();
  public isEditing: boolean = false;
  public isOpen: boolean = false;
  title: string = "";
  button: string = "";

  public tarea: FormGroup = this.formbuilder.group({
    nombre: ['', [Validators.required]],
    fecha: ['', [Validators.required, futureDateValidator]],
    personas: this.formbuilder.array([])
  });

  constructor(private formbuilder: FormBuilder, private gestionTareaService: GestionTareaService) {}
  ngOnInit(): void {
    // Agregar una persona al inicializar
    this.addPersona();
  }
  ngOnChanges(): void {
    if (this.tareaSeleccionada) {
      this.isEditing = true;
      console.log("entro a true: ", this.tareaSeleccionada)
      this.tarea.patchValue(this.tareaSeleccionada);
    } else {
      console.log("entro a false: ")
      this.isEditing = false;
      this.tarea.reset();
      this.personas.clear();
      this.addPersona();
    }

  }


  // Getters para acceder a los FormArray
  get personas(): FormArray {
    return this.tarea.get('personas') as FormArray;
  }

  createPersona(): FormGroup {
    return this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), nombrePersonaUnicoValidator(this.personas)]],
      edad: [0, [Validators.required, Validators.min(18)]],
      habilidades: this.formbuilder.array([this.createHabilidad()])
    });
  }

  createHabilidad(): FormGroup {
    return this.formbuilder.group({
      habilidadNombre: ['', [Validators.required]],
    });
  }

  addPersona(): void {
    this.personas.push(this.createPersona());
  }

  deletePersona(index: number): void {
    if (index > 0) {
      this.personas.removeAt(index);
    }
  }

  // Métodos para manejar habilidades
  getHabilidades(indexPersona: number): FormArray {
    return this.personas.at(indexPersona).get('habilidades') as FormArray;
  }

  addHabilidad(indexPersona: number): void {
    this.getHabilidades(indexPersona).push(this.createHabilidad());
  }

  deleteHabilidad(indexPersona: number, index: number): void {
    if (index > 0) {
      this.getHabilidades(indexPersona).removeAt(index);
    }
  }

  onSubmit() {
    if (this.tarea.valid) {
      const tareaData: Tarea = this.tarea.value;

      // Asigna un id a la tarea si es nueva
      if (!this.isEditing) {
        tareaData.id = uuidv4(); // Genera un id único para la tarea
      }
      // Asigna un id a cada persona y habilidad
      tareaData.personas.forEach(persona => {
        if (!persona.id) {
          persona.id = uuidv4(); // Genera un id único para cada persona
        }
        persona.habilidades.forEach(habilidad => {
          if (!habilidad.id) {
            habilidad.id = uuidv4();
          }
        });
      });

      if (!this.isEditing) {

        this.gestionTareaService.agregarTarea(tareaData);
      } else {
        console.log("editar");
        tareaData.id = this.tareaSeleccionada!.id;
        tareaData.completed =  this.tareaSeleccionada!.completed;
        this.gestionTareaService.actualizarTarea(tareaData);
      }
       this.tareaGuardada.emit();
      this.closeModal();
      this.resetForm();
    } else {
      this.tarea.markAllAsTouched();
    }
  }


  resetForm(): void {
    this.tarea.reset();
    this.personas.clear();
    this.addPersona();
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
  }
}

export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();
  const inputDate = new Date(control.value);
  return inputDate <= today ? { notFutureDate: true } : null;
}
export function nombrePersonaUnicoValidator(personas: FormArray): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const nombre = control.value;

    for (let i = 0; i < personas.controls.length; i++) {
      if (personas.at(i).get('name')?.value === nombre && personas.at(i) !== control.parent) {
        return { nombreDuplicado: true };
      }
    }

    return null;
  };
}
