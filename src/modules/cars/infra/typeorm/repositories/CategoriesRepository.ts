import { getRepository, Repository } from "typeorm";

import {
    ICategoriesRepository,
    ICreateCategoryDTO,
} from "@modules/cars/repositories/ICategoriesRepository";

import { Category } from "../entities/Category";

class CategoriesRepository implements ICategoriesRepository {
    private respository: Repository<Category>;

    constructor() {
        this.respository = getRepository(Category);
    }

    // public static getInstance(): CategoriesRepository {
    //     if (!CategoriesRepository.INSTANCE) {
    //         CategoriesRepository.INSTANCE = new CategoriesRepository();
    //     }

    //     return CategoriesRepository.INSTANCE;
    // }

    async create({ description, name }: ICreateCategoryDTO): Promise<void> {
        const category = this.respository.create({
            description,
            name,
        });

        await this.respository.save(category);
    }

    async list(): Promise<Category[]> {
        const categories = await this.respository.find();
        return categories;
    }

    async findByName(name: string): Promise<Category> {
        const category = await this.respository.findOne({ name });

        return category;
    }
}

export { CategoriesRepository };
