import {Injectable} from '@nestjs/common';
import {PrismaClient} from "@prisma/client/extension";
import {PrismaPg} from "@prisma/adapter-pg";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configService: ConfigService) {
        const adapter = new PrismaPg({connectionString: configService.get<string>('DATABASE_URL')});
        super({ adapter });
    }
}
