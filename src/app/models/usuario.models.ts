
export class  Usuario {

  static fromFirebase ({email, nombre, uid}): Usuario {
    return new Usuario(uid, nombre, email);
  }
  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {
  }
}
