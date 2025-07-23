import { Request, Response } from "express";
import { Gamemode, Map } from "../models/categories.js";

class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    const gamemodes = await Gamemode.find();
    const maps = await Map.find();
    res.json({
      status: "success",
      data: {
        gamemodes,
        maps,
      },
    });
  }

  async getAllGamemodes(req: Request, res: Response) {
    const gamemodes = await Gamemode.find();
    res.json(gamemodes);
  }

  async getAllMaps(req: Request, res: Response) {
    const maps = await Map.find();
    res.json(maps);
  }
}

export default new CategoryController();
