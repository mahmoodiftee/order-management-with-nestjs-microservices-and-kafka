import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckService,
    HealthCheckResult,
    MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator
    ) { }

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Check application health status' })
    @ApiResponse({
        status: 200,
        description: 'Health check successful',
    })
    @ApiResponse({
        status: 503,
        description: 'Service unhealthy',
    })
    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () =>
                this.microservice.pingCheck('kafka', {
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: process.env.KAFKA_BROKERS
                                ? process.env.KAFKA_BROKERS.split(',')
                                : ['localhost:9092'],
                        },
                    },
                }),
        ]);
    }
}
