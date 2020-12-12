import { v4 as uuid } from "uuid";

export class Child {
  id: string = uuid();
  yearOfBirth: number;

  constructor(yearOfBirth?: number) {
    this.yearOfBirth = yearOfBirth ? yearOfBirth : new Date().getFullYear();
  }
}
