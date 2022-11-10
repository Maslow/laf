import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppsModule } from './apps/apps.module'
import { CollectionsModule } from './collections/collections.module'
import { WebsitesModule } from './websites/websites.module'
import { BucketsModule } from './buckets/buckets.module'
import { PoliciesModule } from './policies/policies.module'
import { FunctionsModule } from './functions/functions.module'
import { HealthModule } from './health/health.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    AppsModule,
    FunctionsModule,
    PoliciesModule,
    BucketsModule,
    WebsitesModule,
    CollectionsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
