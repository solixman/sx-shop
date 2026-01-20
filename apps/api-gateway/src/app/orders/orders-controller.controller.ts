import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { get } from 'http';


@Controller('orders')
export class OrdersController {

    constructor(@Inject("ORDERS-SERVICE") private readonly ordersClient:ClientProxy){}
    

    @Get('test')
    test(){
        console.log('here');
            Logger.log('in api-gateway');

       return  this.ordersClient.send('test',{});
    }

}
