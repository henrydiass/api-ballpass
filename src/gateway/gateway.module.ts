import { Module } from '@nestjs/common';
import { MyGateway } from './socket-gateway/gateway';

@Module({
    providers: [MyGateway],
})
export class GatewayModule {}
