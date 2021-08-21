import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DataDragonService {
  constructor() {}

  getUrlProfileIcon(idIcon: number) : string {
    return `http://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${idIcon}.png`
  }
}
