import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class DatabaseTaskService {
  private readonly logger = new Logger(DatabaseTaskService.name)

  constructor(private readonly prisma: PrismaService) {}
}
