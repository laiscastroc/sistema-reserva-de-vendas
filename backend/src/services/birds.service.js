import { birdsRepository } from "../repositories/birds.repository.js";
import { ApiError } from "../utils/ApiError.js";

export const birdsService = {
  async getAll(filters) {
    return birdsRepository.findAll(filters);
  },

  async getById(id) {
    const bird = await birdsRepository.findById(id);
    if (!bird) {
      throw ApiError.notFound("Ave não encontrada");
    }
    return bird;
  },
  async getTypes() {
    return birdsRepository.listTypes();
  },
};
