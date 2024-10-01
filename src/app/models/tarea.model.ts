
export interface Habilidad {
  id: string;
  habilidadNombre: string;
}

export interface Persona {
  id: string;
  name: string;
  edad: number;
  habilidades: Habilidad[];
}

export interface Tarea {
  id: string;
  nombre: string;
  fecha: Date;
  completed: boolean;
  personas: Persona[];
}
