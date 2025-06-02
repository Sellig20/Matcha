export class utilsController {
  static async readFirst(tab: any[] | null | undefined) {
    try {
      if (tab) return tab[0];
      else return null;
    } catch (error) {
      return null;
    }
  }
}
