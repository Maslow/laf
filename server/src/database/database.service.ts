import { Injectable } from '@nestjs/common'
import { DatabaseCoreService } from '../core/database.cr.service'
import * as assert from 'node:assert'
import { MongoAccessor } from 'database-proxy'
import { PrismaService } from 'src/prisma.service'
import { GenerateAlphaNumericPassword } from 'src/utils/random'
import { DatabaseState } from '@prisma/client'

@Injectable()
export class DatabaseService {
  constructor(
    private readonly dbCore: DatabaseCoreService,
    private readonly prisma: PrismaService,
  ) {}

  async create(appid: string) {
    const db = await this.prisma.database.create({
      data: {
        appid,
        name: appid,
        username: appid,
        password: GenerateAlphaNumericPassword(64),
        provider: 'mongodb',
        state: DatabaseState.Creating,
        status: {
          ready: false,
        },
      },
    })

    return db
  }

  async findOne(appid: string) {
    const res = await this.prisma.database.findUnique({
      where: { appid },
    })
    return res
  }

  async delete(appid: string) {
    const res = await this.prisma.database.updateMany({
      where: {
        appid,
        state: DatabaseState.Created,
      },
      data: {
        state: DatabaseState.Deleting,
      },
    })

    return res
  }

  /**
   * Get database accessor that used for `database-proxy`
   * @param appid
   * @returns
   */
  async getDatabaseAccessor(appid: string) {
    const database = await this.dbCore.findOne(appid)
    assert(database, 'Database not found')

    const dbName = database.metadata.name
    const connectionUri = database.status?.connectionUri
    assert(connectionUri, 'Database connection uri not found')

    const accessor = new MongoAccessor(dbName, connectionUri)
    await accessor.init()
    return accessor
  }
}
