import { Usuario } from './usuario';

export class Pregunta {
    constructor(
        public cliente:Usuario,
        public pregunta:string,
        public respuesta:string       

    ) {}
}