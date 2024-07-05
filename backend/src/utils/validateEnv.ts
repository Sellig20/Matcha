import { cleanEnv } from "envalid";
import { str, port } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    EXPRESS_PORT: port(),
    POSTGRES_PORT: port(),
    POSTGRES_NAME: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOSTNAME: str(),
    JWT_SECRET: str(),
});