import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: "KAFKA_SERVICE",
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'api-gateway',
          brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
        }
      }
    }
  ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
