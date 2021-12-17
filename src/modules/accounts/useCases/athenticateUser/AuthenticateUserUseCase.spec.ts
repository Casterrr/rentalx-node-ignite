import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("Should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "123456789",
            email: "user@test.com",
            password: "123456",
            name: "User Test",
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
    });

    it("Should not be able to authenticate a non-existing user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "123456",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to authenticate a user with wrong password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: "123456789",
                email: "user@user.com",
                password: "123456",
                name: "User Test Error",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "wrong-password",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
